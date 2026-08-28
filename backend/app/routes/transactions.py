from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionListResponse
)
from ..services.transaction_service import TransactionService
from ..services.audit_service import AuditService

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=TransactionListResponse)
def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve filtered list of merchant transactions"""
    txns = TransactionService.get_all(db, skip=skip, limit=limit, status=status, risk=risk, search=search)
    return TransactionListResponse(total=len(txns), transactions=txns)

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    """Retrieve single transaction by ID"""
    txn = TransactionService.get_by_id(db, transaction_id)
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Transaction {transaction_id} not found")
    return txn

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new transaction and automatically trigger AI Recovery Agent evaluation"""
    txn = TransactionService.create(db, data)
    AuditService.log_event(
        db=db,
        actor="System Ingestion",
        actor_type="system",
        action="TRANSACTION_INGESTED",
        target=txn.transaction_id,
        reasoning=f"Ingested {txn.amount} INR transaction via {txn.gateway}. Status: {txn.status}. Evaluated recovery strategy."
    )
    return txn

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: str, data: TransactionUpdate, db: Session = Depends(get_db)):
    """Update transaction recovery status or details"""
    txn = TransactionService.update(db, transaction_id, data)
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Transaction {transaction_id} not found")
    AuditService.log_event(
        db=db,
        actor="Merchant Admin / Agent",
        actor_type="human",
        action="TRANSACTION_UPDATED",
        target=transaction_id,
        reasoning=f"Updated recovery status to '{txn.recovery_status}'."
    )
    return txn

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: str, db: Session = Depends(get_db)):
    """Delete transaction record"""
    success = TransactionService.delete(db, transaction_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Transaction {transaction_id} not found")
    return None
