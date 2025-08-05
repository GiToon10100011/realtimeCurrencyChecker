import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { HttpModule } from '@nestjs/axios'

import { RedisCacheModule } from './shared/config/redis.config'

import { ExchangeRateController } from './presentation/controllers/exchange-rate.controller'
import { ExchangeRateGateway } from './presentation/gateways/exchange-rate.gateway'

import { GetExchangeRatesUseCase } from './application/use-cases/get-exchange-rates.use-case'
import { UpdateExchangeRatesUseCase } from './application/use-cases/update-exchange-rates.use-case'
import { ExchangeRateSchedulerService } from './application/services/exchange-rate-scheduler.service'

import { HanaBankApiAdapter } from './infrastructure/adapters/hana-bank-api.adapter'
import { RedisExchangeRateRepository } from './infrastructure/repositories/redis-exchange-rate.repository'

import { EXCHANGE_RATE_REPOSITORY } from './domain/repositories/exchange-rate.repository'
import { HANA_BANK_API_REPOSITORY } from './domain/repositories/hana-bank-api.repository'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    RedisCacheModule,
  ],
  controllers: [
    ExchangeRateController,
  ],
  providers: [
    ExchangeRateGateway,
    
    GetExchangeRatesUseCase,
    UpdateExchangeRatesUseCase,
    ExchangeRateSchedulerService,
    
    {
      provide: EXCHANGE_RATE_REPOSITORY,
      useClass: RedisExchangeRateRepository,
    },
    {
      provide: HANA_BANK_API_REPOSITORY,
      useClass: HanaBankApiAdapter,
    },
  ],
})
export class AppModule {}