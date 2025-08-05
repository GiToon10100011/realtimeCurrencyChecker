import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { UpdateExchangeRatesUseCase } from '../use-cases/update-exchange-rates.use-case'
import { ExchangeRateGateway } from '../../presentation/gateways/exchange-rate.gateway'

@Injectable()
export class ExchangeRateSchedulerService {
  private readonly logger = new Logger(ExchangeRateSchedulerService.name)
  private readonly DEFAULT_CURRENCIES = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD', 'CAD', 'CHF']

  constructor(
    private readonly updateExchangeRatesUseCase: UpdateExchangeRatesUseCase,
    private readonly exchangeRateGateway: ExchangeRateGateway
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateExchangeRates() {
    try {
      this.logger.log('Starting scheduled exchange rate update')

      const connectedSettings = this.exchangeRateGateway.getConnectedClientsSettings()
      
      if (connectedSettings.length === 0) {
        this.logger.log('No connected clients, using default currencies')
        await this.processUpdate(this.DEFAULT_CURRENCIES, 3)
        return
      }

      const allCurrencies = new Set<string>()
      const clientThresholds = new Map<string, number>()

      connectedSettings.forEach(settings => {
        settings.selectedCurrencies.forEach(currency => allCurrencies.add(currency))
        clientThresholds.set(settings.sessionId, settings.thresholdKRW)
      })

      const currencies = Array.from(allCurrencies)
      const minThreshold = Math.min(...Array.from(clientThresholds.values()))

      await this.processUpdate(currencies, minThreshold)

    } catch (error) {
      this.logger.error('Failed to update exchange rates', error)
    }
  }

  private async processUpdate(currencies: string[], threshold: number) {
    try {
      const { updatedRates, hasSignificantChanges } = await this.updateExchangeRatesUseCase.execute(
        currencies, 
        threshold
      )

      if (hasSignificantChanges && updatedRates.length > 0) {
        this.logger.log(`Broadcasting ${updatedRates.length} updated rates to clients`)
        
        const rateObjects = updatedRates.map(rate => rate.toObject())
        this.exchangeRateGateway.broadcastExchangeRateUpdate(rateObjects)
      } else {
        this.logger.log('No significant changes detected, skipping broadcast')
      }

    } catch (error) {
      this.logger.error('Failed to process exchange rate update', error)
    }
  }

  async forceUpdate(currencies?: string[]): Promise<void> {
    try {
      const targetCurrencies = currencies || this.DEFAULT_CURRENCIES
      this.logger.log(`Force updating exchange rates for: ${targetCurrencies.join(', ')}`)
      
      await this.processUpdate(targetCurrencies, 0)
    } catch (error) {
      this.logger.error('Failed to force update exchange rates', error)
      throw error
    }
  }
}