// Charts.jsx — Pie chart and bar chart using Recharts library
// Both charts receive real data from App.jsx — no hardcoded values

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

// Colors for each slice of the pie chart
const PIE_COLORS = ['#e11d48', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#fb7185']

function Charts({ expenses }) {

  // Build data for the pie chart — total per category
  // e.g. [{ name: 'Food', value: 1500 }, { name: 'Transport', value: 800 }]
  const categoryData = []
  const categoryTotals = {}

  for (const expense of expenses) {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] = categoryTotals[expense.category] + expense.amount
    } else {
      categoryTotals[expense.category] = expense.amount
    }
  }

  for (const [name, value] of Object.entries(categoryTotals)) {
    categoryData.push({ name, value: Math.round(value) })
  }

  // Build data for the bar chart — total spending per month
  // e.g. [{ month: 'Jan 2025', total: 5000 }, { month: 'Feb 2025', total: 3200 }]
  const monthlyData = []
  const monthlyTotals = {}

  for (const expense of expenses) {
    // expense.date is like "2025-03-15"
    // We take the first 7 characters to get "2025-03"
    const monthKey = expense.date.substring(0, 7)

    if (monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = monthlyTotals[monthKey] + expense.amount
    } else {
      monthlyTotals[monthKey] = expense.amount
    }
  }

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyTotals).sort()

  for (const month of sortedMonths) {
    monthlyData.push({
      month: month,
      total: Math.round(monthlyTotals[month])
    })
  }

  // Do not render charts if there is no data
  if (expenses.length === 0) {
    return (
      <div className="charts-container">
        <p className="no-data">Add some expenses to see charts</p>
      </div>
    )
  }

  return (
    <div className="charts-container">

      <div className="chart-box">
        <h3>Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h3>Monthly Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar dataKey="total" fill="#e11d48" name="Total Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default Charts