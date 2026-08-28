import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Toast from './components/common/Toast';

// All 9 Dedicated Pages
import Dashboard from './pages/Dashboard';
import RevenueRadar from './pages/RevenueRadar';
import Transactions from './pages/Transactions';
import AIAgent from './pages/AIAgent';
import RecoveryActions from './pages/RecoveryActions';
import Analytics from './pages/Analytics';
import AuditTrail from './pages/AuditTrail';
import RecoveryLab from './pages/RecoveryLab';
import Settings from './pages/Settings';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const renderActivePage = () => {
    switch (activeRoute) {
      case 'overview':
      case 'dashboard':
        return (
          <Dashboard
            searchQuery={searchQuery}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            onShowToast={showToast}
            onNavigate={setActiveRoute}
          />
        );
      case 'revenue-radar':
        return <RevenueRadar onShowToast={showToast} />;
      case 'transactions':
        return <Transactions onShowToast={showToast} />;
      case 'ai-agent':
        return <AIAgent onShowToast={showToast} />;
      case 'recovery-actions':
        return <RecoveryActions onShowToast={showToast} />;
      case 'analytics':
        return <Analytics onShowToast={showToast} />;
      case 'audit-trail':
        return <AuditTrail onShowToast={showToast} />;
      case 'recovery-lab':
        return <RecoveryLab onShowToast={showToast} />;
      case 'settings':
        return <Settings onShowToast={showToast} />;
      default:
        return (
          <Dashboard
            searchQuery={searchQuery}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            onShowToast={showToast}
            onNavigate={setActiveRoute}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={(route) => setActiveRoute(route)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navbar */}
        <Topbar
          onToggleMobile={() => setIsMobileSidebarOpen(prev => !prev)}
          selectedRange={selectedRange}
          onSelectRange={setSelectedRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNotificationAction={() => {
            setActiveRoute('audit-trail');
            showToast("Navigated to Cryptographic Audit Trail logs.", "info");
          }}
        />

        {/* Dynamic Route Body with Page Transition */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto transition-all duration-200">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
