// api.js — All communication with the backend lives here
// Every component that needs data calls a function from this file
// This means if the backend URL ever changes, we only update one file

import axios from 'axios'

// The base URL of our backend server
// All our API calls will start with this address
const BASE_URL = 'http://localhost:5000/api/expenses'

// Fetch all expenses from the backend
export function getAllExpenses() {
  return axios.get(BASE_URL)
}

// Fetch summary statistics for the dashboard
export function getSummary() {
  return axios.get(`${BASE_URL}/summary`)
}

// Create a new expense
// expenseData is an object like { amount, category, date, note }
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