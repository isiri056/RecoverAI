from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, SessionLocal
from .routes.health import router as health_router
from .routes.transactions import router as transactions_router
from .routes.recovery import router as recovery_router
from .routes.analytics import router as analytics_router
from .routes.agent import router as agent_router
from .routes.actions import router as actions_router
from .routes.audit import router as audit_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database tables
    Base.metadata.create_all(bind=engine)
    # Seed initial demo data
    try:
        try:
            from data.demo_seed import seed_demo_data
        except ImportError:
            from ..data.demo_seed import seed_demo_data
        db = SessionLocal()
        seed_demo_data(db)
        db.close()
    except Exception as e:
        print(f"Demo data seeding notice: {e}")
    yield

app = FastAPI(
    title="RecoverAI API",
    description="AI-powered Revenue Recovery Platform",
    version="1.0.0",
    lifespan=lifespan
)

import os

# Configure CORS for React frontend
default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://recoverai-frontend-efxi.onrender.com"
]

env_origins = os.getenv("CORS_ORIGINS")
frontend_url = os.getenv("FRONTEND_URL")

origins = list(default_origins)

if env_origins:
    for origin in env_origins.split(","):
        o = origin.strip()
        if o and o not in origins:
            origins.append(o)

if frontend_url:
    fu = frontend_url.strip()
    if fu and fu not in origins:
        origins.append(fu)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Register API Routers under /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(recovery_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(actions_router, prefix="/api")
app.include_router(audit_router, prefix="/api")

@app.get("/")
def root():
    """Root status endpoint"""
    return {
        "name": "RecoverAI API",
        "status": "running",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
