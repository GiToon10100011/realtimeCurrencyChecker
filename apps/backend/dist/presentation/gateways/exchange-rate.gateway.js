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
var ExchangeRateGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const user_settings_entity_1 = require("../../domain/entities/user-settings.entity");
let ExchangeRateGateway = ExchangeRateGateway_1 = class ExchangeRateGateway {
    server;
    logger = new common_1.Logger(ExchangeRateGateway_1.name);
    connectedClients = new Map();
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        const defaultSettings = new user_settings_entity_1.UserSettings(client.id, 3, ['USD', 'EUR', 'JPY'], 5000);
        this.connectedClients.set(client.id, defaultSettings);
        client.emit('connectionStatus', {
            status: 'connected',
            message: 'Successfully connected to exchange rate updates'
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    handleUpdateThreshold(data, client) {
        try {
            const currentSettings = this.connectedClients.get(client.id);
            if (currentSettings) {
                const updatedSettings = currentSettings.updateThreshold(data.threshold);
                this.connectedClients.set(client.id, updatedSettings);
                this.logger.log(`Updated threshold for client ${client.id}: ${data.threshold} KRW`);
                client.emit('thresholdUpdated', {
                    threshold: data.threshold,
                    message: 'Threshold updated successfully'
                });
            }
        }
        catch (error) {
            this.logger.error(`Failed to update threshold for client ${client.id}`, error);
            client.emit('error', {
                message: 'Failed to update threshold',
                error: error.message
            });
        }
    }
    handleUpdateCurrencies(data, client) {
        try {
            const currentSettings = this.connectedClients.get(client.id);
            if (currentSettings) {
                const updatedSettings = currentSettings.updateSelectedCurrencies(data.currencies);
                this.connectedClients.set(client.id, updatedSettings);
                this.logger.log(`Updated currencies for client ${client.id}: ${data.currencies.join(', ')}`);
                client.emit('currenciesUpdated', {
                    currencies: data.currencies,
                    message: 'Selected currencies updated successfully'
                });
            }
        }
        catch (error) {
            this.logger.error(`Failed to update currencies for client ${client.id}`, error);
            client.emit('error', {
                message: 'Failed to update currencies',
                error: error.message
            });
        }
    }
    handleGetSettings(client) {
        const settings = this.connectedClients.get(client.id);
        if (settings) {
            client.emit('currentSettings', settings.toObject());
        }
    }
    broadcastExchangeRateUpdate(exchangeRates) {
        this.connectedClients.forEach((settings, clientId) => {
            const relevantRates = exchangeRates.filter(rate => settings.selectedCurrencies.includes(rate.currency));
            if (relevantRates.length > 0) {
                this.server.to(clientId).emit('exchangeRateUpdate', relevantRates);
                this.logger.log(`Sent update to client ${clientId}: ${relevantRates.length} rates`);
            }
        });
    }
    getConnectedClientsSettings() {
        return Array.from(this.connectedClients.values());
    }
    getClientSettings(clientId) {
        return this.connectedClients.get(clientId);
    }
};
exports.ExchangeRateGateway = ExchangeRateGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ExchangeRateGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateThreshold'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ExchangeRateGateway.prototype, "handleUpdateThreshold", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateCurrencies'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ExchangeRateGateway.prototype, "handleUpdateCurrencies", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getSettings'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ExchangeRateGateway.prototype, "handleGetSettings", null);
exports.ExchangeRateGateway = ExchangeRateGateway = ExchangeRateGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
], ExchangeRateGateway);
//# sourceMappingURL=exchange-rate.gateway.js.map