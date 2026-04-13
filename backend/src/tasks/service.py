import uuid
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from .models import Task
from .schemas import TaskCreate, TaskUpdate

class TaskService:
    async def create_task(self, project_id: uuid.UUID, data: TaskCreate, session: AsyncSession) -> Task:
        task_dict = data.model_dump()
        new_task = Task(**task_dict, project_id=project_id)
        session.add(new_task)
        await session.commit()
        await session.refresh(new_task)
        return new_task

    async def get_task(self, task_id: uuid.UUID, session: AsyncSession) -> Task | None:
        stmt = select(Task).where(Task.id == task_id)
        result = await session.exec(stmt)
        return result.first()
        
    async def list_tasks(self, project_id: uuid.UUID, status: str | None, assignee_id: uuid.UUID | None, session: AsyncSession):
        stmt = select(Task).where(Task.project_id == project_id)
        if status:
            stmt = stmt.where(Task.status == status)
        if assignee_id:
            stmt = stmt.where(Task.assignee_id == assignee_id)
            
        result = await session.exec(stmt)
        return result.all()
        
    async def update_task(self, task: Task, data: TaskUpdate, session: AsyncSession) -> Task:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(task, key, value)
        
        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task

    async def delete_task(self, task: Task, session: AsyncSession):
        await session.delete(task)
        await session.commit()
