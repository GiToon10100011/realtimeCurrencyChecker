export class UserSettings {
  constructor(
    public readonly sessionId: string,
    public readonly thresholdKRW: number,
    public readonly selectedCurrencies: string[],
    public readonly refreshInterval: number = 5000
  ) {
    if (thresholdKRW < 3) {
      throw new Error('Threshold must be at least 3 KRW')
    }
  }

  updateThreshold(newThreshold: number): UserSettings {
    return new UserSettings(
      this.sessionId,
      newThreshold,
      this.selectedCurrencies,
      this.refreshInterval
    )
  }

  updateSelectedCurrencies(currencies: string[]): UserSettings {
    return new UserSettings(
      this.sessionId,
      this.thresholdKRW,
      currencies,
      this.refreshInterval
    )
  }

  toObject() {
    return {
      sessionId: this.sessionId,
      thresholdKRW: this.thresholdKRW,
      selectedCurrencies: this.selectedCurrencies,
      refreshInterval: this.refreshInterval
    }
  }
}