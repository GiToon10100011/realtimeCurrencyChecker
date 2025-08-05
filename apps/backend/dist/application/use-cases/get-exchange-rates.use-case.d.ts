import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import type { ExchangeRateRepository } from '../../domain/repositories/exchange-rate.repository';
export declare class GetExchangeRatesUseCase {
    private readonly exchangeRateRepository;
    constructor(exchangeRateRepository: ExchangeRateRepository);
    execute(currencies?: string[]): Promise<ExchangeRate[]>;
}
