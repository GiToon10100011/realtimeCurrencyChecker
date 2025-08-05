import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import type { ExchangeRateRepository } from '../../domain/repositories/exchange-rate.repository';
import type { HanaBankApiRepository } from '../../domain/repositories/hana-bank-api.repository';
export declare class UpdateExchangeRatesUseCase {
    private readonly exchangeRateRepository;
    private readonly hanaBankApiRepository;
    private readonly logger;
    constructor(exchangeRateRepository: ExchangeRateRepository, hanaBankApiRepository: HanaBankApiRepository);
    execute(currencies: string[], threshold?: number): Promise<{
        updatedRates: ExchangeRate[];
        hasSignificantChanges: boolean;
    }>;
}
