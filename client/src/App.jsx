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
  const { selectedCurrency, changeCurrency, formatAmount } = useCurrency()

  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Dark mode state — reads from localStorage so it persists
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  const [filters, setFilters] = useState({
    search: '', category: '', startDate: '', endDate: ''
  })

  const [budgets, setBudgets] = useState({
    Food: 5000, Transport: 3000, Bills: 8000,
    Entertainment: 2000, Shopping: 4000, Health: 3000, Other: 2000
  })

  function getCurrentMonth() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())

  // Apply dark mode to the HTML element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

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

  useEffect(() => { fetchExpenses() }, [])

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
      setError('Failed to save expense.')
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
      setError('Failed to delete expense.')
    }
  }

  function getFilteredExpenses() {
    let filtered = expenses
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(e => e.note && e.note.toLowerCase().includes(searchLower))
    }
    if (filters.category) filtered = filtered.filter(e => e.category === filters.category)
    if (filters.startDate) filtered = filtered.filter(e => e.date >= filters.startDate)
    if (filters.endDate) filtered = filtered.filter(e => e.date <= filters.endDate)
    return filtered
  }

  function getMonthlyExpenses() {
    return expenses.filter(e => e.date.startsWith(selectedMonth))
  }

  function calculateMonthlySummary() {
    const monthly = getMonthlyExpenses()
    if (monthly.length === 0) return { totalAmount: 0, totalTransactions: 0, highestExpense: 0, categoryTotals: {} }
    let totalAmount = 0
    let highestExpense = 0
    const categoryTotals = {}
    for (const expense of monthly) {
      totalAmount += expense.amount
      if (expense.amount > highestExpense) highestExpense = expense.amount
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    }
    return { totalAmount, totalTransactions: monthly.length, highestExpense, categoryTotals }
  }

  const filteredExpenses = getFilteredExpenses()
  const monthlyExpenses = getMonthlyExpenses()
  const monthlySummary = calculateMonthlySummary()

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <h1>TrackEx</h1>
        </div>
        <div className="header-right">
          <div className="currency-selector">
            <label>Currency</label>
            <select value={selectedCurrency.code} onChange={e => changeCurrency(e.target.value)}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.label}</option>
              ))}
            </select>
          </div>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Stats row — 4 cards across the top */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon red">💸</div>
            <div className="stat-info">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">{formatAmount(monthlySummary.totalAmount)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div className="stat-info">
              <div className="stat-label">Transactions</div>
              <div className="stat-value">{monthlySummary.totalTransactions}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">⬆️</div>
            <div className="stat-info">
              <div className="stat-label">Highest Expense</div>
              <div className="stat-value">{formatAmount(monthlySummary.highestExpense)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📅</div>
            <div className="stat-info">
              <div className="stat-label">Viewing Month</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>
                {new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Add expense form */}
        <div className="card full-width">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">➕</div>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </div>
            {editingExpense && (
              <button className="btn-secondary btn-sm" onClick={() => setEditingExpense(null)}>
                Cancel Edit
              </button>
            )}
          </div>
          <div className="card-body">
            <ExpenseForm
              onSubmit={handleFormSubmit}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </div>
        </div>

        {/* Month selector */}
        <div className="card full-width">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">📅</div>
              Dashboard Period
            </div>
          </div>
          <div className="card-body">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              expenses={expenses}
            />
          </div>
        </div>

        {/* Charts row */}
        <div className="two-col">
          <Charts expenses={monthlyExpenses} />
          <SummaryPanel summary={monthlySummary} budgets={budgets} setBudgets={setBudgets} />
        </div>

        {/* Budget and Health Score */}
        <div className="two-col">
          <HealthScore expenses={monthlyExpenses} budgets={budgets} />
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon">🎯</div>
                Budget Tracker
              </div>
            </div>
            <div className="card-body">
              <p className="budget-subtitle">Set monthly budgets and track spending</p>
            </div>
          </div>
        </div>

        {/* Filters and table */}
        <div className="card full-width">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">🔍</div>
              Filter Expenses
            </div>
          </div>
          <div className="card-body">
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        <div className="card full-width">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">📊</div>
              All Expenses ({filteredExpenses.length})
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading">Loading expenses...</div>
            ) : (
              <ExpenseTable
                expenses={filteredExpenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

export default App