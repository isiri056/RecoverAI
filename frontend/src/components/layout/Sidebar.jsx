import React from 'react';
import { 
  LayoutDashboard, 
  Radar, 
  ReceiptText, 
  Bot, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  FlaskConical, 
  Settings,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { navigationItems, merchantInfo, systemHealth } from '../../data/mockData';

// Icon mapper for dynamic mockData icon strings
const iconMap = {
  LayoutDashboard,
  Radar,
  ReceiptText,
  Bot,
  Zap,
  BarChart3,
  ShieldCheck,
  FlaskConical,
  Settings,
};

export default function Sidebar({ activeRoute, onNavigate, isMobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-background-secondary border-r border-border/80 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onNavigate('overview')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-500 to-indigo-400 p-[1px] shadow-glow-brand flex items-center justify-center">
              <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-300">
                  Recover<span className="text-brand-400">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-500/20 text-brand-300 rounded border border-brand-500/30 uppercase tracking-wider">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] font-medium text-text-muted tracking-wider uppercase">
                Revenue Recovery
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3.5 py-6 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
            Main Operations
          </div>

          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`
                  w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                  ${isActive 
                    ? 'nav-active-glow text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-400' : 'text-text-muted group-hover:text-text-secondary'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`
                    px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider
                    ${item.badge === 'Live' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : ''}
                    ${item.badge === 'Active' ? 'bg-brand-950/60 text-brand-300 border border-brand-500/30' : ''}
                    ${item.badge === 'Beta' ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30' : ''}
                    ${!isNaN(Number(item.badge)) ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' : ''}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Status & Profile Area */}
        <div className="p-4 border-t border-border/70 bg-background/50 space-y-3">
          {/* System & API Status */}
          <div className="p-2.5 rounded-xl bg-background-card/80 border border-border/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-text-secondary font-medium">{systemHealth.status}</span>
            </div>
            <span className="text-[11px] font-mono text-text-muted">
              {systemHealth.apiLatency}
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
            <div className="relative">
              <img 
                src={merchantInfo.avatarUrl} 
                alt={merchantInfo.name} 
                className="w-9 h-9 rounded-full object-cover ring-1 ring-brand-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {merchantInfo.name}
                </p>
                <span className="text-[10px] font-mono font-medium text-brand-300 bg-brand-500/10 px-1.5 py-0.2 rounded border border-brand-500/20">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-text-muted truncate">
                {merchantInfo.businessName}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
