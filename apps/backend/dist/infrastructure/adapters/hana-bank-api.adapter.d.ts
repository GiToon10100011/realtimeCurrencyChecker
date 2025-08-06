import { HttpService } from '@nestjs/axios';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import { HanaBankApiRepository } from '../../domain/repositories/hana-bank-api.repository';
import { ConfigService } from '@nestjs/config';
export declare class HanaBankApiAdapter implements HanaBankApiRepository {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    fetchExchangeRates(currencies: string[]): Promise<ExchangeRate[]>;
    fetchSingleRate(currency: string): Promise<ExchangeRate | null>;
    private generateMockRate;
    private callKoreaeximApi;
}
