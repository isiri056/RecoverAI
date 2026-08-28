import datetime
from sqlalchemy import Column, String, DateTime, Text
from ..database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    actor = Column(String(128), nullable=False) # AI Autonomous Agent, Isiri (Admin), System Rule Engine
    actor_type = Column(String(32), default="agent") # agent, human, system
    action = Column(String(128), nullable=False)
    target = Column(String(128), nullable=False) # e.g. TXN-10294, Global Policy
    reasoning = Column(Text, nullable=False)
    integrity_hash = Column(String(128), nullable=False) # SHA-256 hash string
    status = Column(String(32), default="Verified")
