import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, CheckCircle2, Percent, Layers } from 'lucide-react';

const metricIcons = {
  risk: AlertTriangle,
  recoverable: ShieldCheck,
  recovered: CheckCircle2,
  rate: Percent,
  cases: Layers,
};

export default function MetricCard({ metric, onClick }) {
  const Icon = metricIcons[metric.id] || Layers;

  // Visual variants for border & glow
  let hoverClass = 'glass-card-hover';
  let badgeColor = 'text-brand-300 bg-brand-500/10 border-brand-500/20';
  let iconColor = 'text-brand-400 bg-brand-500/10 border-brand-500/20';

  if (metric.accentColor === 'amber') {
    hoverClass = 'glass-card-amber';
    badgeColor = 'text-amber-300 bg-amber-500/10 border-amber-500/20';
    iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (metric.accentColor === 'emerald') {
    hoverClass = 'glass-card-emerald';
    badgeColor = 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
    iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (metric.accentColor === 'cyan') {
    badgeColor = 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20';
    iconColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  }

  const isPositive = metric.isPositiveTrend;

  return (
    <div
      onClick={onClick}
      className={`
        relative p-5 rounded-2xl glass-card ${hoverClass} cursor-pointer transition-all duration-300 group flex flex-col justify-between
      `}
    >
      {/* Top row: Title + Icon */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {metric.title}
          </span>
          <div className={`p-2 rounded-xl border ${iconColor} transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Value */}
        <div className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight font-sans">
          {metric.value}
        </div>
      </div>

      {/* Bottom row: Trend Delta + Subtext */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
            isPositive 
              ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' 
              : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {metric.change}
          </span>
          {metric.changeLabel && (
            <span className="text-[11px] text-text-muted truncate">
              {metric.changeLabel}
            </span>
          )}
        </div>

        {/* Subtext info */}
        <span className="text-[11px] text-text-secondary font-medium font-mono text-right truncate">
          {metric.subtext}
        </span>
      </div>
    </div>
  );
}
