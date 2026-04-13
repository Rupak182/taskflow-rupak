import uuid
from datetime import date, datetime
from pydantic import BaseModel, Field
from .models import TaskStatus, TaskPriority

class TaskCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: str | None = None
    status: TaskStatus = Field(default=TaskStatus.todo)
    priority: TaskPriority = Field(default=TaskPriority.medium)
    assignee_id: uuid.UUID | None = None
    due_date: date | None = None

class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assignee_id: uuid.UUID | None = None
    due_date: date | None = None

class TaskRead(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    project_id: uuid.UUID
    assignee_id: uuid.UUID | None
    due_date: date | None
    created_at: datetime
    updated_at: datetime
