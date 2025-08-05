"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("@nestjs/axios");
const redis_config_1 = require("./shared/config/redis.config");
const exchange_rate_controller_1 = require("./presentation/controllers/exchange-rate.controller");
const exchange_rate_gateway_1 = require("./presentation/gateways/exchange-rate.gateway");
const get_exchange_rates_use_case_1 = require("./application/use-cases/get-exchange-rates.use-case");
const update_exchange_rates_use_case_1 = require("./application/use-cases/update-exchange-rates.use-case");
const exchange_rate_scheduler_service_1 = require("./application/services/exchange-rate-scheduler.service");
const hana_bank_api_adapter_1 = require("./infrastructure/adapters/hana-bank-api.adapter");
const redis_exchange_rate_repository_1 = require("./infrastructure/repositories/redis-exchange-rate.repository");
const exchange_rate_repository_1 = require("./domain/repositories/exchange-rate.repository");
const hana_bank_api_repository_1 = require("./domain/repositories/hana-bank-api.repository");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            schedule_1.ScheduleModule.forRoot(),
            axios_1.HttpModule,
            redis_config_1.RedisCacheModule,
        ],
        controllers: [
            exchange_rate_controller_1.ExchangeRateController,
        ],
        providers: [
            exchange_rate_gateway_1.ExchangeRateGateway,
            get_exchange_rates_use_case_1.GetExchangeRatesUseCase,
            update_exchange_rates_use_case_1.UpdateExchangeRatesUseCase,
            exchange_rate_scheduler_service_1.ExchangeRateSchedulerService,
            {
                provide: exchange_rate_repository_1.EXCHANGE_RATE_REPOSITORY,
                useClass: redis_exchange_rate_repository_1.RedisExchangeRateRepository,
            },
            {
                provide: hana_bank_api_repository_1.HANA_BANK_API_REPOSITORY,
                useClass: hana_bank_api_adapter_1.HanaBankApiAdapter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map