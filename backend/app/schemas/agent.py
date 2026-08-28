from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class AgentStatusResponse(BaseModel):
    agent_name: str
    version: str
    status: str
    is_autonomous: bool
    safety_limit_per_txn: float
    safety_limit_formatted: str
    tasks_processed_today: int
    opportunities_detected: int
    recoveries_initiated: int
    recovery_success_rate: str
    active_threads: int
    last_action: str

class AgentAnalysisRequest(BaseModel):
    transaction_id: Optional[str] = None
    amount: float
    payment_method: str
    failure_reason: str
    gateway: str
    attempts_count: Optional[int] = 0

class AgentAnalysisResponse(BaseModel):
    transaction_id: Optional[str]
    recovery_probability: float
    risk_level: str
    priority: str
    recommended_action: str
    action_strategy: str
    explainability_rationale: str
    estimated_salvageable_amount: float
    auto_executable: bool

class AgentPrioritizeResponse(BaseModel):
    total_prioritized: int
    total_salvageable_value: float
    total_salvageable_formatted: str
    prioritized_queue: List[AgentAnalysisResponse]
