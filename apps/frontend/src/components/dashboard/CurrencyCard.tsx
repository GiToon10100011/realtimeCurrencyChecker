"use client";

import { ExchangeRate, SUPPORTED_CURRENCIES } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { calculateChange } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CurrencyCardProps {
  exchangeRate: ExchangeRate;
}

export function CurrencyCard({ exchangeRate }: CurrencyCardProps) {
  const currency = SUPPORTED_CURRENCIES.find(
    (c) => c.code === exchangeRate.currency
  );
  const { change, changePercent, isPositive } = calculateChange(
    exchangeRate.rate,
    exchangeRate.previousRate
  );

  const getChangeColor = () => {
    if (change === 0) return "text-gray-500";
    return isPositive
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getChangeIcon = () => {
    if (change === 0) return <Minus className="w-4 h-4" />;
    return isPositive ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const displayChange = change;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currency?.flag}</span>
            <div>
              <div className="font-semibold">{currency?.code}</div>
              <div className="text-sm text-gray-500 font-normal">
                {currency?.name}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            1{currency?.code} = ₩{exchangeRate.rate.toFixed(2)}
          </div>

          <div
            className={`flex items-center gap-1 text-sm ${getChangeColor()}`}
          >
            {getChangeIcon()}
            <span>
              {isPositive ? "+" : ""}₩{Math.abs(displayChange).toFixed(2)}
            </span>
            <span>
              ({isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="text-xs text-gray-400">
            Last updated: {formatTime(exchangeRate.timestamp)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}