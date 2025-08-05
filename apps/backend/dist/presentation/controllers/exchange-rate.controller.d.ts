import { GetExchangeRatesUseCase } from '../../application/use-cases/get-exchange-rates.use-case';
import { ExchangeRateSchedulerService } from '../../application/services/exchange-rate-scheduler.service';
export declare class ExchangeRateController {
    private readonly getExchangeRatesUseCase;
    private readonly exchangeRateSchedulerService;
    private readonly logger;
    constructor(getExchangeRatesUseCase: GetExchangeRatesUseCase, exchangeRateSchedulerService: ExchangeRateSchedulerService);
    getExchangeRates(currencies?: string): Promise<{
        success: boolean;
        data: {
            currency: string;
            currencyName: string;
            rate: number;
            previousRate: number;
            change: number;
            changePercent: number;
            timestamp: Date;
            isPositive: boolean;
            source: string;
        }[];
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        timestamp: string;
        data?: undefined;
    }>;
    forceUpdate(body: {
        currencies?: string[];
    }): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        timestamp: string;
        message?: undefined;
    }>;
    healthCheck(): Promise<{
        status: string;
        service: string;
        timestamp: string;
    }>;
}
