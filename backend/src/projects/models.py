from typing import List
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from sqlalchemy import func

class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            primary_key=True,
            unique=True,
            nullable=False,
            default=uuid.uuid4
        )
    )
    name: str = Field(nullable=False)
    description: str | None = None
    owner_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, ondelete="CASCADE")
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, server_default=func.now()))
    owner: "User" = Relationship(back_populates="projects", sa_relationship_kwargs={"lazy": "selectin"})
    tasks: List["Task"] = Relationship(back_populates="project", sa_relationship_kwargs={"cascade": "all, delete-orphan", "lazy": "selectin"})
