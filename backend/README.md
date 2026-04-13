# TaskFlow Backend

This API powers the TaskFlow application. While the initial specifications hinted at Go, this project is built using a modern, scalable **Python** stack perfectly tuned for development velocity securely utilizing Async IO.

## Tech Stack
* **FastAPI**: Incredibly fast asynchronous web framework.
* **SQLModel / SQLAlchemy**: Pydantic-powered ORM strictly paired with PostgreSQL.
* **Alembic**: Database migrations and cascade enforcement.
* **asyncpg**: High-performance asynchronous database driver.
* **uv**: Lightning-fast Python package and project manager.

## Local Development

Start the server using our dedicated entrypoint:
```bash
uv run python main.py
```
*(This wraps Uvicorn with hot-reloading and gracefully handles asynchronous shutdown).*

You can alternatively run it via the FastAPI CLI:
```bash
uv run fastapi dev src
```

## Infrastructure: Database Migrations & Seeding

This project requires explicit database migrations (using Alembic) instead of ORM auto-migration.
Once you start the containers with `docker compose up --build`, you **must** initialize the database by running the migrations and the seed script.

Run these exact commands in a new terminal tab from the project root:

1. **Apply Migrations** (Creates tables):
   ```bash
   docker compose exec app alembic upgrade head
   ```

2. **Seed the Database**:
   ```bash
   docker compose exec app python seed.py
   ```
   *The seed script safely creates 1 Test User (`test@example.com` / `password`), 1 Project, and 3 Tasks with different statuses (todo, in_progress, done).*

## Interactive API Documentation
Once running and migrated, the automatically generated interactive documentation is available dynamically at:
`http://localhost:8000/docs`
