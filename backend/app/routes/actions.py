from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.action import (
    ActionCreate,
    ActionUpdate,
    ActionResponse,
    ActionExecuteResponse
)
from ..services.action_service import ActionService
from ..services.recovery_service import RecoveryService
from ..services.audit_service import AuditService

router = APIRouter(prefix="/actions", tags=["Recovery Actions"])

@router.get("", response_model=List[ActionResponse])
def list_actions(db: Session = Depends(get_db)):
    """Retrieve all recovery playbooks & campaigns"""
    actions = ActionService.get_all(db)
    results = []
    for a in actions:
        results.append(ActionResponse(
            action_id=a.action_id,
            title=a.title,
            description=a.description,
            channel=a.channel,
            trigger_rule=a.trigger_rule,
            status=a.status,
            success_rate=a.success_rate or 0.0,
            total_salvaged=a.total_salvaged or 0.0,
            total_salvaged_formatted=RecoveryService.format_currency_inr(a.total_salvaged or 0.0),
            dispatched_count=a.dispatched_count or 0,
            created_at=a.created_at,
            updated_at=a.updated_at
        ))
    return results

@router.post("", response_model=ActionResponse, status_code=status.HTTP_201_CREATED)
def create_action(data: ActionCreate, db: Session = Depends(get_db)):
    """Create a new automated recovery playbook"""
    action = ActionService.create(db, data)
    AuditService.log_event(
        db=db,
        actor="Isiri (Admin)",
        actor_type="human",
        action="PLAYBOOK_CREATED",
        target=action.action_id,
        reasoning=f"Created recovery playbook '{action.title}' on channel {action.channel}."
    )
    return ActionResponse(
        action_id=action.action_id,
        title=action.title,
        description=action.description,
        channel=action.channel,
        trigger_rule=action.trigger_rule,
        status=action.status,
        success_rate=action.success_rate,
        total_salvaged=action.total_salvaged,
        total_salvaged_formatted=RecoveryService.format_currency_inr(action.total_salvaged),
        dispatched_count=action.dispatched_count,
        created_at=action.created_at,
        updated_at=action.updated_at
    )

@router.put("/{action_id}", response_model=ActionResponse)
def update_action(action_id: str, data: ActionUpdate, db: Session = Depends(get_db)):
    """Update playbook configuration or status"""
    action = ActionService.update(db, action_id, data)
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Action {action_id} not found")
    AuditService.log_event(
        db=db,
        actor="Isiri (Admin)",
        actor_type="human",
        action="PLAYBOOK_UPDATED",
        target=action_id,
        reasoning=f"Updated playbook status to '{action.status}'."
    )
    return ActionResponse(
        action_id=action.action_id,
        title=action.title,
        description=action.description,
        channel=action.channel,
        trigger_rule=action.trigger_rule,
        status=action.status,
        success_rate=action.success_rate,
        total_salvaged=action.total_salvaged,
        total_salvaged_formatted=RecoveryService.format_currency_inr(action.total_salvaged),
        dispatched_count=action.dispatched_count,
        created_at=action.created_at,
        updated_at=action.updated_at
    )

@router.post("/{action_id}/execute", response_model=ActionExecuteResponse)
def execute_action(action_id: str, target: Optional[str] = None, db: Session = Depends(get_db)):
    """Execute a recovery playbook intervention"""
    res = ActionService.execute(db, action_id, target=target)
    AuditService.log_event(
        db=db,
        actor="AI Autonomous Agent",
        actor_type="agent",
        action="PLAYBOOK_EXECUTED",
        target=action_id,
        reasoning=f"Executed playbook '{res.action_title}' on target {res.dispatched_to}."
    )
    return res
