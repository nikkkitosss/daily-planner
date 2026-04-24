# Daily Planner REST API

Production-ready backend API built with Node.js, Express, TypeScript, Prisma ORM, SQLite, JWT auth, bcryptjs, and zod.

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT (access token)
- JWT (access + refresh tokens)
- bcryptjs
- zod validation
- nodemailer (SMTP reminder emails)

## Project Structure

```text
.
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── event.controller.ts
│   │   ├── reminder.controller.ts
│   │   ├── tag.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── prisma
│   │   └── client.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── event.routes.ts
│   │   ├── reminder.routes.ts
│   │   ├── tag.routes.ts
│   │   ├── task.routes.ts
│   │   └── user.routes.ts
│   ├── schemas
│   │   ├── auth.schema.ts
│   │   ├── event.schema.ts
│   │   ├── reminder.schema.ts
│   │   ├── tag.schema.ts
│   │   ├── task.schema.ts
│   │   └── user.schema.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── event.service.ts
│   │   ├── reminder.service.ts
│   │   ├── tag.service.ts
│   │   ├── task.service.ts
│   │   └── user.service.ts
│   ├── types
│   │   └── express.d.ts
│   └── utils
│       ├── apiError.ts
│       ├── asyncHandler.ts
│       ├── constants.ts
│       ├── getParam.ts
│       ├── jwt.ts
│       ├── requireAuthUser.ts
│       └── sanitize.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Scripts

```json
{
  "scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

## Environment Variables

Copy `.env.example` to `.env` and update values:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace_with_a_secure_random_secret"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="*"
SMTP_HOST=""
SMTP_PORT=587
SMTP_AUTH_USER=""
SMTP_AUTH_PASS=""
SENDER_EMAIL=""
REMINDER_POLL_INTERVAL_MS=30000
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npm run db:generate
```

3. Run migrations:

```bash
npm run db:migrate -- --name init
```

4. (Optional) Seed data:

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

6. Build and run production:

```bash
npm run build
npm start
```

## Authentication Flow

1. `POST /auth/register` or `POST /auth/login`
2. Receive `accessToken` and `refreshToken`
3. Use header for protected routes:

```http
Authorization: Bearer <accessToken>
```

## API Endpoints

### AUTH

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

### USERS

- `GET /users/profile`
- `PATCH /users/profile`

### TASKS

- `POST /tasks`
- `GET /tasks` (filters: `status`, `priority`, `dueFrom`, `dueTo`, `search`)
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/status`

### EVENTS

- `POST /events`
- `GET /events` (filters: `from`, `to`)
- `GET /events/:id`
- `PATCH /events/:id`
- `DELETE /events/:id`

### REMINDERS

- `POST /reminders`
- `GET /reminders` (filters: `isSent`, `from`, `to`)
- `GET /reminders/:id`
- `PATCH /reminders/:id`
- `DELETE /reminders/:id`

### TAGS

- `POST /tags`
- `GET /tags`
- `GET /tags/:id`
- `PATCH /tags/:id`
- `DELETE /tags/:id`
- `POST /tags/:id/tasks/:taskId` (attach)
- `DELETE /tags/:id/tasks/:taskId` (detach)

## Postman-Style Example Requests

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Nikita",
  "email": "nikita@example.com",
  "password": "StrongPass123"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "nikita@example.com",
  "password": "StrongPass123"
}
```

### Create Tag

```http
POST /tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "work"
}
```

### Create Task with Tags

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Finish API docs",
  "description": "Prepare final documentation",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-04-20T10:00:00.000Z",
  "tagIds": ["<tag_id>"]
}
```

### Update Task Status

```http
PATCH /tasks/<task_id>/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "DONE"
}
```

### Filter Tasks

```http
GET /tasks?status=TODO&priority=HIGH&search=docs
Authorization: Bearer <token>
```

### Attach Tag to Task

```http
POST /tags/<tag_id>/tasks/<task_id>
Authorization: Bearer <token>
```

### Create Event

```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Planning Session",
  "description": "Sprint planning",
  "startTime": "2026-04-18T09:00:00.000Z",
  "endTime": "2026-04-18T10:00:00.000Z"
}
```

### Create Reminder

```http
POST /reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Review tasks",
  "remindAt": "2026-04-17T08:00:00.000Z",
  "isSent": false
}
```

## Security and Architecture Notes

- Passwords are hashed using bcryptjs.
- Passwords are never returned in API responses.
- JWT access-token middleware protects private routes.
- All input is validated through zod schemas.
- Centralized error middleware handles validation, known Prisma errors, and unexpected failures.
- Async controller wrapper avoids duplicated try/catch logic.
- Resource access is user-scoped (ownership checks on protected entities).
