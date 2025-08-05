import type { Cache } from 'cache-manager';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { ExchangeRateRepository } from '../../domain/repositories/exchange-rate.repository';
export declare class RedisExchangeRateRepository implements ExchangeRateRepository {
    private cacheManager;
    private readonly logger;
    private readonly CACHE_PREFIX;
    private readonly HISTORICAL_PREFIX;
    private readonly ALL_CURRENCIES_KEY;
    private readonly TTL;
    constructor(cacheManager: Cache);
    findAll(): Promise<ExchangeRate[]>;
    findByCurrency(currency: string): Promise<ExchangeRate | null>;
    save(exchangeRate: ExchangeRate): Promise<void>;
    saveBatch(exchangeRates: ExchangeRate[]): Promise<void>;
    getHistoricalRates(currency: string, hours: number): Promise<ExchangeRate[]>;
    private updateCurrencyList;
    private saveToHistorical;
}
