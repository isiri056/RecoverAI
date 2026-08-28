import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  let icon = <Info className="w-5 h-5 text-brand-400 shrink-0" />;
  let borderStyle = 'border-brand-500/40 bg-background-elevated/95';

  if (type === 'success') {
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    borderStyle = 'border-emerald-500/40 bg-background-elevated/95 shadow-glow-emerald';
  } else if (type === 'warning') {
    icon = <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
    borderStyle = 'border-amber-500/40 bg-background-elevated/95 shadow-glow-amber';
  } else if (type === 'ai') {
    icon = <Sparkles className="w-5 h-5 text-brand-400 shrink-0 animate-pulse" />;
    borderStyle = 'border-brand-500/50 bg-background-elevated/95 shadow-glow-brand';
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border backdrop-blur-lg text-text-primary shadow-2xl transition-all duration-300 max-w-md ${borderStyle} animate-in fade-in slide-in-from-bottom-5`}>
      {icon}
      <div className="text-sm font-medium text-text-primary flex-1">{message}</div>
      <button 
        onClick={onClose}
        className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
