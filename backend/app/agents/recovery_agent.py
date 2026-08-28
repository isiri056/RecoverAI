"""
RecoverAI Deterministic Revenue Recovery Agent Engine

Implements transparent, explainable financial recovery heuristics:
- Failure classification & transient vs permanent error discernment
- Algorithmic recovery probability calculation
- Risk level classification (High / Medium / Low)
- Priority scoring & opportunity ranking
- Explainable recovery action prescription
"""

from typing import Dict, Any, Tuple

class RevenueRecoveryAgent:
    """
    Autonomous Payment & Revenue Recovery Agent
    """

    FAILURE_RULES: Dict[str, Dict[str, Any]] = {
        "UPI_TIMEOUT": {
            "base_probability": 96.0,
            "is_transient": True,
            "action": "Smart UPI Rail Reroute",
            "strategy": "Reroute VPA handle to high-uptime alternate bank switch (ICICI/Axis)",
            "rationale_template": "UPI handshake timed out on primary rail ({gateway}). Transient bank switch congestion detected."
        },
        "UPI_U30_TIMEOUT": {
            "base_probability": 94.0,
            "is_transient": True,
            "action": "Smart UPI Rail Reroute",
            "strategy": "Dynamic PSP Switch & instant intent retry link",
            "rationale_template": "NPCI/Acquirer U30 timeout on {gateway}. Secondary acquirer routing recommended."
        },
        "CARD_3DS_DROPOFF": {
            "base_probability": 89.0,
            "is_transient": True,
            "action": "Network Token Retry",
            "strategy": "Cryptographic Visa/Mastercard network token fallback via secondary gateway",
            "rationale_template": "User dropped out during 3D-Secure challenge on {gateway}. Network tokenization retry is viable."
        },
        "3DS_OTP_EXPIRED": {
            "base_probability": 92.0,
            "is_transient": True,
            "action": "Frictionless OTP Assisted",
            "strategy": "Seamless OTP auto-read assisted checkout session",
            "rationale_template": "Customer OTP expired on {gateway}. Re-prompting with in-app assisted modal."
        },
        "CHECKOUT_ABANDONED": {
            "base_probability": 91.0,
            "is_transient": True,
            "action": "WhatsApp 1-Click Payment Link",
            "strategy": "Personalized verified WhatsApp checkout link with localized instant payment options",
            "rationale_template": "User exited funnel at payment method selection. Intent remains high; WhatsApp salvage prescribed."
        },
        "BANK_SERVER_DOWN": {
            "base_probability": 90.0,
            "is_transient": True,
            "action": "Virtual Account IMPS/NEFT",
            "strategy": "Dynamic IMPS virtual account generation for immediate offline bank transfer",
            "rationale_template": "Core NetBanking portal down on {gateway}. Automated virtual account dispatch prescribed."
        },
        "GATEWAY_TIMEOUT": {
            "base_probability": 93.0,
            "is_transient": True,
            "action": "Failover Acquirer Switch",
            "strategy": "Automatic failover to secondary acquirer with zero customer friction",
            "rationale_template": "Acquirer {gateway} failed to return handshake within 5000ms. Failover initiated."
        },
        "MANDATE_EXPIRED": {
            "base_probability": 86.0,
            "is_transient": True,
            "action": "Secondary Card Sweep",
            "strategy": "Automatic billing fallback to merchant's registered backup payment token",
            "rationale_template": "Recurring subscription debit failed. Secondary saved card sweep initiated."
        },
        "INSUFFICIENT_FUNDS": {
            "base_probability": 72.0,
            "is_transient": False,
            "action": "Salary-cycle delayed retry",
            "strategy": "Schedule automatic re-attempt at month-end salary payout window",
            "rationale_template": "Account balance low. Scheduling retry for upcoming liquidity window."
        },
        "MAX_RETRIES_EXCEEDED": {
            "base_probability": 30.0,
            "is_transient": False,
            "action": "Customer Support Escalation",
            "strategy": "Flag transaction to merchant payment ops CRM for high-touch intervention",
            "rationale_template": "Gateway retry ceiling reached. Autonomous retries halted to prevent issuer blocks."
        },
        "HARD_DECLINE": {
            "base_probability": 20.0,
            "is_transient": False,
            "action": "Card Re-entry Request",
            "strategy": "Notify customer of permanent card block and prompt alternate payment method",
            "rationale_template": "Card issuer returned permanent decline. Alternate payment method required."
        }
    }

    @classmethod
    def analyze_transaction(
        cls,
        amount: float,
        payment_method: str,
        failure_reason: str,
        gateway: str = "Razorpay",
        attempts_count: int = 0,
        transaction_id: str = None
    ) -> Dict[str, Any]:
        """
        Executes deterministic analysis for a transaction and produces actionable recovery recommendations.
        """
        norm_reason = (failure_reason or "").upper().strip().replace(" ", "_")
        
        # Match failure rule or fallback to generic transient retry
        rule = cls.FAILURE_RULES.get(norm_reason)
        if not rule:
            # Fuzzy fallback based on keyword match
            if "UPI" in norm_reason or "TIMEOUT" in norm_reason:
                rule = cls.FAILURE_RULES["UPI_TIMEOUT"]
            elif "CARD" in norm_reason or "3DS" in norm_reason:
                rule = cls.FAILURE_RULES["CARD_3DS_DROPOFF"]
            elif "ABANDON" in norm_reason:
                rule = cls.FAILURE_RULES["CHECKOUT_ABANDONED"]
            elif "BALANCE" in norm_reason or "FUNDS" in norm_reason:
                rule = cls.FAILURE_RULES["INSUFFICIENT_FUNDS"]
            elif "MANDATE" in norm_reason:
                rule = cls.FAILURE_RULES["MANDATE_EXPIRED"]
            else:
                rule = {
                    "base_probability": 80.0,
                    "is_transient": True,
                    "action": "Smart Retry Protocol",
                    "strategy": "Automated exponential backoff retry",
                    "rationale_template": "Unspecified failure on {gateway}. Smart backoff retry queued."
                }

        # Calculate adjusted probability: penalize multiple failed attempts
        base_prob = rule["base_probability"]
        penalty = min(attempts_count * 8.0, 40.0)
        final_probability = max(round(base_prob - penalty, 1), 10.0)

        # Risk and Priority Classification
        # High-value transactions (> ₹50,000) or high feasibility = High Risk/Priority
        if amount >= 50000.0 or (rule["is_transient"] and amount >= 25000.0):
            risk_level = "High"
            priority = "High"
        elif amount >= 15000.0 or rule["is_transient"]:
            risk_level = "Medium"
            priority = "Medium"
        else:
            risk_level = "Low"
            priority = "Low"

        # Estimated recoverable revenue (Amount * Probability)
        estimated_salvageable = round(amount * (final_probability / 100.0), 2)
        
        # Auto-executable if within standard safety limit (<= ₹1,00,000) and probability >= 75%
        auto_executable = (amount <= 100000.0) and (final_probability >= 75.0)

        rationale = rule["rationale_template"].format(gateway=gateway)

        return {
            "transaction_id": transaction_id,
            "recovery_probability": final_probability,
            "risk_level": risk_level,
            "priority": priority,
            "recommended_action": rule["action"],
            "action_strategy": rule["strategy"],
            "explainability_rationale": rationale,
            "estimated_salvageable_amount": estimated_salvageable,
            "auto_executable": auto_executable
        }

    @classmethod
    def calculate_priority_score(cls, amount: float, probability: float, is_high_value: bool = False) -> float:
        """
        Calculates a numerical priority score for sorting the intervention queue.
        Priority Score = (Amount * 0.5) + (Probability * 400)
        """
        score = (amount * 0.5) + (probability * 400.0)
        if is_high_value:
            score += 10000.0
        return round(score, 2)
