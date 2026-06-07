// expenseRoutes.js — Defines which URL + method calls which controller function
// Think of this as a phone directory: this URL goes to this function

const express = require('express')
const router = express.Router()
const expenseController = require('../controllers/expenseController')

// GET /api/expenses — fetch all expenses
router.get('/', expenseController.getExpenses)

// GET /api/expenses/summary — get dashboard summary stats
// This must be ABOVE the /:id route, otherwise Express thinks "summary" is an id
router.get('/summary', expenseController.getExpenseSummary)

// POST /api/expenses — add a new expense
router.post('/', expenseController.addExpense)

// PUT /api/expenses/:id — edit expense with a specific id
router.put('/:id', expenseController.editExpense)

// DELETE /api/expenses/:id — delete expense with a specific id
router.delete('/:id', expenseController.removeExpense)

module.exports = router