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

# Configure CORS for React frontend
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://recoverai-frontend-efxi.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
