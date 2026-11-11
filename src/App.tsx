import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar, NavModule } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Auth Screens
import { LoginScreen } from './components/modules/auth/LoginScreen';
import { TwoFactorScreen } from './components/modules/auth/TwoFactorScreen';
import { ForgotPasswordScreen } from './components/modules/auth/ForgotPasswordScreen';

// Dashboard Modules
import { DashboardOverview } from './components/modules/dashboard/DashboardOverview';
import { AnnouncementsList } from './components/modules/announcements/AnnouncementsList';
import { EventsList } from './components/modules/events/EventsList';
import { ChallengesList } from './components/modules/challenges/ChallengesList';
import { CommunityManagement } from './components/modules/community/CommunityManagement';
import { UsersList } from './components/modules/users/UsersList';
import { NotificationsList } from './components/modules/notifications/NotificationsList';
import { AuditLogViewer } from './components/modules/audit/AuditLogViewer';
import { SettingsView } from './components/modules/settings/SettingsView';
import { ReportsView } from './components/modules/reports/ReportsView';

export const AppContent: React.FC = () => {
  const { user, authScreen, isAdmin } = useAuth();
  const [currentModule, setCurrentModule] = useState<NavModule>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // If unauthenticated, render Auth Screens
  if (!user || authScreen !== 'authenticated') {
    if (authScreen === '2fa') {
      return <TwoFactorScreen />;
    }
    if (authScreen === 'forgot_password') {
      return <ForgotPasswordScreen />;
    }
    return <LoginScreen />;
  }

  const handleNavigateFromSearch = (module: string, itemId?: string) => {
    setCurrentModule(module as NavModule);
  };

  const renderActiveModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardOverview onNavigate={(mod) => setCurrentModule(mod)} />;
      case 'announcements':
        return <AnnouncementsList />;
      case 'events':
        return <EventsList />;
      case 'challenges':
        return <ChallengesList />;
      case 'community':
        return <CommunityManagement />;
      case 'users':
        return <UsersList />;
      case 'notifications':
        return <NotificationsList />;
      case 'audit':
        return <AuditLogViewer />;
      case 'settings':
        return <SettingsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardOverview onNavigate={(mod) => setCurrentModule(mod)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopHeader
          currentModule={currentModule}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenGlobalSearch={() => setIsSearchModalOpen(true)}
          onSelectModule={(mod) => setCurrentModule(mod)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={handleNavigateFromSearch}
      />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}

