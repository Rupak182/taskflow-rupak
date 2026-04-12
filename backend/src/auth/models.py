from typing import List
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from sqlalchemy import func

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            primary_key=True,
            unique=True,
            nullable=False,
            default=uuid.uuid4,
            info={"description": "Unique identifier for the user account"},
        )
    )
    name: str = Field(nullable=False)
    email: str = Field(unique=True, nullable=False, index=True)
    password: str = Field(exclude=True, nullable=False)
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, server_default=func.now()))
    projects: List["Project"] = Relationship(back_populates="owner", sa_relationship_kwargs={"cascade": "all, delete-orphan", "lazy": "selectin"})
    tasks: List["Task"] = Relationship(back_populates="assignee", sa_relationship_kwargs={"lazy": "selectin"})