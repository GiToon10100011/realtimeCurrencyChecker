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
    logger = new common_1.Logger(HanaBankApiAdapter_1.name);
    constructor(httpService) {
        this.httpService = httpService;
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
            const mockRate = this.generateMockRate(currency);
            this.logger.log(`Fetched rate for ${currency}: ${mockRate.rate}`);
            return mockRate;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rate for ${currency}`, error);
            return null;
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
        return new exchange_rate_entity_1.ExchangeRate(currency, CURRENCY_NAMES[currency] || currency, currentRate, baseRate, new Date(), 'HANA_BANK');
    }
    async callHanaBankApi(currency) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`/api/exchange-rate/${currency}`));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Hana Bank API call failed for ${currency}`, error);
            return null;
        }
    }
};
exports.HanaBankApiAdapter = HanaBankApiAdapter;
exports.HanaBankApiAdapter = HanaBankApiAdapter = HanaBankApiAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], HanaBankApiAdapter);
//# sourceMappingURL=hana-bank-api.adapter.js.map