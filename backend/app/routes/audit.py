from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.audit import AuditLogListResponse
from ..services.audit_service import AuditService

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("", response_model=AuditLogListResponse)
def get_audit_trail(limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    """Retrieve cryptographic immutable audit logs"""
    return AuditService.get_all(db, limit=limit)
