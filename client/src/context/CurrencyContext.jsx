// CurrencyContext.jsx — Provides the selected currency to every component
// Using React Context means any component can read the currency
// without passing it down through every level of props
// localStorage saves the preference so it persists after page refresh

import { createContext, useContext, useState } from 'react'

// The list of supported currencies
// symbol is what shows in the UI
// locale is used by Intl.NumberFormat for correct formatting
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar', locale: 'en-SG' },
]

// Create the context object
const CurrencyContext = createContext()

// CurrencyProvider wraps the entire app and makes currency available everywhere
export function CurrencyProvider({ children }) {

  // Read saved currency from localStorage, default to INR
  const savedCurrencyCode = localStorage.getItem('selectedCurrency') || 'INR'
  const savedCurrency = CURRENCIES.find(c => c.code === savedCurrencyCode) || CURRENCIES[0]

  const [selectedCurrency, setSelectedCurrency] = useState(savedCurrency)

  function changeCurrency(currencyCode) {
    const currency = CURRENCIES.find(c => c.code === currencyCode)
    if (currency) {
      setSelectedCurrency(currency)
      // Save to localStorage so preference persists on page refresh
      localStorage.setItem('selectedCurrency', currencyCode)
    }
  }

  // formatAmount converts a number to a formatted currency string
  // e.g. 1500 with INR → ₹1,500.00
  function formatAmount(amount) {
    return new Intl.NumberFormat(selectedCurrency.locale, {
      style: 'currency',
      currency: selectedCurrency.code
    }).format(amount)
  }

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, changeCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Custom hook — any component calls useCurrency() to get access
// instead of importing useContext and CurrencyContext separately
export function useCurrency() {
  return useContext(CurrencyContext)
}