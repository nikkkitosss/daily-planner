# Daily Planner Monorepo

Full-stack daily planning application with authentication, tasks, tags, events, reminders, and calendar UI.

## Overview

This repository contains:

- Backend API (Node.js + Express + TypeScript + Prisma + SQLite)
- Frontend app (React + TypeScript + Vite + Tailwind)
- Docker setup to run both services together

## Repository Structure

```text
.
├── backend/                 # REST API and database layer
├── frontend/                # React web application
├── docker-compose.yml       # Multi-container local setup
└── package.json             # Monorepo workspace scripts
```

## Tech Stack

- Backend: Express 5, TypeScript, Prisma ORM, SQLite, JWT, Zod
- Frontend: React 18, React Router, Axios, Tailwind CSS, Vite
- Tooling: npm workspaces, Docker, Docker Compose

## Quick Start (Local, Without Docker)

### 1. Install Dependencies

From repository root:

```bash
npm install
```

### 2. Configure Environment

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

### 3. Setup Database

```bash
npm --prefix backend run db:generate
npm --prefix backend run db:migrate -- --name init
```

Optional seed:

```bash
npm --prefix backend run db:seed
```

### 4. Run in Development

Start backend:

```bash
npm --prefix backend run dev
```

Start frontend in another terminal:

```bash
npm --prefix frontend run dev
```

Frontend default URL: http://localhost:5173

## Run with Docker

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Build

Build both packages from root:

```bash
npm run build
```

## Main API Domains

- Auth: register, login, current user
- Users: profile read/update
- Tasks: CRUD + status updates + filters
- Events: CRUD + date range filtering
- Reminders: CRUD + sent/date filtering
- Tags: CRUD + attach/detach tags to tasks

Backend API details and endpoint list:

- See backend/README.md

Frontend setup details:

- See frontend/README.md

## Test Data

Pre-made test events are available in:

- test-data/events.sample.json

You can use them as request bodies for `POST /events` (authorized route).
