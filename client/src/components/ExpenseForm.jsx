// ExpenseForm.jsx — The form for adding and editing expenses
// When editing, it receives the expense to edit via props
// When adding, it starts with empty fields

import { useState, useEffect } from 'react'

// The list of allowed categories
const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other']

function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {

  // These are the form fields — each one is a piece of state
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  // When editingExpense changes (user clicked Edit on a row),
  // fill the form fields with that expense's data
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
      setDate(editingExpense.date)
      setNote(editingExpense.note || '')
    } else {
      // If no expense is being edited, clear the form
      setAmount('')
      setCategory('')
      setDate('')
      setNote('')
    }
  }, [editingExpense])

  // Get today's date in YYYY-MM-DD format for the max date validation
  function getTodayDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function handleSubmit(e) {
    // Prevent the page from refreshing — default browser form behaviour
    e.preventDefault()
    setError('')

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than zero')
      return
    }

    // Validate category
    if (!category) {
      setError('Please select a category')
      return
    }

    // Validate date
    if (!date) {
      setError('Please select a date')
      return
    }

    // Build the expense object to send to the backend
    const expenseData = {
      amount: Number(amount),
      category,
      date,
      note
    }

    // Call the function passed down from App.jsx
    onSubmit(expenseData)

    // Clear the form after submitting
    setAmount('')
    setCategory('')
    setDate('')
    setNote('')
  }

  return (
    <div className="form-container">
      <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>

      {/* Show error message if validation fails */}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={getTodayDate()}
            />
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Lunch with team"
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>

          {/* Only show Cancel button when editing */}
          {editingExpense && (
            <button type="button" className="btn-secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  )
}

export default ExpenseForm