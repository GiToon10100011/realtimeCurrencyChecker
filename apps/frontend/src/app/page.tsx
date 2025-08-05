'use client'

import { CurrencyDashboard } from '@/components/dashboard/CurrencyDashboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Currency Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time exchange rate monitoring with smart revalidation
          </p>
        </div>
        <CurrencyDashboard />
      </div>
    </main>
  )
}