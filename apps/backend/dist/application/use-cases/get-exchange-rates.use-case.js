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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExchangeRatesUseCase = void 0;
const common_1 = require("@nestjs/common");
const exchange_rate_repository_1 = require("../../domain/repositories/exchange-rate.repository");
let GetExchangeRatesUseCase = class GetExchangeRatesUseCase {
    exchangeRateRepository;
    constructor(exchangeRateRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
    }
    async execute(currencies) {
        if (currencies && currencies.length > 0) {
            const rates = [];
            for (const currency of currencies) {
                const rate = await this.exchangeRateRepository.findByCurrency(currency);
                if (rate) {
                    rates.push(rate);
                }
            }
            return rates;
        }
        return this.exchangeRateRepository.findAll();
    }
};
exports.GetExchangeRatesUseCase = GetExchangeRatesUseCase;
exports.GetExchangeRatesUseCase = GetExchangeRatesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(exchange_rate_repository_1.EXCHANGE_RATE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetExchangeRatesUseCase);
//# sourceMappingURL=get-exchange-rates.use-case.js.map