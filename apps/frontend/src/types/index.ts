export interface ExchangeRate {
  currency: string
  currencyName: string
  rate: number
  previousRate: number
  change: number
  changePercent: number
  timestamp: Date
  isPositive: boolean
}

export interface CurrencyConfig {
  code: string
  name: string
  symbol: string
  flag: string
}

export interface CurrencyDisplaySettings {
  [currencyCode: string]: number // Foreign currency amount to display (e.g., USD: 1, JPY: 100)
}

export interface UserSettings {
  thresholdKRW: number
  selectedCurrencies: string[]
  refreshInterval: number
  chartCurrency: string
  currencyDisplaySettings: CurrencyDisplaySettings
}

export interface ChartData {
  timestamp: number
  rate: number
}

export interface WebSocketMessage {
  type: 'EXCHANGE_RATE_UPDATE' | 'CONNECTION_STATUS' | 'ERROR'
  data: unknown
  timestamp: Date
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
]