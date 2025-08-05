export interface ExchangeRate {
    currency: string;
    currencyName: string;
    rate: number;
    previousRate: number;
    change: number;
    changePercent: number;
    timestamp: Date;
    isPositive: boolean;
    source?: string;
}
export interface CurrencyConfig {
    code: string;
    name: string;
    symbol: string;
    flag: string;
}
export interface UserSettings {
    sessionId?: string;
    thresholdKRW: number;
    selectedCurrencies: string[];
    refreshInterval: number;
}
export interface ChartData {
    timestamp: number;
    rate: number;
}
export interface WebSocketMessage {
    type: 'EXCHANGE_RATE_UPDATE' | 'CONNECTION_STATUS' | 'ERROR' | 'THRESHOLD_UPDATED' | 'CURRENCIES_UPDATED';
    data: any;
    timestamp: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
}
export declare const SUPPORTED_CURRENCIES: CurrencyConfig[];
