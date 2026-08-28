import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Text
from ..database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String(64), primary_key=True, index=True)
    customer_id = Column(String(64), index=True)
    customer_name = Column(String(128))
    customer_email = Column(String(128))
    merchant_id = Column(String(64), default="MRC_77209X", index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    payment_method = Column(String(64), nullable=False)
    gateway = Column(String(64), default="Razorpay")
    status = Column(String(32), default="failed", index=True) # failed, recovered, success, pending
    failure_reason = Column(String(128), nullable=True) # UPI_TIMEOUT, CARD_3DS_DROPOFF, etc.
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    # Recovery Fields
    recovery_status = Column(String(32), default="Ready", index=True) # Ready, In Progress, Recovered, Pending, Failed
    recovery_probability = Column(Float, default=0.0) # Percentage 0.0 to 100.0
    priority = Column(String(16), default="Medium", index=True) # High, Medium, Low
    recommended_action = Column(String(128), default="Smart Retry")
    attempts_count = Column(Integer, default=0)
    raw_payload = Column(Text, nullable=True) # JSON payload string
