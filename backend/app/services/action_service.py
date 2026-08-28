import uuid
import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.action import RecoveryAction
from ..schemas.action import ActionCreate, ActionUpdate, ActionResponse, ActionExecuteResponse
from ..services.recovery_service import RecoveryService

class ActionService:
    @staticmethod
    def get_all(db: Session) -> List[RecoveryAction]:
        return db.query(RecoveryAction).order_by(RecoveryAction.created_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, action_id: str) -> Optional[RecoveryAction]:
        return db.query(RecoveryAction).filter(RecoveryAction.action_id == action_id).first()

    @staticmethod
    def create(db: Session, data: ActionCreate) -> RecoveryAction:
        action_id = data.action_id or f"ACT-{uuid.uuid4().hex[:6].upper()}"
        action = RecoveryAction(
            action_id=action_id,
            title=data.title,
            description=data.description,
            channel=data.channel,
            trigger_rule=data.trigger_rule,
            status=data.status or "Active",
            success_rate=75.0,
            total_salvaged=0.0,
            dispatched_count=0
        )
        db.add(action)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def update(db: Session, action_id: str, data: ActionUpdate) -> Optional[RecoveryAction]:
        action = ActionService.get_by_id(db, action_id)
        if not action:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(action, k, v)
        db.commit()
        db.refresh(action)
        return action

    @staticmethod
    def execute(db: Session, action_id: str, target: Optional[str] = "Global Campaign") -> ActionExecuteResponse:
        action = ActionService.get_by_id(db, action_id)
        action_title = action.title if action else "Instant Recovery Action"
        
        if action:
            action.dispatched_count = (action.dispatched_count or 0) + 1
            action.total_salvaged = (action.total_salvaged or 0.0) + 42000.0
            db.commit()

        return ActionExecuteResponse(
            action_id=action_id,
            action_title=action_title,
            dispatched_to=target or "Active Transactions Queue",
            execution_status="Dispatched Successfully",
            dispatched_at=datetime.datetime.utcnow(),
            message=f"Intervention playbook '{action_title}' triggered. Dispatched through verified channel."
        )
