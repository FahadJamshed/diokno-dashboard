import React from 'react';
import {
  LayoutGrid,
  Users,
  Megaphone,
  Calendar,
  Star,
  MessageSquare,
  ShieldAlert,
  Bell,
  Bot,
  BarChart2,
  ClipboardList,
  Settings,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ModeratorPermission } from '../../types';

export type NavModule =
  | 'dashboard'
  | 'users'
  | 'announcements'
  | 'events'
  | 'challenges'
  | 'community'
  | 'moderation'
  | 'notifications'
  | 'chat'
  | 'reports'
  | 'audit'
  | 'settings';

interface SidebarProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { isSuperAdmin, isAdmin, isModerator, hasPermission } = useAuth();
  const { communityReports, challengeProofs, chatDocuments } = useData();

  const pendingReportsCount = communityReports.filter((r) => r.status === 'pending').length;
  const pendingProofsCount = challengeProofs.filter((p) => p.status === 'pending_review').length;
  const pendingDocsCount = chatDocuments.filter((d) => d.approvalStatus === 'pending_approval').length;

  const navItems: {
    id: NavModule;
    label: string;
    icon: React.ElementType;
    adminOnly?: boolean;
    requiredPermission?: ModeratorPermission;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'users', label: 'Users & Members', icon: Users, adminOnly: true },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      requiredPermission: 'content_drafting'
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      requiredPermission: 'content_drafting'
    },
    {
      id: 'challenges',
      label: 'CHELlenges',
      icon: Star,
      requiredPermission: 'proof_review',
      badge: pendingProofsCount > 0 ? pendingProofsCount : undefined
    },
    { id: 'community', label: 'Community & Forum', icon: MessageSquare },
    {
      id: 'moderation',
      label: 'Moderation & Reports',
      icon: ShieldAlert,
      requiredPermission: 'forum_moderation',
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined
    },
    { id: 'notifications', label: 'Push Notifications', icon: Bell, adminOnly: true },
    {
      
      id: 'chat',
      label: 'Chat with Chel',
      icon: Bot,
      adminOnly: true,
      badge: pendingDocsCount > 0 ? pendingDocsCount : undefined
    },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, adminOnly: true },
    { id: 'audit', label: 'Audit Log', icon: ClipboardList, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: true }
  ];

  // Filter items for moderators based on their granular permissions
  const filteredNavItems = navItems.filter((item) => {
    if (isSuperAdmin || isAdmin) return true;
    if (isModerator) {
      if (item.adminOnly) return false;
      if (item.requiredPermission) {
        return hasPermission(item.requiredPermission);
      }
      return true;
    }
    return false;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-[#0C2340] text-slate-300 flex flex-col border-r border-[#153258] transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#18365E]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Bright Yellow D Squircle Logo */}
            <div className="w-11 h-11 rounded-2xl bg-[#F5B800] flex items-center justify-center text-[#0C2340] font-black text-xl shrink-0 shadow-md">
              D
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-[17px] font-black text-white tracking-wider leading-none">
                  DIOKNO
                </h1>
                <p className="text-[9px] font-extrabold text-[#F5B800] mt-1 tracking-widest uppercase">
                  VOLUNTEER ADMIN
                </p>
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                  isActive
                    ? 'bg-[#223D63] text-white shadow-xs font-semibold'
                    : 'text-[#8FA5C0] hover:text-white hover:bg-white/5'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-white stroke-[2.2]' : 'text-[#8FA5C0] group-hover:text-white stroke-[1.8]'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left text-[14.5px] leading-none">
                    {item.label}
                  </span>
                )}

                {/* Yellow Badge (e.g. Community '23' as in design) */}
                {item.badge !== undefined && !isCollapsed && (
                  <span className="bg-[#F5B800] text-[#0C2340] font-black text-[11px] px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                    {item.badge}
                  </span>
                )}

                {item.badge !== undefined && isCollapsed && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F5B800]" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
