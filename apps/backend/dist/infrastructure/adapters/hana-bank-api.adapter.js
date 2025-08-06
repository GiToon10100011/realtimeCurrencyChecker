"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HanaBankApiAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanaBankApiAdapter = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const exchange_rate_entity_1 = require("../../domain/entities/exchange-rate.entity");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
const CURRENCY_NAMES = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'JPY': 'Japanese Yen',
    'CNY': 'Chinese Yuan',
    'GBP': 'British Pound',
    'AUD': 'Australian Dollar',
    'CAD': 'Canadian Dollar',
    'CHF': 'Swiss Franc'
};
let HanaBankApiAdapter = HanaBankApiAdapter_1 = class HanaBankApiAdapter {
    httpService;
    configService;
    logger = new common_1.Logger(HanaBankApiAdapter_1.name);
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async fetchExchangeRates(currencies) {
        const rates = [];
        for (const currency of currencies) {
            try {
                const rate = await this.fetchSingleRate(currency);
                if (rate) {
                    rates.push(rate);
                }
            }
            catch (error) {
                this.logger.warn(`Failed to fetch rate for ${currency}`, error);
                const mockRate = this.generateMockRate(currency);
                rates.push(mockRate);
            }
        }
        return rates;
    }
    async fetchSingleRate(currency) {
        try {
            const realRate = await this.callKoreaeximApi(currency);
            if (realRate) {
                this.logger.log(`Fetched real rate for ${currency}: ${realRate.rate}`);
                return realRate;
            }
            const mockRate = this.generateMockRate(currency);
            this.logger.log(`Using mock rate for ${currency}: ${mockRate.rate}`);
            return mockRate;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rate for ${currency}`, error);
            const mockRate = this.generateMockRate(currency);
            return mockRate;
        }
    }
    generateMockRate(currency) {
        const baseRates = {
            'USD': 1340,
            'EUR': 1456,
            'JPY': 9.45,
            'CNY': 185.2,
            'GBP': 1695,
            'AUD': 875,
            'CAD': 985,
            'CHF': 1485
        };
        const baseRate = baseRates[currency] || 1000;
        const variation = (Math.random() - 0.5) * 20;
        const currentRate = Number((baseRate + variation).toFixed(2));
        return new exchange_rate_entity_1.ExchangeRate(currency, CURRENCY_NAMES[currency] || currency, currentRate, baseRate, new Date(), 'KOREA_EXIMBANK');
    }
    async callKoreaeximApi(currency) {
        try {
            const apiKey = this.configService.get('KOREAEXIM_API_KEY');
            if (!apiKey) {
                this.logger.warn('KOREAEXIM_API_KEY not configured');
                return null;
            }
            const baseUrl = this.configService.get('KOREAEXIM_API_URL', 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON');
            const params = {
                authkey: apiKey,
                data: 'AP01'
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(baseUrl, { params }));
            const data = response.data;
            this.logger.debug(`Korea Eximbank API response for ${currency}:`, JSON.stringify(data, null, 2));
            if (!Array.isArray(data)) {
                this.logger.warn('Invalid response format from Korea Eximbank API');
                return null;
            }
            const currencyMapping = {
                'USD': 'USD',
                'EUR': 'EUR',
                'JPY': 'JPY(100)',
                'CNY': 'CNH',
                'GBP': 'GBP',
                'AUD': 'AUD',
                'CAD': 'CAD',
                'CHF': 'CHF'
            };
            const mappedCurrency = currencyMapping[currency] || currency;
            this.logger.debug(`Looking for currency: ${currency} -> ${mappedCurrency}`);
            const currencyData = data.find(item => item.cur_unit === mappedCurrency ||
                item.cur_unit.startsWith(mappedCurrency));
            this.logger.debug(`Found currency data:`, currencyData);
            if (!currencyData) {
                this.logger.warn(`Currency ${currency} not found in Korea Eximbank API response`);
                return null;
            }
            const rate = parseFloat(currencyData.deal_bas_r.replace(/,/g, ''));
            const baseRate = parseFloat(currencyData.kftc_deal_bas_r?.replace(/,/g, '') || currencyData.deal_bas_r.replace(/,/g, ''));
            return new exchange_rate_entity_1.ExchangeRate(currency, currencyData.cur_nm, rate, baseRate, new Date(), 'KOREA_EXIMBANK');
        }
        catch (error) {
            this.logger.error(`Korea Eximbank API call failed for ${currency}`, error);
            return null;
        }
    }
};
exports.HanaBankApiAdapter = HanaBankApiAdapter;
exports.HanaBankApiAdapter = HanaBankApiAdapter = HanaBankApiAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], HanaBankApiAdapter);
//# sourceMappingURL=hana-bank-api.adapter.js.map