from fastapi import APIRouter, Query
from ..schemas.analytics import (
    AnalyticsOverviewResponse,
    RevenuePulseResponse,
    RecoveryRateResponse
)
from ..services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview():
    """Retrieve recovery analytics overview, unit economics, gateway reliability, and channel attribution"""
    return AnalyticsService.get_overview()

@router.get("/revenue-pulse", response_model=RevenuePulseResponse)
def get_revenue_pulse(interval: str = Query("24h", pattern="^(24h|7d|30d)$")):
    """Retrieve Revenue Recovery Pulse time-series data for 24h, 7d, or 30d"""
    return AnalyticsService.get_revenue_pulse(interval=interval)

@router.get("/recovery-rate", response_model=RecoveryRateResponse)
def get_recovery_rate():
    """Retrieve current recovery success rate against targets"""
    return AnalyticsService.get_recovery_rate()
