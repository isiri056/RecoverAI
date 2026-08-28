import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db
from ..config import settings
from ..schemas.health import HealthResponse

router = APIRouter(prefix="", tags=["Health Check"])

@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database=db_status,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z",
        checks={
            "api": "operational",
            "sqlite_storage": db_status,
            "agent_engine": "active"
        }
    )
