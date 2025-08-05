import { Injectable, Inject, Logger } from '@nestjs/common'
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity'
import type { ExchangeRateRepository } from '../../domain/repositories/exchange-rate.repository'
import { EXCHANGE_RATE_REPOSITORY } from '../../domain/repositories/exchange-rate.repository'
import type { HanaBankApiRepository } from '../../domain/repositories/hana-bank-api.repository'
import { HANA_BANK_API_REPOSITORY } from '../../domain/repositories/hana-bank-api.repository'

@Injectable()
export class UpdateExchangeRatesUseCase {
  private readonly logger = new Logger(UpdateExchangeRatesUseCase.name)

  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly exchangeRateRepository: ExchangeRateRepository,
    @Inject(HANA_BANK_API_REPOSITORY)
    private readonly hanaBankApiRepository: HanaBankApiRepository
  ) {}

  async execute(currencies: string[], threshold: number = 3): Promise<{ 
    updatedRates: ExchangeRate[]
    hasSignificantChanges: boolean 
  }> {
    try {
      this.logger.log(`Fetching exchange rates for currencies: ${currencies.join(', ')}`)
      
      const newRates = await this.hanaBankApiRepository.fetchExchangeRates(currencies)
      const updatedRates: ExchangeRate[] = []
      let hasSignificantChanges = false

      for (const newRate of newRates) {
        const existingRate = await this.exchangeRateRepository.findByCurrency(newRate.currency)
        
        if (!existingRate) {
          await this.exchangeRateRepository.save(newRate)
          updatedRates.push(newRate)
          hasSignificantChanges = true
          continue
        }

        const rateWithPrevious = new ExchangeRate(
          newRate.currency,
          newRate.currencyName,
          newRate.rate,
          existingRate.rate,
          newRate.timestamp,
          newRate.source
        )

        if (rateWithPrevious.hasSignificantChange(threshold)) {
          await this.exchangeRateRepository.save(rateWithPrevious)
          updatedRates.push(rateWithPrevious)
          hasSignificantChanges = true
          
          this.logger.log(
            `Significant change detected for ${newRate.currency}: ` +
            `${existingRate.rate} -> ${newRate.rate} (${rateWithPrevious.change.toFixed(2)} KRW)`
          )
        }
      }

      return { updatedRates, hasSignificantChanges }
    } catch (error) {
      this.logger.error('Failed to update exchange rates', error)
      throw error
    }
  }
}