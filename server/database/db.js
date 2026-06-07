// db.js — This file creates and exports our SQLite database connection
// Every other file that needs the database imports from here

const Database = require('better-sqlite3')
const path = require('path')

// Create or open the database file
// __dirname means "the folder this current file lives in"
// So this creates expenses.db inside the database/ folder
const db = new Database(path.join(__dirname, 'expenses.db'))

// Create the expenses table if it does not already exist
// This runs every time the server starts — IF NOT EXISTS means
// it won't erase your data if the table is already there
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    amount     REAL    NOT NULL,
    category   TEXT    NOT NULL,
    date       TEXT    NOT NULL,
    note       TEXT,
    created_at TEXT    DEFAULT (datetime('now')),
    updated_at TEXT    DEFAULT (datetime('now'))
  )
`)

// Export the database connection so other files can use it
module.exports = db