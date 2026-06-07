// api.js — All communication with the backend lives here
// Every component that needs data calls a function from this file

import axios from 'axios'

// The backend URL — points to our deployed Render server
const BASE_URL = 'https://trackex-backend-x9xk.onrender.com/api/expenses'

// Fetch all expenses from the backend
export function getAllExpenses() {
  return axios.get(BASE_URL)
}

// Fetch summary statistics for the dashboard
export function getSummary() {
  return axios.get(`${BASE_URL}/summary`)
}

// Create a new expense
export function createExpense(expenseData) {
  return axios.post(BASE_URL, expenseData)
}

// Update an existing expense by its id
export function updateExpense(id, expenseData) {
  return axios.put(`${BASE_URL}/${id}`, expenseData)
}

// Delete an expense by its id
export function deleteExpense(id) {
  return axios.delete(`${BASE_URL}/${id}`)
}