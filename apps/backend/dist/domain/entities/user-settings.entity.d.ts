export declare class UserSettings {
    readonly sessionId: string;
    readonly thresholdKRW: number;
    readonly selectedCurrencies: string[];
    readonly refreshInterval: number;
    constructor(sessionId: string, thresholdKRW: number, selectedCurrencies: string[], refreshInterval?: number);
    updateThreshold(newThreshold: number): UserSettings;
    updateSelectedCurrencies(currencies: string[]): UserSettings;
    toObject(): {
        sessionId: string;
        thresholdKRW: number;
        selectedCurrencies: string[];
        refreshInterval: number;
    };
}
