// ExpenseTable.jsx — Displays all expenses in a table
// Each row has Edit and Delete buttons
// Also includes CSV export of visible expenses
import { useCurrency } from '../context/CurrencyContext'

function ExpenseTable({ expenses, onEdit, onDelete }) {

  const { formatAmount: formatCurrency } = useCurrency()

  function handleDeleteClick(expense) {
    const confirmed = window.confirm(
      `Delete "${expense.note || expense.category}" for ${formatCurrency(expense.amount)}?`
    )
    if (confirmed) {
      onDelete(expense.id)
    }
  }

  // CSV Export — converts the visible expenses array into a downloadable .csv file
  // We only export what the user can currently see (after filters are applied)
 function handleExportCSV() {
    const headers = ['Date', 'Category', 'Note', 'Amount']

    const rows = expenses.map((expense) => [
      // Wrapping date in quotes prevents Excel from misreading it as a formula
      `"${expense.date}"`,
      `"${expense.category}"`,
      `"${expense.note || ''}"`,
      expense.amount
    ])

    // Combine headers and rows into CSV format
    // Each row is joined by commas, rows are separated by new lines
    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n')

    // Create a downloadable link element and trigger a click on it
    // This is the standard browser technique for downloading generated files
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'expenses.csv'
    link.click()

    // Clean up the temporary URL after download
    URL.revokeObjectURL(url)
  }

  if (expenses.length === 0) {
    return (
      <div className="table-container">
        <h2>Expenses</h2>
        <div className="empty-state">
          <p>No expenses found. Add one above to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">

      <div className="table-header-row">
        <h2>Expenses ({expenses.length})</h2>
        <button className="btn-export" onClick={handleExportCSV}>
          Export CSV
        </button>
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
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>
                <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
              </td>
              <td>{expense.note || '—'}</td>
              <td className="amount-cell">{formatCurrency(expense.amount)}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(expense)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDeleteClick(expense)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default ExpenseTable