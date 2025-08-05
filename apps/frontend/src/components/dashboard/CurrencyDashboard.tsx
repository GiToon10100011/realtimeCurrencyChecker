'use client'

import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useUserSettings } from '@/hooks/useUserSettings'
import { CurrencyCard } from './CurrencyCard'
import { ExchangeRateChart } from './ExchangeRateChart'
import { CurrencyConverter } from './CurrencyConverter'
import { SettingsPanel } from './SettingsPanel'
import { SUPPORTED_CURRENCIES } from '@/types'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

export function CurrencyDashboard() {
  const { settings, updateSettings, saveSettings } = useUserSettings()
  const { exchangeRates, chartData, isConnected, error } = useExchangeRates({
    selectedCurrencies: settings.selectedCurrencies,
    thresholdKRW: settings.thresholdKRW,
  })

  const filteredExchangeRates = exchangeRates.filter(rate =>
    settings.selectedCurrencies.includes(rate.currency)
  )


  const foreignAmount = settings.currencyDisplaySettings[settings.chartCurrency] || 1


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              환율 대시보드
            </h1>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
              ) : error ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? '실시간 연결' : error ? '연결 오류' : '연결 끊김'}
              </span>
              {error && (
                <span className="text-xs text-red-500 ml-2">
                  ({error})
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            실시간 환율 정보와 차트를 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredExchangeRates.length > 0 ? (
            filteredExchangeRates.map((rate) => (
              <CurrencyCard
                key={rate.currency}
                exchangeRate={rate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-2">
                📊
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {error ? '환율 데이터를 불러올 수 없습니다' : '환율 데이터를 불러오는 중...'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ExchangeRateChart
            currency={settings.chartCurrency}
            data={chartData}
            isRealTime={isConnected}
            foreignAmount={foreignAmount}
          />
          <CurrencyConverter exchangeRates={exchangeRates} />
        </div>

        <SettingsPanel
          settings={settings}
          onSettingsChange={updateSettings}
          onSave={saveSettings}
        />
      </div>
    </div>
  )
}