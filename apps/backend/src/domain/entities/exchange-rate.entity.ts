export class ExchangeRate {
  constructor(
    public readonly currency: string,
    public readonly currencyName: string,
    public readonly rate: number,
    public readonly previousRate: number,
    public readonly timestamp: Date,
    public readonly source: string = 'HANA_BANK'
  ) {}

  get change(): number {
    return this.rate - this.previousRate
  }

  get changePercent(): number {
    return (this.change / this.previousRate) * 100
  }

  get isPositive(): boolean {
    return this.change >= 0
  }

  hasSignificantChange(threshold: number): boolean {
    return Math.abs(this.change) >= threshold
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
    }
  }
}