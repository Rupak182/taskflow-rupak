from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.main import get_session
from .schemas import UserCreateModel, AuthResponseModel, UserLoginModel, UserModelResponse
from .service import UserService
from .utils import create_access_token, verify_password
from .dependencies import access_token_bearer

auth_router = APIRouter()
user_service = UserService()

@auth_router.post(
    "/register",
    response_model=AuthResponseModel,
    status_code=status.HTTP_201_CREATED
)
async def register(user: UserCreateModel, session: AsyncSession = Depends(get_session)):
    user_exists = await user_service.get_user_by_email(user.email, session)
    if user_exists:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "validation failed", "fields": {"email": "already exists"}}
        )
    
    new_user = await user_service.create_user(user, session)
    token = create_access_token(
        user_data={
            "email": new_user.email,
            "user_id": str(new_user.id)
        }
    )
    return AuthResponseModel(
        token=token,
        user=UserModelResponse(id=new_user.id, name=new_user.name, email=new_user.email)
    )

@auth_router.post("/login", response_model=AuthResponseModel)
async def login(login_data: UserLoginModel, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user_by_email(login_data.email, session)
    if user is None:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "unauthorized"}
        )
    
    if not verify_password(login_data.password, user.password):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "unauthorized"}
        )
    
    token = create_access_token(
        user_data={
            "email": user.email,
            "user_id": str(user.id)
        }
    )
    
    return AuthResponseModel(
        token=token,
        user=UserModelResponse(id=user.id, name=user.name, email=user.email)
    )

@auth_router.get("/users", response_model=list[UserModelResponse])
async def get_users(
    session: AsyncSession = Depends(get_session), 
    token_details=Depends(access_token_bearer)
):
    users = await user_service.get_all_users(session)
    return [UserModelResponse(id=user.id, name=user.name, email=user.email) for user in users]
