import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserSettings } from '../../domain/entities/user-settings.entity';
export declare class ExchangeRateGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleUpdateThreshold(data: {
        threshold: number;
    }, client: Socket): void;
    handleUpdateCurrencies(data: {
        currencies: string[];
    }, client: Socket): void;
    handleGetSettings(client: Socket): void;
    broadcastExchangeRateUpdate(exchangeRates: any[]): void;
    getConnectedClientsSettings(): UserSettings[];
    getClientSettings(clientId: string): UserSettings | undefined;
}
