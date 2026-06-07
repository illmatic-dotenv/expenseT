function ExpenseTable({ expenses, onEdit, onDelete }) {

  function getCategoryClass(category) {
    const map = {
      Food: 'badge-food', Transport: 'badge-transport', Bills: 'badge-bills',
      Entertainment: 'badge-entertainment', Shopping: 'badge-shopping',
      Health: 'badge-health', Other: 'badge-other'
    }
    return map[category] || 'badge-other'
  }

  function getCategoryIcon(category) {
    const map = {
      Food: '🍔', Transport: '🚗', Bills: '🧾',
      Entertainment: '🎬', Shopping: '🛍️', Health: '💊', Other: '📦'
    }
    return map[category] || '📦'
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
  }

  function handleExportCSV() {
    const headers = ['Date', 'Category', 'Note', 'Amount']
    const rows = expenses.map(e => [`"${e.date}"`, `"${e.category}"`, `"${e.note || ''}"`, e.amount])
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'trackex-expenses.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleDeleteClick(expense) {
    const confirmed = window.confirm(`Delete "${expense.note || expense.category}" for ${formatCurrency(expense.amount)}?`)
    if (confirmed) onDelete(expense.id)
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p>No expenses found. Add one above to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="table-header-row">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{expenses.length} records</span>
        <button className="btn-export" onClick={handleExportCSV}>⬇ Export CSV</button>
      </div>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Note</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{expense.date}</td>
              <td>
                <span className={`category-badge ${getCategoryClass(expense.category)}`}>
                  {getCategoryIcon(expense.category)} {expense.category}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{expense.note || '—'}</td>
              <td className="amount-cell">{formatCurrency(expense.amount)}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(expense)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteClick(expense)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseTable