import React from 'react';
import { 
  Radar, 
  ReceiptText, 
  Bot, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  FlaskConical, 
  Settings,
  Sparkles,
  ArrowRight,
  Code2,
  Lock,
  Layers
} from 'lucide-react';

const routeInfoMap = {
  'revenue-radar': {
    title: 'Revenue Radar & Threat Monitor',
    subtitle: 'Real-time 3D spatial mapping of payment gateway drops, network congestion, and checkout friction.',
    icon: Radar,
    status: 'In Active Development',
    release: 'Sprint 2 (Q3 2026)',
    highlights: [
      'Interactive geo-spatial failure heatmap across Indian banking circles',
      'Real-time UPI intent & e-Mandate success telemetry',
      'Autonomous failover trigger thresholds'
    ]
  },
  'transactions': {
    title: 'Universal Transactions Ledger',
    subtitle: 'Comprehensive audit stream of all merchant transactions, salvage attempts, and gateway responses.',
    icon: ReceiptText,
    status: 'Ready for Backend API Linking',
    release: 'Sprint 2 (Q3 2026)',
    highlights: [
      'Multi-acquirer reconciliation (Razorpay, Juspay, PayU, Stripe)',
      'Sub-second transaction state search & deep JSON payload viewer',
      'Instant manual retry & dispute mitigation console'
    ]
  },
  'ai-agent': {
    title: 'Autonomous AI Recovery Agent Studio',
    subtitle: 'Configure autonomous decision limits, safety rules, multi-agent collaboration, and fallback logic.',
    icon: Bot,
    status: 'Model Fine-Tuning Stage',
    release: 'Sprint 2 (Q3 2026)',
    highlights: [
      'Dynamic threshold configuration (Autonomous execution < ₹1.0L)',
      'Custom LLM prompt heuristic tailoring & RAG calibration',
      'A/B tested recovery strategy simulation'
    ]
  },
  'recovery-actions': {
    title: 'Active Recovery Interventions & Campaigns',
    subtitle: 'Manage and orchestrate all active smart retry workflows, WhatsApp salvage flows, and payment links.',
    icon: Zap,
    status: 'Pipeline Configured',
    release: 'Sprint 2 (Q3 2026)',
    highlights: [
      'Multi-channel outreach: WhatsApp, SMS, Email, and in-app triggers',
      'Dynamic one-click salvage URLs with localized payment options',
      'Live conversion attribution & ROI ledger'
    ]
  },
  'analytics': {
    title: 'Deep Recovery Intelligence & Unit Economics',
    subtitle: 'Measure total revenue preserved, churn prevention velocity, and merchant ROI metrics.',
    icon: BarChart3,
    status: 'Reporting Engine in Build',
    release: 'Sprint 3 (Q3 2026)',
    highlights: [
      'Cohort-based payment salvage retention curves',
      'Gateway performance benchmarking (SBI vs HDFC vs ICICI)',
      'Exportable financial reconciliation sheets'
    ]
  },
  'audit-trail': {
    title: 'Cryptographic Audit & Compliance Ledger',
    subtitle: 'Immutable logs of all agent decisions, intervention triggers, and merchant policy approvals.',
    icon: ShieldCheck,
    status: 'Security Hardened',
    release: 'Sprint 3 (Q3 2026)',
    highlights: [
      'SOC2 / ISO27001 compliant activity logs',
      'Full explainability trace for every AI recovery choice',
      'Role-based approval hierarchies for high-value transactions'
    ]
  },
  'recovery-lab': {
    title: 'Recovery Lab (Sandbox & Simulator)',
    subtitle: 'Simulate high-concurrency payment outage spikes and test your agent’s recovery efficacy.',
    icon: FlaskConical,
    status: 'Experimental Playground',
    release: 'Beta',
    highlights: [
      'Simulate 10,000 synthetic failure events across all rails',
      'Stress test dynamic discount sensitivity curves',
      'Offline heuristic evaluation against past historical data'
    ]
  },
  'settings': {
    title: 'Merchant & Gateway Configuration',
    subtitle: 'Manage API keys, webhooks, team roles, notification webhooks, and billing settings.',
    icon: Settings,
    status: 'Configuration Portal',
    release: 'Sprint 2 (Q3 2026)',
    highlights: [
      'API Keys & Webhook secret management',
      'Custom branding for customer-facing payment salvage links',
      'Notification routing (Slack, Teams, PagerDuty)'
    ]
  }
};

export default function PlaceholderView({ routeId, onBackToOverview, onShowToast }) {
  const current = routeInfoMap[routeId] || {
    title: 'Feature Coming Soon',
    subtitle: 'This module is being built in the next development phase.',
    icon: Layers,
    status: 'Upcoming',
    release: 'Sprint 2',
    highlights: ['Backend API integration', 'Real-time telemetry stream']
  };

  const Icon = current.icon;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-300 shadow-glow-brand">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                {current.title}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-brand-500/20 text-brand-300 rounded border border-brand-500/30">
                {current.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              {current.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-background-card border border-border text-text-secondary hover:text-text-primary hover:border-brand-500/50 transition-all self-start sm:self-auto"
        >
          <span>← Back to Overview</span>
        </button>
      </div>

      {/* Feature Preview Card */}
      <div className="p-8 rounded-2xl glass-card border border-border/80 relative overflow-hidden">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-500/40 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scheduled for {current.release}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            We are building this next with backend connection.
          </h2>

          <p className="text-sm text-text-secondary leading-relaxed">
            As requested, we have completed the full production-grade Dashboard UI foundation first. This route is pre-configured in the frontend architecture and ready to connect to our upcoming AI backend agent engine.
          </p>

          {/* Highlights checklist */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold font-mono text-text-dim uppercase tracking-wider">
              Included in this module:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2.5">
              {current.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary/80 border border-border/70 text-xs font-mono text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onShowToast(`Notified product team! Priority boosted for ${current.title}`, 'info')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-colors"
            >
              Request Early API Access
            </button>
            <button
              onClick={onBackToOverview}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all hover:scale-[1.02]"
            >
              Explore Live Overview Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
