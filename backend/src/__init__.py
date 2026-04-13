from src.auth.routes import auth_router
from src.projects.routes import project_router
from src.tasks.routes import task_router, task_router_projects
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.db.main import init_db

# Import models to ensure they are registered with SQLAlchemy
import src.projects.models
import src.tasks.models
import src.auth.models
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server is starting")
    await init_db()
    yield
    print("Server is stopping")

from src.config import Config

app = FastAPI(
    title="TaskFlow API",
    description="TaskFlow Backend",
    version="1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(project_router, prefix="/projects", tags=["Projects"])
app.include_router(task_router_projects, prefix="/projects", tags=["Tasks"])
app.include_router(task_router, prefix="/tasks", tags=["Tasks"])
