import { useState, useEffect } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other']

function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
      setDate(editingExpense.date)
      setNote(editingExpense.note || '')
    } else {
      setAmount(''); setCategory(''); setDate(''); setNote('')
    }
  }, [editingExpense])

  function getTodayDate() {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!amount || Number(amount) <= 0) return setError('Please enter a valid amount greater than zero')
    if (!category) return setError('Please select a category')
    if (!date) return setError('Please select a date')
    onSubmit({ amount: Number(amount), category, date, note })
    setAmount(''); setCategory(''); setDate(''); setNote('')
  }

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500" min="0.01" step="0.01" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} max={getTodayDate()} />
          </div>
          <div className="form-group">
            <label>Note (optional)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Lunch with team" />
          </div>
          <button type="submit" className="btn-primary">
            {editingExpense ? 'Update' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm