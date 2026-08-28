import React, { useEffect, useState } from 'react';
import {
  ReceiptText,
  Search,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function Transactions({ onShowToast }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const [selectedTxn, setSelectedTxn] = useState(null);

  // Live backend data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // FETCH TRANSACTIONS FROM FASTAPI BACKEND
  // ============================================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/transactions`
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const data = await response.json();

        console.log('Live transactions from backend:', data);

        // Backend response contains a transactions array
        const backendTransactions = data.transactions || [];

        // Convert backend format to the format expected by
        // the existing RecoverAI UI
        const formattedTransactions = backendTransactions.map(
          (txn) => ({
            id: String(txn.transaction_id ?? 'Unknown'),

            customer: txn.customer_name ?? 'Unknown Customer',

            email: txn.customer_email ?? 'No email',

            amount: new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: txn.currency || 'INR',
              maximumFractionDigits: 0,
            }).format(Number(txn.amount || 0)),

            errorCode:
              txn.failure_reason ||
              txn.error_code ||
              txn.status ||
              'Unknown',

            gateway: txn.gateway ?? 'Unknown',

            rail: txn.payment_method ?? 'Unknown',

            recommendedAction:
              txn.recommended_action ||
              'Review Transaction',

            salvageProbability:
              txn.recovery_probability !== undefined &&
              txn.recovery_probability !== null
                ? `${txn.recovery_probability}%`
                : '0%',

            recoveryStatus:
              txn.recovery_status ?? 'Pending',

            risk: String(
              txn.priority ?? 'Medium'
            ).toLowerCase(),

            timestamp:
              txn.timestamp ||
              txn.created_at ||
              'Recently',

            lastPayload: {
              http_status:
                txn.http_status ||
                txn.status ||
                'N/A',

              sub_error:
                txn.failure_reason ||
                txn.error_code ||
                'No additional details',
            },

            rawPayload: txn,
          })
        );

        setTransactions(formattedTransactions);
      } catch (err) {
        console.error(
          'Failed to fetch transactions:',
          err
        );

        setError(
          err.message ||
            'Unable to connect to RecoverAI backend'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredTransactions = transactions.filter((txn) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      !search ||
      txn.id.toLowerCase().includes(searchText) ||
      txn.customer.toLowerCase().includes(searchText) ||
      txn.email.toLowerCase().includes(searchText) ||
      txn.errorCode.toLowerCase().includes(searchText) ||
      txn.gateway.toLowerCase().includes(searchText);

    const matchesStatus =
      filterStatus === 'all' ||
      txn.recoveryStatus.toLowerCase() ===
        filterStatus.toLowerCase();

    const matchesRisk =
      filterRisk === 'all' ||
      txn.risk.toLowerCase() ===
        filterRisk.toLowerCase();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRisk
    );
  });

  // ============================================================
  // EXPORT
  // ============================================================

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      onShowToast?.(
        'No transactions available to export.',
        'error'
      );
      return;
    }

    const headers = [
      'Transaction ID',
      'Customer',
      'Email',
      'Amount',
      'Error',
      'Gateway',
      'Payment Method',
      'Recovery Status',
      'Priority',
      'Recovery Probability',
      'Recommended Action',
    ];

    const rows = transactions.map((txn) => [
      txn.id,
      txn.customer,
      txn.email,
      txn.amount,
      txn.errorCode,
      txn.gateway,
      txn.rail,
      txn.recoveryStatus,
      txn.risk,
      txn.salvageProbability,
      txn.recommendedAction,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? '').replace(
              /"/g,
              '""'
            )}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download =
      'recoverai-transactions.csv';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast?.(
      'Transactions ledger exported successfully.',
      'success'
    );
  };

  // ============================================================
  // RECOVERY ACTION
  // ============================================================

  const handleExecuteRecovery = (txn) => {
    onShowToast?.(
      `Deploying "${txn.recommendedAction}" for ${txn.id} (${txn.amount})...`,
      'ai'
    );

    setTimeout(() => {
      onShowToast?.(
        `Transaction ${txn.id} moved to In Progress state!`,
        'success'
      );
    }, 1000);
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
              Loading live transactions...
            </p>

            <p className="text-xs text-text-muted mt-1">
              Connecting to RecoverAI Revenue Engine
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <div className="space-y-6 pb-12">
        <div className="p-6 rounded-2xl glass-card border border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <ReceiptText className="w-5 h-5 text-red-400" />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                Unable to load transactions
              </h2>

              <p className="text-sm text-text-muted mt-1">
                RecoverAI could not connect to the backend.
              </p>

              <p className="text-xs font-mono text-red-300 mt-3">
                {error}
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
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

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/70">

        <div className="flex items-center gap-3">

          <div className="p-3 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-300 shadow-glow-brand">
            <ReceiptText className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Transactions & Recovery Ledger
            </h1>

            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Live audit stream of merchant payment drop-offs,
              automated salvage attempts, and gateway responses
            </p>
          </div>

        </div>

        {/* Export Button */}

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-background-card border border-border text-text-secondary hover:text-text-primary hover:border-brand-500/50 hover:bg-white/5 transition-all self-start sm:self-auto shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />

          <span>
            Export Ledger (.CSV)
          </span>
        </button>

      </div>


      {/* ======================================================
          LIVE DATA INDICATOR
      ====================================================== */}

      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20">

        <div className="flex items-center gap-2">

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-mono text-emerald-300">
            LIVE BACKEND DATA
          </span>

        </div>

        <span className="text-xs font-mono text-text-muted">
          {transactions.length} transactions loaded
        </span>

      </div>


      {/* ======================================================
          SEARCH + FILTERS
      ====================================================== */}

      <div className="p-4 rounded-2xl glass-card border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Search */}

        <div className="relative w-full sm:w-80 group">

          <Search className="w-4 h-4 text-text-muted group-focus-within:text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by ID, customer, error code..."
            className="w-full pl-10 pr-4 py-2 text-xs font-sans bg-background-secondary border border-border/70 rounded-xl text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-500 transition-colors"
          />

        </div>


        {/* Filters */}

        <div className="flex items-center gap-2 w-full sm:w-auto">

          {/* Status */}

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="px-3 py-2 text-xs font-mono bg-background-secondary border border-border/70 rounded-xl text-text-secondary focus:outline-none focus:border-brand-500 flex-1 sm:flex-initial"
          >
            <option value="all">
              All Recovery Statuses
            </option>

            <option value="recovered">
              Recovered
            </option>

            <option value="in progress">
              In Progress
            </option>

            <option value="ready">
              Ready
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="failed">
              Failed
            </option>
          </select>


          {/* Risk */}

          <select
            value={filterRisk}
            onChange={(e) =>
              setFilterRisk(e.target.value)
            }
            className="px-3 py-2 text-xs font-mono bg-background-secondary border border-border/70 rounded-xl text-text-secondary focus:outline-none focus:border-brand-500 flex-1 sm:flex-initial"
          >
            <option value="all">
              All Risk Tiers
            </option>

            <option value="high">
              High Risk
            </option>

            <option value="medium">
              Medium Risk
            </option>

            <option value="low">
              Low Risk
            </option>
          </select>

        </div>

      </div>


      {/* ======================================================
          TRANSACTIONS TABLE
      ====================================================== */}

      <div className="p-6 rounded-2xl glass-card border border-border/80">

        <div className="overflow-x-auto -mx-6 px-6">

          <table className="w-full text-left border-collapse min-w-[850px]">

            <thead>
              <tr className="border-b border-border/70 text-[11px] font-mono font-semibold uppercase text-text-dim">

                <th className="pb-3 pl-2">
                  Transaction ID
                </th>

                <th className="pb-3">
                  Customer
                </th>

                <th className="pb-3">
                  Amount
                </th>

                <th className="pb-3">
                  Error / Rail
                </th>

                <th className="pb-3">
                  AI Recovery Strategy
                </th>

                <th className="pb-3">
                  Status
                </th>

                <th className="pb-3 text-right pr-2">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-border/40 text-xs">

              {filteredTransactions.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-text-muted font-mono"
                  >
                    No transactions matching the selected criteria.
                  </td>
                </tr>

              ) : (

                filteredTransactions.map((txn) => (

                  <tr
                    key={txn.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >

                    {/* ID */}

                    <td className="py-3.5 pl-2 font-mono">

                      <button
                        onClick={() =>
                          setSelectedTxn(txn)
                        }
                        className="font-bold text-brand-300 hover:text-brand-200 flex items-center gap-1.5 group-hover:underline"
                      >
                        <span>
                          {txn.id}
                        </span>

                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      <span className="text-[10px] text-text-dim block mt-0.5">
                        {txn.timestamp}
                      </span>

                    </td>


                    {/* CUSTOMER */}

                    <td className="py-3.5">

                      <div className="font-semibold text-text-primary">
                        {txn.customer}
                      </div>

                      <div className="text-[11px] text-text-muted font-mono">
                        {txn.email}
                      </div>

                    </td>


                    {/* AMOUNT */}

                    <td className="py-3.5 font-mono font-bold text-text-primary">
                      {txn.amount}
                    </td>


                    {/* ERROR / RAIL */}

                    <td className="py-3.5 font-mono">

                      <span className="text-amber-400 font-semibold block">
                        {txn.errorCode}
                      </span>

                      <span className="text-text-dim text-[10px] block mt-0.5">
                        {txn.gateway} · {txn.rail}
                      </span>

                    </td>


                    {/* AI STRATEGY */}

                    <td className="py-3.5">

                      <div className="flex items-center gap-1 text-brand-300 font-medium">

                        <Sparkles className="w-3 h-3 text-brand-400 shrink-0" />

                        <span>
                          {txn.recommendedAction}
                        </span>

                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                        {txn.salvageProbability} Salvage Prob.
                      </span>

                    </td>


                    {/* STATUS */}

                    <td className="py-3.5">

                      <StatusBadge
                        type="status"
                        value={txn.recoveryStatus}
                      />

                    </td>


                    {/* ACTION */}

                    <td className="py-3.5 text-right pr-2">

                      <button
                        onClick={() =>
                          handleExecuteRecovery(txn)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 hover:text-white border border-brand-500/30 transition-all hover:scale-[1.02]"
                      >

                        <Zap className="w-3 h-3" />

                        <span>
                          Retry
                        </span>

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================================
          TRANSACTION DETAIL MODAL
      ====================================================== */}

      {selectedTxn && (

        <Modal
          isOpen={!!selectedTxn}
          onClose={() =>
            setSelectedTxn(null)
          }
          title={`Transaction Telemetry Payload: ${selectedTxn.id}`}
        >

          <div className="space-y-4 font-mono text-xs">

            {/* Customer + Amount */}

            <div className="p-4 rounded-xl bg-background-secondary border border-border/80 flex items-center justify-between">

              <div>

                <span className="text-text-muted text-[11px] block">
                  Customer Entity
                </span>

                <span className="text-sm font-bold text-text-primary font-sans">
                  {selectedTxn.customer}
                </span>

              </div>

              <div className="text-right">

                <span className="text-xl font-bold text-text-primary">
                  {selectedTxn.amount}
                </span>

                <span className="text-text-dim text-[10px] block">
                  {selectedTxn.timestamp}
                </span>

              </div>

            </div>


            {/* Error */}

            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300">

              <span className="font-bold block">
                Gateway Error Code: {selectedTxn.errorCode}
              </span>

              <span className="text-[11px] text-text-muted mt-1 block">
                Acquirer responded with HTTP Status{' '}
                {selectedTxn.lastPayload?.http_status ?? 'N/A'}{' '}
                ({selectedTxn.lastPayload?.sub_error ?? 'No additional details'})
              </span>

            </div>


            {/* Raw JSON */}

            <div>

              <span className="text-text-dim text-[11px] block mb-1.5 uppercase font-bold">
                Raw Telemetry Payload (JSON)
              </span>

              <pre className="p-4 rounded-xl bg-background border border-border/80 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(
                  selectedTxn.rawPayload,
                  null,
                  2
                )}
              </pre>

            </div>


            {/* Modal buttons */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() =>
                  setSelectedTxn(null)
                }
                className="px-4 py-2 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleExecuteRecovery(
                    selectedTxn
                  );

                  setSelectedTxn(null);
                }}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold flex items-center gap-1.5 shadow-glow-brand"
              >
                <Zap className="w-3.5 h-3.5" />

                <span>
                  Deploy AI Recovery
                </span>
              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
}