// HealthScore.jsx — Financial Health Score from 0 to 100
// Uses 5 rules to evaluate spending behaviour

import { useCurrency } from '../context/CurrencyContext'

function HealthScore({ expenses, budgets }) {

  // useCurrency must be called INSIDE the function, not outside
  // This is a fundamental React rule called "Rules of Hooks"
  const { formatAmount: formatCurrency } = useCurrency()

  if (!expenses || expenses.length < 3) {
    return (
      <div className="health-container">
        <h2>Financial Health Score</h2>
        <p className="health-empty">Add at least 3 expenses to see your score.</p>
      </div>
    )
  }

  // Total spent per category
  const categorySpending = {}
  for (const expense of expenses) {
    if (categorySpending[expense.category]) {
      categorySpending[expense.category] += expense.amount
    } else {
      categorySpending[expense.category] = expense.amount
    }
  }

  const categoryNames = Object.keys(budgets)
  const totalBudgetAllCategories = categoryNames.reduce((sum, cat) => sum + budgets[cat], 0)
  const totalSpentAllCategories = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const averageExpenseAmount = totalSpentAllCategories / expenses.length

  // RULE 1 — Budget Adherence (40 points max)
  let budgetAdherenceScore = 0
  const pointsPerCategory = 40 / categoryNames.length

  for (const category of categoryNames) {
    const spent = categorySpending[category] || 0
    const budget = budgets[category]
    const ratio = spent / budget

    if (ratio <= 1.0) {
      budgetAdherenceScore += pointsPerCategory
    } else if (ratio <= 1.25) {
      budgetAdherenceScore += pointsPerCategory * 0.5
    } else if (ratio <= 2.0) {
      budgetAdherenceScore += pointsPerCategory * 0.25
    }
    // Over 2x budget — zero points for this category
  }

  budgetAdherenceScore = Math.round(budgetAdherenceScore)

  // RULE 2 — Catastrophic Overspend Penalty
  let catastrophicPenaltyMultiplier = 1.0
  let catastrophicCategory = null
  let worstOverspendRatio = 0

  for (const category of categoryNames) {
    const spent = categorySpending[category] || 0
    const budget = budgets[category]
    const ratio = spent / budget

    if (ratio > worstOverspendRatio) {
      worstOverspendRatio = ratio
      if (ratio > 3.0) {
        catastrophicCategory = category
      }
    }
  }

  if (worstOverspendRatio > 10.0) {
    catastrophicPenaltyMultiplier = 0.3
  } else if (worstOverspendRatio > 5.0) {
    catastrophicPenaltyMultiplier = 0.5
  } else if (worstOverspendRatio > 3.0) {
    catastrophicPenaltyMultiplier = 0.7
  }

  // RULE 3 — Largest Single Expense Ratio
  const largestSingleExpense = Math.max(...expenses.map(e => e.amount))
  const largestExpenseRatio = largestSingleExpense / totalBudgetAllCategories

  const numberOfCategoriesUsed = Object.keys(categorySpending).length
  let diversityScore = Math.round((numberOfCategoriesUsed / categoryNames.length) * 30)

  if (largestExpenseRatio > 0.4) {
    diversityScore = Math.round(diversityScore * 0.3)
  } else if (largestExpenseRatio > 0.2) {
    diversityScore = Math.round(diversityScore * 0.6)
  }

  // RULE 4 — Spending Spike Detection
  let spikeCount = 0
  for (const expense of expenses) {
    if (expense.amount > averageExpenseAmount * 3) {
      spikeCount++
    }
  }

  const monthlyTotals = {}
  for (const expense of expenses) {
    const month = expense.date.substring(0, 7)
    monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount
  }

  const monthlyValues = Object.values(monthlyTotals)
  let consistencyScore = 30

  if (monthlyValues.length > 1) {
    const averageMonthly = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length
    let totalDeviation = 0
    for (const monthTotal of monthlyValues) {
      totalDeviation += Math.abs(monthTotal - averageMonthly)
    }
    const deviationRatio = (totalDeviation / monthlyValues.length) / averageMonthly
    if (deviationRatio > 0.5) {
      consistencyScore = Math.round(30 * (1 - Math.min(deviationRatio - 0.5, 1)))
    }
  }

  if (spikeCount >= 3) {
    consistencyScore = Math.round(consistencyScore * 0.4)
  } else if (spikeCount === 2) {
    consistencyScore = Math.round(consistencyScore * 0.6)
  } else if (spikeCount === 1) {
    consistencyScore = Math.round(consistencyScore * 0.8)
  }

  // RULE 5 — Overall Budget Utilisation Cap
  const overallUtilisationRatio = totalSpentAllCategories / totalBudgetAllCategories
  let hardScoreCap = 100

  if (overallUtilisationRatio > 3.0) {
    hardScoreCap = 25
  } else if (overallUtilisationRatio > 2.0) {
    hardScoreCap = 35
  } else if (overallUtilisationRatio > 1.5) {
    hardScoreCap = 50
  } else if (overallUtilisationRatio > 1.2) {
    hardScoreCap = 65
  }

  // FINAL SCORE
  const rawScore = budgetAdherenceScore + diversityScore + consistencyScore
  const penalisedScore = Math.round(rawScore * catastrophicPenaltyMultiplier)
  const totalScore = Math.min(penalisedScore, hardScoreCap)

  function getScoreLabel(score) {
    if (score >= 80) return { label: 'Excellent', color: '#10b981' }
    if (score >= 60) return { label: 'Good', color: '#6366f1' }
    if (score >= 40) return { label: 'Fair', color: '#f59e0b' }
    if (score >= 20) return { label: 'Poor', color: '#ef4444' }
    return { label: 'Critical', color: '#dc2626' }
  }

  const { label, color } = getScoreLabel(totalScore)

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (totalScore / 100) * circumference

  return (
    <div className="health-container">
      <h2>Financial Health Score</h2>
      <p className="budget-subtitle">
        Based on 5 rules: budget adherence, catastrophic overspend, largest expense ratio, spending spikes, and overall utilisation
      </p>

      {catastrophicCategory && (
        <div className="health-warning">
          ⚠ Catastrophic overspend detected in <strong>{catastrophicCategory}</strong> — spending is {Math.round(worstOverspendRatio * 100)}% of budget. This is heavily penalising your score.
        </div>
      )}

      {hardScoreCap < 100 && (
        <div className="health-warning">
          ⚠ Total spending is {Math.round(overallUtilisationRatio * 100)}% of your total budget. Score is capped at {hardScoreCap}.
        </div>
      )}

      <div className="health-content">

        <div className="health-circle-wrapper">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
            <circle
              cx="90" cy="90" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 90 90)"
            />
            <text x="90" y="85" textAnchor="middle" fontSize="32" fontWeight="700" fill={color}>
              {totalScore}
            </text>
            <text x="90" y="108" textAnchor="middle" fontSize="13" fill="#64748b">
              out of 100
            </text>
          </svg>
          <div className="health-label" style={{ color }}>{label}</div>
        </div>

        <div className="health-breakdown">

          <div className="health-factor">
            <div className="health-factor-header">
              <span>Rule 1 — Budget Adherence</span>
              <span style={{ color }}>{budgetAdherenceScore} / 40</span>
            </div>
            <div className="budget-bar-track">
              <div className="budget-bar-fill" style={{ width: `${(budgetAdherenceScore / 40) * 100}%`, background: color }} />
            </div>
            <p className="health-factor-desc">Points deducted for each category that goes over budget</p>
          </div>

          <div className="health-factor">
            <div className="health-factor-header">
              <span>Rule 2 + 3 — Overspend and Diversity</span>
              <span style={{ color }}>{diversityScore} / 30</span>
            </div>
            <div className="budget-bar-track">
              <div className="budget-bar-fill" style={{ width: `${(diversityScore / 30) * 100}%`, background: color }} />
            </div>
            <p className="health-factor-desc">
              {numberOfCategoriesUsed} of {categoryNames.length} categories used.
              Largest single expense is {Math.round(largestExpenseRatio * 100)}% of total budget.
            </p>
          </div>

          <div className="health-factor">
            <div className="health-factor-header">
              <span>Rule 4 — Spending Consistency</span>
              <span style={{ color }}>{consistencyScore} / 30</span>
            </div>
            <div className="budget-bar-track">
              <div className="budget-bar-fill" style={{ width: `${(consistencyScore / 30) * 100}%`, background: color }} />
            </div>
            <p className="health-factor-desc">
              {spikeCount} spike{spikeCount !== 1 ? 's' : ''} detected — expenses more than 3x the average of {formatCurrency(Math.round(averageExpenseAmount))}
            </p>
          </div>

          <div className="health-factor">
            <div className="health-factor-header">
              <span>Rule 5 — Overall Utilisation</span>
              <span style={{ color }}>{Math.round(overallUtilisationRatio * 100)}% of total budget used</span>
            </div>
            <div className="budget-bar-track">
              <div
                className="budget-bar-fill"
                style={{
                  width: `${Math.min(overallUtilisationRatio * 100, 100)}%`,
                  background: overallUtilisationRatio > 1 ? '#ef4444' : '#10b981'
                }}
              />
            </div>
            <p className="health-factor-desc">
              Score hard-capped at {hardScoreCap} — total spending is {Math.round(overallUtilisationRatio * 100)}% of all budgets combined
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HealthScore