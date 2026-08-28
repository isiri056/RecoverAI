import React from 'react';
import { Bot, Cpu, ShieldCheck, Activity, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { agentStatusData } from '../../data/mockData';

export default function AgentStatus({ onInspectAgent }) {
  return (
    <div className="p-6 rounded-2xl glass-card border border-border/80 flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle background ambient pulse */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-500/20 transition-all duration-500" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 shadow-glow-brand/50">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  {agentStatusData.agentName}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-text-dim">
                {agentStatusData.version}
              </span>
            </div>
          </div>

          {/* ACTIVE badge with animated status beacon */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold font-mono shadow-glow-emerald/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>{agentStatusData.status}</span>
          </div>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Tasks processed */}
          <div className="p-3 rounded-xl bg-background-secondary/80 border border-border/70">
            <span className="text-[11px] font-medium text-text-muted block truncate">
              Tasks processed today
            </span>
            <span className="text-lg font-bold font-mono text-text-primary mt-0.5 block">
              {agentStatusData.tasksProcessedToday}
            </span>
          </div>

          {/* Opportunities detected */}
          <div className="p-3 rounded-xl bg-background-secondary/80 border border-border/70">
            <span className="text-[11px] font-medium text-text-muted block truncate">
              Opportunities detected
            </span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">
              {agentStatusData.opportunitiesDetected}
            </span>
          </div>

          {/* Recoveries initiated */}
          <div className="p-3 rounded-xl bg-background-secondary/80 border border-border/70">
            <span className="text-[11px] font-medium text-text-muted block truncate">
              Recoveries initiated
            </span>
            <span className="text-lg font-bold font-mono text-brand-400 mt-0.5 block">
              {agentStatusData.recoveriesInitiated}
            </span>
          </div>

          {/* Recovery success rate */}
          <div className="p-3 rounded-xl bg-background-secondary/80 border border-border/70">
            <span className="text-[11px] font-medium text-text-muted block truncate">
              Recovery success rate
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
              {agentStatusData.recoverySuccessRate}
            </span>
          </div>
        </div>
      </div>

      {/* Autonomy & Health Footer */}
      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          <span>{agentStatusData.activeThreads} parallel recovery workers</span>
        </div>
        <button
          onClick={onInspectAgent}
          className="text-brand-400 hover:text-brand-300 font-semibold hover:underline"
        >
          Configure Agent →
        </button>
      </div>
    </div>
  );
}
