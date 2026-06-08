# TrackEx - Smart Expense Tracker

Exercise 2: Mini Expense Tracker — Studio Graphene Full Stack Developer Assessment

TrackEx is a full stack expense tracking application that lets users log daily spending across categories, visualise where money is going, track budgets per category, and monitor financial health through a scored dashboard. Built with Node.js and Express on the backend, React on the frontend, and SQLite for persistent storage that survives server restarts.

## Live Demo

Frontend (Vercel): https://expense-t-nine.vercel.app/
Backend API (Render): https://trackex-backend-x9xk.onrender.com

## Tech Stack

| Layer | Technology | Why I chose it |
|---|---|---|
| Backend runtime | Node.js | Industry standard for JavaScript on the server |
| Backend framework | Express.js | Lightweight, minimal, easy to explain every line |
| Database | SQLite via better-sqlite3 | Zero configuration, single file storage, perfect for this scale. PostgreSQL would be used in production |
| Frontend framework | React + Vite | Vite starts in under 1 second vs Create React App. Functional components with hooks throughout |
| HTTP client | Axios | Cleaner API than fetch(), consistent error handling |
| Charts | Recharts | React-native charting, composable API |
| Styling | Plain CSS | No framework needed. Every line is explainable |
| State sharing | React Context API | Used for currency selection across all components without prop drilling |

## Features Built

### Must Have 
- Add expense with amount, category, date, and optional note
- View all expenses in a table sorted by date newest first
- Edit and delete expenses with confirmation prompt
- Filter by category and date range
- Summary panel showing total spent, transaction count, and highest expense

### Should Have 
- Pie chart showing expenses by category using Recharts
- Bar chart showing monthly spending trends using Recharts
- Indian Rupee formatting using Intl.NumberFormat
- Multi-currency support - INR, USD, EUR, GBP, JPY, AED, SGD
- Form validation - no negative amounts, no future dates, category required

### Some Extra I Did
- CSV export of visible expenses with correct date formatting
- Budget tracker per category with progress bars and over-budget warnings
- SQLite persistence - all data survives server restarts
- Financial Health Score using 5 scoring rules
- Month selector - all dashboard panels filter to selected month only

### Financial Health Score - 5 Rules
1. Budget Adherence (40 points) - Points deducted for each category that exceeds its budget. Over 2x budget means zero points for that category.
2. Catastrophic Overspend Penalty - If any category exceeds 10x its budget, a 0.3 multiplier is applied to the entire score.
3. Largest Expense Ratio (30 points) - If the single largest expense is over 40% of total budget, the diversity score is reduced by 70%.
4. Spending Spike Detection (30 points) - Any expense more than 3x the average is flagged as a spike. Multiple spikes reduce the consistency score.
5. Overall Utilisation Hard Cap - If total spending exceeds total budget by more than 3x, the maximum possible score is capped at 25.

## How to Run Locally

Assumes you have Node.js installed. No other setup required.

1. Clone the repository

git clone https://github.com/illmatic-dotenv/expenseT.git
cd expenseT

2. Start the backend

cd server
npm install
npm run dev

Backend runs on http://localhost:5000
You should see: Server is running on port 5000

3. Start the frontend - open a new terminal

cd client
npm install
npm run dev

Frontend runs on http://localhost:5173
Open your browser and go to http://localhost:5173

## Project Structure

```
expenseT/
├── .gitignore
├── README.md
├── server/
│   ├── index.js
│   ├── package.json
│   ├── controllers/
│   │   └── expenseController.js
│   ├── services/
│   │   └── expenseService.js
│   ├── routes/
│   │   └── expenseRoutes.js
│   └── database/
│       └── db.js
└── client/
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── context/
        │   └── CurrencyContext.jsx
        ├── services/
        │   └── api.js
        └── components/
            ├── ExpenseForm.jsx
            ├── ExpenseTable.jsx
            ├── SummaryPanel.jsx
            ├── BudgetPanel.jsx
            ├── Charts.jsx
            ├── Filters.jsx
            ├── HealthScore.jsx
            └── MonthSelector.jsx
```

## API Documentation

Base URL (local): http://localhost:5000/api/expenses

### GET /api/expenses

Fetch all expenses sorted by date descending.
Request: No body required.

Response 200 OK:
[
  {
    "id": 1,
    "amount": 500,
    "category": "Food",
    "date": "2025-06-01",
    "note": "Lunch with team",
    "created_at": "2025-06-01 12:00:00",
    "updated_at": "2025-06-01 12:00:00"
  }
]

### GET /api/expenses/summary

Get aggregated statistics across all expenses.
Request: No body required.

Response 200 OK:
{
  "totalAmount": 5250,
  "totalTransactions": 12,
  "highestExpense": 2500,
  "categoryTotals": {
    "Food": 1500,
    "Transport": 750,
    "Bills": 3000
  }
}

### POST /api/expenses

Create a new expense.

Request body:
{
  "amount": 500,
  "category": "Food",
  "date": "2025-06-01",
  "note": "Lunch with team"
}

Validation rules:
- amount must be present and greater than zero
- category must be present
- date must be present

Response 201 Created:
{
  "id": 2,
  "amount": 500,
  "category": "Food",
  "date": "2025-06-01",
  "note": "Lunch with team",
  "created_at": "2025-06-01 12:00:00",
  "updated_at": "2025-06-01 12:00:00"
}

Response 400 Bad Request:
{
  "error": "Amount, category and date are required"
}

### PUT /api/expenses/:id

Update an existing expense by its ID.
Request body: Same fields as POST.
Response 200 OK: Updated expense object.

### DELETE /api/expenses/:id

Delete an expense by its ID.
Request: No body required.

Response 200 OK:
{
  "message": "Expense deleted successfully"
}

## Known Limitations and Honest Notes

Mixed currency bug - The app stores amounts as plain numbers with no currency code attached. If you add 250 rupees and then switch to USD and add 23.50 dollars, both are stored as numbers and the budget comparison treats them as the same currency. Fix: add a currency column to the database and store the original currency with each expense.

Budget persistence - Budget amounts are stored in React state and reset to defaults on page refresh. Fix: store budgets in a separate database table.

No authentication - As specified in the brief, this assumes one user. In production, JWT authentication would be added.

AI assistance - This project was built with Claude (Anthropic). I understand every line and can explain any part during the interview - the controller and service separation, how React Context works, why SQLite was chosen, how the health score is calculated, and how Axios communicates with Express.

## What I Would Build Next

- Store currency code per expense to properly support multi-currency tracking
- Persist budget settings in the database so they survive page refresh
- Add user authentication with JWT so multiple users can have separate data
- Write backend unit tests using Jest for the service layer
- Add a recurring expenses feature for monthly bills
- Add income tracking so the health score can factor in savings rate
- Deploy with Docker so the entire setup runs with one command
