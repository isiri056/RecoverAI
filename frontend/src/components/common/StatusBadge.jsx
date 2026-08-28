import React from 'react';

/**
 * StatusBadge Component
 * Reusable badge for Risk, Status, and Event Types with crisp 2026 fintech styling.
 */
export default function StatusBadge({ type, value, size = 'sm', pulse = false }) {
  const normalized = (value || '').toLowerCase().trim();

  let styleClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/50';
  let dotColor = 'bg-slate-400';

  if (type === 'risk') {
    if (normalized === 'high') {
      styleClasses = 'bg-red-950/50 text-red-300 border-red-500/30';
      dotColor = 'bg-red-400';
    } else if (normalized === 'medium') {
      styleClasses = 'bg-amber-950/50 text-amber-300 border-amber-500/30';
      dotColor = 'bg-amber-400';
    } else if (normalized === 'low') {
      styleClasses = 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30';
      dotColor = 'bg-emerald-400';
    }
  } else if (type === 'status' || type === 'state') {
    if (normalized === 'ready' || normalized === 'active' || normalized === 'recovered' || normalized === 'success') {
      styleClasses = 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30';
      dotColor = 'bg-emerald-400';
    } else if (normalized === 'pending' || normalized === 'processing' || normalized === 'prioritized') {
      styleClasses = 'bg-amber-950/50 text-amber-300 border-amber-500/30';
      dotColor = 'bg-amber-400';
    } else if (normalized === 'failed' || normalized === 'abandoned' || normalized === 'error') {
      styleClasses = 'bg-red-950/50 text-red-300 border-red-500/30';
      dotColor = 'bg-red-400';
    } else if (normalized === 'detected') {
      styleClasses = 'bg-purple-950/50 text-purple-300 border-purple-500/30';
      dotColor = 'bg-purple-400';
    }
  }

  const sizeClasses = size === 'xs' 
    ? 'px-1.5 py-0.5 text-[11px] tracking-wide' 
    : size === 'md' 
    ? 'px-3 py-1 text-xs tracking-wider' 
    : 'px-2.5 py-0.5 text-xs tracking-wide';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border font-mono ${sizeClasses} ${styleClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulse ? 'animate-ping' : ''}`} />
      <span>{value}</span>
    </span>
  );
}
