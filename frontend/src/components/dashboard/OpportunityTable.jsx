import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  Filter, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { recoveryOpportunities } from '../../data/mockData';

export default function OpportunityTable({ onExecuteAction, onInspectTransaction, searchQuery = '' }) {
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter opportunities based on risk, status and global/local search
  const filteredList = recoveryOpportunities.filter((item) => {
    const matchesRisk = filterRisk === 'all' || item.risk.toLowerCase() === filterRisk.toLowerCase();
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.failureReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recommendedAction.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 rounded-2xl glass-card border border-border/80 flex flex-col justify-between">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              Recovery Opportunities Preview
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-brand-500/20 text-brand-300 rounded border border-brand-500/30 uppercase">
              Priority Queue
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            High-confidence revenue opportunities prioritized for immediate algorithmic rescue
          </p>
        </div>

        {/* Risk & Status Filters */}
        <div className="flex items-center gap-2">
          {/* Risk Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-background-secondary border border-border/70 rounded-xl text-text-secondary focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="all">All Risks</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-background-secondary border border-border/70 rounded-xl text-text-secondary focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="ready">Ready</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-mono font-semibold uppercase text-text-dim">
              <th className="pb-3 pl-2">Transaction</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Risk Level</th>
              <th className="pb-3">Failure Reason</th>
              <th className="pb-3">Recommended Action</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-muted font-mono">
                  No matching opportunities found for current filter.
                </td>
              </tr>
            ) : (
              filteredList.map((opp) => (
                <tr 
                  key={opp.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  {/* Transaction ID & Customer */}
                  <td className="py-3.5 pl-2">
                    <button
                      onClick={() => onInspectTransaction && onInspectTransaction(opp)}
                      className="font-mono font-semibold text-brand-300 hover:text-brand-200 flex items-center gap-1.5 group-hover:underline text-left"
                    >
                      <span>{opp.id}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <div className="text-[11px] text-text-muted font-sans truncate max-w-[140px]">
                      {opp.customer}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 font-mono font-bold text-text-primary">
                    {opp.amount}
                  </td>

                  {/* Risk */}
                  <td className="py-3.5">
                    <StatusBadge type="risk" value={opp.risk} />
                  </td>

                  {/* Failure reason */}
                  <td className="py-3.5">
                    <div className="text-text-secondary font-medium">
                      {opp.failureReason}
                    </div>
                    <div className="text-[10px] font-mono text-text-dim">
                      {opp.gateway}
                    </div>
                  </td>

                  {/* Recommended action */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5 text-brand-300 font-medium">
                      <Sparkles className="w-3 h-3 text-brand-400 shrink-0" />
                      <span>{opp.recommendedAction}</span>
                    </div>
                    <div className="text-[10px] text-text-muted font-mono">
                      {opp.confidence}% AI Confidence
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    <StatusBadge type="status" value={opp.status} />
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={() => onExecuteAction && onExecuteAction(opp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 hover:text-white border border-brand-500/30 hover:border-brand-400/50 transition-all duration-150 group/act hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Execute</span>
                      <Zap className="w-3 h-3 text-brand-400 group-hover/act:text-white transition-colors" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
