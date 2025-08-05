'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ExchangeRate, SUPPORTED_CURRENCIES } from '@/types'
import { ArrowLeftRight, Calculator } from 'lucide-react'

interface CurrencyConverterProps {
  exchangeRates: ExchangeRate[]
}

export function CurrencyConverter({ exchangeRates }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('100000')
  const [fromCurrency, setFromCurrency] = useState<string>('KRW')
  const [toCurrency, setToCurrency] = useState<string>('USD')

  const exchangeRateMap = useMemo(() => {
    const map: { [key: string]: number } = { KRW: 1 }
    exchangeRates.forEach(rate => {
      map[rate.currency] = rate.rate
    })
    return map
  }, [exchangeRates])

  const convertAmount = () => {
    const numAmount = parseFloat(amount) || 0
    if (fromCurrency === 'KRW' && toCurrency !== 'KRW') {
      return numAmount / exchangeRateMap[toCurrency]
    } else if (fromCurrency !== 'KRW' && toCurrency === 'KRW') {
      return numAmount * exchangeRateMap[fromCurrency]
    } else if (fromCurrency !== 'KRW' && toCurrency !== 'KRW') {
      const krwAmount = numAmount * exchangeRateMap[fromCurrency]
      return krwAmount / exchangeRateMap[toCurrency]
    }
    return numAmount
  }

  const result = convertAmount()

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const getCurrencySymbol = (currencyCode: string) => {
    if (currencyCode === 'KRW') return '₩'
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
    return currency?.symbol || currencyCode
  }

  const availableCurrencies = ['KRW', ...exchangeRates.map(rate => rate.currency)]

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          환율 계산기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              금액
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="금액을 입력하세요"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              변환 결과
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-600 rounded-lg text-lg font-semibold text-gray-900 dark:text-white">
              {getCurrencySymbol(toCurrency)}{formatNumber(result)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency === 'KRW' ? '🇰🇷 KRW (Korean Won)' : 
                   `${SUPPORTED_CURRENCIES.find(c => c.code === currency)?.flag} ${currency} (${SUPPORTED_CURRENCIES.find(c => c.code === currency)?.name})`}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapCurrencies}
            className="mt-6 h-10 w-10 rounded-full"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency === 'KRW' ? '🇰🇷 KRW (Korean Won)' : 
                   `${SUPPORTED_CURRENCIES.find(c => c.code === currency)?.flag} ${currency} (${SUPPORTED_CURRENCIES.find(c => c.code === currency)?.name})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          실시간 환율 기준으로 계산됩니다. 실제 거래 시 수수료가 추가될 수 있습니다.
        </div>
      </CardContent>
    </Card>
  )
}