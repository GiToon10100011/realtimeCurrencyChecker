"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRate = void 0;
class ExchangeRate {
    currency;
    currencyName;
    rate;
    previousRate;
    timestamp;
    source;
    constructor(currency, currencyName, rate, previousRate, timestamp, source = 'KOREA_EXIMBANK') {
        this.currency = currency;
        this.currencyName = currencyName;
        this.rate = rate;
        this.previousRate = previousRate;
        this.timestamp = timestamp;
        this.source = source;
    }
    get change() {
        return this.rate - this.previousRate;
    }
    get changePercent() {
        return (this.change / this.previousRate) * 100;
    }
    get isPositive() {
        return this.change >= 0;
    }
    hasSignificantChange(threshold) {
        return Math.abs(this.change) >= threshold;
    }
    toObject() {
        return {
            currency: this.currency,
            currencyName: this.currencyName,
            rate: this.rate,
            previousRate: this.previousRate,
            change: this.change,
            changePercent: this.changePercent,
            timestamp: this.timestamp,
            isPositive: this.isPositive,
            source: this.source
        };
    }
}
exports.ExchangeRate = ExchangeRate;
//# sourceMappingURL=exchange-rate.entity.js.map