'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { ChartData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface ExchangeRateChartProps {
  currency: string
  data: ChartData[]
  isRealTime?: boolean
  foreignAmount: number
}

export function ExchangeRateChart({ 
  currency, 
  data, 
  isRealTime = false,
  foreignAmount
}: ExchangeRateChartProps) {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: 'line',
      height: 350,
      animations: {
        enabled: isRealTime,
        dynamicAnimation: {
          enabled: isRealTime,
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'HH:mm:ss'
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => `₩${value.toFixed(2)}`
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm:ss'
      },
      y: {
        formatter: (value) => `₩${value.toFixed(2)}`
      }
    },
    colors: ['#3B82F6'],
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 0,
      position: 'back'
    },
    theme: {
      mode: 'light'
    }
  })

  const [series, setSeries] = useState([
    {
      name: `${foreignAmount}${currency} = KRW`,
      data: data.map(item => [item.timestamp, item.rate * foreignAmount])
    }
  ])

  useEffect(() => {
    setSeries([
      {
        name: `${foreignAmount}${currency} = KRW`,
        data: data.map(item => [item.timestamp, item.rate * foreignAmount])
      }
    ])
  }, [data, currency, foreignAmount])

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    setChartOptions(prev => ({
      ...prev,
      theme: {
        mode: isDarkMode ? 'dark' : 'light'
      },
      grid: {
        ...prev.grid,
        borderColor: isDarkMode ? '#374151' : '#E5E7EB'
      }
    }))
  }, [])

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{foreignAmount}{currency} = KRW Chart</span>
          {isRealTime && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={series}
              type="line"
              height={350}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}