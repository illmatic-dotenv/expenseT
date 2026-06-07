function MonthSelector({ selectedMonth, onMonthChange, expenses }) {
  function getAvailableMonths() {
    const monthSet = new Set()
    const now = new Date()
    monthSet.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    for (const expense of expenses) {
      monthSet.add(expense.date.substring(0, 7))
    }
    return Array.from(monthSet).sort().reverse()
  }

  function formatMonthLabel(monthString) {
    const [year, month] = monthString.split('-')
    return new Date(Number(year), Number(month) - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="month-buttons">
      {getAvailableMonths().map(month => (
        <button
          key={month}
          className={`month-btn ${selectedMonth === month ? 'month-btn-active' : ''}`}
          onClick={() => onMonthChange(month)}
        >
          {formatMonthLabel(month)}
        </button>
      ))}
    </div>
  )
}

export default MonthSelector