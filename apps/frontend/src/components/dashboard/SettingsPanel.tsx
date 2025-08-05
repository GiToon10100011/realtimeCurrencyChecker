"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserSettings, SUPPORTED_CURRENCIES } from "@/types";
import { Settings, Save } from "lucide-react";

interface SettingsPanelProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onSave: () => void;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onSave,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleThresholdChange = (value: number) => {
    const threshold = Math.max(3, value);
    setLocalSettings((prev) => ({ ...prev, thresholdKRW: threshold }));
  };

  const handleCurrencyToggle = (currencyCode: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      selectedCurrencies: prev.selectedCurrencies.includes(currencyCode)
        ? prev.selectedCurrencies.filter((c) => c !== currencyCode)
        : [...prev.selectedCurrencies, currencyCode],
    }));
  };

  const handleChartCurrencyChange = (currencyCode: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      chartCurrency: currencyCode,
    }));
  };

  const handleCurrencyAmountChange = (currencyCode: string, amount: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      currencyDisplaySettings: {
        ...prev.currencyDisplaySettings,
        [currencyCode]: amount,
      },
    }));
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onSave();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full relative max-w-md h-2/3 border-0 shadow-2xl bg-white dark:bg-gray-800 overflow-y-scroll">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dashboard Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Revalidation Threshold (KRW)
              </label>
              <span className="font-medium">
                {localSettings.thresholdKRW} KRW
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="3"
                max="100"
                step="1"
                value={localSettings.thresholdKRW}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>3 KRW</span>
                <span>100 KRW</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum change required to trigger updates
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chart Currency
            </label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SUPPORTED_CURRENCIES.filter((currency) =>
                localSettings.selectedCurrencies.includes(currency.code)
              ).map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleChartCurrencyChange(currency.code)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    localSettings.chartCurrency === currency.code
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currency.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{currency.code}</div>
                      <div className="text-xs text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chart Display Amount
            </label>
            <div className="space-y-3 mb-6">
              {SUPPORTED_CURRENCIES.filter((currency) =>
                localSettings.selectedCurrencies.includes(currency.code)
              ).map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-lg">{currency.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{currency.code}</div>
                    <div className="text-xs text-gray-500">{currency.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={
                        localSettings.currencyDisplaySettings[currency.code] ||
                        1
                      }
                      onChange={(e) =>
                        handleCurrencyAmountChange(
                          currency.code,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <span className="text-sm">{currency.code} = ₩</span>
                    <span className="text-sm text-gray-500">?</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Monitored Currencies
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyToggle(currency.code)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    localSettings.selectedCurrencies.includes(currency.code)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currency.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{currency.code}</div>
                      <div className="text-xs text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 sticky bottom-4 right-0 w-full bg-white dark:bg-gray-800">
            <Button onClick={handleSave} className="flex-1 cursor-pointer">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}