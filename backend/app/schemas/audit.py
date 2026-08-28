from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class AuditLogResponse(BaseModel):
    log_id: str
    timestamp: datetime
    actor: str
    actor_type: str
    action: str
    target: str
    reasoning: str
    integrity_hash: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class AuditLogListResponse(BaseModel):
    total: int
    logs: List[AuditLogResponse]
