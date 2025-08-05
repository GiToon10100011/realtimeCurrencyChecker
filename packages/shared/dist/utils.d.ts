export declare function formatCurrency(value: number, currency: string): string;
export declare function formatExchangeRate(rate: number): string;
export declare function calculateChange(current: number, previous: number): {
    change: number;
    changePercent: number;
    isPositive: boolean;
};
export declare function validateThreshold(threshold: number): boolean;
export declare function validateCurrencies(currencies: string[]): boolean;
