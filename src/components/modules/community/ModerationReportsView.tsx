import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Flag,
  Lock,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Shield,
  Trash2,
  Tag,
  Plus
} from 'lucide-react';
import { CommunityReport, KeywordBlockItem } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { EmptyState } from '../../common/EmptyState';
import { ReportDetailModal } from './ReportDetailModal';

export const ModerationReportsView: React.FC = () => {
  const {
    communityReports,
    keywordBlocklist,
    addKeyword,
    removeKeyword,
    users,
    liftSanction
  } = useData();

  const { isAdmin, isModerator } = useAuth();

  const [activeTab, setActiveTab] = useState<'reports' | 'keywords' | 'sanctions'>('reports');
  const [reportFilter, setReportFilter] = useState<string>('pending');
  const [reportSearch, setReportSearch] = useState('');
  const [inspectReport, setInspectReport] = useState<CommunityReport | null>(null);

  // Keyword form state
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordLang, setKeywordLang] = useState<'en' | 'fil'>('fil');
  const [keywordSearch, setKeywordSearch] = useState('');

  const pendingReportsCount = communityReports.filter((r) => r.status === 'pending').length;

  const filteredReports = communityReports.filter((r) => {
    const matchSearch =
      r.postSnippet.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.postAuthorName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.reason.toLowerCase().includes(reportSearch.toLowerCase());

    const matchStatus = reportFilter === 'all' || r.status === reportFilter;
    return matchSearch && matchStatus;
  });

  const filteredKeywords = keywordBlocklist.filter((k) =>
    k.word.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  const sanctionedUsers = users.filter((u) => u.sanctions && u.sanctions.some((s) => s.active));

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    const res = addKeyword(newKeyword, keywordLang);
    if (res.success) {
      setNewKeyword('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Moderation & Reports</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {pendingReportsCount} Reports Pending Review
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Content flagging, progressive sanctions (warning, mute 24h/7d, ban), and bilingual keyword filtering.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Report Queue</span>
          {pendingReportsCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'reports' ? 'bg-white text-rose-700' : 'bg-rose-500 text-white'
              }`}
            >
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeTab === 'keywords'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Keyword Blocklist ({keywordBlocklist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sanctions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeTab === 'sanctions'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Sanctioned Volunteers ({sanctionedUsers.length})</span>
        </button>
      </div>

      {/* TAB: REPORT QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search report author, content, or reason..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
              >
                <option value="pending">Pending Review</option>
                <option value="resolved">Action Taken (Resolved)</option>
                <option value="dismissed">Dismissed</option>
                <option value="all">All Statuses</option>
              </select>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <EmptyState
              title="No reports match your filters"
              description="Good news! Either no reports exist with the selected status, or your search query yielded no results."
              icon={CheckCircle2}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    report.status === 'pending'
                      ? 'border-rose-200 shadow-2xs'
                      : 'border-slate-200/80 opacity-80'
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">
                        Author: <strong className="text-slate-800">{report.postAuthorName}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <Badge
                        variant={
                          report.status === 'pending'
                            ? 'danger'
                            : report.status === 'action_taken'
                            ? 'success'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        {report.status === 'pending'
                          ? 'Action Required'
                          : report.status === 'action_taken'
                          ? 'Action Taken'
                          : report.status === 'reviewed'
                          ? 'Reviewed'
                          : 'Dismissed'}
                      </Badge>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        Reason: {report.reason}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700 italic line-clamp-2">
                      &quot;{report.postSnippet}&quot;
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Reported by: {report.reportingUserName}</span>
                      <span>•</span>
                      <span>{new Date(report.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      {report.actionNote && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-medium">Mod note: {report.actionNote}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setInspectReport(report)}
                      className="px-3.5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review & Moderate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: KEYWORD BLOCKLIST */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Add Forbidden Word or Pattern</h3>
            <p className="text-xs text-slate-500 mb-4">
              Posts matching these terms are automatically held in moderation review before going live.
            </p>
            <form onSubmit={handleAddKeyword} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter word or phrase (e.g., profanity or harassment term)..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
              />
              <select
                value={keywordLang}
                onChange={(e) => setKeywordLang(e.target.value as 'en' | 'fil')}
                className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl"
              >
                <option value="fil">Filipino / Taglish</option>
                <option value="en">English</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Word</span>
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Current Blocklist</h3>
              <input
                type="text"
                placeholder="Filter words..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-48"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {filteredKeywords.map((kw) => (
                <span
                  key={kw.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <span className="font-bold">{kw.word}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    {kw.language}
                  </span>
                  <button
                    onClick={() => removeKeyword(kw.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SANCTIONED USERS */}
      {activeTab === 'sanctions' && (
        <div className="space-y-4">
          {sanctionedUsers.length === 0 ? (
            <EmptyState
              title="No active sanctions"
              description="No volunteer accounts are currently muted, warned, or suspended."
              icon={CheckCircle2}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {sanctionedUsers.map((u) => {
                const activeSanction = u.sanctions?.find((s) => s.active);
                return (
                  <div
                    key={u.id}
                    className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img src={u.avatar} alt="" className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{u.name}</span>
                          <Badge variant="danger" size="sm">
                            <span className="uppercase">{activeSanction?.type.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Reason: <strong className="text-slate-700">{activeSanction?.reason}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Applied: {activeSanction?.imposedAt ? new Date(activeSanction.imposedAt).toLocaleDateString() : 'Active'} • Expires: {activeSanction?.expiresAt ? new Date(activeSanction.expiresAt).toLocaleDateString() : 'Permanent'}
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => liftSanction(u.id)}
                        className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                      >
                        Lift Sanction & Restore
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Report Action Inspection Modal */}
      {inspectReport && (
        <ReportDetailModal
          isOpen={!!inspectReport}
          onClose={() => setInspectReport(null)}
          report={inspectReport}
        />
      )}
    </div>
  );
};
