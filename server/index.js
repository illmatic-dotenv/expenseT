// index.js — This is the entry point of our backend server
// Every request to our API comes through this file first

const express = require('express')
const cors = require('cors')
const expenseRoutes = require('./routes/expenseRoutes')

// Create the Express application
const app = express()

// Set the port number our server will listen on
const PORT = 5000

// MIDDLEWARE SECTION
// Middleware runs on every single request before it reaches our routes

// cors() allows our React frontend (port 5173) to talk to this backend (port 5000)
// Without this, the browser blocks the connection for security reasons
app.use(cors())

// express.json() reads the raw JSON text from request bodies
// and converts it into a JavaScript object we can use
app.use(express.json())

// ROUTES SECTION
// Any request that starts with /api/expenses goes to expenseRoutes
app.use('/api/expenses', expenseRoutes)

// START THE SERVER
// app.listen tells our computer to start accepting incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})