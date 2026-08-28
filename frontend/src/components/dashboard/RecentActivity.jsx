import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCw, 
  XCircle,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { recentActivities } from '../../data/mockData';

export default function RecentActivity({ onSelectActivity }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'initiated':
        return (
          <div className="p-2 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-400">
            <Zap className="w-4 h-4" />
          </div>
        );
      case 'detected':
        return (
          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'failed':
        return (
          <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400">
            <XCircle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400">
            <Clock className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl glass-card border border-border/80 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            Recent Activity
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Live AI intervention and payment rescue feed
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-full bg-white/[0.04] border border-border/70 text-text-secondary">
          {recentActivities.length} events
        </span>
      </div>

      {/* Activity Feed List */}
      <div className="space-y-3.5 divide-y divide-border/40">
        {recentActivities.map((activity, idx) => (
          <div
            key={activity.id}
            onClick={() => onSelectActivity && onSelectActivity(activity)}
            className={`pt-3.5 first:pt-0 flex items-start justify-between gap-3.5 group cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 py-1.5 rounded-xl transition-all duration-150`}
          >
            <div className="flex items-start gap-3 min-w-0">
              {getActivityIcon(activity.type)}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-text-primary truncate group-hover:text-brand-300 transition-colors">
                    {activity.title}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-text-muted font-mono">
                  <span className="text-amber-400/90 font-medium">
                    {activity.reason}
                  </span>
                  <span>•</span>
                  <span className="text-text-dim truncate">
                    {activity.customer}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Amount & Timestamp */}
            <div className="text-right shrink-0">
              <div className="text-xs sm:text-sm font-bold font-mono text-text-primary">
                {activity.amount}
              </div>
              <div className="text-[10px] text-text-dim font-mono mt-0.5">
                {activity.timeAgo}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
