// App.jsx — Main component
// selectedMonth controls which month ALL components display data for
// Changing the month picker updates Summary, Budget, Charts, and Health Score

import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseTable from './components/ExpenseTable'
import SummaryPanel from './components/SummaryPanel'
import Charts from './components/Charts'
import Filters from './components/Filters'
import HealthScore from './components/HealthScore'
import MonthSelector from './components/MonthSelector'
import { useCurrency, CURRENCIES } from './context/CurrencyContext'
import { getAllExpenses, getSummary, createExpense, updateExpense, deleteExpense } from './services/api'
import './index.css'

function App() {

  const { selectedCurrency, changeCurrency } = useCurrency()

  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    startDate: '',
    endDate: ''
  })

  const [budgets, setBudgets] = useState({
    Food: 5000,
    Transport: 3000,
    Bills: 8000,
    Entertainment: 2000,
    Shopping: 4000,
    Health: 3000,
    Other: 2000
  })

  // selectedMonth controls the dashboard view — format is "YYYY-MM"
  // Defaults to the current month
  function getCurrentMonth() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  async function fetchExpenses() {
    try {
      setLoading(true)
      const expensesResponse = await getAllExpenses()
      const summaryResponse = await getSummary()
      setExpenses(expensesResponse.data)
      setSummary(summaryResponse.data)
    } catch (err) {
      setError('Could not connect to the server. Make sure your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function handleFormSubmit(expenseData) {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData)
        setEditingExpense(null)
      } else {
        await createExpense(expenseData)
      }
      fetchExpenses()
    } catch (err) {
      setError('Failed to save expense. Please try again.')
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id)
      fetchExpenses()
    } catch (err) {
      setError('Failed to delete expense. Please try again.')
    }
  }

  // Filter expenses shown in the table (uses the filter bar, not the month selector)
  function getFilteredExpenses() {
    let filtered = expenses

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((expense) =>
        expense.note && expense.note.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category) {
      filtered = filtered.filter((expense) => expense.category === filters.category)
    }

    if (filters.startDate) {
      filtered = filtered.filter((expense) => expense.date >= filters.startDate)
    }

    if (filters.endDate) {
      filtered = filtered.filter((expense) => expense.date <= filters.endDate)
    }

    return filtered
  }

  // Filter expenses for the dashboard panels by the selected month
  // e.g. selectedMonth = "2025-06" keeps only expenses from June 2025
  function getMonthlyExpenses() {
    return expenses.filter((expense) =>
      expense.date.startsWith(selectedMonth)
    )
  }

  const filteredExpenses = getFilteredExpenses()
  const monthlyExpenses = getMonthlyExpenses()

  // Calculate summary stats fresh from monthlyExpenses on the frontend
  // This avoids an extra API call every time the month changes
  function calculateMonthlySummary() {
    if (monthlyExpenses.length === 0) {
      return {
        totalAmount: 0,
        totalTransactions: 0,
        highestExpense: 0,
        categoryTotals: {}
      }
    }

    let totalAmount = 0
    for (const expense of monthlyExpenses) {
      totalAmount += expense.amount
    }

    let highestExpense = 0
    for (const expense of monthlyExpenses) {
      if (expense.amount > highestExpense) {
        highestExpense = expense.amount
      }
    }

    const categoryTotals = {}
    for (const expense of monthlyExpenses) {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount
      } else {
        categoryTotals[expense.category] = expense.amount
      }
    }

    return {
      totalAmount,
      totalTransactions: monthlyExpenses.length,
      highestExpense,
      categoryTotals
    }
  }

  const monthlySummary = calculateMonthlySummary()

  return (
    <div className="app">

      <header className="app-header">
        <div className="header-top">
          <div className="header-brand">
            <h1>TrackEx</h1>
            <p>track your life expenses with us</p>
          </div>
          <div className="header-controls">
            <div className="currency-selector">
              <label>Currency</label>
              <select
                value={selectedCurrency.code}
                onChange={(e) => changeCurrency(e.target.value)}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Add / Edit form — always visible */}
        <ExpenseForm
          onSubmit={handleFormSubmit}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
        />

        {/* Month selector — controls all dashboard panels below */}
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          expenses={expenses}
        />

        {/* All panels below use monthlyExpenses, not all expenses */}
        <SummaryPanel
          summary={monthlySummary}
          budgets={budgets}
          setBudgets={setBudgets}
        />

        <Charts expenses={monthlyExpenses} />

        <HealthScore expenses={monthlyExpenses} budgets={budgets} />

        {/* Table uses its own filter bar — independent of month selector */}
        <Filters filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="loading">Loading expenses...</div>
        ) : (
          <ExpenseTable
            expenses={filteredExpenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </main>
    </div>
  )
}

export default App