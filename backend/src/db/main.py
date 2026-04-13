from sqlmodel import create_engine,text,SQLModel
from sqlalchemy.ext.asyncio import AsyncEngine
from src.config import Config
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import sessionmaker

engine = AsyncEngine(
    create_engine(
        Config.DATABASE_URL,
        echo=False,  # Set to False to stop flooding the console with raw SQL logs
        pool_pre_ping=True,
        pool_recycle=3600
    )
)

async def get_session():
    Session = sessionmaker(
        engine,class_=AsyncSession,
        expire_on_commit=False
        )
    async with Session() as session:
        yield session