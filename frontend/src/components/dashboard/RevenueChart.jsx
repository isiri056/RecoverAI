import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { pulseChartData } from '../../data/mockData';
import { Activity, Clock } from 'lucide-react';

/**
 * Custom Dark Theme Tooltip for Recharts
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background-elevated/95 backdrop-blur-md border border-border-brand/40 p-3.5 rounded-xl shadow-2xl min-w-[200px]">
        <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-border/80 text-xs font-mono text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-brand-400" />
            {label}
          </span>
          <span className="text-[10px] text-text-dim">Pulse Point</span>
        </div>

        <div className="space-y-1.5">
          {payload.map((entry, index) => {
            let labelText = 'At Risk';
            let colorDot = 'bg-amber-400';
            if (entry.dataKey === 'recoverable') {
              labelText = 'Recoverable';
              colorDot = 'bg-brand-400';
            } else if (entry.dataKey === 'recovered') {
              labelText = 'Recovered';
              colorDot = 'bg-emerald-400';
            }

            return (
              <div key={`item-${index}`} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${colorDot}`} />
                  <span className="text-text-muted">{labelText}:</span>
                </div>
                <span className="font-semibold text-text-primary">
                  ₹{entry.value}L
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ activeRange = '24h', onRangeChange }) {
  const [range, setRange] = useState(activeRange);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    if (onRangeChange) onRangeChange(newRange);
  };

  const chartData = pulseChartData[range] || pulseChartData['24h'];

  return (
    <div className="p-6 rounded-2xl glass-card border border-border/80 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              Revenue Recovery Pulse
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            {range === '24h' ? 'Last 24 hours · updated every 5 minutes' : 
             range === '7d' ? 'Last 7 days daily aggregate' : 'Monthly trend trajectory'}
          </p>
        </div>

        {/* Time Filter Pills + Series Legend Indicator */}
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className={`px-3 py-1 text-xs font-medium font-mono rounded-lg transition-all ${
                range === r
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'bg-background-secondary text-text-muted hover:text-text-primary hover:bg-white/[0.04] border border-border/50'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Series Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-4 px-2 text-xs font-medium font-mono text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-amber-400" />
          <span>At Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-brand-400" />
          <span>Recoverable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-emerald-400" />
          <span>Recovered</span>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* At Risk Gradient (Amber) */}
              <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>

              {/* Recoverable Gradient (Violet) */}
              <linearGradient id="colorRecoverable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>

              {/* Recovered Gradient (Emerald) */}
              <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1F263B" strokeDasharray="3 3" vertical={false} />
            
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#1F263B' }}
              dy={10}
            />

            <YAxis 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val}L`}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* At Risk Area */}
            <Area
              type="monotone"
              dataKey="atRisk"
              stroke="#F59E0B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAtRisk)"
              activeDot={{ r: 5, fill: "#F59E0B", stroke: "#0B0D13", strokeWidth: 2 }}
            />

            {/* Recoverable Area */}
            <Area
              type="monotone"
              dataKey="recoverable"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRecoverable)"
              activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#0B0D13", strokeWidth: 2 }}
            />

            {/* Recovered Area */}
            <Area
              type="monotone"
              dataKey="recovered"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRecovered)"
              activeDot={{ r: 6, fill: "#10B981", stroke: "#0B0D13", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
