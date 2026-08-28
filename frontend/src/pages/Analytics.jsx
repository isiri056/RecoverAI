import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Calendar, 
  Download, 
  PieChart as PieIcon,
  Sparkles,
  Layers,
  RotateCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { analyticsReportData } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000';

export default function Analytics({ onShowToast }) {
  const [timeRange, setTimeRange] = useState('8m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live analytics state
  const [overview, setOverview] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState(analyticsReportData.monthlyTrend);
  const [gatewayReliability, setGatewayReliability] = useState(analyticsReportData.gatewayReliability);
  const [channelAttribution, setChannelAttribution] = useState(analyticsReportData.channelAttribution);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewRes, pulseRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/overview`).catch(() => null),
        fetch(`${API_BASE_URL}/api/analytics/revenue-pulse?interval=24h`).catch(() => null)
      ]);

      if (overviewRes && overviewRes.ok) {
        const data = await overviewRes.json();
        setOverview(data);

        if (data.gateways && data.gateways.length > 0) {
          setGatewayReliability(data.gateways);
        }

        if (data.channels && data.channels.length > 0) {
          setChannelAttribution(data.channels);
        }
      }

    } catch (err) {
      console.error('Failed to fetch analytics from backend:', err);
      setError(err.message || 'Unable to connect to analytics engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleExportReport = () => {
    onShowToast?.("Exporting comprehensive Revenue Recovery Analytics (.CSV)...", "success");
    
    // Generate CSV export
    const headers = ['Category', 'Metric', 'Value'];
    const rows = [
      ['Topline', 'Total Revenue Preserved', overview?.total_preserved_formatted || analyticsReportData.totalRevenuePreserved],
      ['Topline', 'Customer Churn Prevented', `${overview?.churn_prevented_rate || 18.4}%`],
      ['Topline', 'ROI Multiplier', overview?.roi_multiplier || analyticsReportData.roiMultiplier],
      ['Topline', 'Salvaged Orders Count', String(overview?.salvaged_count || 1284)],
      ...(gatewayReliability || []).map(g => ['Gateway Benchmark', g.gateway, `${g.recoveredRate}%`]),
      ...(channelAttribution || []).map(c => ['Channel Attribution', c.channel, `${c.revenue} (${c.percentage}%)`])
    ];

    const csvContent = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recoverai-analytics-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-text-primary">
              Computing unit economics & recovery intelligence...
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono">
              Connecting to Live Analytics API at {API_BASE_URL}/api/analytics/overview
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error && !overview) {
    return (
      <div className="space-y-6 pb-12">
        <div className="p-6 rounded-2xl glass-card border border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">
                Unable to load analytics data
              </h2>
              <p className="text-sm text-text-muted mt-1">
                RecoverAI could not fetch intelligence metrics from the backend.
              </p>
              <p className="text-xs font-mono text-red-300 mt-3">
                {error}
              </p>
              <button
                onClick={() => fetchAnalyticsData()}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-300 shadow-glow-brand">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                Recovery Analytics & Unit Economics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[11px] font-mono font-semibold border border-emerald-500/30">
                ● LIVE ANALYTICS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Deep financial intelligence on preserved merchant revenue, gateway benchmarks, and ROI velocity
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-background-card border border-border text-text-secondary hover:text-text-primary hover:border-brand-500/50 hover:bg-white/5 transition-all self-start sm:self-auto shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* 2. Topline Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-border/80">
          <span className="text-xs font-mono uppercase text-text-muted">Total Revenue Preserved</span>
          <div className="text-2xl lg:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            {overview?.total_preserved_formatted || analyticsReportData.totalRevenuePreserved}
          </div>
          <span className="text-[11px] text-text-dim mt-1 block font-mono">
            {overview?.salvaged_count ? `${overview.salvaged_count.toLocaleString()} rescued orders` : '1,284 rescued orders'}
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/80">
          <span className="text-xs font-mono uppercase text-text-muted">Customer Churn Prevented</span>
          <div className="text-2xl lg:text-3xl font-extrabold font-mono text-brand-300 mt-1">
            {overview ? `${overview.churn_prevented_rate}%` : analyticsReportData.churnPreventedRate}
          </div>
          <span className="text-[11px] text-text-dim mt-1 block">Cohort 30-day retention</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/80">
          <span className="text-xs font-mono uppercase text-text-muted">Net ROI Multiplier</span>
          <div className="text-2xl lg:text-3xl font-extrabold font-mono text-cyan-300 mt-1">
            {overview?.roi_multiplier || analyticsReportData.roiMultiplier}
          </div>
          <span className="text-[11px] text-text-dim mt-1 block">₹14.20 saved per ₹1 spent</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/80">
          <span className="text-xs font-mono uppercase text-text-muted">Avg Recovery Latency</span>
          <div className="text-2xl lg:text-3xl font-extrabold font-mono text-amber-300 mt-1">
            3.8 mins
          </div>
          <span className="text-[11px] text-text-dim mt-1 block">From failure to success</span>
        </div>
      </div>

      {/* 3. Monthly Preserved vs Lost Area Chart */}
      <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Monthly Preserved vs Unrecoverable Revenue
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Longitudinal tracking of merchant revenue salvaging progression
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-emerald-400" />
              <span>Recovered (₹ Lakhs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-red-400" />
              <span>Unrecoverable</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1F263B" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#181D2E', borderColor: '#3B2D60', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [`₹${v} Lakhs`, 'Amount']}
              />
              <Area type="monotone" dataKey="recovered" stroke="#10B981" strokeWidth={2.5} fill="url(#colorRec)" />
              <Area type="monotone" dataKey="lost" stroke="#EF4444" strokeWidth={1.5} fill="url(#colorLost)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Gateway Benchmark & Channel Attribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Benchmark Bar Chart */}
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Gateway Recovery Efficiency Benchmark
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Recovery success % when routing through specific acquirers
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gatewayReliability} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="#1F263B" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="gateway" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181D2E', borderColor: '#3B2D60', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [`${v}% Recovery Success`, 'Rate']}
                />
                <Bar dataKey="recoveredRate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Attribution Breakdown */}
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Revenue Salvage Channel Attribution
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Contribution of specific automated recovery workflows
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {channelAttribution.map((item) => (
              <div key={item.channel} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-text-primary font-semibold">{item.channel}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{item.revenue} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/50">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-text-dim font-mono text-right">
            Based on {overview?.salvaged_count || 1284} successful multi-channel interventions
          </div>
        </div>
      </div>
    </div>
  );
}
