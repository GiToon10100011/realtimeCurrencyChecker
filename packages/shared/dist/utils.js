"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatExchangeRate = formatExchangeRate;
exports.calculateChange = calculateChange;
exports.validateThreshold = validateThreshold;
exports.validateCurrencies = validateCurrencies;
function formatCurrency(value, currency) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: currency === 'KRW' ? 'KRW' : 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
function formatExchangeRate(rate) {
    return new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(rate);
}
function calculateChange(current, previous) {
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    return {
        change,
        changePercent,
        isPositive: change >= 0
    };
}
function validateThreshold(threshold) {
    return threshold >= 3 && threshold <= 1000;
}
function validateCurrencies(currencies) {
    const validCodes = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD', 'CAD', 'CHF'];
    return currencies.every(currency => validCodes.includes(currency));
}
