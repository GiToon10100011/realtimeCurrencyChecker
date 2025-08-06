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
  isLoading: boolean
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
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [chartData, setChartData] = useState<ChartData[]>(DUMMY_CHART_DATA)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 API 호출
  const fetchInitialRates = useCallback(async () => {
    try {
      setIsLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      console.log('Fetching from:', `${apiUrl}/api/exchange-rates`)
      
      const response = await fetch(`${apiUrl}/api/exchange-rates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('API Response:', result)
      
      // API 응답에서 data 필드 추출 및 날짜 변환
      const data: ExchangeRate[] = (result.data || []).map((rate: any) => ({
        ...rate,
        timestamp: typeof rate.timestamp === 'string' ? new Date(rate.timestamp) : rate.timestamp
      }))
      const filteredData = data.filter(rate => selectedCurrencies.includes(rate.currency))
      
      console.log('Filtered data:', filteredData)
      console.log('Selected currencies:', selectedCurrencies)
      
      setExchangeRates(filteredData)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch initial exchange rates:', err)
      // Fallback to dummy data if API fails
      setExchangeRates(
        DUMMY_EXCHANGE_RATES.filter(rate => selectedCurrencies.includes(rate.currency))
      )
      setError('API 연결 실패, 샘플 데이터 사용 중')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCurrencies])

  // 컴포넌트 마운트 시 초기 데이터 가져오기
  useEffect(() => {
    fetchInitialRates()
  }, [fetchInitialRates])

  useEffect(() => {
    if (socket?.connected) return

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
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

    newSocket.on('exchangeRateUpdate', (data: any) => {
      const exchangeRate: ExchangeRate = {
        ...data,
        timestamp: typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp
      }
      
      setExchangeRates(prev => {
        const existingIndex = prev.findIndex(rate => rate.currency === exchangeRate.currency)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = exchangeRate
          return updated
        }
        return [...prev, exchangeRate]
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

  // selectedCurrencies가 변경될 때 API 다시 호출
  useEffect(() => {
    fetchInitialRates()
  }, [fetchInitialRates])

  return {
    exchangeRates,
    chartData,
    isConnected,
    error,
    isLoading
  }
}