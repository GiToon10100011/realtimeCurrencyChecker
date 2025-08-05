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
var ExchangeRateController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateController = void 0;
const common_1 = require("@nestjs/common");
const get_exchange_rates_use_case_1 = require("../../application/use-cases/get-exchange-rates.use-case");
const exchange_rate_scheduler_service_1 = require("../../application/services/exchange-rate-scheduler.service");
let ExchangeRateController = ExchangeRateController_1 = class ExchangeRateController {
    getExchangeRatesUseCase;
    exchangeRateSchedulerService;
    logger = new common_1.Logger(ExchangeRateController_1.name);
    constructor(getExchangeRatesUseCase, exchangeRateSchedulerService) {
        this.getExchangeRatesUseCase = getExchangeRatesUseCase;
        this.exchangeRateSchedulerService = exchangeRateSchedulerService;
    }
    async getExchangeRates(currencies) {
        try {
            const currencyList = currencies ? currencies.split(',') : undefined;
            const rates = await this.getExchangeRatesUseCase.execute(currencyList);
            return {
                success: true,
                data: rates.map(rate => rate.toObject()),
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            this.logger.error('Failed to get exchange rates', error);
            return {
                success: false,
                error: 'Failed to fetch exchange rates',
                timestamp: new Date().toISOString()
            };
        }
    }
    async forceUpdate(body) {
        try {
            await this.exchangeRateSchedulerService.forceUpdate(body.currencies);
            return {
                success: true,
                message: 'Exchange rates updated successfully',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            this.logger.error('Failed to force update exchange rates', error);
            return {
                success: false,
                error: 'Failed to update exchange rates',
                timestamp: new Date().toISOString()
            };
        }
    }
    async healthCheck() {
        return {
            status: 'ok',
            service: 'exchange-rate-service',
            timestamp: new Date().toISOString()
        };
    }
};
exports.ExchangeRateController = ExchangeRateController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('currencies')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "getExchangeRates", null);
__decorate([
    (0, common_1.Post)('force-update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "forceUpdate", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExchangeRateController.prototype, "healthCheck", null);
exports.ExchangeRateController = ExchangeRateController = ExchangeRateController_1 = __decorate([
    (0, common_1.Controller)('api/exchange-rates'),
    __metadata("design:paramtypes", [get_exchange_rates_use_case_1.GetExchangeRatesUseCase,
        exchange_rate_scheduler_service_1.ExchangeRateSchedulerService])
], ExchangeRateController);
//# sourceMappingURL=exchange-rate.controller.js.map