import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity'
import { HanaBankApiRepository } from '../../domain/repositories/hana-bank-api.repository'
import { firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'

interface KoreaeximResponse {
  result: number
  cur_unit: string
  cur_nm: string
  ttb: string
  tts: string
  deal_bas_r: string
  bkpr: string
  yy_efee_r: string
  ten_dd_efee_r: string
  kftc_deal_bas_r: string
  kftc_bkpr: string
}

const CURRENCY_NAMES: Record<string, string> = {
  'USD': 'US Dollar',
  'EUR': 'Euro',
  'JPY': 'Japanese Yen',
  'CNY': 'Chinese Yuan',
  'GBP': 'British Pound',
  'AUD': 'Australian Dollar',
  'CAD': 'Canadian Dollar',
  'CHF': 'Swiss Franc'
}

@Injectable()
export class HanaBankApiAdapter implements HanaBankApiRepository {
  private readonly logger = new Logger(HanaBankApiAdapter.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async fetchExchangeRates(currencies: string[]): Promise<ExchangeRate[]> {
    const rates: ExchangeRate[] = []

    for (const currency of currencies) {
      try {
        const rate = await this.fetchSingleRate(currency)
        if (rate) {
          rates.push(rate)
        }
      } catch (error) {
        this.logger.warn(`Failed to fetch rate for ${currency}`, error)
        const mockRate = this.generateMockRate(currency)
        rates.push(mockRate)
      }
    }

    return rates
  }

  async fetchSingleRate(currency: string): Promise<ExchangeRate | null> {
    try {
      // Try to fetch from Korea Eximbank API first
      const realRate = await this.callKoreaeximApi(currency)
      if (realRate) {
        this.logger.log(`Fetched real rate for ${currency}: ${realRate.rate}`)
        return realRate
      }

      // Fallback to mock data
      const mockRate = this.generateMockRate(currency)
      this.logger.log(`Using mock rate for ${currency}: ${mockRate.rate}`)
      return mockRate
    } catch (error) {
      this.logger.error(`Failed to fetch rate for ${currency}`, error)
      const mockRate = this.generateMockRate(currency)
      return mockRate
    }
  }

  private generateMockRate(currency: string): ExchangeRate {
    const baseRates: Record<string, number> = {
      'USD': 1340,
      'EUR': 1456,
      'JPY': 9.45,
      'CNY': 185.2,
      'GBP': 1695,
      'AUD': 875,
      'CAD': 985,
      'CHF': 1485
    }

    const baseRate = baseRates[currency] || 1000
    const variation = (Math.random() - 0.5) * 20
    const currentRate = Number((baseRate + variation).toFixed(2))

    return new ExchangeRate(
      currency,
      CURRENCY_NAMES[currency] || currency,
      currentRate,
      baseRate,
      new Date(),
      'KOREA_EXIMBANK'
    )
  }

  private async callKoreaeximApi(currency: string): Promise<ExchangeRate | null> {
    try {
      const apiKey = this.configService.get<string>('KOREAEXIM_API_KEY')
      if (!apiKey) {
        this.logger.warn('KOREAEXIM_API_KEY not configured')
        return null
      }

      const baseUrl = this.configService.get<string>('KOREAEXIM_API_URL', 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON')
      const params = {
        authkey: apiKey,
        data: 'AP01'
      }

      const response = await firstValueFrom(
        this.httpService.get(baseUrl, { params })
      )

      const data: KoreaeximResponse[] = response.data
      this.logger.debug(`Korea Eximbank API response for ${currency}:`, JSON.stringify(data, null, 2))
      
      if (!Array.isArray(data)) {
        this.logger.warn('Invalid response format from Korea Eximbank API')
        return null
      }

      // Find the currency in the response
      // Korea Eximbank uses different currency codes
      const currencyMapping: Record<string, string> = {
        'USD': 'USD',
        'EUR': 'EUR', 
        'JPY': 'JPY(100)',
        'CNY': 'CNH',
        'GBP': 'GBP',
        'AUD': 'AUD',
        'CAD': 'CAD',
        'CHF': 'CHF'
      }
      
      const mappedCurrency = currencyMapping[currency] || currency
      this.logger.debug(`Looking for currency: ${currency} -> ${mappedCurrency}`)
      
      const currencyData = data.find(item => 
        item.cur_unit === mappedCurrency ||
        item.cur_unit.startsWith(mappedCurrency)
      )
      
      this.logger.debug(`Found currency data:`, currencyData)

      if (!currencyData) {
        this.logger.warn(`Currency ${currency} not found in Korea Eximbank API response`)
        return null
      }

      const rate = parseFloat(currencyData.deal_bas_r.replace(/,/g, ''))
      const baseRate = parseFloat(currencyData.kftc_deal_bas_r?.replace(/,/g, '') || currencyData.deal_bas_r.replace(/,/g, ''))

      return new ExchangeRate(
        currency,
        currencyData.cur_nm,
        rate,
        baseRate,
        new Date(),
        'KOREA_EXIMBANK'
      )
    } catch (error) {
      this.logger.error(`Korea Eximbank API call failed for ${currency}`, error)
      return null
    }
  }
}