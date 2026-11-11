import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  Users,
  Trophy,
  CheckCircle2,
  Flag,
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { PHILIPPINE_PROVINCES } from '../../../data/mockData';

export const ReportsView: React.FC = () => {
  const { users, events, challenges, communityReports, auditLogs } = useData();
  const { isAdmin } = useAuth();

  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'ytd' | 'all'>('30d');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [reportType, setReportType] = useState<
    'overview' | 'registrations' | 'events' | 'challenges' | 'moderation'
  >('overview');

  // Computed summary metrics
  const totalVolunteers = 10482;
  const completedProfiles = Math.round(totalVolunteers * 0.853);
  const wau = 4210;
  const mau = 9120;
  const totalRSVPs = events.reduce((acc, curr) => acc + curr.rsvpCount, 0) + 1200;
  const totalAttendance = events.reduce((acc, curr) => acc + curr.attendanceCount, 0) + 940;
  const challengeCompletions = challenges.reduce((acc, curr) => acc + curr.completionCount, 0);

  // Regional distribution breakdown
  const regionalDistribution = [
    { region: 'National Capital Region (Metro Manila)', volunteers: 4120, percent: 39.3, activeRate: 88 },
    { region: 'Region VII (Central Visayas - Cebu)', volunteers: 1840, percent: 17.5, activeRate: 84 },
    { region: 'Region VI (Western Visayas - Iloilo)', volunteers: 1250, percent: 11.9, activeRate: 86 },
    { region: 'Region III (Central Luzon - Pampanga/Bulacan)', volunteers: 1100, percent: 10.5, activeRate: 79 },
    { region: 'Region IV-A (CALABARZON - Batangas/Laguna)', volunteers: 950, percent: 9.1, activeRate: 82 },
    { region: 'Region XI (Davao Region)', volunteers: 620, percent: 5.9, activeRate: 75 },
    { region: 'Other Regions Nationwide', volunteers: 602, percent: 5.8, activeRate: 71 }
  ];

  // CSV Export Generation
  const handleExportCSV = () => {
    let headers = '';
    let rows = '';

    if (reportType === 'events') {
      headers = 'Event ID,Title,Type,Province,Capacity,RSVP Count,Attendance Count,Check-in Rate\n';
      rows = events
        .map(
          (e) =>
            `"${e.id}","${e.title}","${e.eventType}","${e.province}","${e.capacity}","${e.rsvpCount}","${e.attendanceCount}","${
              e.rsvpCount > 0 ? Math.round((e.attendanceCount / e.rsvpCount) * 100) : 0
            }%"`
        )
        .join('\n');
    } else if (reportType === 'challenges') {
      headers = 'Challenge ID,Name,Month,Year,Tasks Count,Participants,Completed Badges,Completion Rate\n';
      rows = challenges
        .map(
          (c) =>
            `"${c.id}","${c.name}","${c.month}","${c.year}","${c.tasks.length}","${c.participationCount}","${c.completionCount}","${
              c.participationCount > 0 ? Math.round((c.completionCount / c.participationCount) * 100) : 0
            }%"`
        )
        .join('\n');
    } else {
      headers = 'Region / Metric,Volunteers,Share Percentage,Active Participation Rate\n';
      rows = regionalDistribution
        .map(
          (r) =>
            `"${r.region}","${r.volunteers}","${r.percent}%","${r.activeRate}%"`
        )
        .join('\n');
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `diokno-engagement-report-${reportType}-${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Q4 2025 Performance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate engagement statistics, attendance ratios, and regional demographic distribution.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {isAdmin ? (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>
          ) : (
            <div className="text-[11px] font-medium text-slate-400 italic">
              (Export restricted for Moderator role)
            </div>
          )}
        </div>
      </div>

      {/* Filter and Report Type Selection */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        {/* Report Types */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold w-full md:w-auto">
          {[
            { id: 'overview', label: 'Civic Overview' },
            { id: 'registrations', label: 'User Demographics' },
            { id: 'events', label: 'Events & RSVPs' },
            { id: 'challenges', label: 'CHELlenges & Badges' },
            { id: 'moderation', label: 'Community & Trust' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportType === type.id
                  ? 'bg-white text-chel-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Date and Province Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year-to-Date (2025)</option>
            <option value="all">All-Time Platform</option>
          </select>

          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200 max-w-[160px]"
          >
            <option value="all">All 17 Regions</option>
            <option value="Metro Manila">Metro Manila</option>
            <option value="Cebu">Cebu</option>
            <option value="Iloilo">Iloilo</option>
            <option value="Pampanga">Pampanga</option>
            <option value="Batangas">Batangas</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Mobilized
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalVolunteers.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% MoM Growth</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Profile Completion
          </span>
          <div className="text-2xl font-black text-chel-700 mt-1">85.3%</div>
          <div className="text-xs text-slate-500 mt-1">8,940 verified volunteers</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Event Turnout
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1">83.7%</div>
          <div className="text-xs text-slate-500 mt-1">
            {totalAttendance.toLocaleString()} checked-in from {totalRSVPs.toLocaleString()} RSVPs
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            CHELlenge Completions
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {challengeCompletions.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Confirmed badge earners</div>
        </div>
      </div>

      {/* Regional Demographic Distribution Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Regional Volunteer Engagement Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Geographic distribution across major Philippine clusters
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            100% Nationwide Reach
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Region / Cluster</th>
                <th className="py-3 px-4">Registered Volunteers</th>
                <th className="py-3 px-4">National Share</th>
                <th className="py-3 px-4">Active Ratio (MAU)</th>
                <th className="py-3 px-4 text-right">Engagement Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionalDistribution.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-chel-600" />
                    <span>{item.region}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {item.volunteers.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-chel-600 h-1.5 rounded-full"
                          style={{ width: `${item.percent * 2.2}%` }}
                        />
                      </div>
                      <span className="font-medium text-slate-700">{item.percent}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-emerald-700">
                    {item.activeRate}% active
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      High Impact
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Event & CHELlenge Performance Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events Table Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Event Attendance Ratios</h3>
            <span className="text-xs text-chel-600 font-bold">{events.length} Events</span>
          </div>

          <div className="space-y-3">
            {events.slice(0, 4).map((evt) => (
              <div key={evt.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-900">
                  <span className="line-clamp-1">{evt.title}</span>
                  <span className="text-chel-700 shrink-0 ml-2">
                    {evt.rsvpCount} / {evt.capacity} RSVPs
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{evt.venue}, {evt.province}</span>
                  <span className="font-semibold text-emerald-700">
                    {evt.attendanceCount > 0 ? `${evt.attendanceCount} attended` : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHELlenge Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">CHELlenge Sprints Completion</h3>
            <span className="text-xs text-amber-600 font-bold">{challenges.length} Sprints</span>
          </div>

          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-900">
                  <span className="line-clamp-1">{c.name}</span>
                  <span className="text-amber-800 shrink-0 ml-2">
                    {c.completionCount} badges confirmed
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{c.month} {c.year} • {c.tasks.length} tasks</span>
                  <span className="font-semibold text-slate-700 capitalize">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

