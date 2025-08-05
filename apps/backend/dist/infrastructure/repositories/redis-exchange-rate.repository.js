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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisExchangeRateRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisExchangeRateRepository = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const exchange_rate_entity_1 = require("../../domain/entities/exchange-rate.entity");
let RedisExchangeRateRepository = RedisExchangeRateRepository_1 = class RedisExchangeRateRepository {
    cacheManager;
    logger = new common_1.Logger(RedisExchangeRateRepository_1.name);
    CACHE_PREFIX = 'exchange_rate';
    HISTORICAL_PREFIX = 'historical';
    ALL_CURRENCIES_KEY = 'all_currencies';
    TTL = 300;
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async findAll() {
        try {
            const currencyKeys = await this.cacheManager.get(this.ALL_CURRENCIES_KEY) || [];
            const rates = [];
            for (const currency of currencyKeys) {
                const rate = await this.findByCurrency(currency);
                if (rate) {
                    rates.push(rate);
                }
            }
            return rates;
        }
        catch (error) {
            this.logger.error('Failed to find all exchange rates', error);
            return [];
        }
    }
    async findByCurrency(currency) {
        try {
            const key = `${this.CACHE_PREFIX}:${currency}`;
            const cachedData = await this.cacheManager.get(key);
            if (!cachedData) {
                return null;
            }
            return new exchange_rate_entity_1.ExchangeRate(cachedData.currency, cachedData.currencyName, cachedData.rate, cachedData.previousRate, new Date(cachedData.timestamp), cachedData.source);
        }
        catch (error) {
            this.logger.error(`Failed to find exchange rate for ${currency}`, error);
            return null;
        }
    }
    async save(exchangeRate) {
        try {
            const key = `${this.CACHE_PREFIX}:${exchangeRate.currency}`;
            const data = {
                currency: exchangeRate.currency,
                currencyName: exchangeRate.currencyName,
                rate: exchangeRate.rate,
                previousRate: exchangeRate.previousRate,
                timestamp: exchangeRate.timestamp.toISOString(),
                source: exchangeRate.source
            };
            await this.cacheManager.set(key, data, this.TTL * 1000);
            await this.updateCurrencyList(exchangeRate.currency);
            await this.saveToHistorical(exchangeRate);
            this.logger.log(`Saved exchange rate for ${exchangeRate.currency}: ${exchangeRate.rate}`);
        }
        catch (error) {
            this.logger.error(`Failed to save exchange rate for ${exchangeRate.currency}`, error);
            throw error;
        }
    }
    async saveBatch(exchangeRates) {
        try {
            for (const rate of exchangeRates) {
                await this.save(rate);
            }
            this.logger.log(`Saved batch of ${exchangeRates.length} exchange rates`);
        }
        catch (error) {
            this.logger.error('Failed to save batch of exchange rates', error);
            throw error;
        }
    }
    async getHistoricalRates(currency, hours) {
        try {
            const key = `${this.HISTORICAL_PREFIX}:${currency}`;
            const historicalData = await this.cacheManager.get(key) || [];
            const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
            return historicalData
                .filter(data => new Date(data.timestamp) >= cutoffTime)
                .map(data => new exchange_rate_entity_1.ExchangeRate(data.currency, data.currencyName, data.rate, data.previousRate, new Date(data.timestamp), data.source))
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        }
        catch (error) {
            this.logger.error(`Failed to get historical rates for ${currency}`, error);
            return [];
        }
    }
    async updateCurrencyList(currency) {
        try {
            const currencies = await this.cacheManager.get(this.ALL_CURRENCIES_KEY) || [];
            if (!currencies.includes(currency)) {
                currencies.push(currency);
                await this.cacheManager.set(this.ALL_CURRENCIES_KEY, currencies, this.TTL * 4 * 1000);
            }
        }
        catch (error) {
            this.logger.error('Failed to update currency list', error);
        }
    }
    async saveToHistorical(exchangeRate) {
        try {
            const key = `${this.HISTORICAL_PREFIX}:${exchangeRate.currency}`;
            const historicalData = await this.cacheManager.get(key) || [];
            const data = {
                currency: exchangeRate.currency,
                currencyName: exchangeRate.currencyName,
                rate: exchangeRate.rate,
                previousRate: exchangeRate.previousRate,
                timestamp: exchangeRate.timestamp.toISOString(),
                source: exchangeRate.source
            };
            historicalData.push(data);
            const maxEntries = 100;
            if (historicalData.length > maxEntries) {
                historicalData.splice(0, historicalData.length - maxEntries);
            }
            await this.cacheManager.set(key, historicalData, this.TTL * 10 * 1000);
        }
        catch (error) {
            this.logger.error(`Failed to save historical data for ${exchangeRate.currency}`, error);
        }
    }
};
exports.RedisExchangeRateRepository = RedisExchangeRateRepository;
exports.RedisExchangeRateRepository = RedisExchangeRateRepository = RedisExchangeRateRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], RedisExchangeRateRepository);
//# sourceMappingURL=redis-exchange-rate.repository.js.map