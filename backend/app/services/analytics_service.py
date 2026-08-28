from typing import List, Dict, Any
from ..schemas.analytics import (
    AnalyticsOverviewResponse,
    RevenuePulseResponse,
    RecoveryRateResponse,
    PulsePoint,
    GatewayBenchmark,
    ChannelAttributionItem
)

class AnalyticsService:
    @staticmethod
    def get_overview() -> AnalyticsOverviewResponse:
        return AnalyticsOverviewResponse(
            total_preserved_revenue=4820000.0,
            total_preserved_formatted="₹48.2L",
            churn_prevented_rate=18.4,
            roi_multiplier="14.2x",
            salvaged_count=1284,
            gateways=[
                GatewayBenchmark(gateway="Juspay", recoveredRate=74.2, avgLatency=110),
                GatewayBenchmark(gateway="Razorpay", recoveredRate=71.8, avgLatency=145),
                GatewayBenchmark(gateway="ICICI Direct", recoveredRate=68.4, avgLatency=160),
                GatewayBenchmark(gateway="PayU", recoveredRate=64.1, avgLatency=180),
                GatewayBenchmark(gateway="HDFC Direct", recoveredRate=58.2, avgLatency=290),
                GatewayBenchmark(gateway="SBI Direct", recoveredRate=48.6, avgLatency=410),
            ],
            channels=[
                ChannelAttributionItem(channel="UPI Rail Rerouting", percentage=42.0, revenue="₹20.2L", color="#8B5CF6"),
                ChannelAttributionItem(channel="WhatsApp 1-Click Pay", percentage=28.0, revenue="₹13.5L", color="#10B981"),
                ChannelAttributionItem(channel="Network Token Retry", percentage=18.0, revenue="₹8.7L", color="#06B6D4"),
                ChannelAttributionItem(channel="Mandate Smart Sweep", percentage=12.0, revenue="₹5.8L", color="#F59E0B"),
            ]
        )

    @staticmethod
    def get_revenue_pulse(interval: str = "24h") -> RevenuePulseResponse:
        if interval == "7d":
            points = [
                PulsePoint(time="Mon", atRisk=112.4, recoverable=78.1, recovered=44.5),
                PulsePoint(time="Tue", atRisk=128.6, recoverable=84.2, recovered=51.0),
                PulsePoint(time="Wed", atRisk=135.2, recoverable=91.5, recovered=58.4),
                PulsePoint(time="Thu", atRisk=119.8, recoverable=79.4, recovered=52.8),
                PulsePoint(time="Fri", atRisk=146.5, recoverable=102.1, recovered=67.3),
                PulsePoint(time="Sat", atRisk=162.0, recoverable=115.4, recovered=74.9),
                PulsePoint(time="Sun", atRisk=138.4, recoverable=94.8, recovered=62.1),
            ]
        elif interval == "30d":
            points = [
                PulsePoint(time="Week 1", atRisk=480.2, recoverable=320.5, recovered=192.4),
                PulsePoint(time="Week 2", atRisk=520.6, recoverable=355.0, recovered=228.1),
                PulsePoint(time="Week 3", atRisk=495.3, recoverable=340.2, recovered=214.8),
                PulsePoint(time="Week 4", atRisk=470.8, recoverable=332.9, recovered=225.6),
            ]
        else: # 24h
            points = [
                PulsePoint(time="00:00", atRisk=14.2, recoverable=9.4, recovered=3.1),
                PulsePoint(time="02:00", atRisk=12.8, recoverable=8.2, recovered=3.8),
                PulsePoint(time="04:00", atRisk=9.6, recoverable=6.5, recovered=4.2),
                PulsePoint(time="06:00", atRisk=11.4, recoverable=7.8, recovered=4.9),
                PulsePoint(time="08:00", atRisk=15.6, recoverable=10.2, recovered=5.4),
                PulsePoint(time="10:00", atRisk=22.4, recoverable=14.8, recovered=6.2),
                PulsePoint(time="12:00", atRisk=26.1, recoverable=17.5, recovered=7.9),
                PulsePoint(time="14:00", atRisk=24.3, recoverable=16.1, recovered=8.5),
                PulsePoint(time="16:00", atRisk=21.7, recoverable=13.9, recovered=9.4),
                PulsePoint(time="18:00", atRisk=23.9, recoverable=15.4, recovered=10.2),
                PulsePoint(time="20:00", atRisk=19.8, recoverable=12.7, recovered=9.8),
                PulsePoint(time="22:00", atRisk=18.4, recoverable=11.8, recovered=7.2),
            ]
        return RevenuePulseResponse(interval=interval, data=points)

    @staticmethod
    def get_recovery_rate() -> RecoveryRateResponse:
        return RecoveryRateResponse(
            current_recovery_rate=61.3,
            target_rate=60.0,
            trailing_7_days_change="+4.2pp vs last week",
            status="Exceeding Target"
        )
