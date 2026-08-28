from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict

class TransactionBase(BaseModel):
    customer_id: str
    customer_name: str
    customer_email: str
    amount: float = Field(gt=0, description="Amount in currency units (INR)")
    currency: str = "INR"
    payment_method: str
    gateway: str = "Razorpay"
    status: str = "failed"
    failure_reason: Optional[str] = None
    merchant_id: str = "MRC_77209X"
    raw_payload: Optional[str] = None

class TransactionCreate(TransactionBase):
    transaction_id: Optional[str] = None

class TransactionUpdate(BaseModel):
    status: Optional[str] = None
    recovery_status: Optional[str] = None
    recommended_action: Optional[str] = None
    recovery_probability: Optional[float] = None
    priority: Optional[str] = None
    attempts_count: Optional[int] = None

class TransactionResponse(TransactionBase):
    transaction_id: str
    timestamp: datetime
    recovery_status: str
    recovery_probability: float
    priority: str
    recommended_action: str
    attempts_count: int

    model_config = ConfigDict(from_attributes=True)

class TransactionListResponse(BaseModel):
    total: int
    transactions: List[TransactionResponse]
