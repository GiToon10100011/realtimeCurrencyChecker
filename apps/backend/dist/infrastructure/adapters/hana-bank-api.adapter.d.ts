import { HttpService } from '@nestjs/axios';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { HanaBankApiRepository } from '../../domain/repositories/hana-bank-api.repository';
export declare class HanaBankApiAdapter implements HanaBankApiRepository {
    private readonly httpService;
    private readonly logger;
    constructor(httpService: HttpService);
    fetchExchangeRates(currencies: string[]): Promise<ExchangeRate[]>;
    fetchSingleRate(currency: string): Promise<ExchangeRate | null>;
    private generateMockRate;
    private callHanaBankApi;
}
