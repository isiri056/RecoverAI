import React, { useEffect, useState } from 'react';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import MetricCard from '../components/dashboard/MetricCard';
import AIInsight from '../components/dashboard/AIInsight';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import OpportunityTable from '../components/dashboard/OpportunityTable';
import AgentStatus from '../components/dashboard/AgentStatus';

import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';

import {
  Sparkles,
  Zap,
  BrainCircuit,
} from 'lucide-react';

import {
  kpiMetrics as mockKpiMetrics,
  recoveryOpportunities as mockRecoveryOpportunities,
} from '../data/mockData';


const API_BASE_URL = 'http://localhost:8000';


export default function Dashboard({
  searchQuery,
  selectedRange,
  onRangeChange,
  onShowToast,
  onNavigate,
}) {

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const [selectedMetric, setSelectedMetric] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [kpiMetrics, setKpiMetrics] = useState(mockKpiMetrics);

  const [recoveryOpportunities, setRecoveryOpportunities] =
    useState(mockRecoveryOpportunities);

  const [backendConnected, setBackendConnected] = useState(false);

  const [loading, setLoading] = useState(true);


  // ---------------------------------------------------------
  // HELPER
  // ---------------------------------------------------------

  const getValue = (obj, keys, fallback = null) => {

    if (!obj) return fallback;

    for (const key of keys) {

      if (
        obj[key] !== undefined &&
        obj[key] !== null
      ) {
        return obj[key];
      }

    }

    return fallback;
  };


  const formatCurrency = (value) => {

    if (value === null || value === undefined) {
      return '₹0';
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    if (number >= 10000000) {
      return `₹${(number / 10000000).toFixed(1)}Cr`;
    }

    if (number >= 100000) {
      return `₹${(number / 100000).toFixed(1)}L`;
    }

    if (number >= 1000) {
      return `₹${(number / 1000).toFixed(1)}K`;
    }

    return `₹${number.toLocaleString('en-IN')}`;
  };


  // ---------------------------------------------------------
  // LOAD REAL BACKEND DATA
  // ---------------------------------------------------------

  const loadDashboardData = async (showMessage = false) => {

    try {

      setLoading(true);

      const [
        summaryResponse,
        opportunitiesResponse,
        agentResponse,
      ] = await Promise.all([

        fetch(`${API_BASE_URL}/api/recovery/summary`),

        fetch(`${API_BASE_URL}/api/recovery/opportunities`),

        fetch(`${API_BASE_URL}/api/agent/status`),

      ]);


      if (!summaryResponse.ok) {
        throw new Error('Recovery summary API failed');
      }

      if (!opportunitiesResponse.ok) {
        throw new Error('Recovery opportunities API failed');
      }


      const summary = await summaryResponse.json();

      const opportunitiesData =
        await opportunitiesResponse.json();


      // -------------------------------------------------------
      // BACKEND CONNECTED
      // -------------------------------------------------------

      setBackendConnected(true);


      // -------------------------------------------------------
      // HANDLE SUMMARY
      // -------------------------------------------------------

      const summaryData =
        summary?.data ||
        summary?.summary ||
        summary;


      const revenueAtRisk = getValue(
        summaryData,
        [
          'revenue_at_risk',
          'at_risk',
          'total_at_risk',
          'revenueAtRisk',
        ],
        null
      );


      const recoverable = getValue(
        summaryData,
        [
          'recoverable',
          'recoverable_revenue',
          'total_recoverable',
          'recoverableRevenue',
        ],
        null
      );


      const recovered = getValue(
        summaryData,
        [
          'recovered',
          'revenue_recovered',
          'total_recovered',
          'recovered_revenue',
        ],
        null
      );


      const recoveryRate = getValue(
        summaryData,
        [
          'recovery_rate',
          'recoveryRate',
          'rate',
        ],
        null
      );


      const activeCases = getValue(
        summaryData,
        [
          'active_cases',
          'activeCases',
          'cases',
        ],
        null
      );


      // -------------------------------------------------------
      // UPDATE EXISTING KPI CARDS
      // -------------------------------------------------------

      setKpiMetrics((previous) => {

        const updated = [...previous];


        if (revenueAtRisk !== null && updated[0]) {

          updated[0] = {
            ...updated[0],
            value:
              typeof revenueAtRisk === 'number'
                ? formatCurrency(revenueAtRisk)
                : revenueAtRisk,
          };

        }


        if (recoverable !== null && updated[1]) {

          updated[1] = {
            ...updated[1],
            value:
              typeof recoverable === 'number'
                ? formatCurrency(recoverable)
                : recoverable,
          };

        }


        if (recovered !== null && updated[2]) {

          updated[2] = {
            ...updated[2],
            value:
              typeof recovered === 'number'
                ? formatCurrency(recovered)
                : recovered,
          };

        }


        if (recoveryRate !== null && updated[3]) {

          updated[3] = {
            ...updated[3],
            value:
              typeof recoveryRate === 'number'
                ? `${recoveryRate}%`
                : recoveryRate,
          };

        }


        if (activeCases !== null && updated[4]) {

          updated[4] = {
            ...updated[4],
            value: String(activeCases),
          };

        }


        return updated;

      });


      // -------------------------------------------------------
      // HANDLE OPPORTUNITIES
      // -------------------------------------------------------

      const rawOpportunities =
        opportunitiesData?.opportunities ||
        opportunitiesData?.data ||
        opportunitiesData;


      if (Array.isArray(rawOpportunities)) {

        const normalizedOpportunities =
          rawOpportunities.map((item, index) => {

            return {

              ...item,

              id:
                getValue(
                  item,
                  [
                    'id',
                    'transaction_id',
                    'transactionId',
                  ],
                  `TXN-${index + 1}`
                ),

              customer:
                getValue(
                  item,
                  [
                    'customer',
                    'customer_name',
                    'customerName',
                  ],
                  'Unknown Customer'
                ),

              customerSegment:
                getValue(
                  item,
                  [
                    'customerSegment',
                    'customer_segment',
                    'segment',
                  ],
                  'Standard'
                ),

              amount:
                typeof getValue(
                  item,
                  [
                    'amount',
                    'recovery_amount',
                    'recoverable_amount',
                  ],
                  0
                ) === 'number'
                  ? formatCurrency(
                      getValue(
                        item,
                        [
                          'amount',
                          'recovery_amount',
                          'recoverable_amount',
                        ],
                        0
                      )
                    )
                  : getValue(
                      item,
                      [
                        'amount',
                        'recovery_amount',
                        'recoverable_amount',
                      ],
                      '₹0'
                    ),

              risk:
                getValue(
                  item,
                  [
                    'risk',
                    'risk_level',
                    'priority',
                  ],
                  'Medium'
                ),

              status:
                getValue(
                  item,
                  [
                    'status',
                    'recovery_status',
                  ],
                  'Ready'
                ),

              gateway:
                getValue(
                  item,
                  [
                    'gateway',
                    'payment_gateway',
                  ],
                  'Razorpay'
                ),

              failureReason:
                getValue(
                  item,
                  [
                    'failureReason',
                    'failure_reason',
                    'reason',
                  ],
                  'Payment Failed'
                ),

              confidence:
                getValue(
                  item,
                  [
                    'confidence',
                    'recovery_probability',
                    'probability',
                  ],
                  0
                ),

              recommendedAction:
                getValue(
                  item,
                  [
                    'recommendedAction',
                    'recommended_action',
                    'action',
                  ],
                  'Smart Retry Protocol'
                ),

              actionStrategy:
                getValue(
                  item,
                  [
                    'actionStrategy',
                    'action_strategy',
                    'strategy',
                  ],
                  'Smart Retry'
                ),

            };

          });


        setRecoveryOpportunities(
          normalizedOpportunities
        );

      }


      // -------------------------------------------------------
      // AGENT STATUS
      // -------------------------------------------------------

      if (agentResponse.ok) {

        await agentResponse.json();

      }


      if (showMessage) {

        onShowToast(
          'RecoverAI dashboard refreshed with live backend data.',
          'success'
        );

      }


    } catch (error) {

      console.error(
        'RecoverAI API connection error:',
        error
      );


      setBackendConnected(false);


      if (showMessage) {

        onShowToast(
          'Could not refresh live API data. Showing available dashboard data.',
          'error'
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // ---------------------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------------------

  useEffect(() => {

    loadDashboardData(false);

  }, []);


  // ---------------------------------------------------------
  // REFRESH
  // ---------------------------------------------------------

  const handleRefresh = async () => {

    setIsRefreshing(true);

    await loadDashboardData(true);

    setTimeout(() => {

      setIsRefreshing(false);

    }, 500);

  };


  // ---------------------------------------------------------
  // SINGLE RECOVERY ACTION
  // ---------------------------------------------------------

  const handleExecuteAction = (opp) => {

    onShowToast(
      `Executing "${opp.recommendedAction}" for ${opp.id} (${opp.amount})... AI agent initiated.`,
      'ai'
    );


    setTimeout(() => {

      onShowToast(
        `Recovery sequence deployed for ${opp.id}! Status updated to in-progress.`,
        'success'
      );

    }, 1200);

  };


  // ---------------------------------------------------------
  // REVIEW OPPORTUNITIES
  // ---------------------------------------------------------

  const handleReviewOpportunities = () => {

    setShowReviewModal(true);

  };


  // ---------------------------------------------------------
  // BATCH RECOVERY
  // ---------------------------------------------------------

  const handleExecuteBatchRecovery = () => {

    setShowReviewModal(false);

    onShowToast(
      `Batch recovery initiated for ${recoveryOpportunities.length} high-value transactions.`,
      'ai'
    );

  };


  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (

    <div className="space-y-6 pb-12">


      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <DashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />


      {/* =====================================================
          BACKEND STATUS
      ===================================================== */}

      <div className="flex items-center justify-end">

        <div
          className={`
            px-3 py-1.5
            rounded-full
            text-[11px]
            font-mono
            border
            ${
              backendConnected
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
            }
          `}
        >

          <span className="mr-1.5">

            {backendConnected ? '●' : '●'}

          </span>

          {backendConnected
            ? 'LIVE API CONNECTED'
            : 'CONNECTING TO API...'}

        </div>

      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {kpiMetrics.map((metric) => (

          <MetricCard

            key={metric.id}

            metric={metric}

            onClick={() =>
              setSelectedMetric(metric)
            }

          />

        ))}

      </div>


      {/* =====================================================
          AI INSIGHT
      ===================================================== */}

      <AIInsight
        onReviewOpportunities={
          handleReviewOpportunities
        }
      />


      {/* =====================================================
          REVENUE CHART + AGENT
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        <div className="lg:col-span-2">

          <RevenueChart

            activeRange={selectedRange}

            onRangeChange={onRangeChange}

          />

        </div>


        <div className="lg:col-span-1 flex flex-col gap-6">

          <AgentStatus
            onInspectAgent={() =>
              onNavigate('ai-agent')
            }
          />

        </div>

      </div>


      {/* =====================================================
          OPPORTUNITIES + RECENT ACTIVITY
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        <div className="lg:col-span-2">

          <OpportunityTable

            searchQuery={searchQuery}

            opportunities={
              recoveryOpportunities
            }

            onExecuteAction={
              handleExecuteAction
            }

            onInspectTransaction={
              (opp) =>
                setSelectedOpportunity(opp)
            }

          />

        </div>


        <div className="lg:col-span-1">

          <RecentActivity

            onSelectActivity={(act) => {

              onShowToast(
                `Viewing event logs for ${act.title} (${act.amount})`,
                'info'
              );

            }}

          />

        </div>

      </div>


      {/* =====================================================
          TRANSACTION MODAL
      ===================================================== */}

      {selectedOpportunity && (

        <Modal

          isOpen={
            !!selectedOpportunity
          }

          onClose={() =>
            setSelectedOpportunity(null)
          }

          title={`Transaction Recovery Dossier: ${selectedOpportunity.id}`}

        >

          <div className="space-y-5">


            {/* Overview */}

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-background-secondary border border-border/80">

              <div>

                <span className="text-xs text-text-muted font-mono block">

                  At-Risk Amount

                </span>

                <span className="text-2xl font-bold font-mono text-text-primary">

                  {selectedOpportunity.amount}

                </span>

              </div>


              <div className="flex items-center gap-2">

                <StatusBadge
                  type="risk"
                  value={
                    selectedOpportunity.risk
                  }
                  size="md"
                />

                <StatusBadge
                  type="status"
                  value={
                    selectedOpportunity.status
                  }
                  size="md"
                />

              </div>

            </div>


            {/* Details */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">


              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-border/60">

                <span className="text-text-muted block">

                  Customer / Entity

                </span>

                <span className="text-text-primary font-semibold text-sm mt-0.5 block">

                  {selectedOpportunity.customer}

                </span>

                <span className="text-text-dim text-[11px]">

                  {selectedOpportunity.customerSegment}

                </span>

              </div>


              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-border/60">

                <span className="text-text-muted block">

                  Payment Rail / Gateway

                </span>

                <span className="text-text-primary font-semibold text-sm mt-0.5 block">

                  {selectedOpportunity.gateway}

                </span>

                <span className="text-text-dim text-[11px]">

                  Payment telemetry detected

                </span>

              </div>


              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-border/60">

                <span className="text-text-muted block">

                  Failure Reason Analysis

                </span>

                <span className="text-amber-400 font-semibold text-sm mt-0.5 block">

                  {selectedOpportunity.failureReason}

                </span>

              </div>


              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-border/60">

                <span className="text-text-muted block">

                  AI Confidence Score

                </span>

                <span className="text-emerald-400 font-semibold text-sm mt-0.5 block">

                  {selectedOpportunity.confidence}%

                </span>

              </div>


            </div>


            {/* AI Strategy */}

            <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/30 space-y-2">

              <div className="flex items-center gap-2 text-brand-300 font-semibold text-xs font-mono uppercase tracking-wider">

                <Sparkles className="w-4 h-4 text-brand-400" />

                <span>

                  AI Prescribed Intervention

                </span>

              </div>


              <p className="text-sm text-text-primary leading-relaxed">

                Strategy:{' '}

                <strong className="text-brand-300 font-semibold">

                  {selectedOpportunity.actionStrategy}

                </strong>

                . RecoverAI recommends the appropriate recovery action based on the transaction failure pattern.

              </p>

            </div>


            {/* Buttons */}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">

              <button

                onClick={() =>
                  setSelectedOpportunity(null)
                }

                className="px-4 py-2 text-xs font-semibold rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"

              >

                Close

              </button>


              <button

                onClick={() => {

                  handleExecuteAction(
                    selectedOpportunity
                  );

                  setSelectedOpportunity(null);

                }}

                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand flex items-center gap-2 transition-all hover:scale-[1.02]"

              >

                <Zap className="w-3.5 h-3.5" />

                <span>
                  Execute Recovery Strategy
                </span>

              </button>

            </div>


          </div>

        </Modal>

      )}


      {/* =====================================================
          BATCH REVIEW MODAL
      ===================================================== */}

      {showReviewModal && (

        <Modal

          isOpen={showReviewModal}

          onClose={() =>
            setShowReviewModal(false)
          }

          title={`RecoverAI Batch Optimization Queue (${recoveryOpportunities.length} Cases)`}

          maxWidth="max-w-3xl"

        >

          <div className="space-y-5">


            <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/30 flex items-start gap-3">

              <BrainCircuit className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />

              <div>

                <h4 className="text-sm font-semibold text-brand-200">

                  AI Recovery Opportunity Analysis

                </h4>


                <p className="text-xs text-text-muted mt-1 leading-relaxed">

                  RecoverAI has identified high-priority transactions that may be recoverable through automated recovery strategies.

                </p>

              </div>

            </div>


            {/* Opportunity List */}

            <div className="border border-border/80 rounded-xl overflow-hidden divide-y divide-border/50 max-h-64 overflow-y-auto">

              {recoveryOpportunities.map((opp) => (

                <div

                  key={opp.id}

                  className="p-3 bg-background-secondary/60 flex items-center justify-between text-xs font-mono"

                >

                  <div>

                    <span className="font-bold text-text-primary mr-2">

                      {opp.id}

                    </span>

                    <span className="text-text-muted font-sans">

                      {opp.customer}

                    </span>

                  </div>


                  <div className="flex items-center gap-4">

                    <span className="text-amber-400">

                      {opp.failureReason}

                    </span>

                    <span className="font-bold text-emerald-400">

                      {opp.amount}

                    </span>

                  </div>

                </div>

              ))}

            </div>


            {/* Actions */}

            <div className="flex items-center justify-between pt-4 border-t border-border/60">

              <div className="text-xs font-mono text-text-muted">

                Opportunities:{' '}

                <span className="text-text-primary font-bold">

                  {recoveryOpportunities.length}

                </span>

              </div>


              <div className="flex items-center gap-3">

                <button

                  onClick={() =>
                    setShowReviewModal(false)
                  }

                  className="px-4 py-2 text-xs font-semibold rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"

                >

                  Cancel

                </button>


                <button

                  onClick={
                    handleExecuteBatchRecovery
                  }

                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow-brand flex items-center gap-2 transition-all hover:scale-[1.02]"

                >

                  <Zap className="w-4 h-4" />

                  <span>
                    Deploy Interventions
                  </span>

                </button>

              </div>

            </div>


          </div>

        </Modal>

      )}


      {/* =====================================================
          KPI DETAIL MODAL
      ===================================================== */}

      {selectedMetric && (

        <Modal

          isOpen={!!selectedMetric}

          onClose={() =>
            setSelectedMetric(null)
          }

          title={`KPI Telemetry: ${selectedMetric.title}`}

        >

          <div className="space-y-4 font-mono text-xs">


            <div className="p-4 rounded-xl bg-background-secondary border border-border/80 flex items-center justify-between">

              <div>

                <span className="text-text-muted block text-[11px]">

                  Current Measurement

                </span>

                <span className="text-3xl font-extrabold text-text-primary font-sans mt-1 block">

                  {selectedMetric.value}

                </span>

              </div>


              <div className="text-right">

                <span className="text-emerald-400 font-bold block">

                  {selectedMetric.change}

                </span>

                <span className="text-text-dim text-[10px]">

                  {selectedMetric.changeLabel}

                </span>

              </div>

            </div>


            <p className="text-text-secondary font-sans leading-relaxed text-sm">

              This metric is now connected to the RecoverAI revenue recovery backend when live API data is available.

            </p>


            <div className="flex justify-end pt-2">

              <button

                onClick={() =>
                  setSelectedMetric(null)
                }

                className="px-4 py-2 rounded-xl bg-white/5 text-text-primary hover:bg-white/10 transition-colors"

              >

                Close

              </button>

            </div>


          </div>

        </Modal>

      )}

    </div>

  );

}