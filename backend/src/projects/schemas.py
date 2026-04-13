import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=128)
    description: str | None = Field(default=None, max_length=1000)

class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=128)
    description: str | None = Field(default=None, max_length=1000)

class ProjectRead(BaseModel):
    model_config = {"from_attributes": True}
    
    id: uuid.UUID
    name: str
    description: str | None
    owner_id: uuid.UUID
    created_at: datetime
