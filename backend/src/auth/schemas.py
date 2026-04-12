import uuid
from pydantic import BaseModel, Field

class UserCreateModel(BaseModel):
    name: str = Field(..., description="Name of the user", max_length=128)
    email: str = Field(..., description="Email for the user", max_length=255)
    password: str = Field(..., description="Password for the user", min_length=8, max_length=128)

class UserModelResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str

class AuthResponseModel(BaseModel):
    token: str
    user: UserModelResponse

class UserLoginModel(BaseModel):
    email: str = Field(..., description="Email for the user", max_length=255)
    password: str = Field(..., description="Password for the user", min_length=8, max_length=128)
