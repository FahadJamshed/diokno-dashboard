import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Activity,
  Calendar,
  Trophy,
  Flag,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck,
  UserPlus,
  Filter,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../../common/StatCard';
import { Badge } from '../../common/Badge';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { NavModule } from '../../common/Sidebar';

interface DashboardOverviewProps {
  onNavigate: (module: NavModule, filter?: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { users, events, announcements, challenges, challengeProofs, communityReports, auditLogs } = useData();
  const { user, isAdmin } = useAuth();
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | 'month' | 'quarter' | 'year'>('30d');

  // Counts & stats
  const totalUsers = 10482; // representative scale
  const completedProfilesCount = Math.round(totalUsers * 0.853);
  const wau = 4210;
  const mau = 9120;
  const totalRSVPs = events.reduce((acc, curr) => acc + curr.rsvpCount, 0) + 1200;
  const totalCheckIns = events.reduce((acc, curr) => acc + curr.attendanceCount, 0) + 940;
  const totalChallengeCompletions = challenges.reduce((acc, curr) => acc + curr.completionCount, 0);

  const pendingReports = communityReports.filter((r) => r.status === 'pending');
  const pendingProofs = challengeProofs.filter((p) => p.status === 'pending_review');
  const pendingModApplications = users.filter((u) => u.moderatorApplicationStatus === 'pending');

  // Chart data simulation points for user growth
  const chartPoints = [
    { label: 'Oct 12', registrations: 140, active: 3100 },
    { label: 'Oct 19', registrations: 280, active: 3450 },
    { label: 'Oct 26', registrations: 420, active: 3890 },
    { label: 'Nov 02', registrations: 680, active: 4120 },
    { label: 'Nov 09', registrations: 890, active: 4210 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mabuhay, {user?.name.split(' ')[0]}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chel-50 text-chel-700 border border-chel-200 uppercase">
              {user?.role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of volunteer mobilization, events, and moderation across 17 Philippine regions.
          </p>
        </div>

        {/* Date Filter & Demo indicator */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setDateFilter('7d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateFilter === '7d' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              7D
            </button>
            <button
              onClick={() => setDateFilter('30d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateFilter === '30d' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              30D
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateFilter === 'month' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter('quarter')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateFilter === 'quarter' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'}`}
            >
              Quarter
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Demo System</span>
          </div>
        </div>
      </div>

      {/* Action Required Alert Cards (Pending Actions) */}
      {(pendingReports.length > 0 || pendingProofs.length > 0 || (isAdmin && pendingModApplications.length > 0)) && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Pending Administrative & Moderation Actions</span>
            </div>
            <span className="text-xs text-amber-800 font-medium">Requires Staff Review</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pendingReports.length > 0 && (
              <div
                onClick={() => onNavigate('community')}
                className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-2xs hover:shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xl font-extrabold text-rose-600">{pendingReports.length}</div>
                  <div className="text-xs font-semibold text-slate-700">Open Community Reports</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Harassment & profanity flags</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            )}

            {pendingProofs.length > 0 && (
              <div
                onClick={() => onNavigate('challenges')}
                className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-2xs hover:shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xl font-extrabold text-chel-600">{pendingProofs.length}</div>
                  <div className="text-xs font-semibold text-slate-700">CHELlenge Proof Reviews</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Voter & civic task uploads</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            )}

            {isAdmin && pendingModApplications.length > 0 && (
              <div
                onClick={() => onNavigate('users')}
                className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-2xs hover:shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xl font-extrabold text-purple-600">{pendingModApplications.length}</div>
                  <div className="text-xs font-semibold text-slate-700">Moderator Applications</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Volunteer leader promotions</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={totalUsers.toLocaleString()}
          subtitle="All regions nationwide"
          change="+12.4%"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-chel-50 text-chel-600"
          onClick={() => onNavigate('users')}
        />

        <StatCard
          title="Completed Profiles"
          value={`${completedProfilesCount.toLocaleString()}`}
          subtitle="85.3% completion rate"
          change="+5.1%"
          changeType="positive"
          icon={<CheckCircle className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => onNavigate('users')}
        />

        <StatCard
          title="Weekly Active Users (WAU)"
          value={wau.toLocaleString()}
          subtitle="40.2% active engagement"
          change="+8.3%"
          changeType="positive"
          icon={<Activity className="w-5 h-5" />}
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Monthly Active Users (MAU)"
          value={mau.toLocaleString()}
          subtitle="87.0% monthly retention"
          change="+14.2%"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Total Event RSVPs"
          value={totalRSVPs.toLocaleString()}
          subtitle="Townhalls & missions"
          change="+24.0%"
          changeType="positive"
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => onNavigate('events')}
        />

        <StatCard
          title="Event Check-Ins"
          value={totalCheckIns.toLocaleString()}
          subtitle="83.7% attendance rate"
          change="+18.5%"
          changeType="positive"
          icon={<CheckSquare className="w-5 h-5" />}
          iconBg="bg-teal-50 text-teal-600"
          onClick={() => onNavigate('events')}
        />

        <StatCard
          title="CHELlenge Completions"
          value={totalChallengeCompletions.toLocaleString()}
          subtitle="Monthly badge earners"
          change="+31.2%"
          changeType="positive"
          icon={<Trophy className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => onNavigate('challenges')}
        />

        <StatCard
          title="Open Reports"
          value={pendingReports.length}
          subtitle="Community queue"
          change={pendingReports.length > 5 ? 'High' : 'Normal'}
          changeType={pendingReports.length > 5 ? 'negative' : 'neutral'}
          icon={<Flag className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
          onClick={() => onNavigate('community')}
        />
      </div>

      {/* Two Column Section: User Growth Chart & Volunteer Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Line Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                User Growth & Active Engagement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly registrations and active user trends
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-chel-500" />
                <span className="text-slate-600 font-medium">Registrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-600 font-medium">Active Users</span>
              </div>
            </div>
          </div>

          {/* SVG Line / Bar Visualization */}
          <div className="h-64 w-full relative flex flex-col justify-end">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-200 w-full" />
              <div className="border-b border-dashed border-slate-200 w-full" />
              <div className="border-b border-dashed border-slate-200 w-full" />
              <div className="border-b border-dashed border-slate-200 w-full" />
            </div>

            {/* Visual Bars / Line Representation */}
            <div className="relative z-10 flex items-end justify-around h-48 pt-4">
              {chartPoints.map((pt, idx) => {
                const regHeight = (pt.registrations / 1000) * 100;
                const actHeight = (pt.active / 5000) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-44">
                      {/* Active bar */}
                      <div
                        style={{ height: `${actHeight}%` }}
                        className="w-5 sm:w-8 bg-indigo-100 group-hover:bg-indigo-200 rounded-t-md transition-all relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap shadow-xs">
                          {pt.active} active
                        </div>
                      </div>
                      {/* Registration bar */}
                      <div
                        style={{ height: `${regHeight}%` }}
                        className="w-5 sm:w-8 bg-chel-500 group-hover:bg-chel-600 rounded-t-md transition-all relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-chel-700 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap shadow-xs">
                          +{pt.registrations} new
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{pt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average weekly registration velocity: +740 volunteers</span>
            <span className="font-semibold text-emerald-600">Peak season for civic registration</span>
          </div>
        </div>

        {/* Volunteer Engagement Breakdown (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Engagement Health
              </h3>
              <Sparkles className="w-4 h-4 text-chel-500" />
            </div>

            <div className="space-y-4">
              {/* Profile Completion */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Profile Completion Rate</span>
                  <span className="text-chel-600">85.3%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-chel-600 h-2.5 rounded-full" style={{ width: '85.3%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  8,940 of 10,482 volunteers completed ID and province verification.
                </p>
              </div>

              {/* Event Attendance Rate */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Event Attendance vs RSVP</span>
                  <span className="text-emerald-600">83.7%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '83.7%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  2,890 attendees checked in from 3,450 total confirmations.
                </p>
              </div>

              {/* CHELlenge Completion */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">CHELlenge Task Submissions</span>
                  <span className="text-amber-600">68.2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '68.2%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  1,620 active volunteers submitted at least 4 monthly civic tasks.
                </p>
              </div>

              {/* Community Participation */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Community Forum Activity</span>
                  <span className="text-indigo-600">92.4%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '92.4%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Low toxicity score with 0.12% flagged post incident rate.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('reports')}
              className="w-full py-2 px-3 text-xs font-semibold text-chel-700 bg-chel-50 hover:bg-chel-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Analytics Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Stream & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity Stream</h3>
              <p className="text-xs text-slate-500">Live feed of civic participation across modules</p>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs font-semibold text-chel-600 hover:text-chel-700 hover:underline"
            >
              View Audit Log
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                    {log.category === 'users' && <UserPlus className="w-4 h-4 text-chel-600" />}
                    {log.category === 'events' && <Calendar className="w-4 h-4 text-purple-600" />}
                    {log.category === 'challenges' && <Trophy className="w-4 h-4 text-amber-600" />}
                    {log.category === 'community' && <Flag className="w-4 h-4 text-rose-600" />}
                    {log.category === 'announcements' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {log.category === 'settings' && <Sparkles className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{log.action}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{log.affectedRecordName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      By {log.adminName} ({log.adminRole})
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">
                    {log.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchpad & Shortcuts (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
              Admin Quick Launch
            </h3>
            <p className="text-xs text-slate-500 mb-4">Frequent workflows for daily management</p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('announcements')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-chel-50/80 border border-slate-200/60 hover:border-chel-200 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-chel-100 text-chel-700">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-chel-700">
                      Post Announcement
                    </div>
                    <div className="text-[11px] text-slate-500">Publish or schedule a broadcast</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-chel-600" />
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200/60 hover:border-purple-200 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Create Civic Event
                    </div>
                    <div className="text-[11px] text-slate-500">Townhall or legal clinic launch</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>

              <button
                onClick={() => onNavigate('challenges')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200/60 hover:border-amber-200 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                      Review Proof Submissions
                    </div>
                    <div className="text-[11px] text-slate-500">{pendingProofs.length} submissions pending review</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              </button>

              <button
                onClick={() => onNavigate('community')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/80 border border-slate-200/60 hover:border-rose-200 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
                      Open Moderation Queue
                    </div>
                    <div className="text-[11px] text-slate-500">{pendingReports.length} reports to resolve</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-100 flex items-center justify-between">
            <span>Admin Console Version</span>
            <span className="font-semibold text-slate-700">v1.4.2 Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
};

