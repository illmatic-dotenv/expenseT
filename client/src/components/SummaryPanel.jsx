// SummaryPanel.jsx — Shows key stats and includes the budget tracker

import BudgetPanel from './BudgetPanel'
import { useCurrency } from '../context/CurrencyContext'

function SummaryPanel({ summary, budgets, setBudgets }) {

  const { formatAmount: formatCurrency } = useCurrency()

  if (!summary) {
    return <div className="summary-container">Loading summary...</div>
  }

  return (
    <>
      <div className="summary-container">
        <h2>Summary</h2>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Spent</div>
            <div className="summary-value">{formatCurrency(summary.totalAmount)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Transactions</div>
            <div className="summary-value">{summary.totalTransactions}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Highest Expense</div>
            <div className="summary-value">{formatCurrency(summary.highestExpense)}</div>
          </div>
        </div>

        <div className="category-breakdown">
          <h3>Spending by Category</h3>
          {Object.entries(summary.categoryTotals).map(([category, total]) => (
            <div key={category} className="category-row">
              <span className="category-name">{category}</span>
              <span className="category-amount">{formatCurrency(total)}</span>
            </div>
          ))}
        </div>
      </div>

      <BudgetPanel
        budgets={budgets}
        setBudgets={setBudgets}
        categoryTotals={summary.categoryTotals}
      />
    </>
  )
}

export default SummaryPanel