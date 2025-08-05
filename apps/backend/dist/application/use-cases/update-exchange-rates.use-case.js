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
var UpdateExchangeRatesUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExchangeRatesUseCase = void 0;
const common_1 = require("@nestjs/common");
const exchange_rate_entity_1 = require("../../domain/entities/exchange-rate.entity");
const exchange_rate_repository_1 = require("../../domain/repositories/exchange-rate.repository");
const hana_bank_api_repository_1 = require("../../domain/repositories/hana-bank-api.repository");
let UpdateExchangeRatesUseCase = UpdateExchangeRatesUseCase_1 = class UpdateExchangeRatesUseCase {
    exchangeRateRepository;
    hanaBankApiRepository;
    logger = new common_1.Logger(UpdateExchangeRatesUseCase_1.name);
    constructor(exchangeRateRepository, hanaBankApiRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
        this.hanaBankApiRepository = hanaBankApiRepository;
    }
    async execute(currencies, threshold = 3) {
        try {
            this.logger.log(`Fetching exchange rates for currencies: ${currencies.join(', ')}`);
            const newRates = await this.hanaBankApiRepository.fetchExchangeRates(currencies);
            const updatedRates = [];
            let hasSignificantChanges = false;
            for (const newRate of newRates) {
                const existingRate = await this.exchangeRateRepository.findByCurrency(newRate.currency);
                if (!existingRate) {
                    await this.exchangeRateRepository.save(newRate);
                    updatedRates.push(newRate);
                    hasSignificantChanges = true;
                    continue;
                }
                const rateWithPrevious = new exchange_rate_entity_1.ExchangeRate(newRate.currency, newRate.currencyName, newRate.rate, existingRate.rate, newRate.timestamp, newRate.source);
                if (rateWithPrevious.hasSignificantChange(threshold)) {
                    await this.exchangeRateRepository.save(rateWithPrevious);
                    updatedRates.push(rateWithPrevious);
                    hasSignificantChanges = true;
                    this.logger.log(`Significant change detected for ${newRate.currency}: ` +
                        `${existingRate.rate} -> ${newRate.rate} (${rateWithPrevious.change.toFixed(2)} KRW)`);
                }
            }
            return { updatedRates, hasSignificantChanges };
        }
        catch (error) {
            this.logger.error('Failed to update exchange rates', error);
            throw error;
        }
    }
};
exports.UpdateExchangeRatesUseCase = UpdateExchangeRatesUseCase;
exports.UpdateExchangeRatesUseCase = UpdateExchangeRatesUseCase = UpdateExchangeRatesUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(exchange_rate_repository_1.EXCHANGE_RATE_REPOSITORY)),
    __param(1, (0, common_1.Inject)(hana_bank_api_repository_1.HANA_BANK_API_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateExchangeRatesUseCase);
//# sourceMappingURL=update-exchange-rates.use-case.js.map