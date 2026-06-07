// MonthSelector.jsx — Lets the user pick which month to view on the dashboard
// Generates a list of all months that have expense data, plus the current month
// Passing selectedMonth up to App.jsx controls Summary, Charts, Budget, Health Score

function MonthSelector({ selectedMonth, onMonthChange, expenses }) {

  // Build a list of unique months that have at least one expense
  // We also always include the current month even if it has no expenses yet
  function getAvailableMonths() {
    const monthSet = new Set()

    // Add current month always
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    monthSet.add(currentMonth)

    // Add every month that has an expense
    for (const expense of expenses) {
      const month = expense.date.substring(0, 7)
      monthSet.add(month)
    }

    // Sort descending so most recent month appears first
    return Array.from(monthSet).sort().reverse()
  }

  // Convert "2025-06" to a readable label like "June 2025"
  function formatMonthLabel(monthString) {
    const [year, month] = monthString.split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const availableMonths = getAvailableMonths()

  return (
    <div className="month-selector-container">

      <div className="month-selector-header">
        <h3>Dashboard — {formatMonthLabel(selectedMonth)}</h3>
        <p className="month-selector-sub">Summary, charts, budget and health score show data for the selected month only</p>
      </div>

      <div className="month-buttons">
        {availableMonths.map((month) => (
          <button
            key={month}
            className={`month-btn ${selectedMonth === month ? 'month-btn-active' : ''}`}
            onClick={() => onMonthChange(month)}
          >
            {formatMonthLabel(month)}
          </button>
        ))}
      </div>

    </div>
  )
}

export default MonthSelector