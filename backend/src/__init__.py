from src.auth.routes import auth_router
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.main import init_db
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server is starting")
    await init_db()
    yield
    print("Server is stopping")

app = FastAPI(
    title="TaskFlow API",
    description="TaskFlow Backend",
    version="1.0",
    lifespan=lifespan
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
