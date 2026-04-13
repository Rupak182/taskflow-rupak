import uuid
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, func, or_
from .models import Project
from .schemas import ProjectCreate, ProjectUpdate
from src.tasks.models import Task

class ProjectService:
    async def create_project(self, data: ProjectCreate, owner_id: str, session: AsyncSession) -> Project:
        project_dict = data.model_dump()
        new_project = Project(**project_dict, owner_id=uuid.UUID(owner_id))
        session.add(new_project)
        await session.commit()
        await session.refresh(new_project)
        return new_project

    async def get_project(self, project_id: uuid.UUID, session: AsyncSession) -> Project | None:
        stmt = select(Project).where(Project.id == project_id)
        result = await session.exec(stmt)
        return result.first()
        
    async def get_projects(self, user_id: str, page: int, limit: int, session: AsyncSession):
        offset = (page - 1) * limit
        # Outerjoin used to filter parent Project by its child tasks' assignments
        stmt = (
            select(Project)
            .distinct()
            .outerjoin(Task, Task.project_id == Project.id)
            .where(
                or_(
                    Project.owner_id == uuid.UUID(user_id),
                    Task.assignee_id == uuid.UUID(user_id)
                )
            )
            .offset(offset)
            .limit(limit)
        )
        
        result = await session.exec(stmt)
        return result.all()
        
    async def update_project(self, project: Project, data: ProjectUpdate, session: AsyncSession) -> Project:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(project, key, value)
        
        session.add(project)
        await session.commit()
        await session.refresh(project)
        return project

    async def delete_project(self, project: Project, session: AsyncSession):
        # Database cascading foreign keys and ORM efficiently wipe out tasks automatically
        await session.delete(project)
        await session.commit()
