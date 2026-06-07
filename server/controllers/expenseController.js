// expenseController.js — Handles incoming requests and sends responses
// Controllers only job: read the request, call a service, send back the result
// Controllers never write SQL — that is the service's job

const expenseService = require('../services/expenseService')

// Handles GET /api/expenses
function getExpenses(req, res) {
  try {
    const expenses = expenseService.getAllExpenses()
    res.status(200).json(expenses)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' })
  }
}

// Handles POST /api/expenses
function addExpense(req, res) {
  // Destructure means: pull these specific values out of req.body
  const { amount, category, date, note } = req.body

  // Validate — reject the request if required fields are missing
  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Amount, category and date are required' })
  }

  // Validate — amount must be a positive number
  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' })
  }

  try {
    const newExpense = expenseService.createExpense(amount, category, date, note)
    res.status(201).json(newExpense)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' })
  }
}

// Handles PUT /api/expenses/:id
function editExpense(req, res) {
  // req.params.id is the number in the URL e.g. /api/expenses/5 gives id = 5
  const { id } = req.params
  const { amount, category, date, note } = req.body

  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Amount, category and date are required' })
  }

  try {
    const updatedExpense = expenseService.updateExpense(id, amount, category, date, note)
    res.status(200).json(updatedExpense)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' })
  }
}

// Handles DELETE /api/expenses/:id
function removeExpense(req, res) {
  const { id } = req.params

  try {
    expenseService.deleteExpense(id)
    res.status(200).json({ message: 'Expense deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' })
  }
}

// Handles GET /api/expenses/summary
function getExpenseSummary(req, res) {
  try {
    const summary = expenseService.getSummary()
    res.status(200).json(summary)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' })
  }
}

module.exports = {
  getExpenses,
  addExpense,
  editExpense,
  removeExpense,
  getExpenseSummary
}