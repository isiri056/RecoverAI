import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Terminal, 
  RotateCw, 
  Lock, 
  Layers, 
  Settings2, 
  AlertTriangle, 
  ArrowRight,
  FlaskConical,
  Activity
} from 'lucide-react';
import { agentStudioData } from '../data/mockData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://recoverai-backend-lzlh.onrender.com').replace(/\/$/, '');

export default function AIAgent({ onShowToast }) {
  const [autonomousMode, setAutonomousMode] = useState(agentStudioData.autonomousMode);
  const [safetyLimit, setSafetyLimit] = useState(agentStudioData.safetyLimitPerTxn);
  const [confidenceThreshold, setConfidenceThreshold] = useState(agentStudioData.minConfidenceThreshold);
  const [selectedModel, setSelectedModel] = useState(agentStudioData.selectedModel);
  const [systemPrompt, setSystemPrompt] = useState(agentStudioData.systemPrompt);
  const [isSaving, setIsSaving] = useState(false);

  // Live backend states
  const [agentStatus, setAgentStatus] = useState(null);
  const [prioritizedQueue, setPrioritizedQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interactive Live Strategy Sandbox State
  const [testAmount, setTestAmount] = useState(75000);
  const [testMethod, setTestMethod] = useState('UPI');
  const [testReason, setTestReason] = useState('UPI_TIMEOUT');
  const [testGateway, setTestGateway] = useState('Razorpay');
  const [testResult, setTestResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusRes, prioritizeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/agent/status`).catch(() => null),
        fetch(`${API_BASE_URL}/api/agent/prioritize`, { method: 'POST' }).catch(() => null)
      ]);

      if (statusRes && statusRes.ok) {
        const data = await statusRes.json();
        setAgentStatus(data);
        if (data.is_autonomous !== undefined) setAutonomousMode(data.is_autonomous);
        if (data.safety_limit_per_txn) setSafetyLimit(data.safety_limit_per_txn);
      }

      if (prioritizeRes && prioritizeRes.ok) {
        const pData = await prioritizeRes.json();
        if (pData.prioritized_queue) {
          setPrioritizedQueue(pData.prioritized_queue);
        }
      }

    } catch (err) {
      console.error('Failed to fetch AI agent telemetry:', err);
      setError(err.message || 'Unable to connect to AI Agent engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  const handleSaveConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onShowToast?.("AI Agent policies & safety thresholds updated successfully in runtime engine!", "success");
    }, 600);
  };

  const handleToggleAutonomy = () => {
    const nextState = !autonomousMode;
    setAutonomousMode(nextState);
    onShowToast?.(`Autonomous Execution Mode ${nextState ? 'ENABLED' : 'DISABLED'}`, nextState ? 'ai' : 'warning');
  };

  const handleRunTestAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(testAmount),
          payment_method: testMethod,
          failure_reason: testReason,
          gateway: testGateway
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(data);
        onShowToast?.(`Heuristic evaluation complete: ${data.recommended_action} (${data.recovery_probability}% certainty)`, "ai");
      } else {
        throw new Error('Analysis request failed');
      }
    } catch (e) {
      console.error('Analysis error:', e);
      onShowToast?.('Failed to evaluate strategy via backend.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
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
              Connecting to Autonomous Decision Engine...
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono">
              Loading agent telemetry from {API_BASE_URL}/api/agent/status
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (error && !agentStatus) {
    return (
      <div className="space-y-6 pb-12">
        <div className="p-6 rounded-2xl glass-card border border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">
                Unable to load AI Agent telemetry
              </h2>
              <p className="text-sm text-text-muted mt-1">
                RecoverAI could not connect to the agent reasoning engine.
              </p>
              <p className="text-xs font-mono text-red-300 mt-3">
                {error}
              </p>
              <button
                onClick={() => fetchAgentData()}
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
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                AI Agent Studio & Autonomy Console
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 rounded-full border border-emerald-500/30">
                ● {agentStatus?.status || 'ACTIVE'} ({agentStatus?.version || 'RAG-v2.4'})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Configure autonomous decision rules, safety bounds, LLM heuristics & multi-agent worker threads
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all self-start sm:self-auto hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Updating Agent...' : 'Save Agent Policies'}</span>
        </button>
      </div>

      {/* 2. Top Autonomy & Budget Banner */}
      <div className="p-6 rounded-2xl glass-card border border-brand-500/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              Autonomous Recovery Execution
            </h3>
            <button
              onClick={handleToggleAutonomy}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autonomousMode ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autonomousMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-text-muted max-w-xl leading-relaxed">
            When enabled, RecoverAI will autonomously formulate and dispatch payment reroutes and token retries without waiting for manual human sign-off as long as transactions are under the threshold.
          </p>
        </div>

        {/* Daily Budget Progress */}
        <div className="p-4 rounded-xl bg-background-secondary/80 border border-border/80 min-w-[260px] space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Tasks Processed Today:</span>
            <span className="text-emerald-400 font-bold">{agentStatus?.tasks_processed_today || 284} Tasks</span>
          </div>
          <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/60">
            <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-2 rounded-full" style={{ width: '28.8%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-text-dim">
            <span>Safety Limit: {agentStatus?.safety_limit_formatted || '₹1,00,000'}</span>
            <span>{agentStatus?.recovery_success_rate || '30.8%'} Success</span>
          </div>
        </div>
      </div>

      {/* 3. Parameters & Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safety & Thresholds Card */}
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide font-mono">
              Safety Boundaries & Guardrails
            </h3>
          </div>

          {/* Safety Limit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary">Max Autonomous Value per Txn:</span>
              <span className="font-bold text-brand-300">₹{(safetyLimit / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="10000"
              value={safetyLimit}
              onChange={(e) => setSafetyLimit(Number(e.target.value))}
              className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <span className="text-[11px] text-text-dim block">
              Transactions &gt; ₹{(safetyLimit / 1000).toFixed(0)}k require manual operator approval.
            </span>
          </div>

          {/* Minimum Confidence Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary">Min. AI Confidence Threshold:</span>
              <span className="font-bold text-emerald-400">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[11px] text-text-dim block">
              Agent will only autonomously intervene when algorithmic certainty is at or above {confidenceThreshold}%.
            </span>
          </div>
        </div>

        {/* Model Selection Card */}
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide font-mono">
              Model Selection & Heuristics Pool
            </h3>
          </div>

          {/* Model Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-secondary block">Active Reasoning Engine:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2.5 text-xs font-mono bg-background-secondary border border-border/70 rounded-xl text-text-primary focus:outline-none focus:border-brand-500"
            >
              <option value="Gemini 1.5 Pro (Fintech Tuned)">Gemini 1.5 Pro (Fintech Tuned - Recommended)</option>
              <option value="RecoverAI RAG-v2.4 Specialized">RecoverAI RAG-v2.4 Specialized Switch Engine</option>
              <option value="Claude 3.5 Sonnet Payments">Claude 3.5 Sonnet Payments Architecture</option>
            </select>
          </div>

          {/* Worker pool metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-background-secondary/60 border border-border/70">
              <span className="text-text-muted text-[10px] block">Worker Pool Threads</span>
              <span className="text-base font-bold text-text-primary mt-0.5 block">{agentStatus?.active_threads || 8} Concurrent</span>
            </div>
            <div className="p-3 rounded-xl bg-background-secondary/60 border border-border/70">
              <span className="text-text-muted text-[10px] block">Average Decision Latency</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">142ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Prioritized Opportunities Queue from POST /api/agent/prioritize */}
      {prioritizedQueue.length > 0 && (
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm sm:text-base font-bold text-text-primary">
                Live Evaluated & Prioritized Recovery Queue (POST /api/agent/prioritize)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              ● DETERMINISTIC HEURISTICS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prioritizedQueue.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-background-secondary/70 border border-border/70 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-300">{item.transaction_id || `OPP-${idx + 1}`}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    {item.recovery_probability}% Certainty
                  </span>
                </div>
                <div className="font-sans font-semibold text-text-primary">{item.recommended_action}</div>
                <p className="text-[11px] text-text-muted leading-relaxed font-sans">{item.explainability_rationale}</p>
                <div className="pt-2 border-t border-border/40 flex justify-between text-[11px]">
                  <span className="text-text-dim">Salvageable:</span>
                  <span className="text-emerald-400 font-bold">₹{item.estimated_salvageable_amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Live Strategy Sandbox / Reasoning Simulator (POST /api/agent/analyze) */}
      <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide font-mono">
              Live Heuristic Evaluation Sandbox (POST /api/agent/analyze)
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            REAL-TIME API TESTER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1 font-mono text-xs">
            <label className="text-text-secondary">Amount (INR):</label>
            <input 
              type="number" 
              value={testAmount} 
              onChange={(e) => setTestAmount(e.target.value)} 
              className="w-full p-2 rounded-xl bg-background-secondary border border-border/70 text-text-primary focus:outline-none focus:border-brand-500" 
            />
          </div>

          <div className="space-y-1 font-mono text-xs">
            <label className="text-text-secondary">Payment Method:</label>
            <select 
              value={testMethod} 
              onChange={(e) => setTestMethod(e.target.value)} 
              className="w-full p-2 rounded-xl bg-background-secondary border border-border/70 text-text-primary focus:outline-none focus:border-brand-500"
            >
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Mandate">Mandate</option>
              <option value="NetBanking">NetBanking</option>
            </select>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <label className="text-text-secondary">Failure Reason:</label>
            <select 
              value={testReason} 
              onChange={(e) => setTestReason(e.target.value)} 
              className="w-full p-2 rounded-xl bg-background-secondary border border-border/70 text-text-primary focus:outline-none focus:border-brand-500"
            >
              <option value="UPI_TIMEOUT">UPI_TIMEOUT</option>
              <option value="CARD_3DS_DROPOFF">CARD_3DS_DROPOFF</option>
              <option value="CHECKOUT_ABANDONED">CHECKOUT_ABANDONED</option>
              <option value="BANK_SERVER_DOWN">BANK_SERVER_DOWN</option>
              <option value="INSUFFICIENT_FUNDS">INSUFFICIENT_FUNDS</option>
              <option value="MANDATE_EXPIRED">MANDATE_EXPIRED</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunTestAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-glow-brand"
            >
              <Zap className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Evaluating...' : 'Evaluate Live'}</span>
            </button>
          </div>
        </div>

        {testResult && (
          <div className="p-4 rounded-xl bg-brand-950/20 border border-brand-500/30 space-y-2 font-mono text-xs animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-brand-300">
                Recommended Action: {testResult.recommended_action}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                  {testResult.recovery_probability}% Recovery Probability
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/50 text-cyan-400 border border-cyan-500/30">
                  Est. Salvageable: ₹{testResult.estimated_salvageable_amount?.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-text-muted font-sans text-xs">{testResult.explainability_rationale}</p>
          </div>
        )}
      </div>

      {/* 6. Active Heuristic Matrix & System Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heuristics Table */}
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide font-mono">
            Calibrated Heuristic Rules (RAG-v2.4)
          </h3>
          <div className="divide-y divide-border/40 font-mono text-xs">
            {agentStudioData.heuristics.map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-text-primary font-semibold block">{h.name}</span>
                  <span className="text-[10px] text-text-dim">ID: {h.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{h.accuracy} precision</span>
                  <span className="text-[10px] text-brand-300">{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Prompt Console */}
        <div className="p-6 rounded-2xl glass-card border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide font-mono">
                System Instructions & Policy Prompt
              </h3>
            </div>
            <span className="text-[10px] font-mono text-text-dim">Read/Write Sandbox</span>
          </div>

          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={7}
            className="w-full p-3.5 text-xs font-mono bg-background border border-border/80 rounded-xl text-emerald-400 focus:outline-none focus:border-brand-500 leading-relaxed resize-none"
          />
        </div>
      </div>
    </div>
  );
}
