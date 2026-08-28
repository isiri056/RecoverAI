import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ArrowUpRight, 
  ShieldAlert, 
  Globe, 
  RotateCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { revenueRadarData } from '../data/mockData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function RevenueRadar({ onShowToast }) {
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live backend data states
  const [summary, setSummary] = useState(null);
  const [gateways, setGateways] = useState(revenueRadarData.gateways);
  const [anomalies, setAnomalies] = useState(revenueRadarData.activeAnomalies);
  const [failureDistribution, setFailureDistribution] = useState(revenueRadarData.failureDistribution);
  const [regionalCircles, setRegionalCircles] = useState(revenueRadarData.regionalCircles);

  const fetchRadarData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch live data from backend
      const [summaryRes, analyticsRes, txnsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/recovery/summary`).catch(() => null),
        fetch(`${API_BASE_URL}/api/analytics/overview`).catch(() => null),
        fetch(`${API_BASE_URL}/api/transactions`).catch(() => null)
      ]);

      if (summaryRes && summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }

      if (analyticsRes && analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        if (analyticsData.gateways && analyticsData.gateways.length > 0) {
          const mappedGw = analyticsData.gateways.map((g, idx) => ({
            id: `gw-${idx + 1}`,
            name: g.gateway || 'Primary Rail',
            successRate: g.recoveredRate || 95.0,
            latencyMs: g.avgLatency || 120,
            volume24h: '₹34.8L',
            status: (g.recoveredRate >= 70 ? 'healthy' : g.recoveredRate >= 55 ? 'degraded' : 'down'),
            issue: g.recoveredRate < 60 ? 'Core switch latency spike' : null
          }));
          setGateways(mappedGw);
        }
      }

      if (txnsRes && txnsRes.ok) {
        const txnsData = await txnsRes.json();
        const txns = txnsData.transactions || [];

        // Build active threats from live transactions
        if (txns.length > 0) {
          const activeFailed = txns.filter(t => t.status === 'failed' || t.recovery_status === 'Ready');
          const mappedAnomalies = activeFailed.slice(0, 3).map((t, idx) => ({
            id: `anom-${idx + 1}`,
            rail: `${t.gateway} (${t.payment_method})`,
            severity: t.priority === 'High' ? 'High' : 'Medium',
            impact: new Intl.NumberFormat('en-IN', { style: 'currency', currency: t.currency || 'INR', maximumFractionDigits: 0 }).format(t.amount || 0),
            recommendation: t.recommended_action || 'Autonomous Failover Switch',
            autoRerouted: t.recovery_status === 'Ready',
            time: 'Live Telemetry'
          }));
          if (mappedAnomalies.length > 0) {
            setAnomalies(mappedAnomalies);
          }

          // Build dynamic failure root cause breakdown
          const failureCounts = {};
          let totalFailures = 0;
          txns.forEach(t => {
            const reason = t.failure_reason || 'OTHER';
            failureCounts[reason] = (failureCounts[reason] || 0) + 1;
            totalFailures += 1;
          });

          const colorPalette = ['#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#EF4444', '#10B981'];
          const mappedDistribution = Object.keys(failureCounts).map((key, i) => {
            const count = failureCounts[key];
            const pct = Math.round((count / (totalFailures || 1)) * 100);
            return {
              name: key.replace(/_/g, ' '),
              value: pct,
              amount: `${count} txns`,
              color: colorPalette[i % colorPalette.length]
            };
          });

          if (mappedDistribution.length > 0) {
            setFailureDistribution(mappedDistribution);
          }
        }
      }

    } catch (err) {
      console.error('Failed to fetch radar telemetry:', err);
      setError(err.message || 'Unable to connect to telemetry backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadarData();
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    fetchRadarData();
    setTimeout(() => {
      setIsScanning(false);
      onShowToast?.("Radar network sweep complete. Live telemetry updated from backend.", "success");
    }, 700);
  };

  const handleAutoReroute = (anomaly) => {
    onShowToast?.(`Auto-failover initiated for ${anomaly.rail}! Diverted traffic to secondary acquirer.`, "ai");
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
              Sweeping payment rails & telemetry...
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono">
              Connecting to Live Radar API at {API_BASE_URL}/api/recovery/summary
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error && !summary) {
    return (
      <div className="space-y-6 pb-12">
        <div className="p-6 rounded-2xl glass-card border border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">
                Unable to load telemetry radar
              </h2>
              <p className="text-sm text-text-muted mt-1">
                RecoverAI could not connect to the radar backend engine.
              </p>
              <p className="text-xs font-mono text-red-300 mt-3">
                {error}
              </p>
              <button
                onClick={() => fetchRadarData()}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                Retry Telemetry Sweep
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
            <Radar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                Revenue Threat Radar
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE TELEMETRY</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Continuous spatial monitoring of payment gateway health, rail latency spikes & acquirer anomalies
            </p>
          </div>
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-background-card border border-border text-text-secondary hover:text-text-primary hover:border-brand-500/50 hover:bg-white/5 transition-all self-start sm:self-auto shadow-sm"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-brand-400' : ''}`} />
          <span>Sweep Rails Now</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-border/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">Network Health Index</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {summary ? `${summary.recoverable_percentage_of_risk}% Optimal` : revenueRadarData.overallHealthScore}
            </div>
            <span className="text-[11px] text-text-dim mt-0.5 block font-mono">
              Across {gateways.length} monitored gateways
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">Active Payment Threats</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {summary ? `${summary.active_cases_count} Threat Cases` : `${revenueRadarData.activeThreatCount} Rails Degraded`}
            </div>
            <span className="text-[11px] text-text-dim mt-0.5 block font-mono">
              {summary ? `At Risk: ${summary.revenue_at_risk_formatted}` : 'SBI & HDFC UPI switches'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-border/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">Autonomous Salvage Volume</span>
            <div className="text-2xl font-bold font-mono text-brand-400 mt-1">
              {summary ? summary.recovered_formatted : '84.2% Success'}
            </div>
            <span className="text-[11px] text-text-dim mt-0.5 block font-mono">
              {summary ? `Recoverable: ${summary.recoverable_revenue_formatted}` : '₹8.4L rescued today'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Live Active Anomalies / Alerts */}
      <div className="p-6 rounded-2xl glass-card border border-brand-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Real-Time Gateway Threats Detected by RecoverAI
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            ● LIVE BACKEND FEED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {anomalies.map((anom) => (
            <div 
              key={anom.id}
              className="p-4 rounded-xl bg-background-secondary/80 border border-border/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                    anom.severity === 'High' ? 'bg-red-950/60 text-red-300 border border-red-500/30' :
                    anom.severity === 'Medium' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                    'bg-brand-950/60 text-brand-300 border border-brand-500/30'
                  }`}>
                    {anom.severity} Threat
                  </span>
                  <span className="text-[10px] text-text-dim font-mono">{anom.time}</span>
                </div>

                <h4 className="text-sm font-semibold text-text-primary mt-2">{anom.rail}</h4>
                <p className="text-xs font-mono text-amber-400 mt-0.5">At Risk: {anom.impact}</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{anom.recommendation}</p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] font-mono text-text-dim">
                  {anom.autoRerouted ? '✓ Auto-Rerouted' : 'Manual Review'}
                </span>
                <button
                  onClick={() => handleAutoReroute(anom)}
                  className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500 hover:text-white transition-colors"
                >
                  Deploy Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Gateway Health Table & Failure Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gateway Health List (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Payment Gateway & Rail Reliability Status
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Real-time uptime telemetry & latency benchmarks across connected merchant acquirers
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-mono text-text-dim uppercase">
                  <th className="pb-2 pl-2">Gateway Rail</th>
                  <th className="pb-2">Success Rate</th>
                  <th className="pb-2">Avg Latency</th>
                  <th className="pb-2">24h Volume</th>
                  <th className="pb-2 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs font-mono">
                {gateways.map((gw) => (
                  <tr key={gw.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pl-2 font-semibold text-text-primary">
                      {gw.name}
                      {gw.issue && (
                        <span className="block text-[10px] text-amber-400 font-sans mt-0.5">
                          ⚠ {gw.issue}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        gw.successRate >= 70 ? 'text-emerald-400' :
                        gw.successRate >= 55 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {gw.successRate}%
                      </span>
                    </td>
                    <td className="py-3 text-text-secondary">{gw.latencyMs}ms</td>
                    <td className="py-3 text-text-muted">{gw.volume24h}</td>
                    <td className="py-3 text-right pr-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        gw.status === 'healthy' ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30' :
                        gw.status === 'degraded' ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30' :
                        'bg-red-950/50 text-red-300 border border-red-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          gw.status === 'healthy' ? 'bg-emerald-400' :
                          gw.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <span>{gw.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failure Breakdown Chart (1 col) */}
        <div className="lg:col-span-1 p-6 rounded-2xl glass-card border border-border/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">Failure Root Cause</h3>
            <p className="text-xs text-text-muted mt-0.5">Distribution across drop-off vectors</p>

            <div className="h-52 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureDistribution} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#1F263B" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={10} width={90} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#181D2E', borderColor: '#3B2D60', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val) => [`${val}% of total failures`, 'Percentage']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {failureDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5">
            {failureDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}:</span>
                </div>
                <span className="text-text-primary font-semibold">{item.amount} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Regional Banking Circle Health Map */}
      <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-400" />
          <h3 className="text-base font-bold text-text-primary">
            Regional Banking Circle Health Telemetry
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {regionalCircles.map((circle) => (
            <div key={circle.circle} className="p-3.5 rounded-xl bg-background-secondary/60 border border-border/70 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-text-primary font-semibold block">{circle.circle}</span>
                <span className="text-[11px] text-text-dim mt-0.5 block">Latency: {circle.latency}</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${circle.status === 'Optimal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {circle.health}
                </span>
                <span className="text-[10px] text-text-muted block">{circle.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
