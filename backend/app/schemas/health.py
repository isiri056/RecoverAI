from typing import Dict, Any
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    environment: str
    database: str
    timestamp: str
    checks: Dict[str, Any]
