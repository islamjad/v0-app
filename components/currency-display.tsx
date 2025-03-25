"use client"

import { useEffect, useState } from "react"

// Get system settings from localStorage or use defaults
const getSystemSettings = () => {
  if (typeof window !== "undefined") {
    const savedSettings = localStorage.getItem("systemSettings")
    if (savedSettings) {
      return JSON.parse(savedSettings)
    }
  }
  return { currency: "USD" }
}

// Currency symbols
const currencySymbols = {
  USD: "$",
  EUR: "€",
  ILS: "₪",
}

export function CurrencyDisplay({ amount, className = "" }) {
  const [currency, setCurrency] = useState("USD")

  useEffect(() => {
    const settings = getSystemSettings()
    setCurrency(settings.currency || "USD")
  }, [])

  const symbol = currencySymbols[currency] || "$"

  return (
    <span className={className}>
      {symbol}
      {Number(amount).toFixed(2)}
    </span>
  )
}

