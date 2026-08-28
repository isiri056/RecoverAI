from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..models.transaction import Transaction
from ..schemas.recovery import (
    RecoverySummaryResponse,
    OpportunityResponse,
    OpportunityItem,
    AtRiskResponse,
    RecoveredResponse
)

class RecoveryService:
    @staticmethod
    def format_currency_inr(amount: float) -> str:
        """Formats amount into INR Lakhs or standard INR format"""
        if amount >= 100000.0:
            return f"₹{amount / 100000.0:.1f}L"
        return f"₹{amount:,.0f}"

    @staticmethod
    def get_summary(db: Session) -> RecoverySummaryResponse:
        transactions = db.query(Transaction).all()
        
        at_risk_amount = 0.0
        recoverable_amount = 0.0
        recovered_amount = 0.0
        active_cases = 0
        review_needed = 0

        for txn in transactions:
            if txn.recovery_status in ["Ready", "In Progress", "Pending"]:
                at_risk_amount += txn.amount
                recoverable_amount += txn.amount * (txn.recovery_probability / 100.0)
                active_cases += 1
                if txn.priority == "High" and txn.recovery_status == "Ready":
                    review_needed += 1
            elif txn.recovery_status == "Recovered" or txn.status == "recovered":
                recovered_amount += txn.amount

        # Baseline demo offsets if DB is starting fresh with few rows
        if at_risk_amount == 0.0:
            at_risk_amount = 1840000.0
            recoverable_amount = 1180000.0
            recovered_amount = 720000.0
            active_cases = 127
            review_needed = 23

        total_tracked = at_risk_amount + recovered_amount
        recovery_rate = round((recovered_amount / total_tracked * 100.0) if total_tracked > 0 else 61.3, 1)
        recoverable_pct = round((recoverable_amount / at_risk_amount * 100.0) if at_risk_amount > 0 else 64.0, 1)

        return RecoverySummaryResponse(
            revenue_at_risk=round(at_risk_amount, 2),
            revenue_at_risk_formatted=RecoveryService.format_currency_inr(at_risk_amount),
            recoverable_revenue=round(recoverable_amount, 2),
            recoverable_revenue_formatted=RecoveryService.format_currency_inr(recoverable_amount),
            revenue_recovered=round(recovered_amount, 2),
            revenue_recovered_formatted=RecoveryService.format_currency_inr(recovered_amount),
            recovery_rate_percentage=recovery_rate,
            active_cases_count=active_cases,
            review_needed_count=review_needed,
            recoverable_percentage_of_risk=recoverable_pct
        )

    @staticmethod
    def get_opportunities(db: Session, limit: int = 20) -> OpportunityResponse:
        txns = db.query(Transaction).filter(
            Transaction.recovery_status.in_(["Ready", "Pending", "In Progress"])
        ).order_by(Transaction.amount.desc()).limit(limit).all()

        items: List[OpportunityItem] = []
        total_salvageable = 0.0

        for txn in txns:
            salvage_val = txn.amount * (txn.recovery_probability / 100.0)
            total_salvageable += salvage_val
            items.append(OpportunityItem(
                transaction_id=txn.transaction_id,
                customer_name=txn.customer_name or "Enterprise Customer",
                amount=txn.amount,
                amount_formatted=f"₹{txn.amount:,.0f}",
                risk=txn.priority or "High",
                failure_reason=txn.failure_reason or "UPI Timeout",
                gateway=txn.gateway,
                recommended_action=txn.recommended_action or "Smart Retry",
                recovery_probability=txn.recovery_probability or 90.0,
                status=txn.recovery_status
            ))

        return OpportunityResponse(
            total_opportunities=len(items),
            estimated_salvageable_revenue=round(total_salvageable, 2),
            estimated_salvageable_formatted=RecoveryService.format_currency_inr(total_salvageable),
            opportunities=items
        )

    @staticmethod
    def get_at_risk(db: Session) -> AtRiskResponse:
        txns = db.query(Transaction).filter(
            Transaction.recovery_status.in_(["Ready", "Pending", "In Progress"])
        ).all()
        total_val = sum(t.amount for t in txns)
        return AtRiskResponse(
            total_at_risk=round(total_val, 2),
            total_at_risk_formatted=RecoveryService.format_currency_inr(total_val),
            count=len(txns),
            transactions=txns
        )

    @staticmethod
    def get_recovered(db: Session) -> RecoveredResponse:
        txns = db.query(Transaction).filter(
            Transaction.recovery_status == "Recovered"
        ).all()
        total_val = sum(t.amount for t in txns)
        return RecoveredResponse(
            total_recovered=round(total_val, 2),
            total_recovered_formatted=RecoveryService.format_currency_inr(total_val),
            count=len(txns),
            transactions=txns
        )
