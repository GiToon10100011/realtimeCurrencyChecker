import { Injectable, Inject } from '@nestjs/common'
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity'
import type { ExchangeRateRepository } from '../../domain/repositories/exchange-rate.repository'
import { EXCHANGE_RATE_REPOSITORY } from '../../domain/repositories/exchange-rate.repository'

@Injectable()
export class GetExchangeRatesUseCase {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly exchangeRateRepository: ExchangeRateRepository
  ) {}

  async execute(currencies?: string[]): Promise<ExchangeRate[]> {
    if (currencies && currencies.length > 0) {
      const rates: ExchangeRate[] = []
      for (const currency of currencies) {
        const rate = await this.exchangeRateRepository.findByCurrency(currency)
        if (rate) {
          rates.push(rate)
        }
      }
      return rates
    }

    return this.exchangeRateRepository.findAll()
  }
}