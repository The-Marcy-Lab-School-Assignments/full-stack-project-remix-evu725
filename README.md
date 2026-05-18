# Expense Tracker App

A full-stack expense tracker app built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering — the same patterns students use in their full-stack projects.

## User Stories
**Auth**
- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Expense**
- A logged-in user can see all of their expenses
- A logged-in user can create a new expense by entering title, amount, category, and expense date
- A logged-in user can mark a expense public or private
- A logged-in user can delete a expense

## Schema

```
users
─────────────────────────────
user_id         SERIAL PRIMARY KEY
username        TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL

memos
─────────────────────────────
expense_id      SERIAL PRIMARY KEY
title           TEXT NOT NULL
amount          NUMERIC(10,2) NOT NULL
category        TEXT NOT NULL
expense_date    DATE NOT NULL DEFAULT CURRENT_DATE
user_id         INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many expenses. Deleting a user cascades to delete all of their expenses.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Expense endpoints (all require authentication)

| Method | Endpoint                  | Request Body                                | Response                                     |
| ------ | ------------------------  | ------------------------------------------- | -------------------------------------------- |
| GET    | `/api/expenses`           | —                                           | `[{ expense_id, title, amount, category, expense_date, user_id }]` |
| POST   | `/api/expenses`           | `{ title, amount, category expense_date }`  | `{ expense_id, title, amount, category, expense_date, user_id }`   |
| PATCH  | `/api/expenses/:entry_id` | `{ title, amount, category, expense_date }` | `{ expense_id, title, amount, category, expense_date, user_id }`   |
| DELETE | `/api/expenses/:entry_id` | —                                           | `{ expense_id, title, amount, category, expense_date, user_id }`   |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb daily_journal
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |
| liam      | password123 |

## Application Structure

```
full-stack-project-remix-evu725/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── expense-adapters.js  # Fetch adapters for /api/expenses/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── ExpensePage.jsx    # Main app container (shown when logged in)
│   │       ├── AddExpenseForm.jsx # Form to create a new expense
│   │       ├── ExpenseList.jsx    # Renders a list of ExpenseItems
│   │       └── ExpenseItem.jsx    # Single expense: title, amount, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── expenseControllers.js  # list, create, update, delete expenses
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── expenseModel.js    # SQL queries for the expenses table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
