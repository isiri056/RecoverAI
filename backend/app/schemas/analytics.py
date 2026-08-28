from typing import List
from pydantic import BaseModel

class PulsePoint(BaseModel):
    time: str
    atRisk: float
    recoverable: float
    recovered: float

class RevenuePulseResponse(BaseModel):
    interval: str
    data: List[PulsePoint]

class GatewayBenchmark(BaseModel):
    gateway: str
    recoveredRate: float
    avgLatency: int

class ChannelAttributionItem(BaseModel):
    channel: str
    percentage: float
    revenue: str
    color: str

class AnalyticsOverviewResponse(BaseModel):
    total_preserved_revenue: float
    total_preserved_formatted: str
    churn_prevented_rate: float
    roi_multiplier: str
    salvaged_count: int
    gateways: List[GatewayBenchmark]
    channels: List[ChannelAttributionItem]

class RecoveryRateResponse(BaseModel):
    current_recovery_rate: float
    target_rate: float
    trailing_7_days_change: str
    status: str
