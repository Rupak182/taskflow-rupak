from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.main import get_session
import uuid
from .schemas import TaskCreate, TaskUpdate, TaskRead
from .service import TaskService
from src.projects.service import ProjectService
from src.auth.dependencies import access_token_bearer

task_router_projects = APIRouter()
task_router = APIRouter()

task_service = TaskService()
project_service = ProjectService()

@task_router_projects.get("/{project_id}/tasks")
async def list_tasks(
    project_id: uuid.UUID,
    status: str | None = None,
    assignee: uuid.UUID | None = None,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    project = await project_service.get_project(project_id, session)
    if not project:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    tasks = await task_service.list_tasks(project_id, status, assignee, session)
    return {"tasks": [TaskRead.model_validate(t).model_dump(mode="json") for t in tasks]}

@task_router_projects.post("/{project_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    project_id: uuid.UUID,
    data: TaskCreate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    project = await project_service.get_project(project_id, session)
    if not project:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    new_task = await task_service.create_task(project_id, data, session)
    return new_task

@task_router.patch("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: uuid.UUID,
    data: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    task = await task_service.get_task(task_id, session)
    if not task:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    updated_task = await task_service.update_task(task, data, session)
    return updated_task

@task_router.delete("/{task_id}")
async def delete_task(
    task_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    user_id = token_details["user_id"]
    task = await task_service.get_task(task_id, session)
    if not task:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    project = await project_service.get_project(task.project_id, session)
    
    # We allow the project owner OR the task assignee to delete it.
    if str(project.owner_id) != user_id and str(task.assignee_id) != user_id:
        return JSONResponse(status_code=403, content={"error": "forbidden"})
    
    await task_service.delete_task(task, session)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
