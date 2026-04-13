# TaskFlow

A full-stack task management system. Users can register, log in, create projects, and manage tasks — including assigning them to other users, filtering by status/assignee, and tracking priorities.



<img width="1918" height="1073" alt="image" src="https://github.com/user-attachments/assets/ec8bcd9c-4713-48bc-b30b-d1c07dbdc280" />




## 1. Overview

### What it does
- JWT-based user authentication (register + login)
- Create and manage projects (owned by the creator)
- Create, update, and delete tasks within projects
- Assign tasks to any registered user
- Filter tasks by status (`todo`, `in_progress`, `done`) and assignee
- Project analytics: task counts by status via `GET /projects/:id/stats`
- Responsive UI — works on mobile (375px) and desktop (1280px)

### Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python · FastAPI · SQLModel / SQLAlchemy |
| **Database** | PostgreSQL 16 |
| **Migrations** | Alembic |
| **Auth** | JWT (PyJWT) · bcrypt (passlib, cost 12) |
| **Frontend** | React 18 · TypeScript · Vite |
| **UI Library** | shadcn/ui + Radix UI primitives |
| **State / Data** | TanStack Query (optimistic updates) |
| **Styling** | Tailwind CSS |
| **Orchestration** | Docker Compose |

---

## 2. Architecture Decisions

### Backend (FastAPI)
I chose **FastAPI + Python**  for the backend along with sqlalchemy as ORM and alembic for migrations.

### Schema & Migrations
- All schema changes are managed strictly by **Alembic** — no `SQLModel.metadata.create_all()` ORM magic
- Both `up` and `down` migrations are present in every migration file
- Enums (`TaskStatus`, `TaskPriority`) are Postgres native types for type safety at DB level

### Authentication & Security
- Passwords hashed with **bcrypt at cost 12** 
- JWTs contain `user_id` + `email`, expire after **24 hours**
- JWT secret and CORS origins are read from `.env`
- CORS `allow_origins` is loaded dynamically from the `Config` object

### Frontend (React)
- **TanStack Query** manages all server state with automatic cache invalidation after mutations
- Auth state stored in `localStorage` (persists across refreshes)
- **Optimistic updates** on task status changes — UI updates immediately, rolls back on API error

### Intentional Omissions 
- No WebSocket/SSE real-time sync — would require a message broker
- No drag-and-drop reorder — complex UI with negligible rubric weight
- No pagination on the frontend UI (backend supports `?page=&limit=`)

---

## 3. Running Locally

> **Prerequisites**: Docker and Docker Compose only. Nothing else required.

```bash
# 1. Clone the repo
git clone https://github.com/Rupak182/taskflow-rupak.git
cd proj

# 2. Set up environment variables
cp .env.example .env
# Edit .env if you wish to change defaults (defaults work out of the box)

# 3. Start all services (PostgreSQL, API, and React frontend)
docker compose up --build

# App is available at:
#   Frontend: http://localhost:3000
#   Backend API: http://localhost:8000
#   API Docs: http://localhost:8000/docs
```

---

## 4. Running Migrations & Seeding

Migrations do **not** run automatically on container start. After `docker compose up --build`, run the following in a new terminal:

```bash
# Apply all database migrations (create tables)
docker compose exec app uv run alembic upgrade head

# Seed the database with test data (1 user, 1 project, 3 tasks)
docker compose exec app uv run python seed.py
# Seed Login Credentials:
# Email: test@example.com , Password: password
```

## Interactive API Documentation
Once running and migrated, the automatically generated interactive documentation is available dynamically at:
`http://localhost:8000/docs`


> **To start from a completely clean slate** (e.g., for testing reproducibility):
> ```bash
> docker compose down -v   # destroys all containers AND the database volume
> docker compose up --build -d
> docker compose exec app uv run alembic upgrade head
> docker compose exec app uv run python seed.py
> ```

---

## 5. Test Credentials

After running the seed script:

```
Email:    test@example.com
Password: password
```

---

## 6. API Reference

Full interactive docs are available at **http://localhost:8000/docs** when the stack is running.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register with `name`, `email`, `password` |
| `POST` | `/auth/login` | Returns JWT access token |
| `GET` | `/auth/users` | List all registered users (authenticated) |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects` | List projects owned or assigned to current user |
| `POST` | `/projects` | Create project (owner = current user) |
| `GET` | `/projects/:id` | Project details + task list |
| `PATCH` | `/projects/:id` | Update name/description (owner only) |
| `DELETE` | `/projects/:id` | Delete project and all tasks (owner only) |
| `GET` | `/projects/:id/stats` | Task count grouped by status |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects/:id/tasks` | List tasks — supports `?status=` and `?assignee_id=` |
| `POST` | `/projects/:id/tasks` | Create task |
| `PATCH` | `/tasks/:id` | Update title, status, priority, assignee, due date |
| `DELETE` | `/tasks/:id` | Delete task (project owner or assignee) |

### Error Responses
```json
// 400 Validation error
{ "error": "validation failed", "fields": { "email": "is required" } }

// 401 Unauthenticated
{ "error": "unauthorized" }

// 403 Forbidden
{ "error": "forbidden" }

// 404 Not found
{ "error": "not found" }
```

---

## 7. What I Might have Done With More Time

### Known Tradeoffs

- **Websocket support**: Not implemented as it would need additonal setup and overhead to the project.
- **Single-stage Dockerfile**: Using UV along with a minimal setup had some issues. So mutli stage build was not used due to time constraint.
- **No Pagination in Frontend**: We have support for pagination in backend but frontend is not using that.
- **No Token rotation or refresh token**: It was not mentioned in the scope, so ommited to simplify the implementation.
- **Partial validation in fetching event and tasks**: Since authorization checks were not in scope, I have not implemented them, excluding what was explicitly mentioned
- **Tests**: Did manual tests but no automated tests were written. 
- **localstorage for stoing jwt**: We should use http only cookies for security , but chose localstoage for simplicity




