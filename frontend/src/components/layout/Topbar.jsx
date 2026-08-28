import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Bell, 
  Menu, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { systemHealth, merchantInfo, notificationsList } from '../../data/mockData';

export default function Topbar({ 
  onToggleMobile, 
  selectedRange, 
  onSelectRange, 
  searchQuery, 
  onSearchChange,
  onNotificationAction 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [notifications, setNotifications] = useState(notificationsList);

  const unreadCount = notifications.filter(n => n.unread).length;

  const dateRanges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'mtd', label: 'Month to Date' },
  ];

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-background/80 backdrop-blur-xl border-b border-border/70 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={onToggleMobile}
          className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 group">
          <Search className="w-4 h-4 text-text-muted group-focus-within:text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions, cases, customers, or failure reasons..."
            className="w-full pl-10 pr-12 py-2 text-xs md:text-sm bg-background-secondary/80 border border-border/70 rounded-xl text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-text-dim bg-background border border-border rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-background-secondary/80 border border-border/70 text-text-secondary hover:text-text-primary hover:border-border transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">
              {dateRanges.find(r => r.id === selectedRange)?.label || 'Last 24 Hours'}
            </span>
            <span className="sm:hidden uppercase font-mono text-[11px]">
              {selectedRange}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${showRangeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showRangeDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-background-card border border-border rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-text-dim uppercase tracking-wider">
                Select Time Window
              </div>
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => {
                    onSelectRange(range.id);
                    setShowRangeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    selectedRange === range.id 
                      ? 'bg-brand-500/10 text-brand-300 font-semibold' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <span>{range.label}</span>
                  {selectedRange === range.id && <Check className="w-3.5 h-3.5 text-brand-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* All Systems Normal Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="tracking-tight">{systemHealth.status}</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/70 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-background animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background-card border border-border rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Agent Feed & Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.2 text-[10px] font-bold bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-medium transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="divide-y divide-border/40 max-h-72 overflow-y-auto my-2">
                {notifications.map((item) => (
                  <div 
                    key={item.id}
                    className={`py-3 px-1 transition-colors ${item.unread ? 'bg-brand-500/[0.04]' : 'opacity-80'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                        {item.type === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        {item.type === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        {item.type === 'info' && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-text-dim font-mono">{item.time}</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border/60 text-center">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    onNotificationAction();
                  }}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center justify-center gap-1 w-full py-1 hover:bg-brand-500/10 rounded-lg transition-colors"
                >
                  <span>View Recovery Audit Trail</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Topbar User Avatar */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-border/60">
          <div className="relative group cursor-pointer">
            <img 
              src={merchantInfo.avatarUrl} 
              alt={merchantInfo.name} 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
