from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ActionBase(BaseModel):
    title: str
    description: Optional[str] = None
    channel: str
    trigger_rule: str
    status: str = "Active"

class ActionCreate(ActionBase):
    action_id: Optional[str] = None

class ActionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    trigger_rule: Optional[str] = None
    status: Optional[str] = None

class ActionResponse(ActionBase):
    action_id: str
    success_rate: float
    total_salvaged: float
    total_salvaged_formatted: str
    dispatched_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ActionExecuteResponse(BaseModel):
    action_id: str
    action_title: str
    dispatched_to: str
    execution_status: str
    dispatched_at: datetime
    message: str
