[README.md](https://github.com/user-attachments/files/30923100/README.md)
# Project Tracker Expense (Student Expense Tracker)

Live Demo: https://project-tracker-expense-ooym.vercel.app/

A full-stack personal finance app for tracking income, expenses, and budgets. Built as a single **Next.js** application — the same codebase serves the React frontend and the JSON backend (via Next.js API routes), backed by **MongoDB**.

## Project Overview

- **Authentication** — Sign up / log in with email + password. Passwords are hashed with `bcryptjs`; sessions are handled with JWTs (`jsonwebtoken`).
- **Transactions** — Create, list, and delete income/expense entries (date, category, description, amount, type), scoped to the logged-in user.
- **Budgets** — Set and update a personal monthly budget; defaults to `5000` if none has been set yet.
- **UI** — Built with React 19, Tailwind CSS 4, Radix UI primitives, and shadcn/ui-style components (`components/ui`); charts via `recharts`.

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript/JavaScript, Tailwind CSS, MongoDB (native driver), JWT, bcryptjs.

## Prerequisites

- **Node.js** 18.18+ (Node 20 LTS recommended, for Next.js 16 / React 19)
- **pnpm** (the repo ships a `pnpm-lock.yaml`/`pnpm-workspace.yaml`) — npm or yarn will also work but pnpm is preferred
- A **MongoDB** database — either:
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster, or
  - A local MongoDB instance
- Git

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/OwnFuture/Project-Tracker-Expense.git
   cd Project-Tracker-Expense
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root (see [Default Environment Variables](#default-environment-variables-if-any) below).

4. **Whitelist your IP (Atlas only)**

   If you're using MongoDB Atlas, make sure your current IP (or `0.0.0.0/0` for development) is allowlisted under Network Access, and that you've created a database user.

## How to Run

This project doesn't have separate frontend/backend servers — Next.js runs both together as one process.

### Development

```bash
pnpm dev
# or: npm run dev
```

The app (frontend UI + `/api/*` backend routes) will be available at **http://localhost:3000**.

### Production

```bash
pnpm build
pnpm start
# or: npm run build && npm run start
```

### Lint

```bash
pnpm lint
```

## Default Environment Variables (if any)

Create `.env.local` in the project root with:

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | — | MongoDB connection string, e.g. `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/expense_tracker?retryWrites=true&w=majority`. The app connects to a database named `Expense_Tracker`. Throws an error at runtime if unset. |
| `JWT_SECRET` | Recommended | `"your-secret-key"` | Secret used to sign/verify JWTs for auth. The code falls back to a hardcoded default if this isn't set — **always set a strong, unique value in any real deployment.** |

Example `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-string
```

## Database Schema / Migrations

MongoDB is schemaless, so there are **no formal migration scripts** — collections and documents are created automatically on first write by the API routes. Effective schema, inferred from the code:

**Database:** `Expense_Tracker`

### `users`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `email` | string | Unique (checked at signup) |
| `password` | string | bcrypt hash |
| `name` | string | Derived from email (part before `@`) |
| `createdAt` | Date | Set at signup |

### `transactions`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | References `users._id` |
| `date` | Date | Transaction date |
| `category` | string | e.g. Food, Rent, Salary |
| `description` | string | Free-text note |
| `amount` | number | Parsed as float |
| `type` | string | e.g. `income` / `expense` |
| `createdAt` | Date | Set on insert |

### `budgets`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | References `users._id`, unique per user (upserted) |
| `amount` | number | Budget amount |
| `updatedAt` | Date | Set on each update |

**Recommended indexes** (not created automatically — add manually if scaling beyond dev/testing):
```js
db.users.createIndex({ email: 1 }, { unique: true })
db.transactions.createIndex({ userId: 1, date: -1 })
db.budgets.createIndex({ userId: 1 }, { unique: true })
```
