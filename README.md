# Daily Memory App — Full-Stack Case Study

A full-stack time daily memory app built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering — the same patterns students use in their full-stack projects.

## User Stories
**Auth**
- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Memo**
- A logged-in user can see all of their memos
- A logged-in user can create a new memo by entering description
- A logged-in user can mark a memo public or private
- A logged-in user can delete a memo

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

memos
─────────────────────────────
memo_id  SERIAL PRIMARY KEY
description TEXT NOT NULL
is_public   BOOLEAN DEFAULT FALSE
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many capsules. Deleting a user cascades to delete all of their memos.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Todo endpoints (all require authentication)

| Method | Endpoint              | Request Body      | Response                                     |
| ------ | --------------------- | ----------------- | -------------------------------------------- |
| GET    | `/api/memos`          | —                 | `[{ memo_id, title, is_public, user_id }]` |
| POST   | `/api/memos`          | `{ title }`       | `{ memo_id, title, is_public, user_id }`   |
| PATCH  | `/api/memos/:memo_id` | `{ is_public }` | `{ memo_id, title, is_public, user_id }`   |
| DELETE | `/api/memos/:memo_id` | —                 | `{ memo_id, title, is_public, user_id }`   |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb memos
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

## Application Structure

```
swe-casestudy-7-todo-app/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── memo-adapters.js  # Fetch adapters for /api/todos/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── MemoPage.jsx    # Main app container (shown when logged in)
│   │       ├── MemoPage.jsx    # Main app container (shown when logged in)
│   │       ├── AddMemoForm.jsx # Form to create a new todo
│   │       ├── AddTodoForm.jsx # Form to create a new todo
│   │       ├── MemoList.jsx    # Renders a list of MemoItems
│   │       ├── MemoList.jsx    # Renders a list of MemoItems
│   │       └── MemoItem.jsx    # Single memo: checkbox, title, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── memoControllers.js  # list, create, update, delete todos
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── memoModel.js    # SQL queries for the memos table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
