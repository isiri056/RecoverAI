import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { aiInsightData } from '../../data/mockData';

export default function AIInsight({ onReviewOpportunities }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-950/40 via-background-card to-background-secondary p-6 sm:p-7 shadow-2xl shadow-brand-950/20 group">
      {/* Decorative ambient background blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-600/15 transition-all duration-500" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left / Main Insight Information */}
        <div className="space-y-4 max-w-3xl">
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
              <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
              <span>{aiInsightData.tag}</span>
            </div>

            {aiInsightData.isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE</span>
              </span>
            )}

            <span className="text-xs font-mono text-text-dim">
              Updated {aiInsightData.updated}
            </span>
          </div>

          {/* Main Message */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-text-primary leading-relaxed tracking-tight">
              {aiInsightData.headline}{" "}
              <span className="text-brand-300 font-normal">
                RecoverAI recommends prioritizing 23 high-value transactions.
              </span>
            </h3>
          </div>

          {/* Metadata Badges & Diagnostics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-border/80 text-text-secondary">
              <span className="text-text-muted">Confidence:</span>
              <span className="font-semibold text-emerald-400">{aiInsightData.confidence}%</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-border/80 text-text-secondary">
              <Cpu className="w-3 h-3 text-brand-400" />
              <span className="text-text-muted">Model:</span>
              <span className="font-semibold text-text-primary">{aiInsightData.model}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-border/80 text-text-secondary">
              <Activity className="w-3 h-3 text-amber-400" />
              <span className="text-text-muted">Est. Salvageable:</span>
              <span className="font-semibold text-amber-300">₹4.82L</span>
            </div>
          </div>
        </div>

        {/* Right CTA Button with subtle glow & smooth hover */}
        <div className="shrink-0 lg:self-center">
          <button
            onClick={onReviewOpportunities}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-brand hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn border border-brand-400/30"
          >
            <span>{aiInsightData.actionButtonText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
