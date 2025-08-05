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
var ExchangeRateSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const update_exchange_rates_use_case_1 = require("../use-cases/update-exchange-rates.use-case");
const exchange_rate_gateway_1 = require("../../presentation/gateways/exchange-rate.gateway");
let ExchangeRateSchedulerService = ExchangeRateSchedulerService_1 = class ExchangeRateSchedulerService {
    updateExchangeRatesUseCase;
    exchangeRateGateway;
    logger = new common_1.Logger(ExchangeRateSchedulerService_1.name);
    DEFAULT_CURRENCIES = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD', 'CAD', 'CHF'];
    constructor(updateExchangeRatesUseCase, exchangeRateGateway) {
        this.updateExchangeRatesUseCase = updateExchangeRatesUseCase;
        this.exchangeRateGateway = exchangeRateGateway;
    }
    async updateExchangeRates() {
        try {
            this.logger.log('Starting scheduled exchange rate update');
            const connectedSettings = this.exchangeRateGateway.getConnectedClientsSettings();
            if (connectedSettings.length === 0) {
                this.logger.log('No connected clients, using default currencies');
                await this.processUpdate(this.DEFAULT_CURRENCIES, 3);
                return;
            }
            const allCurrencies = new Set();
            const clientThresholds = new Map();
            connectedSettings.forEach(settings => {
                settings.selectedCurrencies.forEach(currency => allCurrencies.add(currency));
                clientThresholds.set(settings.sessionId, settings.thresholdKRW);
            });
            const currencies = Array.from(allCurrencies);
            const minThreshold = Math.min(...Array.from(clientThresholds.values()));
            await this.processUpdate(currencies, minThreshold);
        }
        catch (error) {
            this.logger.error('Failed to update exchange rates', error);
        }
    }
    async processUpdate(currencies, threshold) {
        try {
            const { updatedRates, hasSignificantChanges } = await this.updateExchangeRatesUseCase.execute(currencies, threshold);
            if (hasSignificantChanges && updatedRates.length > 0) {
                this.logger.log(`Broadcasting ${updatedRates.length} updated rates to clients`);
                const rateObjects = updatedRates.map(rate => rate.toObject());
                this.exchangeRateGateway.broadcastExchangeRateUpdate(rateObjects);
            }
            else {
                this.logger.log('No significant changes detected, skipping broadcast');
            }
        }
        catch (error) {
            this.logger.error('Failed to process exchange rate update', error);
        }
    }
    async forceUpdate(currencies) {
        try {
            const targetCurrencies = currencies || this.DEFAULT_CURRENCIES;
            this.logger.log(`Force updating exchange rates for: ${targetCurrencies.join(', ')}`);
            await this.processUpdate(targetCurrencies, 0);
        }
        catch (error) {
            this.logger.error('Failed to force update exchange rates', error);
            throw error;
        }
    }
};
exports.ExchangeRateSchedulerService = ExchangeRateSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExchangeRateSchedulerService.prototype, "updateExchangeRates", null);
exports.ExchangeRateSchedulerService = ExchangeRateSchedulerService = ExchangeRateSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [update_exchange_rates_use_case_1.UpdateExchangeRatesUseCase,
        exchange_rate_gateway_1.ExchangeRateGateway])
], ExchangeRateSchedulerService);
//# sourceMappingURL=exchange-rate-scheduler.service.js.map