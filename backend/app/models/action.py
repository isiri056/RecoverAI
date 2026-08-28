import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Boolean
from ..database import Base

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    action_id = Column(String(64), primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    channel = Column(String(64), nullable=False) # WhatsApp, Gateway Protocol, Tokenization, Mandate
    trigger_rule = Column(String(256), nullable=False)
    status = Column(String(32), default="Active") # Active, Paused, Archived
    success_rate = Column(Float, default=0.0) # e.g. 78.4%
    total_salvaged = Column(Float, default=0.0) # in INR
    dispatched_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
