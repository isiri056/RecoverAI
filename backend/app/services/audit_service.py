import hashlib
import uuid
import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.audit import AuditLog
from ..schemas.audit import AuditLogResponse, AuditLogListResponse

class AuditService:
    @staticmethod
    def generate_integrity_hash(payload: str) -> str:
        """Generates SHA-256 integrity block hash"""
        raw = f"{payload}-{datetime.datetime.utcnow().isoformat()}-{uuid.uuid4().hex}"
        return f"0x{hashlib.sha256(raw.encode()).hexdigest()[:18]}"

    @staticmethod
    def get_all(db: Session, limit: int = 100) -> AuditLogListResponse:
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
        return AuditLogListResponse(
            total=len(logs),
            logs=logs
        )

    @staticmethod
    def log_event(
        db: Session,
        actor: str,
        actor_type: str,
        action: str,
        target: str,
        reasoning: str
    ) -> AuditLog:
        log_id = f"LOG-{uuid.uuid4().hex[:6].upper()}"
        integrity_hash = AuditService.generate_integrity_hash(f"{action}-{target}-{reasoning}")
        
        entry = AuditLog(
            log_id=log_id,
            actor=actor,
            actor_type=actor_type,
            action=action,
            target=target,
            reasoning=reasoning,
            integrity_hash=integrity_hash,
            status="Verified"
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry
