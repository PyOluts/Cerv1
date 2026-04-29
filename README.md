# 🚀 Fullstack Todo Application

Production-ready Todo application built with modern architecture, Optimistic UI, and drag-and-drop support.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Query v5 (Optimistic UI updates), React Router v6, TailwindCSS, @dnd-kit (Drag-and-Drop).
- **Backend**: Node.js, Express, Mongoose (MongoDB), Zod (Schema Validation).
- **Tooling**: TypeScript, Jest/Supertest, Docker & Docker Compose.

---

## 🌟 Key Features

- **Optimistic UI**: Instantaneous interactions before server response. UI rollback automatically triggers on network failure.
- **Drag & Drop**: Native re-ordering of tasks in the list.
- **Keyboard Shortcuts**: `/` (Focus Search), `N` (Create), `Esc` (Blur inputs). 
- **Bulk Actions**: Batch delete all completed tasks with confirmation.
- **Pagination & Filters via URL**: State seamlessly bound to `useSearchParams` to ensure browser navigation (Back/Forward) strictly honors active queries.

---

## 📦 Setup & Installation

### Option 1: Docker (Recommended)

Boot up the entire stack (Client, Server, and MongoDB isolated containers) via Docker Compose:

```bash
docker-compose up --build
```
- Client running at: `http://localhost:5173`
- API running at: `http://localhost:3000/api`

### Option 2: Manual Local Setup

1. **Clone and Install dependencies**
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

2. **Environment Variables**
Copy `.env.example` to `.env` in the root (for docker) or in respective folders.
```bash
cp .env.example .env
```

3. **Running the services**
You must have a local MongoDB instance running on port `27017` or use an Atlas string in `.env`.

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 📜 Build Scripts & Typechecking

Both client and server come with strict typescript validation mapped in their `package.json`:
- `npm run typecheck` - Compiles without emit to verify TS structural integrity.
- `npm run build` - Server builds to `dist/`, Client bundles static files in `/dist` via Vite.
- `npm run lint` - Enforces clean code formatting.
- `npm run test` (Server) - Executes Jest + Supertest suites.

---

## 🌐 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/todos` | Fetch paginated list (params: `page`, `limit`, `search`, `status`, `priority`, `sort`) |
| `GET` | `/api/todos/:id` | Fetch details of a single task |
| `POST` | `/api/todos` | Create a new task (Zod Validated) |
| `PATCH` | `/api/todos/:id` | Soft-edit fields of a task |
| `PATCH` | `/api/todos/:id/toggle` | Inverse the completed status |
| `DELETE` | `/api/todos/:id` | Drop task |
| `DELETE` | `/api/todos/bulk` | Delete mass tasks (Requires `ids` array in body data) |
