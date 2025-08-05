import { ExchangeRate } from '../entities/exchange-rate.entity';
export interface HanaBankApiRepository {
    fetchExchangeRates(currencies: string[]): Promise<ExchangeRate[]>;
    fetchSingleRate(currency: string): Promise<ExchangeRate | null>;
}
export declare const HANA_BANK_API_REPOSITORY: unique symbol;
