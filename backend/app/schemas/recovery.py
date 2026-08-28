from typing import List, Optional
from pydantic import BaseModel
from .transaction import TransactionResponse

class RecoverySummaryResponse(BaseModel):
    revenue_at_risk: float
    revenue_at_risk_formatted: str
    recoverable_revenue: float
    recoverable_revenue_formatted: str
    revenue_recovered: float
    revenue_recovered_formatted: str
    recovery_rate_percentage: float
    active_cases_count: int
    review_needed_count: int
    recoverable_percentage_of_risk: float

class OpportunityItem(BaseModel):
    transaction_id: str
    customer_name: str
    amount: float
    amount_formatted: str
    risk: str
    failure_reason: str
    gateway: str
    recommended_action: str
    recovery_probability: float
    status: str

class OpportunityResponse(BaseModel):
    total_opportunities: int
    estimated_salvageable_revenue: float
    estimated_salvageable_formatted: str
    opportunities: List[OpportunityItem]

class AtRiskResponse(BaseModel):
    total_at_risk: float
    total_at_risk_formatted: str
    count: int
    transactions: List[TransactionResponse]

class RecoveredResponse(BaseModel):
    total_recovered: float
    total_recovered_formatted: str
    count: int
    transactions: List[TransactionResponse]
