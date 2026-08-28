import datetime
import json
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.action import RecoveryAction
from app.models.audit import AuditLog
from app.agents.recovery_agent import RevenueRecoveryAgent

DEMO_TRANSACTIONS = [
    {
        "transaction_id": "TXN-10294",
        "customer_id": "CUST-9921",
        "customer_name": "Apex Logistics Corp",
        "customer_email": "billing@apexlogistics.in",
        "amount": 75000.0,
        "currency": "INR",
        "payment_method": "UPI",
        "gateway": "Razorpay",
        "status": "failed",
        "failure_reason": "UPI_TIMEOUT",
        "recovery_status": "Ready",
        "recovery_probability": 96.0,
        "priority": "High",
        "recommended_action": "Smart UPI Rail Reroute",
        "attempts_count": 1
    },
    {
        "transaction_id": "TXN-10281",
        "customer_id": "CUST-8812",
        "customer_name": "Dr. Siddharth Sen",
        "customer_email": "siddharth.sen@medclinic.org",
        "amount": 42000.0,
        "currency": "INR",
        "payment_method": "Card",
        "gateway": "HDFC Gateway",
        "status": "recovered",
        "failure_reason": "CARD_3DS_DROPOFF",
        "recovery_status": "Recovered",
        "recovery_probability": 89.0,
        "priority": "Medium",
        "recommended_action": "Network Token Retry",
        "attempts_count": 2
    },
    {
        "transaction_id": "TXN-10267",
        "customer_id": "CUST-7719",
        "customer_name": "Kavita Rao Design",
        "customer_email": "accounts@kavitarao.com",
        "amount": 18500.0,
        "currency": "INR",
        "payment_method": "UPI",
        "gateway": "PayU",
        "status": "failed",
        "failure_reason": "CHECKOUT_ABANDONED",
        "recovery_status": "Pending",
        "recovery_probability": 92.0,
        "priority": "High",
        "recommended_action": "WhatsApp 1-Click Payment Link",
        "attempts_count": 0
    },
    {
        "transaction_id": "TXN-10255",
        "customer_id": "CUST-6628",
        "customer_name": "HyperScale Media",
        "customer_email": "finance@hyperscale.io",
        "amount": 92000.0,
        "currency": "INR",
        "payment_method": "Card",
        "gateway": "Axis Merchant",
        "status": "failed",
        "failure_reason": "3DS_OTP_EXPIRED",
        "recovery_status": "Ready",
        "recovery_probability": 94.0,
        "priority": "High",
        "recommended_action": "Frictionless OTP Assisted",
        "attempts_count": 1
    },
    {
        "transaction_id": "TXN-10242",
        "customer_id": "CUST-5510",
        "customer_name": "Tanya Verma",
        "customer_email": "tanya.v@gmail.com",
        "amount": 28400.0,
        "currency": "INR",
        "payment_method": "UPI",
        "gateway": "Paytm Bank",
        "status": "failed",
        "failure_reason": "INSUFFICIENT_FUNDS",
        "recovery_status": "Pending",
        "recovery_probability": 78.0,
        "priority": "Low",
        "recommended_action": "Salary-cycle delayed retry",
        "attempts_count": 0
    },
    {
        "transaction_id": "TXN-10239",
        "customer_id": "CUST-4419",
        "customer_name": "Zenith Software LLP",
        "customer_email": "pay@zenithsoft.in",
        "amount": 56100.0,
        "currency": "INR",
        "payment_method": "NetBanking",
        "gateway": "HDFC NetBanking",
        "status": "recovered",
        "failure_reason": "BANK_SERVER_DOWN",
        "recovery_status": "Recovered",
        "recovery_probability": 91.0,
        "priority": "Medium",
        "recommended_action": "Virtual Account IMPS/NEFT",
        "attempts_count": 1
    },
    {
        "transaction_id": "TXN-10220",
        "customer_id": "CUST-3318",
        "customer_name": "Arjun Singhal",
        "customer_email": "arjun.singhal@rediff.com",
        "amount": 63200.0,
        "currency": "INR",
        "payment_method": "Card",
        "gateway": "Juspay",
        "status": "failed",
        "failure_reason": "GATEWAY_TIMEOUT",
        "recovery_status": "Ready",
        "recovery_probability": 95.0,
        "priority": "High",
        "recommended_action": "Failover Acquirer Switch",
        "attempts_count": 1
    },
    {
        "transaction_id": "TXN-10204",
        "customer_id": "CUST-2217",
        "customer_name": "Kunal Mehra",
        "customer_email": "kunal.mehra@outlook.com",
        "amount": 12000.0,
        "currency": "INR",
        "payment_method": "UPI",
        "gateway": "SBI Gateway",
        "status": "failed",
        "failure_reason": "MAX_RETRIES_EXCEEDED",
        "recovery_status": "Failed",
        "recovery_probability": 30.0,
        "priority": "Low",
        "recommended_action": "Customer Support Escalation",
        "attempts_count": 4
    },
    {
        "transaction_id": "TXN-10192",
        "customer_id": "CUST-1104",
        "customer_name": "CloudSphere India",
        "customer_email": "devops@cloudsphere.in",
        "amount": 24999.0,
        "currency": "INR",
        "payment_method": "Mandate",
        "gateway": "Razorpay Mandates",
        "status": "recovered",
        "failure_reason": "MANDATE_EXPIRED",
        "recovery_status": "Recovered",
        "recovery_probability": 88.0,
        "priority": "Medium",
        "recommended_action": "Secondary Card Sweep",
        "attempts_count": 2
    }
]

DEMO_ACTIONS = [
    {
        "action_id": "pb-1",
        "title": "Instant UPI Rail Failover",
        "description": "Automatically reroutes failing UPI VPAs to alternate high-uptime banking switches during bank downtime spikes.",
        "channel": "Gateway Protocol",
        "trigger_rule": "UPI Latency > 350ms or Error U30",
        "status": "Active",
        "success_rate": 78.4,
        "total_salvaged": 2480000.0,
        "dispatched_count": 1420
    },
    {
        "action_id": "pb-2",
        "title": "WhatsApp 1-Click Payment Link",
        "description": "Sends personalized verified WhatsApp interactive message with instant pre-filled UPI Intent links within 4 minutes of abandonment.",
        "channel": "WhatsApp Business API",
        "trigger_rule": "Checkout Abandonment > ₹5,000",
        "status": "Active",
        "success_rate": 64.2,
        "total_salvaged": 1820000.0,
        "dispatched_count": 890
    },
    {
        "action_id": "pb-3",
        "title": "Network Token Secondary Retry",
        "description": "Executes cryptographic token retries on Visa/Mastercard secondary acquirers when 3DS drop-off occurs on primary gateway.",
        "channel": "Card Network Tokenization",
        "trigger_rule": "Card 3DS Drop or Issuer Glitch",
        "status": "Active",
        "success_rate": 59.1,
        "total_salvaged": 1460000.0,
        "dispatched_count": 630
    },
    {
        "action_id": "pb-4",
        "title": "Subscription Mandate Smart Sweep",
        "description": "Predictive automated retry schedule that sweeps mandate debits at optimal bank balance intervals.",
        "channel": "e-Mandate / NACH",
        "trigger_rule": "Mandate Debit Failure",
        "status": "Active",
        "success_rate": 52.8,
        "total_salvaged": 940000.0,
        "dispatched_count": 410
    },
    {
        "action_id": "pb-5",
        "title": "VIP Enterprise Custom Concierge",
        "description": "High-value enterprise transactions (> ₹50,000) are flagged with automated dedicated virtual accounts and direct rep notification.",
        "channel": "CRM & Concierge",
        "trigger_rule": "Transaction Value >= ₹50,000",
        "status": "Active",
        "success_rate": 88.9,
        "total_salvaged": 3810000.0,
        "dispatched_count": 115
    }
]

DEMO_AUDIT_LOGS = [
    {
        "log_id": "LOG-882194",
        "actor": "AI Autonomous Agent",
        "actor_type": "agent",
        "action": "REROUTE_TRANSACTION_RAIL",
        "target": "TXN-10294 (₹75,000)",
        "reasoning": "SBI rail latency surged to 820ms (>350ms threshold). Auto-switched to ICICI Rail with 96% confidence.",
        "integrity_hash": "0x8f3c9e12a4b89d71c2",
        "status": "Verified"
    },
    {
        "log_id": "LOG-882193",
        "actor": "AI Autonomous Agent",
        "actor_type": "agent",
        "action": "NETWORK_TOKEN_RETRY",
        "target": "TXN-10281 (₹42,000)",
        "reasoning": "Card 3DS drop-off detected. Dispatched cryptographic network token retry via Visa secondary gateway.",
        "integrity_hash": "0x3e71d9a2b84c10ef89",
        "status": "Verified"
    },
    {
        "log_id": "LOG-882192",
        "actor": "Isiri (Admin)",
        "actor_type": "human",
        "action": "SAFETY_LIMIT_ADJUSTED",
        "target": "Global Policy",
        "reasoning": "Adjusted max autonomous threshold from ₹75,000 to ₹1,00,000 for peak festive season throughput.",
        "integrity_hash": "0x91d84e2a1b7c33fe44",
        "status": "Verified"
    },
    {
        "log_id": "LOG-882191",
        "actor": "System Rule Engine",
        "actor_type": "system",
        "action": "ANOMALY_TRIGGERED",
        "target": "SBI UPI Rail",
        "reasoning": "Failure rate exceeded 12% in Delhi NCR circle. Alert dispatched to merchant dashboard and PagerDuty.",
        "integrity_hash": "0x12b49c7e3f8801ad99",
        "status": "Verified"
    },
    {
        "log_id": "LOG-882190",
        "actor": "AI Autonomous Agent",
        "actor_type": "agent",
        "action": "VIRTUAL_ACCOUNT_DISPATCH",
        "target": "TXN-10239 (₹56,100)",
        "reasoning": "HDFC NetBanking core server downtime. Generated dynamic IMPS/NEFT virtual account link for merchant.",
        "integrity_hash": "0x77c28a11e4f901cb33",
        "status": "Verified"
    }
]

def seed_demo_data(db: Session):
    """Seeds initial demo data if database is empty"""
    if db.query(Transaction).count() == 0:
        for t_data in DEMO_TRANSACTIONS:
            db.add(Transaction(**t_data))
        db.commit()

    if db.query(RecoveryAction).count() == 0:
        for a_data in DEMO_ACTIONS:
            db.add(RecoveryAction(**a_data))
        db.commit()

    if db.query(AuditLog).count() == 0:
        for l_data in DEMO_AUDIT_LOGS:
            db.add(AuditLog(**l_data))
        db.commit()
