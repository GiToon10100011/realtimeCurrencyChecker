import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { UserSettings } from '../../domain/entities/user-settings.entity'

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
export class ExchangeRateGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(ExchangeRateGateway.name)
  private connectedClients = new Map<string, UserSettings>()

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
    
    const defaultSettings = new UserSettings(
      client.id,
      3, // Default threshold 3 KRW
      ['USD', 'EUR', 'JPY'], // Default currencies
      5000 // Default refresh interval
    )
    
    this.connectedClients.set(client.id, defaultSettings)
    
    client.emit('connectionStatus', {
      status: 'connected',
      message: 'Successfully connected to exchange rate updates'
    })
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
    this.connectedClients.delete(client.id)
  }

  @SubscribeMessage('updateThreshold')
  handleUpdateThreshold(
    @MessageBody() data: { threshold: number },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const currentSettings = this.connectedClients.get(client.id)
      if (currentSettings) {
        const updatedSettings = currentSettings.updateThreshold(data.threshold)
        this.connectedClients.set(client.id, updatedSettings)
        
        this.logger.log(`Updated threshold for client ${client.id}: ${data.threshold} KRW`)
        
        client.emit('thresholdUpdated', {
          threshold: data.threshold,
          message: 'Threshold updated successfully'
        })
      }
    } catch (error) {
      this.logger.error(`Failed to update threshold for client ${client.id}`, error)
      client.emit('error', {
        message: 'Failed to update threshold',
        error: error.message
      })
    }
  }

  @SubscribeMessage('updateCurrencies')
  handleUpdateCurrencies(
    @MessageBody() data: { currencies: string[] },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const currentSettings = this.connectedClients.get(client.id)
      if (currentSettings) {
        const updatedSettings = currentSettings.updateSelectedCurrencies(data.currencies)
        this.connectedClients.set(client.id, updatedSettings)
        
        this.logger.log(`Updated currencies for client ${client.id}: ${data.currencies.join(', ')}`)
        
        client.emit('currenciesUpdated', {
          currencies: data.currencies,
          message: 'Selected currencies updated successfully'
        })
      }
    } catch (error) {
      this.logger.error(`Failed to update currencies for client ${client.id}`, error)
      client.emit('error', {
        message: 'Failed to update currencies',
        error: error.message
      })
    }
  }

  @SubscribeMessage('getSettings')
  handleGetSettings(@ConnectedSocket() client: Socket) {
    const settings = this.connectedClients.get(client.id)
    if (settings) {
      client.emit('currentSettings', settings.toObject())
    }
  }

  broadcastExchangeRateUpdate(exchangeRates: any[]) {
    this.connectedClients.forEach((settings, clientId) => {
      const relevantRates = exchangeRates.filter(rate => 
        settings.selectedCurrencies.includes(rate.currency)
      )

      if (relevantRates.length > 0) {
        this.server.to(clientId).emit('exchangeRateUpdate', relevantRates)
        this.logger.log(`Sent update to client ${clientId}: ${relevantRates.length} rates`)
      }
    })
  }

  getConnectedClientsSettings(): UserSettings[] {
    return Array.from(this.connectedClients.values())
  }

  getClientSettings(clientId: string): UserSettings | undefined {
    return this.connectedClients.get(clientId)
  }
}