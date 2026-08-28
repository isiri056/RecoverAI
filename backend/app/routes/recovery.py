from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.recovery import (
    RecoverySummaryResponse,
    OpportunityResponse,
    AtRiskResponse,
    RecoveredResponse
)
from ..services.recovery_service import RecoveryService

router = APIRouter(prefix="/recovery", tags=["Revenue Recovery"])

@router.get("/summary", response_model=RecoverySummaryResponse)
def get_recovery_summary(db: Session = Depends(get_db)):
    """Retrieve high-level recovery metrics: At-Risk, Recoverable, Recovered, Recovery Rate"""
    return RecoveryService.get_summary(db)

@router.get("/opportunities", response_model=OpportunityResponse)
def get_recovery_opportunities(limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    """Retrieve prioritized recovery opportunities queue"""
    return RecoveryService.get_opportunities(db, limit=limit)

@router.get("/at-risk", response_model=AtRiskResponse)
def get_at_risk_transactions(db: Session = Depends(get_db)):
    """Retrieve all transactions currently at risk"""
    return RecoveryService.get_at_risk(db)

@router.get("/recovered", response_model=RecoveredResponse)
def get_recovered_transactions(db: Session = Depends(get_db)):
    """Retrieve all successfully salvaged transactions"""
    return RecoveryService.get_recovered(db)
