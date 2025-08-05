import { Injectable, Inject, Logger } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity'
import { ExchangeRateRepository } from '../../domain/repositories/exchange-rate.repository'

@Injectable()
export class RedisExchangeRateRepository implements ExchangeRateRepository {
  private readonly logger = new Logger(RedisExchangeRateRepository.name)
  private readonly CACHE_PREFIX = 'exchange_rate'
  private readonly HISTORICAL_PREFIX = 'historical'
  private readonly ALL_CURRENCIES_KEY = 'all_currencies'
  private readonly TTL = 300 // 5 minutes

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async findAll(): Promise<ExchangeRate[]> {
    try {
      const currencyKeys: string[] = await this.cacheManager.get(this.ALL_CURRENCIES_KEY) || []
      const rates: ExchangeRate[] = []

      for (const currency of currencyKeys) {
        const rate = await this.findByCurrency(currency)
        if (rate) {
          rates.push(rate)
        }
      }

      return rates
    } catch (error) {
      this.logger.error('Failed to find all exchange rates', error)
      return []
    }
  }

  async findByCurrency(currency: string): Promise<ExchangeRate | null> {
    try {
      const key = `${this.CACHE_PREFIX}:${currency}`
      const cachedData = await this.cacheManager.get<any>(key)

      if (!cachedData) {
        return null
      }

      return new ExchangeRate(
        cachedData.currency,
        cachedData.currencyName,
        cachedData.rate,
        cachedData.previousRate,
        new Date(cachedData.timestamp),
        cachedData.source
      )
    } catch (error) {
      this.logger.error(`Failed to find exchange rate for ${currency}`, error)
      return null
    }
  }

  async save(exchangeRate: ExchangeRate): Promise<void> {
    try {
      const key = `${this.CACHE_PREFIX}:${exchangeRate.currency}`
      const data = {
        currency: exchangeRate.currency,
        currencyName: exchangeRate.currencyName,
        rate: exchangeRate.rate,
        previousRate: exchangeRate.previousRate,
        timestamp: exchangeRate.timestamp.toISOString(),
        source: exchangeRate.source
      }

      await this.cacheManager.set(key, data, this.TTL * 1000)
      
      await this.updateCurrencyList(exchangeRate.currency)
      
      await this.saveToHistorical(exchangeRate)

      this.logger.log(`Saved exchange rate for ${exchangeRate.currency}: ${exchangeRate.rate}`)
    } catch (error) {
      this.logger.error(`Failed to save exchange rate for ${exchangeRate.currency}`, error)
      throw error
    }
  }

  async saveBatch(exchangeRates: ExchangeRate[]): Promise<void> {
    try {
      for (const rate of exchangeRates) {
        await this.save(rate)
      }
      this.logger.log(`Saved batch of ${exchangeRates.length} exchange rates`)
    } catch (error) {
      this.logger.error('Failed to save batch of exchange rates', error)
      throw error
    }
  }

  async getHistoricalRates(currency: string, hours: number): Promise<ExchangeRate[]> {
    try {
      const key = `${this.HISTORICAL_PREFIX}:${currency}`
      const historicalData: any[] = await this.cacheManager.get(key) || []

      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000)

      return historicalData
        .filter(data => new Date(data.timestamp) >= cutoffTime)
        .map(data => new ExchangeRate(
          data.currency,
          data.currencyName,
          data.rate,
          data.previousRate,
          new Date(data.timestamp),
          data.source
        ))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    } catch (error) {
      this.logger.error(`Failed to get historical rates for ${currency}`, error)
      return []
    }
  }

  private async updateCurrencyList(currency: string): Promise<void> {
    try {
      const currencies: string[] = await this.cacheManager.get(this.ALL_CURRENCIES_KEY) || []
      
      if (!currencies.includes(currency)) {
        currencies.push(currency)
        await this.cacheManager.set(this.ALL_CURRENCIES_KEY, currencies, this.TTL * 4 * 1000)
      }
    } catch (error) {
      this.logger.error('Failed to update currency list', error)
    }
  }

  private async saveToHistorical(exchangeRate: ExchangeRate): Promise<void> {
    try {
      const key = `${this.HISTORICAL_PREFIX}:${exchangeRate.currency}`
      const historicalData: any[] = await this.cacheManager.get(key) || []

      const data = {
        currency: exchangeRate.currency,
        currencyName: exchangeRate.currencyName,
        rate: exchangeRate.rate,
        previousRate: exchangeRate.previousRate,
        timestamp: exchangeRate.timestamp.toISOString(),
        source: exchangeRate.source
      }

      historicalData.push(data)

      const maxEntries = 100
      if (historicalData.length > maxEntries) {
        historicalData.splice(0, historicalData.length - maxEntries)
      }

      await this.cacheManager.set(key, historicalData, this.TTL * 10 * 1000)
    } catch (error) {
      this.logger.error(`Failed to save historical data for ${exchangeRate.currency}`, error)
    }
  }
}