import React, { useState } from 'react';
import { RotateCw, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { merchantInfo } from '../../data/mockData';

export default function DashboardHeader({ onRefresh, isRefreshing }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      {/* Greeting & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Good morning, {merchantInfo.name}.
          </h1>
          <span className="text-xl sm:text-2xl inline-block animate-pulse">✨</span>
        </div>
        <p className="text-sm text-text-secondary mt-1 font-normal">
          Here's what RecoverAI found while you were away.
        </p>
      </div>

      {/* Right: Recovery Agent Active Badge + Refresh Button */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
        {/* Recovery Agent Active Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-950/60 border border-brand-500/40 text-brand-300 text-xs font-semibold shadow-glow-brand/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
          </span>
          <span className="tracking-wide">Recovery Agent Active</span>
        </div>

        {/* Small Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh real-time recovery metrics"
          className="p-2 rounded-xl bg-background-card border border-border/80 text-text-secondary hover:text-text-primary hover:border-border hover:bg-white/[0.04] transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>
    </div>
  );
}
