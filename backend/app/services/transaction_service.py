import json
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.transaction import Transaction
from ..schemas.transaction import TransactionCreate, TransactionUpdate
from ..agents.recovery_agent import RevenueRecoveryAgent

class TransactionService:
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        risk: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Transaction]:
        query = db.query(Transaction)
        if status and status != "all":
            query = query.filter(Transaction.recovery_status.ilike(f"%{status}%"))
        if risk and risk != "all":
            query = query.filter(Transaction.priority.ilike(f"%{risk}%"))
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Transaction.transaction_id.ilike(search_pattern)) |
                (Transaction.customer_name.ilike(search_pattern)) |
                (Transaction.customer_email.ilike(search_pattern)) |
                (Transaction.failure_reason.ilike(search_pattern)) |
                (Transaction.gateway.ilike(search_pattern))
            )
        return query.order_by(Transaction.timestamp.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, transaction_id: str) -> Optional[Transaction]:
        return db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()

    @staticmethod
    def create(db: Session, data: TransactionCreate) -> Transaction:
        txn_id = data.transaction_id or f"TXN-{uuid.uuid4().hex[:6].upper()}"
        
        # Analyze with AI recovery agent
        analysis = RevenueRecoveryAgent.analyze_transaction(
            amount=data.amount,
            payment_method=data.payment_method,
            failure_reason=data.failure_reason or "GENERIC_FAILURE",
            gateway=data.gateway,
            attempts_count=0,
            transaction_id=txn_id
        )

        txn = Transaction(
            transaction_id=txn_id,
            customer_id=data.customer_id,
            customer_name=data.customer_name,
            customer_email=data.customer_email,
            merchant_id=data.merchant_id,
            amount=data.amount,
            currency=data.currency,
            payment_method=data.payment_method,
            gateway=data.gateway,
            status=data.status,
            failure_reason=data.failure_reason,
            recovery_status="Ready" if data.status == "failed" else "Completed",
            recovery_probability=analysis["recovery_probability"],
            priority=analysis["priority"],
            recommended_action=analysis["recommended_action"],
            attempts_count=0,
            raw_payload=data.raw_payload or json.dumps(analysis)
        )
        db.add(txn)
        db.commit()
        db.refresh(txn)
        return txn

    @staticmethod
    def update(db: Session, transaction_id: str, data: TransactionUpdate) -> Optional[Transaction]:
        txn = TransactionService.get_by_id(db, transaction_id)
        if not txn:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(txn, key, value)
        
        db.commit()
        db.refresh(txn)
        return txn

    @staticmethod
    def delete(db: Session, transaction_id: str) -> bool:
        txn = TransactionService.get_by_id(db, transaction_id)
        if not txn:
            return False
        db.delete(txn)
        db.commit()
        return True
