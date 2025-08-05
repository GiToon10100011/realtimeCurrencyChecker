"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettings = void 0;
class UserSettings {
    sessionId;
    thresholdKRW;
    selectedCurrencies;
    refreshInterval;
    constructor(sessionId, thresholdKRW, selectedCurrencies, refreshInterval = 5000) {
        this.sessionId = sessionId;
        this.thresholdKRW = thresholdKRW;
        this.selectedCurrencies = selectedCurrencies;
        this.refreshInterval = refreshInterval;
        if (thresholdKRW < 3) {
            throw new Error('Threshold must be at least 3 KRW');
        }
    }
    updateThreshold(newThreshold) {
        return new UserSettings(this.sessionId, newThreshold, this.selectedCurrencies, this.refreshInterval);
    }
    updateSelectedCurrencies(currencies) {
        return new UserSettings(this.sessionId, this.thresholdKRW, currencies, this.refreshInterval);
    }
    toObject() {
        return {
            sessionId: this.sessionId,
            thresholdKRW: this.thresholdKRW,
            selectedCurrencies: this.selectedCurrencies,
            refreshInterval: this.refreshInterval
        };
    }
}
exports.UserSettings = UserSettings;
//# sourceMappingURL=user-settings.entity.js.map