import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatExchangeRate(rate: number): string {
  return rate.toLocaleString('ko-KR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
}

export function calculateChange(currentRate: number, previousRate: number) {
  const change = currentRate - previousRate
  const changePercent = (change / previousRate) * 100
  const isPositive = change > 0

  return {
    change,
    changePercent,
    isPositive
  }
}