import { Controller, Get, Post, Query, Body, Logger } from '@nestjs/common'
import { GetExchangeRatesUseCase } from '../../application/use-cases/get-exchange-rates.use-case'
import { ExchangeRateSchedulerService } from '../../application/services/exchange-rate-scheduler.service'

@Controller('api/exchange-rates')
export class ExchangeRateController {
  private readonly logger = new Logger(ExchangeRateController.name)

  constructor(
    private readonly getExchangeRatesUseCase: GetExchangeRatesUseCase,
    private readonly exchangeRateSchedulerService: ExchangeRateSchedulerService
  ) {}

  @Get()
  async getExchangeRates(@Query('currencies') currencies?: string) {
    try {
      const currencyList = currencies ? currencies.split(',') : undefined
      const rates = await this.getExchangeRatesUseCase.execute(currencyList)
      
      return {
        success: true,
        data: rates.map(rate => rate.toObject()),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      this.logger.error('Failed to get exchange rates', error)
      return {
        success: false,
        error: 'Failed to fetch exchange rates',
        timestamp: new Date().toISOString()
      }
    }
  }

  @Post('force-update')
  async forceUpdate(@Body() body: { currencies?: string[] }) {
    try {
      await this.exchangeRateSchedulerService.forceUpdate(body.currencies)
      
      return {
        success: true,
        message: 'Exchange rates updated successfully',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      this.logger.error('Failed to force update exchange rates', error)
      return {
        success: false,
        error: 'Failed to update exchange rates',
        timestamp: new Date().toISOString()
      }
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'exchange-rate-service',
      timestamp: new Date().toISOString()
    }
  }
}