from .models import User
from .schemas import UserCreateModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from .utils import generate_password_hash

class UserService:
    async def get_user_by_email(self, email: str, session: AsyncSession) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await session.exec(stmt)
        return result.first()

    async def create_user(self, user: UserCreateModel, session: AsyncSession) -> User:
        user_data_dict = user.model_dump()
        new_user = User(**user_data_dict)
        new_user.password = generate_password_hash(user.password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

    async def get_all_users(self, session: AsyncSession) -> list[User]:
        stmt = select(User)
        result = await session.exec(stmt)
        return list(result.all())
