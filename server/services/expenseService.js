// expenseService.js — All database queries live here and nowhere else
// Controllers call these functions — they never touch the database directly
// This separation means if we ever change our database, we only edit this file

const db = require('../database/db')

// Get every expense from the database, newest date first
function getAllExpenses() {
  const expenses = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all()
  return expenses
}

// Insert a new expense into the database
function createExpense(amount, category, date, note) {
  const result = db.prepare(`
    INSERT INTO expenses (amount, category, date, note)
    VALUES (?, ?, ?, ?)
  `).run(amount, category, date, note)

  // Fetch and return the newly created expense using the auto-generated id
  const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid)
  return newExpense
}

// Update an existing expense by its id
function updateExpense(id, amount, category, date, note) {
  db.prepare(`
    UPDATE expenses
    SET amount = ?, category = ?, date = ?, note = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(amount, category, date, note, id)

  // Return the updated expense
  const updatedExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id)
  return updatedExpense
}

// Delete an expense by its id
function deleteExpense(id) {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id)
}

// Calculate summary statistics for the dashboard panel
function getSummary() {
  const allExpenses = db.prepare('SELECT * FROM expenses').all()

  // Add up every expense amount to get the grand total
  let totalAmount = 0
  for (const expense of allExpenses) {
    totalAmount = totalAmount + expense.amount
  }

  // Find the single highest expense
  let highestExpense = 0
  for (const expense of allExpenses) {
    if (expense.amount > highestExpense) {
      highestExpense = expense.amount
    }
  }

  // Group expenses by category and sum each category's total
  const categoryTotals = {}
  for (const expense of allExpenses) {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] = categoryTotals[expense.category] + expense.amount
    } else {
      categoryTotals[expense.category] = expense.amount
    }
  }

  return {
    totalAmount,
    totalTransactions: allExpenses.length,
    highestExpense,
    categoryTotals
  }
}

module.exports = {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary
}