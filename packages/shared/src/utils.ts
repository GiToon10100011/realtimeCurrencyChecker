export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency === 'KRW' ? 'KRW' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatExchangeRate(rate: number): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate)
}

export function calculateChange(current: number, previous: number): {
  change: number
  changePercent: number
  isPositive: boolean
} {
  const change = current - previous
  const changePercent = (change / previous) * 100
  return {
    change,
    changePercent,
    isPositive: change >= 0
  }
}

export function validateThreshold(threshold: number): boolean {
  return threshold >= 3 && threshold <= 1000
}

export function validateCurrencies(currencies: string[]): boolean {
  const validCodes = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD', 'CAD', 'CHF']
  return currencies.every(currency => validCodes.includes(currency))
}