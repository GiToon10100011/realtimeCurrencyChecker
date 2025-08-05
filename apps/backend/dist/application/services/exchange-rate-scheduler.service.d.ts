import { UpdateExchangeRatesUseCase } from '../use-cases/update-exchange-rates.use-case';
import { ExchangeRateGateway } from '../../presentation/gateways/exchange-rate.gateway';
export declare class ExchangeRateSchedulerService {
    private readonly updateExchangeRatesUseCase;
    private readonly exchangeRateGateway;
    private readonly logger;
    private readonly DEFAULT_CURRENCIES;
    constructor(updateExchangeRatesUseCase: UpdateExchangeRatesUseCase, exchangeRateGateway: ExchangeRateGateway);
    updateExchangeRates(): Promise<void>;
    private processUpdate;
    forceUpdate(currencies?: string[]): Promise<void>;
}
