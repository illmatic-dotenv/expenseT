// BudgetPanel.jsx — Lets the user set a monthly budget per category
// Shows a progress bar that turns red when spending exceeds the budget
// Receives budgets, setBudgets, and categoryTotals from App.jsx via SummaryPanel
import { useCurrency } from '../context/CurrencyContext'

function BudgetPanel({ budgets, setBudgets, categoryTotals }) {

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // When user changes a budget input, update only that category
  function handleBudgetChange(category, newValue) {
    setBudgets({ ...budgets, [category]: Number(newValue) })
  }

  // Calculate what percentage of the budget has been spent
  // Capped at 100 for the visual bar, but the text shows the real number
  function getSpentPercentage(category) {
    const spent = categoryTotals[category] || 0
    const budget = budgets[category] || 1
    return Math.min((spent / budget) * 100, 100)
  }

  function getActualPercentage(category) {
    const spent = categoryTotals[category] || 0
    const budget = budgets[category] || 1
    return Math.round((spent / budget) * 100)
  }

  const categories = Object.keys(budgets)

  return (
    <div className="budget-container">
      <h2>Budget Tracker</h2>
      <p className="budget-subtitle">Set monthly budgets and track your spending against them</p>

      {categories.map((category) => {
        const spent = categoryTotals[category] || 0
        const budget = budgets[category]
        const percentage = getActualPercentage(category)
        const isOverBudget = spent > budget

        return (
          <div key={category} className="budget-row">

            <div className="budget-row-header">
              <span className="budget-category">{category}</span>
              <div className="budget-input-group">
                <span className="budget-input-label">Budget ₹</span>
                <input
                  type="number"
                  className="budget-input"
                  value={budget}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Progress bar — turns red when over budget */}
            <div className="budget-bar-track">
              <div
                className={`budget-bar-fill ${isOverBudget ? 'over-budget' : ''}`}
                style={{ width: `${getSpentPercentage(category)}%` }}
              />
            </div>

            <div className="budget-row-footer">
              <span className="budget-spent">
                Spent: {formatCurrency(spent)}
              </span>
              <span className={`budget-percentage ${isOverBudget ? 'text-danger' : 'text-success'}`}>
                {isOverBudget
                  ? `⚠ ${percentage}% — Over budget by ${formatCurrency(spent - budget)}`
                  : `${percentage}% used`
                }
              </span>
            </div>

          </div>
        )
      })}
    </div>
  )
}

export default BudgetPanel