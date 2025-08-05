export declare class ExchangeRate {
    readonly currency: string;
    readonly currencyName: string;
    readonly rate: number;
    readonly previousRate: number;
    readonly timestamp: Date;
    readonly source: string;
    constructor(currency: string, currencyName: string, rate: number, previousRate: number, timestamp: Date, source?: string);
    get change(): number;
    get changePercent(): number;
    get isPositive(): boolean;
    hasSignificantChange(threshold: number): boolean;
    toObject(): {
        currency: string;
        currencyName: string;
        rate: number;
        previousRate: number;
        change: number;
        changePercent: number;
        timestamp: Date;
        isPositive: boolean;
        source: string;
    };
}
