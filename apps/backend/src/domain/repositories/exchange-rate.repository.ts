import { ExchangeRate } from '../entities/exchange-rate.entity'

export interface ExchangeRateRepository {
  findAll(): Promise<ExchangeRate[]>
  findByCurrency(currency: string): Promise<ExchangeRate | null>
  save(exchangeRate: ExchangeRate): Promise<void>
  saveBatch(exchangeRates: ExchangeRate[]): Promise<void>
  getHistoricalRates(currency: string, hours: number): Promise<ExchangeRate[]>
}

export const EXCHANGE_RATE_REPOSITORY = Symbol('EXCHANGE_RATE_REPOSITORY')