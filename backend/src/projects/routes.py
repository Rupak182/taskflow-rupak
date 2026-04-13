from fastapi import APIRouter, Depends, status, Query
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.main import get_session
import uuid
from .schemas import ProjectCreate, ProjectUpdate, ProjectRead
from .service import ProjectService
from src.auth.dependencies import access_token_bearer

project_router = APIRouter()
project_service = ProjectService()

@project_router.get("", status_code=status.HTTP_200_OK)
async def list_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    user_id = token_details["user_id"]
    projects = await project_service.get_projects(user_id, page, limit, session)
    return {"projects": [ProjectRead.model_validate(p).model_dump(mode="json") for p in projects]}

@project_router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    user_id = token_details["user_id"]
    new_project = await project_service.create_project(data, user_id, session)
    return new_project

@project_router.get("/{project_id}", status_code=status.HTTP_200_OK)
async def get_project(
    project_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    project = await project_service.get_project(project_id, session)
    if not project:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    # We can naturally access project.tasks here. The selectin relationship has loaded it instantly in the background!
    response_data = ProjectRead.model_validate(project).model_dump(mode="json")
    response_data["tasks"] = [
        {
            "id": str(t.id),
            "title": t.title,
            "status": t.status.value,
            "priority": t.priority.value,
            "assignee_id": str(t.assignee_id) if t.assignee_id else None,
            "due_date": str(t.due_date) if t.due_date else None,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None
        }
        for t in project.tasks
    ]
    return response_data

@project_router.patch("/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: uuid.UUID,
    data: ProjectUpdate,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    user_id = token_details["user_id"]
    project = await project_service.get_project(project_id, session)
    if not project:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    if str(project.owner_id) != user_id:
        return JSONResponse(status_code=403, content={"error": "forbidden"})
    
    updated_project = await project_service.update_project(project, data, session)
    return updated_project

@project_router.delete("/{project_id}")
async def delete_project(
    project_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    token_details: dict = Depends(access_token_bearer)
):
    user_id = token_details["user_id"]
    project = await project_service.get_project(project_id, session)
    if not project:
        return JSONResponse(status_code=404, content={"error": "not found"})
    
    if str(project.owner_id) != user_id:
        return JSONResponse(status_code=403, content={"error": "forbidden"})
    
    await project_service.delete_project(project, session)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
