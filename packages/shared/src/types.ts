export interface ExchangeRate {
  currency: string
  currencyName: string
  rate: number
  previousRate: number
  change: number
  changePercent: number
  timestamp: Date
  isPositive: boolean
  source?: string
}

export interface CurrencyConfig {
  code: string
  name: string
  symbol: string
  flag: string
}

export interface UserSettings {
  sessionId?: string
  thresholdKRW: number
  selectedCurrencies: string[]
  refreshInterval: number
}

export interface ChartData {
  timestamp: number
  rate: number
}

export interface WebSocketMessage {
  type: 'EXCHANGE_RATE_UPDATE' | 'CONNECTION_STATUS' | 'ERROR' | 'THRESHOLD_UPDATED' | 'CURRENCIES_UPDATED'
  data: any
  timestamp: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
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