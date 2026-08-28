/**
 * RecoverAI Mock / Demo Data Layer
 * Comprehensive realistic fintech data for all 9 modules.
 */

export const merchantInfo = {
  name: "Isiri",
  businessName: "Nexus Retail Group",
  merchantId: "MRC_77209X",
  role: "Lead Payments Ops / Admin",
  email: "isiri.payments@nexusgroup.in",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
};

export const systemHealth = {
  status: "All systems normal",
  apiLatency: "14ms",
  gatewayUptime: "99.98%",
  lastHeartbeat: "Just now",
  isOperational: true,
};

// ----------------------------------------------------
// 1. DASHBOARD / OVERVIEW DATA
// ----------------------------------------------------
export const kpiMetrics = [
  {
    id: "risk",
    title: "Revenue at Risk",
    value: "₹18.4L",
    numericValue: 1840000,
    change: "-12.4%",
    isPositiveTrend: true,
    changeLabel: "vs last week",
    subtext: "284 transactions",
    accentColor: "amber",
    tag: "Priority Risk",
  },
  {
    id: "recoverable",
    title: "Recoverable",
    value: "₹11.8L",
    numericValue: 1180000,
    change: "+8.1%",
    isPositiveTrend: true,
    changeLabel: "vs last week",
    subtext: "64% of at-risk",
    accentColor: "brand",
    tag: "High Feasibility",
  },
  {
    id: "recovered",
    title: "Revenue Recovered",
    value: "₹7.2L",
    numericValue: 720000,
    change: "+19.3%",
    isPositiveTrend: true,
    changeLabel: "vs last week",
    subtext: "Today",
    accentColor: "emerald",
    tag: "Direct Impact",
  },
  {
    id: "rate",
    title: "Recovery Rate",
    value: "61.3%",
    numericValue: 61.3,
    change: "+4.2pp",
    isPositiveTrend: true,
    changeLabel: "vs last week",
    subtext: "Trailing 7 days",
    accentColor: "brand",
    tag: "Target: 60%",
  },
  {
    id: "cases",
    title: "Active Cases",
    value: "127",
    numericValue: 127,
    change: "+23",
    isPositiveTrend: false,
    changeLabel: "in last hour",
    subtext: "23 need review",
    accentColor: "cyan",
    tag: "Live Pipeline",
  },
];

export const aiInsightData = {
  tag: "AI INSIGHT",
  isLive: true,
  headline: "Payment failures increased 18% in the last 6 hours, primarily due to UPI timeout patterns.",
  recommendation: "RecoverAI recommends prioritizing 23 high-value transactions with smart routing switch and immediate WhatsApp reminder sequences.",
  confidence: 94,
  model: "RAG-v2.4",
  updated: "2m ago",
  actionCount: 23,
  actionButtonText: "Review 23 opportunities →",
  breakdown: [
    { label: "UPI Handshake Latency", value: "+340ms (HDFC & SBI rails)" },
    { label: "Estimated Salvageable Revenue", value: "₹4.82L" },
    { label: "Recommended Strategy", value: "Intent-based Smart Switch + 1-click fallback" }
  ]
};

export const pulseChartData = {
  "24h": [
    { time: "00:00", atRisk: 14.2, recoverable: 9.4, recovered: 3.1 },
    { time: "02:00", atRisk: 12.8, recoverable: 8.2, recovered: 3.8 },
    { time: "04:00", atRisk: 9.6, recoverable: 6.5, recovered: 4.2 },
    { time: "06:00", atRisk: 11.4, recoverable: 7.8, recovered: 4.9 },
    { time: "08:00", atRisk: 15.6, recoverable: 10.2, recovered: 5.4 },
    { time: "10:00", atRisk: 22.4, recoverable: 14.8, recovered: 6.2 },
    { time: "12:00", atRisk: 26.1, recoverable: 17.5, recovered: 7.9 },
    { time: "14:00", atRisk: 24.3, recoverable: 16.1, recovered: 8.5 },
    { time: "16:00", atRisk: 21.7, recoverable: 13.9, recovered: 9.4 },
    { time: "18:00", atRisk: 23.9, recoverable: 15.4, recovered: 10.2 },
    { time: "20:00", atRisk: 19.8, recoverable: 12.7, recovered: 9.8 },
    { time: "22:00", atRisk: 18.4, recoverable: 11.8, recovered: 7.2 },
  ],
  "7d": [
    { time: "Mon", atRisk: 112.4, recoverable: 78.1, recovered: 44.5 },
    { time: "Tue", atRisk: 128.6, recoverable: 84.2, recovered: 51.0 },
    { time: "Wed", atRisk: 135.2, recoverable: 91.5, recovered: 58.4 },
    { time: "Thu", atRisk: 119.8, recoverable: 79.4, recovered: 52.8 },
    { time: "Fri", atRisk: 146.5, recoverable: 102.1, recovered: 67.3 },
    { time: "Sat", atRisk: 162.0, recoverable: 115.4, recovered: 74.9 },
    { time: "Sun", atRisk: 138.4, recoverable: 94.8, recovered: 62.1 },
  ],
  "30d": [
    { time: "Week 1", atRisk: 480.2, recoverable: 320.5, recovered: 192.4 },
    { time: "Week 2", atRisk: 520.6, recoverable: 355.0, recovered: 228.1 },
    { time: "Week 3", atRisk: 495.3, recoverable: 340.2, recovered: 214.8 },
    { time: "Week 4", atRisk: 470.8, recoverable: 332.9, recovered: 225.6 },
  ]
};

export const recentActivities = [
  {
    id: "act-1",
    type: "initiated",
    title: "Payment recovery initiated",
    amount: "₹42,000",
    reason: "UPI timeout",
    timeAgo: "2 min ago",
    customer: "Rohan V. (Premium Tier)",
    method: "UPI Auto-Switch Rail",
    status: "processing"
  },
  {
    id: "act-2",
    type: "success",
    title: "Recovery successful",
    amount: "₹18,500",
    reason: "Card retry",
    timeAgo: "8 min ago",
    customer: "Ananya Sharma",
    method: "Smart Token Retry (ICICI)",
    status: "recovered"
  },
  {
    id: "act-3",
    type: "detected",
    title: "High-value transaction detected",
    amount: "₹75,000",
    reason: "Checkout abandonment",
    timeAgo: "14 min ago",
    customer: "Enterprise Tech Labs",
    method: "AI Dynamic Discount Trigger",
    status: "prioritized"
  },
  {
    id: "act-4",
    type: "failed",
    title: "Recovery failed",
    amount: "₹12,000",
    reason: "Bank timeout",
    timeAgo: "21 min ago",
    customer: "Kunal Mehra",
    method: "Exceeded Max Gateway Retries",
    status: "abandoned"
  },
  {
    id: "act-5",
    type: "success",
    title: "Subscription salvaged",
    amount: "₹24,999",
    reason: "Mandate failure",
    timeAgo: "32 min ago",
    customer: "CloudSphere India",
    method: "e-Mandate Secondary Card Fallback",
    status: "recovered"
  },
  {
    id: "act-6",
    type: "initiated",
    title: "Interactive recovery sent",
    amount: "₹31,400",
    reason: "3D-Secure drop-off",
    timeAgo: "45 min ago",
    customer: "Vikram Malhotra",
    method: "WhatsApp 1-Click Pay Link",
    status: "processing"
  }
];

export const recoveryOpportunities = [
  {
    id: "TXN-10294",
    customer: "Apex Logistics Corp",
    amount: "₹75,000",
    numericAmount: 75000,
    risk: "High",
    failureReason: "UPI timeout",
    gateway: "Razorpay / SBI Rail",
    recommendedAction: "Retry payment",
    actionStrategy: "Smart UPI Rail Reroute",
    status: "Ready",
    confidence: 96,
    time: "4 mins ago",
    customerSegment: "Enterprise"
  },
  {
    id: "TXN-10281",
    customer: "Dr. Siddharth Sen",
    amount: "₹42,000",
    numericAmount: 42000,
    risk: "Medium",
    failureReason: "Card decline",
    gateway: "HDFC Payment Gateway",
    recommendedAction: "Smart retry",
    actionStrategy: "Network Tokenization Fallback",
    status: "Ready",
    confidence: 89,
    time: "11 mins ago",
    customerSegment: "VIP Consumer"
  },
  {
    id: "TXN-10267",
    customer: "Kavita Rao Design",
    amount: "₹18,500",
    numericAmount: 18500,
    risk: "High",
    failureReason: "Checkout abandoned",
    gateway: "Shopify Checkout / PayU",
    recommendedAction: "Reminder",
    actionStrategy: "Dynamic Cart Salvage WhatsApp",
    status: "Pending",
    confidence: 92,
    time: "19 mins ago",
    customerSegment: "SMB Retail"
  },
  {
    id: "TXN-10255",
    customer: "HyperScale Media",
    amount: "₹92,000",
    numericAmount: 92000,
    risk: "High",
    failureReason: "3D-Secure timeout",
    gateway: "Axis Merchant Services",
    recommendedAction: "Dynamic routing",
    actionStrategy: "Frictionless OTP Assisted Session",
    status: "Ready",
    confidence: 94,
    time: "28 mins ago",
    customerSegment: "Enterprise"
  },
  {
    id: "TXN-10242",
    customer: "Tanya Verma",
    amount: "₹28,400",
    numericAmount: 28400,
    risk: "Low",
    failureReason: "Insufficient balance",
    gateway: "Paytm Payments Bank",
    recommendedAction: "Schedule retry",
    actionStrategy: "Salary-cycle delayed re-trigger",
    status: "Pending",
    confidence: 78,
    time: "39 mins ago",
    customerSegment: "Retail"
  },
  {
    id: "TXN-10239",
    customer: "Zenith Software LLP",
    amount: "₹56,100",
    numericAmount: 56100,
    risk: "Medium",
    failureReason: "Bank downtime (HDFC)",
    gateway: "HDFC NetBanking Rail",
    recommendedAction: "Alternate rail",
    actionStrategy: "Direct IMPS/NEFT Virtual Account",
    status: "Ready",
    confidence: 91,
    time: "52 mins ago",
    customerSegment: "B2B SaaS"
  },
  {
    id: "TXN-10220",
    customer: "Arjun Singhal",
    amount: "₹63,200",
    numericAmount: 63200,
    risk: "High",
    failureReason: "Gateway handshake error",
    gateway: "Juspay Smart Routing",
    recommendedAction: "Instant re-dispatch",
    actionStrategy: "Failover to secondary acquirer",
    status: "Ready",
    confidence: 95,
    time: "1h 10m ago",
    customerSegment: "Enterprise"
  }
];

export const agentStatusData = {
  agentName: "RecoverAI Agent",
  version: "v2.4-production",
  status: "ACTIVE",
  isAutonomous: true,
  autonomyThreshold: "₹1,00,000",
  tasksProcessedToday: 284,
  opportunitiesDetected: 127,
  recoveriesInitiated: 64,
  recoverySuccessRate: "61.3%",
  activeThreads: 8,
  averageRecoveryTime: "4.2 mins",
  lastActionTimestamp: "Just now"
};

export const notificationsList = [
  {
    id: "n-1",
    title: "Spike in HDFC NetBanking timeouts",
    description: "Failures exceeded 15% threshold. RecoverAI dynamically rerouted 38 transactions to alternate rails.",
    time: "5m ago",
    unread: true,
    type: "warning"
  },
  {
    id: "n-2",
    title: "₹1,85,000 batch recovered",
    description: "Automated retry cycle completed successfully for 4 high-value enterprise accounts.",
    time: "24m ago",
    unread: true,
    type: "success"
  },
  {
    id: "n-3",
    title: "Weekly AI Model Calibration",
    description: "RAG-v2.4 updated pattern heuristics with 94.2% precision on UPI drop-offs.",
    time: "2h ago",
    unread: false,
    type: "info"
  }
];

export const navigationItems = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard", path: "/dashboard", badge: null },
  { id: "revenue-radar", label: "Revenue Radar", icon: "Radar", path: "/revenue-radar", badge: "Live" },
  { id: "transactions", label: "Transactions", icon: "ReceiptText", path: "/transactions", badge: null },
  { id: "ai-agent", label: "AI Agent", icon: "Bot", path: "/ai-agent", badge: "Active" },
  { id: "recovery-actions", label: "Recovery Actions", icon: "Zap", path: "/recovery-actions", badge: "23" },
  { id: "analytics", label: "Analytics", icon: "BarChart3", path: "/analytics", badge: null },
  { id: "audit-trail", label: "Audit Trail", icon: "ShieldCheck", path: "/audit-trail", badge: null },
  { id: "recovery-lab", label: "Recovery Lab", icon: "FlaskConical", path: "/recovery-lab", badge: "Beta" },
  { id: "settings", label: "Settings", icon: "Settings", path: "/settings", badge: null },
];

// ----------------------------------------------------
// 2. REVENUE RADAR DATA
// ----------------------------------------------------
export const revenueRadarData = {
  overallHealthScore: "88.4%",
  activeThreatCount: 3,
  monitoredGatewaysCount: 6,
  gateways: [
    { id: "gw-1", name: "Razorpay Standard Rail", successRate: 98.6, latencyMs: 142, status: "healthy", volume24h: "₹42.8L" },
    { id: "gw-2", name: "Juspay Express Checkout", successRate: 99.1, latencyMs: 98, status: "healthy", volume24h: "₹65.2L" },
    { id: "gw-3", name: "HDFC Core Direct Rail", successRate: 91.2, latencyMs: 480, status: "degraded", volume24h: "₹28.4L", issue: "UPI Latency Spike (+340ms)" },
    { id: "gw-4", name: "SBI NetBanking & Mandates", successRate: 86.4, latencyMs: 820, status: "critical", volume24h: "₹19.1L", issue: "Issuer Timeout Loop" },
    { id: "gw-5", name: "ICICI Payment Engine", successRate: 98.4, latencyMs: 120, status: "healthy", volume24h: "₹34.6L" },
    { id: "gw-6", name: "PayU Enterprise Gateway", successRate: 97.9, latencyMs: 165, status: "healthy", volume24h: "₹21.0L" },
  ],
  failureDistribution: [
    { name: "UPI Timeouts", value: 54, amount: "₹9.9L", color: "#F59E0B" },
    { name: "3DS Drop-offs", value: 22, amount: "₹4.1L", color: "#8B5CF6" },
    { name: "Bank Server Glitches", value: 14, amount: "₹2.6L", color: "#EF4444" },
    { name: "Mandate Failures", value: 10, amount: "₹1.8L", color: "#06B6D4" },
  ],
  regionalCircles: [
    { circle: "Mumbai Circle (West)", health: "98.2%", latency: "110ms", failureRate: "1.8%", status: "Optimal" },
    { circle: "Bengaluru & Karnataka (South)", health: "97.6%", latency: "125ms", failureRate: "2.4%", status: "Optimal" },
    { circle: "Delhi NCR (North)", health: "89.4%", latency: "420ms", failureRate: "10.6%", status: "Degraded" },
    { circle: "Hyderabad & AP (South)", health: "96.8%", latency: "135ms", failureRate: "3.2%", status: "Optimal" },
    { circle: "Chennai & Tamil Nadu", health: "95.9%", latency: "148ms", failureRate: "4.1%", status: "Optimal" },
    { circle: "Kolkata & Eastern Hub", health: "92.1%", latency: "310ms", failureRate: "7.9%", status: "Degraded" },
  ],
  activeAnomalies: [
    {
      id: "anom-1",
      severity: "High",
      rail: "SBI UPI Acquiring Switch",
      impact: "₹3.4L in last 90 mins",
      recommendation: "Auto-reroute all SBI VPA handles to ICICI alternate switch.",
      autoRerouted: true,
      time: "8 mins ago"
    },
    {
      id: "anom-2",
      severity: "Medium",
      rail: "HDFC NetBanking OTP Handshake",
      impact: "₹1.8L in last 3 hours",
      recommendation: "Prompt user with WhatsApp frictionless 1-click fallback link.",
      autoRerouted: false,
      time: "24 mins ago"
    },
    {
      id: "anom-3",
      severity: "Low",
      rail: "Axis e-Mandate Debit Pool",
      impact: "₹62,000 scheduled",
      recommendation: "Schedule delayed secondary card retry at 18:00 IST.",
      autoRerouted: true,
      time: "48 mins ago"
    }
  ]
};

// ----------------------------------------------------
// 3. TRANSACTIONS LEDGER DATA
// ----------------------------------------------------
export const transactionsLedgerData = [
  {
    id: "TXN-10294",
    customer: "Apex Logistics Corp",
    email: "billing@apexlogistics.in",
    amount: "₹75,000",
    numericAmount: 75000,
    timestamp: "Today, 14:48:22",
    gateway: "Razorpay",
    rail: "UPI / SBI Handle",
    errorCode: "UPI_U30_TIMEOUT",
    risk: "High",
    recommendedAction: "Smart UPI Rail Reroute",
    recoveryStatus: "In Progress",
    salvageProbability: "96%",
    attempts: 1,
    lastPayload: {
      acquirer_ref: "SBIN8829104",
      http_status: 504,
      sub_error: "PSP_GATEWAY_TIMEOUT",
      suggested_fallback: "ICICI_UPI_SWITCH"
    }
  },
  {
    id: "TXN-10281",
    customer: "Dr. Siddharth Sen",
    email: "siddharth.sen@medclinic.org",
    amount: "₹42,000",
    numericAmount: 42000,
    timestamp: "Today, 14:37:05",
    gateway: "HDFC Gateway",
    rail: "Visa Infinite Debit",
    errorCode: "CARD_3DS_DROPOFF",
    risk: "Medium",
    recommendedAction: "Network Token Retry",
    recoveryStatus: "Recovered",
    salvageProbability: "89%",
    attempts: 2,
    lastPayload: {
      acquirer_ref: "HDFC9938120",
      http_status: 200,
      sub_error: "RECOVERED_VIA_TOKEN",
      recovered_at: "14:42:10"
    }
  },
  {
    id: "TXN-10267",
    customer: "Kavita Rao Design",
    email: "accounts@kavitarao.com",
    amount: "₹18,500",
    numericAmount: 18500,
    timestamp: "Today, 14:29:41",
    gateway: "PayU",
    rail: "Shopify Checkout",
    errorCode: "CHECKOUT_ABANDONED",
    risk: "High",
    recommendedAction: "WhatsApp Cart Salvage",
    recoveryStatus: "Pending",
    salvageProbability: "92%",
    attempts: 0,
    lastPayload: {
      acquirer_ref: "PYU-449102",
      http_status: 400,
      sub_error: "USER_EXIT_AT_PAYMENT_SELECTION",
      suggested_fallback: "DISCOUNTED_PAY_LINK"
    }
  },
  {
    id: "TXN-10255",
    customer: "HyperScale Media",
    email: "finance@hyperscale.io",
    amount: "₹92,000",
    numericAmount: 92000,
    timestamp: "Today, 14:20:18",
    gateway: "Axis Merchant",
    rail: "Mastercard Corporate",
    errorCode: "3DS_OTP_EXPIRED",
    risk: "High",
    recommendedAction: "Frictionless OTP Assisted",
    recoveryStatus: "Ready",
    salvageProbability: "94%",
    attempts: 1,
    lastPayload: {
      acquirer_ref: "AXIS-77192",
      http_status: 408,
      sub_error: "OTP_AUTH_TIMEOUT",
      suggested_fallback: "RETRY_WITH_SEAMLESS_INAPP"
    }
  },
  {
    id: "TXN-10242",
    customer: "Tanya Verma",
    email: "tanya.v@gmail.com",
    amount: "₹28,400",
    numericAmount: 28400,
    timestamp: "Today, 14:09:55",
    gateway: "Paytm Bank",
    rail: "UPI Auto-Debit",
    errorCode: "INSUFFICIENT_FUNDS",
    risk: "Low",
    recommendedAction: "Salary-cycle delayed retry",
    recoveryStatus: "Pending",
    salvageProbability: "78%",
    attempts: 0,
    lastPayload: {
      acquirer_ref: "PTM-39910",
      http_status: 402,
      sub_error: "BALANCE_LOW_FAIL_MANDATE",
      suggested_fallback: "RETRY_ON_1ST_OF_MONTH"
    }
  },
  {
    id: "TXN-10239",
    customer: "Zenith Software LLP",
    email: "pay@zenithsoft.in",
    amount: "₹56,100",
    numericAmount: 56100,
    timestamp: "Today, 13:56:12",
    gateway: "HDFC NetBanking",
    rail: "Corporate NetBanking",
    errorCode: "BANK_SERVER_DOWN",
    risk: "Medium",
    recommendedAction: "Virtual Account IMPS",
    recoveryStatus: "Recovered",
    salvageProbability: "91%",
    attempts: 1,
    lastPayload: {
      acquirer_ref: "HDFC-NET-9912",
      http_status: 503,
      sub_error: "CORE_BANKING_UNAVAILABLE",
      recovered_via: "SMART_NEFT_ROUTING"
    }
  },
  {
    id: "TXN-10220",
    customer: "Arjun Singhal",
    email: "arjun.singhal@rediff.com",
    amount: "₹63,200",
    numericAmount: 63200,
    timestamp: "Today, 13:38:09",
    gateway: "Juspay",
    rail: "Rupay Credit Card",
    errorCode: "GATEWAY_TIMEOUT",
    risk: "High",
    recommendedAction: "Failover Acquirer Switch",
    recoveryStatus: "Ready",
    salvageProbability: "95%",
    attempts: 1,
    lastPayload: {
      acquirer_ref: "JSP-882190",
      http_status: 504,
      sub_error: "ACQUIRER_FAILED_TO_RESPOND",
      suggested_fallback: "RAZORPAY_SECONDARY_RAIL"
    }
  },
  {
    id: "TXN-10204",
    customer: "Kunal Mehra",
    email: "kunal.mehra@outlook.com",
    amount: "₹12,000",
    numericAmount: 12000,
    timestamp: "Today, 13:21:40",
    gateway: "SBI Gateway",
    rail: "SBI UPI VPA",
    errorCode: "MAX_RETRIES_EXCEEDED",
    risk: "High",
    recommendedAction: "Customer Support Escalation",
    recoveryStatus: "Failed",
    salvageProbability: "32%",
    attempts: 4,
    lastPayload: {
      acquirer_ref: "SBI-991203",
      http_status: 400,
      sub_error: "HARD_DECLINE_LIMIT_EXCEEDED",
      note: "Escalated to merchant CRM"
    }
  },
  {
    id: "TXN-10192",
    customer: "CloudSphere India",
    email: "devops@cloudsphere.in",
    amount: "₹24,999",
    numericAmount: 24999,
    timestamp: "Today, 13:10:02",
    gateway: "Razorpay Mandates",
    rail: "Recurring Subscriptions",
    errorCode: "MANDATE_EXPIRED",
    risk: "Medium",
    recommendedAction: "Secondary Card Sweep",
    recoveryStatus: "Recovered",
    salvageProbability: "88%",
    attempts: 2,
    lastPayload: {
      acquirer_ref: "RZP-SUB-4410",
      http_status: 200,
      sub_error: "SALVAGED_VIA_BACKUP_CARD",
      recovered_at: "13:15:33"
    }
  }
];

// ----------------------------------------------------
// 4. AI AGENT STUDIO CONFIG DATA
// ----------------------------------------------------
export const agentStudioData = {
  agentName: "RecoverAI Autonomous Agent",
  status: "ACTIVE",
  version: "RAG-v2.4-Production",
  autonomousMode: true,
  safetyLimitPerTxn: 100000, // ₹1,00,000
  dailyAutonomousBudget: 2500000, // ₹25,00,000
  todayAutonomousExecuted: 720000,
  selectedModel: "Gemini 1.5 Pro (Fintech Tuned)",
  temperature: 0.15,
  minConfidenceThreshold: 85, // Only execute if confidence >= 85%
  workerPoolSize: 8,
  activeWorkerThreads: 8,
  systemPrompt: `You are RecoverAI Agent, an autonomous payments and revenue recovery intelligence engine.
Your mission:
1. Detect transaction failures across UPI, Card, NetBanking, and Recurring Mandates in sub-second latency.
2. Formulate the lowest-friction, highest-conversion recovery playbook using historical merchant telemetry.
3. Automatically execute reroutes, token retries, and WhatsApp pay-links if within safety limit (₹1,00,000).
4. Strictly abide by RBI compliance, PCI-DSS tokenization limits, and customer rate-limits.`,
  heuristics: [
    { id: "h-1", name: "UPI Switch Failover Matrix", accuracy: "97.4%", status: "Active" },
    { id: "h-2", name: "Dynamic WhatsApp Salvage Timing", accuracy: "94.1%", status: "Active" },
    { id: "h-3", name: "Network Token Expiry Fallback", accuracy: "91.8%", status: "Active" },
    { id: "h-4", name: "Salary-Day Intent Prediction", accuracy: "86.5%", status: "Calibrating" }
  ]
};

// ----------------------------------------------------
// 5. RECOVERY ACTIONS & CAMPAIGNS DATA
// ----------------------------------------------------
export const recoveryPlaybooksData = [
  {
    id: "pb-1",
    title: "Instant UPI Rail Failover",
    description: "Automatically reroutes failing UPI VPAs to alternate high-uptime banking switches during bank downtime spikes.",
    channel: "Gateway Protocol",
    trigger: "UPI Latency > 350ms or Error U30",
    status: "Active",
    successRate: "78.4%",
    totalSalvaged: "₹24.8L",
    dispatchedCount: 1420,
    color: "brand"
  },
  {
    id: "pb-2",
    title: "WhatsApp 1-Click Payment Link",
    description: "Sends personalized verified WhatsApp interactive message with instant pre-filled UPI Intent links within 4 minutes of abandonment.",
    channel: "WhatsApp Business API",
    trigger: "Checkout Abandonment > ₹5,000",
    status: "Active",
    successRate: "64.2%",
    totalSalvaged: "₹18.2L",
    dispatchedCount: 890,
    color: "emerald"
  },
  {
    id: "pb-3",
    title: "Network Token Secondary Retry",
    description: "Executes cryptographic token retries on Visa/Mastercard secondary acquirers when 3DS drop-off occurs on primary gateway.",
    channel: "Card Network Tokenization",
    trigger: "Card 3DS Drop or Issuer Glitch",
    status: "Active",
    successRate: "59.1%",
    totalSalvaged: "₹14.6L",
    dispatchedCount: 630,
    color: "cyan"
  },
  {
    id: "pb-4",
    title: "Subscription Mandate Smart Sweep",
    description: "Predictive automated retry schedule that sweeps mandate debits at optimal bank balance intervals.",
    channel: "e-Mandate / NACH",
    trigger: "Mandate Debit Failure",
    status: "Active",
    successRate: "52.8%",
    totalSalvaged: "₹9.4L",
    dispatchedCount: 410,
    color: "amber"
  },
  {
    id: "pb-5",
    title: "VIP Enterprise Custom Concierge",
    description: "High-value enterprise transactions (> ₹50,000) are flagged with automated dedicated virtual accounts and direct rep notification.",
    channel: "CRM & Concierge",
    trigger: "Transaction Value >= ₹50,000",
    status: "Active",
    successRate: "88.9%",
    totalSalvaged: "₹38.1L",
    dispatchedCount: 115,
    color: "brand"
  }
];

// ----------------------------------------------------
// 6. ANALYTICS DATA
// ----------------------------------------------------
export const analyticsReportData = {
  totalRevenuePreserved: "₹48.2L",
  churnPreventedRate: "18.4%",
  roiMultiplier: "14.2x",
  salvagedVolume: 1284,
  monthlyTrend: [
    { month: "Jan", recovered: 28.4, lost: 14.2, totalAtRisk: 42.6 },
    { month: "Feb", recovered: 34.1, lost: 16.0, totalAtRisk: 50.1 },
    { month: "Mar", recovered: 39.5, lost: 15.2, totalAtRisk: 54.7 },
    { month: "Apr", recovered: 44.8, lost: 17.1, totalAtRisk: 61.9 },
    { month: "May", recovered: 51.2, lost: 18.0, totalAtRisk: 69.2 },
    { month: "Jun", recovered: 58.6, lost: 19.5, totalAtRisk: 78.1 },
    { month: "Jul", recovered: 66.2, lost: 17.8, totalAtRisk: 84.0 },
    { month: "Aug", recovered: 74.5, lost: 16.2, totalAtRisk: 90.7 },
  ],
  gatewayReliability: [
    { gateway: "Juspay", recoveredRate: 74.2, avgLatency: 110 },
    { gateway: "Razorpay", recoveredRate: 71.8, avgLatency: 145 },
    { gateway: "ICICI Direct", recoveredRate: 68.4, avgLatency: 160 },
    { gateway: "PayU", recoveredRate: 64.1, avgLatency: 180 },
    { gateway: "HDFC Direct", recoveredRate: 58.2, avgLatency: 290 },
    { gateway: "SBI Direct", recoveredRate: 48.6, avgLatency: 410 },
  ],
  channelAttribution: [
    { channel: "UPI Rail Rerouting", percentage: 42, revenue: "₹20.2L", color: "#8B5CF6" },
    { channel: "WhatsApp 1-Click Pay", percentage: 28, revenue: "₹13.5L", color: "#10B981" },
    { channel: "Network Token Retry", percentage: 18, revenue: "₹8.7L", color: "#06B6D4" },
    { channel: "Mandate Smart Sweep", percentage: 12, revenue: "₹5.8L", color: "#F59E0B" },
  ]
};

// ----------------------------------------------------
// 7. AUDIT TRAIL DATA
// ----------------------------------------------------
export const auditTrailLedgerData = [
  {
    id: "LOG-882194",
    timestamp: "2026-08-21 14:48:25 IST",
    actor: "AI Autonomous Agent",
    actorType: "agent",
    action: "REROUTE_TRANSACTION_RAIL",
    target: "TXN-10294 (₹75,000)",
    reasoning: "SBI rail latency surged to 820ms (>350ms threshold). Auto-switched to ICICI Rail with 96% confidence.",
    integrityHash: "0x8f3c9e12a4b89d71c2",
    status: "Verified"
  },
  {
    id: "LOG-882193",
    timestamp: "2026-08-21 14:42:10 IST",
    actor: "AI Autonomous Agent",
    actorType: "agent",
    action: "NETWORK_TOKEN_RETRY",
    target: "TXN-10281 (₹42,000)",
    reasoning: "Card 3DS drop-off detected. Dispatched cryptographic network token retry via Visa secondary gateway.",
    integrityHash: "0x3e71d9a2b84c10ef89",
    status: "Verified"
  },
  {
    id: "LOG-882192",
    timestamp: "2026-08-21 14:30:00 IST",
    actor: "Isiri (Admin)",
    actorType: "human",
    action: "SAFETY_LIMIT_ADJUSTED",
    target: "Global Policy",
    reasoning: "Adjusted max autonomous threshold from ₹75,000 to ₹1,00,000 for peak festive season throughput.",
    integrityHash: "0x91d84e2a1b7c33fe44",
    status: "Verified"
  },
  {
    id: "LOG-882191",
    timestamp: "2026-08-21 14:21:05 IST",
    actor: "System Rule Engine",
    actorType: "system",
    action: "ANOMALY_TRIGGERED",
    target: "SBI UPI Rail",
    reasoning: "Failure rate exceeded 12% in Delhi NCR circle. Alert dispatched to merchant dashboard and PagerDuty.",
    integrityHash: "0x12b49c7e3f8801ad99",
    status: "Verified"
  },
  {
    id: "LOG-882190",
    timestamp: "2026-08-21 13:56:40 IST",
    actor: "AI Autonomous Agent",
    actorType: "agent",
    action: "VIRTUAL_ACCOUNT_DISPATCH",
    target: "TXN-10239 (₹56,100)",
    reasoning: "HDFC NetBanking core server downtime. Generated dynamic IMPS/NEFT virtual account link for merchant.",
    integrityHash: "0x77c28a11e4f901cb33",
    status: "Verified"
  }
];

// ----------------------------------------------------
// 8. RECOVERY LAB SANDBOX SCENARIOS
// ----------------------------------------------------
export const recoveryLabScenarios = [
  {
    id: "sc-1",
    name: "HDFC UPI Outage Surge (5,000 Txns)",
    description: "Simulates sudden 45% failure rate on HDFC UPI handles during peak lunchtime flash sale.",
    volume: 5000,
    simulatedFailureRate: 45,
    estimatedAtRisk: "₹37,50,000",
    projectedSalvageRate: "81.4%",
    projectedRecovered: "₹30,52,500"
  },
  {
    id: "sc-2",
    name: "Month-End Salary Mandate Avalanche",
    description: "Simulates 10,000 subscription debit mandates with high bank congestion and insufficient funds.",
    volume: 10000,
    simulatedFailureRate: 32,
    estimatedAtRisk: "₹85,00,000",
    projectedSalvageRate: "68.9%",
    projectedRecovered: "₹58,56,500"
  },
  {
    id: "sc-3",
    name: "Global Black Friday Card 3DS Spike",
    description: "Simulates international and domestic cards 3DS timeout spikes during hyper-scale traffic.",
    volume: 8000,
    simulatedFailureRate: 28,
    estimatedAtRisk: "₹1,20,00,000",
    projectedSalvageRate: "76.2%",
    projectedRecovered: "₹91,44,000"
  }
];

// ----------------------------------------------------
// 9. SETTINGS DATA
// ----------------------------------------------------
export const merchantSettingsData = {
  general: {
    merchantName: "Nexus Retail Group",
    merchantId: "MRC_77209X",
    billingCurrency: "INR (₹)",
    timezone: "Asia/Kolkata (IST)",
    settlementAccount: "HDFC Bank •••• 8821"
  },
  gateways: [
    { id: "gw-rzp", name: "Razorpay", keyId: "rzp_live_9921••••••••", status: "Connected", isPrimary: true },
    { id: "gw-jsp", name: "Juspay Smart Routing", keyId: "jsp_live_3381••••••••", status: "Connected", isPrimary: false },
    { id: "gw-pyu", name: "PayU Enterprise", keyId: "pyu_live_7719••••••••", status: "Connected", isPrimary: false },
    { id: "gw-stp", name: "Stripe India", keyId: "pk_live_51M••••••••••••", status: "Connected", isPrimary: false }
  ],
  webhooks: [
    { id: "wh-1", endpoint: "https://api.nexusgroup.in/v1/recoverai/webhook", events: "payment.failed, recovery.success", status: "Active", secret: "whsec_••••••••" },
    { id: "wh-2", endpoint: "https://ops.nexusgroup.in/alerts/payment-drop", events: "rail.degraded, anomaly.detected", status: "Active", secret: "whsec_••••••••" }
  ],
  notifications: {
    slackEnabled: true,
    slackChannel: "#payments-revenue-alerts",
    pagerDutyEnabled: true,
    whatsappAlerts: true,
    adminEmail: "isiri.payments@nexusgroup.in"
  },
  team: [
    { id: "u-1", name: "Isiri", email: "isiri.payments@nexusgroup.in", role: "Owner / Lead Payments Ops", status: "Active" },
    { id: "u-2", name: "Raghav Menon", email: "raghav@nexusgroup.in", role: "DevOps / SRE Lead", status: "Active" },
    { id: "u-3", name: "Pooja Hegde", email: "pooja.finance@nexusgroup.in", role: "Finance Manager", status: "Active" }
  ]
};
