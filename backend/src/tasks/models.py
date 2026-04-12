from datetime import datetime, date
from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from sqlalchemy import func
from enum import Enum

class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            primary_key=True,
            unique=True,
            nullable=False,
            default=uuid.uuid4
        )
    )
    title: str = Field(nullable=False)
    description: str | None = None
    status: TaskStatus = Field(default=TaskStatus.todo, nullable=False)
    priority: TaskPriority = Field(default=TaskPriority.medium, nullable=False)
    project_id: uuid.UUID = Field(foreign_key="projects.id", nullable=False, ondelete="CASCADE")
    assignee_id: uuid.UUID | None = Field(default=None, foreign_key="users.id", ondelete="SET NULL")
    due_date: date | None = None
    
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, server_default=func.now()))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, server_default=func.now(), onupdate=func.now()))
    project: "Project" = Relationship(back_populates="tasks", sa_relationship_kwargs={"lazy": "selectin"})
    assignee: "User" = Relationship(back_populates="tasks", sa_relationship_kwargs={"lazy": "selectin"})
