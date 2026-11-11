import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Shield,
  UserCheck,
  ChevronDown,
  RotateCcw,
  LogOut,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { NavModule } from './Sidebar';

interface TopHeaderProps {
  currentModule: NavModule;
  onOpenMobileMenu: () => void;
  onOpenGlobalSearch: () => void;
  onSelectModule: (module: NavModule) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentModule,
  onOpenMobileMenu,
  onOpenGlobalSearch,
  onSelectModule
}) => {
  const { user, isAdmin, isModerator, logout, switchRole } = useAuth();
  const { notifications, communityReports, challengeProofs, resetAllData } = useData();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titles: Record<NavModule, { title: string; breadcrumb: string }> = {
    dashboard: { title: 'Dashboard Overview', breadcrumb: 'Overview & Key Metrics' },
    announcements: { title: 'Announcements Management', breadcrumb: 'Broadcasts & Legislative Updates' },
    events: { title: 'Events Management', breadcrumb: 'Townhalls, Legal Missions & Attendance' },
    challenges: { title: 'CHELlenges Management', breadcrumb: 'Monthly Tasks & Proof Review Queue' },
    community: { title: 'Community Management', breadcrumb: 'Forum Moderation & Reports' },
    users: { title: 'User Management', breadcrumb: 'Volunteers, Roles & Sanctions' },
    notifications: { title: 'Notifications Management', breadcrumb: 'Push Notifications (FCM / APNs)' },
    audit: { title: 'Audit Log', breadcrumb: 'Immutable Administrative Activity Stream' },
    settings: { title: 'Application Settings', breadcrumb: 'Platform Config & Guidelines' },
    reports: { title: 'Reports & Analytics', breadcrumb: 'Civic Engagement Reporting & Exports' }
  };

  const pendingReportsCount = communityReports.filter((r) => r.status === 'pending').length;
  const pendingProofsCount = challengeProofs.filter((p) => p.status === 'pending_review').length;
  const totalAlerts = pendingReportsCount + pendingProofsCount;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="hover:text-chel-600 cursor-pointer" onClick={() => onSelectModule('dashboard')}>
              Diokno Volunteer Platform
            </span>
            <span>/</span>
            <span className="text-slate-700 capitalize font-semibold">{currentModule}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {titles[currentModule]?.title || 'Dashboard'}
          </h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Trigger */}
        <button
          onClick={onOpenGlobalSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/60 rounded-xl transition-all"
          title="Global Search (Cmd + K)"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Notifications & Action Items</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-chel-50 text-chel-700 font-semibold">
                  {totalAlerts} pending
                </span>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {pendingReportsCount > 0 && (
                  <div
                    onClick={() => {
                      onSelectModule('community');
                      setIsNotifOpen(false);
                    }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100/70 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-rose-950">
                          {pendingReportsCount} Open Community Reports
                        </div>
                        <p className="text-[11px] text-rose-800 mt-0.5">
                          Requires moderation action (profanity / harassment flagged).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {pendingProofsCount > 0 && (
                  <div
                    onClick={() => {
                      onSelectModule('challenges');
                      setIsNotifOpen(false);
                    }}
                    className="p-3 rounded-xl bg-chel-50 border border-chel-100 hover:bg-chel-100/70 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-chel-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-chel-950">
                          {pendingProofsCount} CHELlenge Proofs Pending Review
                        </div>
                        <p className="text-[11px] text-chel-800 mt-0.5">
                          Volunteer submissions awaiting badge approval.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {notifications.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="text-xs font-semibold text-slate-800">{n.title}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {n.sentAt ? new Date(n.sentAt).toLocaleDateString() : 'Draft'} • {n.audience}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    onSelectModule('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-chel-600 hover:underline font-semibold"
                >
                  View All Broadcasts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          >
            <img
              src={user?.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">{user?.name}</div>
              <div className="text-[10px] text-slate-500 capitalize mt-0.5">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in text-sm">
              <div className="p-3 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-900 leading-tight">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                  <Shield className="w-3 h-3 text-chel-600" />
                  Role: {user?.role}
                </div>
              </div>

              {/* Role switcher inside menu */}
              <button
                onClick={() => {
                  switchRole(isAdmin ? 'moderator' : 'admin');
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-chel-700 hover:bg-chel-50 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch to {isAdmin ? 'Moderator' : 'Administrator'}</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    onSelectModule('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Platform Settings</span>
                </button>
              )}

              <button
                onClick={() => {
                  resetAllData();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                title="Reset all demo changes back to fresh state"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset Demo Data</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

