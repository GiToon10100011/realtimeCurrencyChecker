'use client'

import { useState, useEffect } from 'react'
import { UserSettings } from '@/types'

const DEFAULT_SETTINGS: UserSettings = {
  selectedCurrencies: ['USD', 'EUR', 'JPY', 'CNY'],
  thresholdKRW: 5,
  refreshInterval: 5000,
  chartCurrency: 'USD',
  currencyDisplaySettings: {
    USD: 1,
    EUR: 1,
    JPY: 100,
    CNY: 1,
    GBP: 1,
    AUD: 1,
    CAD: 1,
    CHF: 1
  }
}

interface UseUserSettingsReturn {
  settings: UserSettings
  updateSettings: (newSettings: UserSettings) => void
  saveSettings: () => void
}

export function useUserSettings(): UseUserSettingsReturn {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('currencyDashboardSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings)
  }

  const saveSettings = () => {
    localStorage.setItem('currencyDashboardSettings', JSON.stringify(settings))
  }

  return {
    settings,
    updateSettings,
    saveSettings
  }
}