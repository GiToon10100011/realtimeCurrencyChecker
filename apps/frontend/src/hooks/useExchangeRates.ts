'use client'

import { useState, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { ExchangeRate, ChartData } from '@/types'

interface UseExchangeRatesProps {
  selectedCurrencies: string[]
  thresholdKRW: number
}

interface UseExchangeRatesReturn {
  exchangeRates: ExchangeRate[]
  chartData: ChartData[]
  isConnected: boolean
  error: string | null
}

// 더미 데이터
const DUMMY_EXCHANGE_RATES: ExchangeRate[] = [
  {
    currency: 'USD',
    currencyName: 'US Dollar',
    rate: 1340.50,
    previousRate: 1338.20,
    change: 2.30,
    changePercent: 0.17,
    timestamp: new Date(),
    isPositive: true
  },
  {
    currency: 'EUR',
    currencyName: 'Euro',
    rate: 1456.80,
    previousRate: 1459.10,
    change: -2.30,
    changePercent: -0.16,
    timestamp: new Date(),
    isPositive: false
  },
  {
    currency: 'JPY',
    currencyName: 'Japanese Yen',
    rate: 9.12,
    previousRate: 9.08,
    change: 0.04,
    changePercent: 0.44,
    timestamp: new Date(),
    isPositive: true
  },
  {
    currency: 'CNY',
    currencyName: 'Chinese Yuan',
    rate: 183.45,
    previousRate: 184.20,
    change: -0.75,
    changePercent: -0.41,
    timestamp: new Date(),
    isPositive: false
  }
]

const DUMMY_CHART_DATA: ChartData[] = [
  { timestamp: Date.now() - 300000, rate: 1338.20 },
  { timestamp: Date.now() - 240000, rate: 1339.10 },
  { timestamp: Date.now() - 180000, rate: 1340.50 },
  { timestamp: Date.now() - 120000, rate: 1339.80 },
  { timestamp: Date.now() - 60000, rate: 1340.20 },
  { timestamp: Date.now(), rate: 1340.50 }
]

export function useExchangeRates({
  selectedCurrencies,
  thresholdKRW
}: UseExchangeRatesProps): UseExchangeRatesReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(
    DUMMY_EXCHANGE_RATES.filter(rate => selectedCurrencies.includes(rate.currency))
  )
  const [chartData, setChartData] = useState<ChartData[]>(DUMMY_CHART_DATA)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (socket?.connected) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      upgrade: false,
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
      setError(null)
      
      // Subscribe to currencies
      newSocket.emit('subscribe', { 
        currencies: selectedCurrencies,
        thresholdKRW 
      })
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('exchangeRateUpdate', (data: ExchangeRate) => {
      setExchangeRates(prev => {
        const existingIndex = prev.findIndex(rate => rate.currency === data.currency)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = data
          return updated
        }
        return [...prev, data]
      })
    })

    newSocket.on('chartDataUpdate', (data: { currency: string; chartData: ChartData[] }) => {
      setChartData(data.chartData)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err)
      setError('서버에 연결할 수 없습니다')
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('subscribe', { 
        currencies: selectedCurrencies,
        thresholdKRW 
      })
    }
  }, [selectedCurrencies, thresholdKRW, socket, isConnected])

  // selectedCurrencies가 변경될 때 더미 데이터 업데이트
  useEffect(() => {
    if (!isConnected) {
      setExchangeRates(
        DUMMY_EXCHANGE_RATES.filter(rate => selectedCurrencies.includes(rate.currency))
      )
    }
  }, [selectedCurrencies, isConnected])

  return {
    exchangeRates,
    chartData,
    isConnected,
    error
  }
}