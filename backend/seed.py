import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.main import engine
from src.auth.models import User
from src.projects.models import Project
from src.tasks.models import Task
from src.auth.utils import generate_password_hash

async def seed():
    async with AsyncSession(engine) as session:
        email = "test@example.com"
        password = "password123"
        print(f"Seeding database with user: {email} / {password}...")

        user = User(
            name="Test User",
            email=email,
            password=generate_password_hash(password)
        )
        session.add(user)
        await session.flush()
        
        project = Project(
            name="TaskFlow Launch",
            description="Production rollout checklist and final testing.",
            owner_id=user.id
        )
        session.add(project)
        await session.flush()
        
        tasks = [
            Task(
                title="Database Initialization",
                description="Run migrations and deploy initial schema.",
                status="done",
                priority="high",
                project_id=project.id,
                assignee_id=user.id
            ),
            Task(
                title="API Integration tests",
                description="Verify all endpoints respond with the correct JSON schema.",
                status="in_progress",
                priority="high",
                project_id=project.id,
                assignee_id=user.id
            ),
            Task(
                title="Frontend Documentation",
                description="Document the React/Vite Docker orchestration.",
                status="todo",
                priority="low",
                project_id=project.id,
                assignee_id=None
            )
        ]
        session.add_all(tasks)
        await session.commit()
        print("Done! Seeding successful. 1 User, 1 Project, and 3 Tasks created.")

if __name__ == "__main__":
    asyncio.run(seed())
