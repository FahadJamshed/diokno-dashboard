import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Flag,
  Shield,
  ShieldAlert,
  Archive,
  ChevronUp,
  ChevronDown,
  Edit,
  Eye,
  Trash2,
  Lock,
  UserX,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ForumTopic, CommunityReport, KeywordBlockItem } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { EmptyState } from '../../common/EmptyState';
import { TopicEditorModal } from './TopicEditorModal';
import { ReportDetailModal } from './ReportDetailModal';

export const CommunityManagement: React.FC = () => {
  const {
    forumTopics,
    reorderForumTopic,
    archiveForumTopic,
    communityReports,
    keywordBlocklist,
    addKeyword,
    removeKeyword,
    users,
    liftSanction
  } = useData();

  const { isAdmin, isModerator } = useAuth();

  const [activeTab, setActiveTab] = useState<'reports' | 'topics' | 'keywords'>('reports');
  const [reportFilter, setReportFilter] = useState<string>('pending');
  const [reportSearch, setReportSearch] = useState('');

  // Modals state
  const [isTopicEditorOpen, setIsTopicEditorOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ForumTopic | null>(null);
  const [inspectReport, setInspectReport] = useState<CommunityReport | null>(null);

  // Keyword form state
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordLang, setKeywordLang] = useState<'en' | 'fil'>('fil');
  const [keywordSearch, setKeywordSearch] = useState('');

  // Pending counts
  const pendingReportsCount = communityReports.filter((r) => r.status === 'pending').length;

  // Filtered reports
  const filteredReports = communityReports.filter((r) => {
    const matchSearch =
      r.postSnippet.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.postAuthorName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.reason.toLowerCase().includes(reportSearch.toLowerCase());

    const matchStatus = reportFilter === 'all' || r.status === reportFilter;
    return matchSearch && matchStatus;
  });

  // Filtered keywords
  const filteredKeywords = keywordBlocklist.filter((k) =>
    k.word.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  // Users with active sanctions
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Community Moderation</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {pendingReportsCount} Reports Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain safe, respectful civic discourse, enforce community standards, and manage profanity filters.
          </p>
        </div>

        {activeTab === 'topics' && isAdmin && (
          <button
            onClick={() => {
              setEditingTopic(null);
              setIsTopicEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Topic</span>
          </button>
        )}
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'reports'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Report Queue</span>
          {pendingReportsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'topics'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Forum Topics ({forumTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'keywords'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Moderation Controls & Blocklist</span>
        </button>
      </div>

      {/* TAB 1: REPORT QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                placeholder="Search by post snippet, user, reason..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
              >
                <option value="all">All Incident Statuses</option>
                <option value="pending">Pending Resolution</option>
                <option value="action_taken">Action Taken</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {filteredReports.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No incident reports in this queue"
                description="Community discussions are healthy and within established civic guidelines."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                      <th className="py-3.5 px-4">Reported Post Snippet</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4">Reported Author</th>
                      <th className="py-3.5 px-4">Reported By</th>
                      <th className="py-3.5 px-4">Submitted Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => setInspectReport(r)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="max-w-xs sm:max-w-sm">
                            <div className="font-medium text-slate-900 line-clamp-2 italic">
                              "{r.postSnippet}"
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">Topic: {r.topicName}</div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              r.reason === 'Harassment'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : r.reason === 'Profanity'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : r.reason === 'Misinformation'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {r.reason}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{r.postAuthorName}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">{r.reportingUserName}</td>

                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(r.submittedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              r.status === 'pending'
                                ? 'danger'
                                : r.status === 'action_taken'
                                ? 'success'
                                : 'secondary'
                            }
                            dot
                            size="sm"
                          >
                            <span className="capitalize">{r.status.replace('_', ' ')}</span>
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setInspectReport(r)}
                            className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shadow-2xs"
                          >
                            Review & Moderate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FORUM TOPICS */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Topic Title & Purpose</th>
                  <th className="py-3.5 px-4">Post Count</th>
                  <th className="py-3.5 px-4">Assigned Moderator</th>
                  <th className="py-3.5 px-4">Latest Activity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {forumTopics.map((topic, index) => (
                  <tr key={topic.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => reorderForumTopic(topic.id, 'up')}
                          disabled={index === 0}
                          className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Topic Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-500">{topic.order}</span>
                        <button
                          onClick={() => reorderForumTopic(topic.id, 'down')}
                          disabled={index === forumTopics.length - 1}
                          className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Topic Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{topic.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {topic.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {topic.postCount.toLocaleString()} posts
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {topic.assignedModeratorName ? (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Shield className="w-3.5 h-3.5 text-chel-600" />
                          <span>{topic.assignedModeratorName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(topic.latestActivityAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={topic.status === 'active' ? 'success' : 'secondary'}
                        size="sm"
                      >
                        <span className="capitalize">{topic.status}</span>
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setEditingTopic(topic);
                              setIsTopicEditorOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Topic"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => archiveForumTopic(topic.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title={topic.status === 'active' ? 'Archive Topic' : 'Restore Topic'}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MODERATION CONTROLS & KEYWORDS */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyword Blocklist Editor (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Keyword Blocklist Editor
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {keywordBlocklist.length} Blocked Terms
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Automated regex filter blocking English and Filipino profanity, harassment, and scam links before posts are published.
              </p>
            </div>

            {/* Add New Keyword Form */}
            <form onSubmit={handleAddKeyword} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter term or phrase (e.g. offensive word, scam URL)..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-200"
              />
              <select
                value={keywordLang}
                onChange={(e) => setKeywordLang(e.target.value as any)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium"
              >
                <option value="fil">Filipino / Tagalog</option>
                <option value="en">English</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-2xs"
              >
                Add Filter Term
              </button>
            </form>

            {/* Search and Tags Grid */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keywordSearch}
                  onChange={(e) => setKeywordSearch(e.target.value)}
                  placeholder="Filter blocked terms..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-1">
                {filteredKeywords.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs text-slate-800 transition-colors group"
                  >
                    <span className="font-mono">{item.word}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {item.language}
                    </span>
                    <button
                      onClick={() => removeKeyword(item.id)}
                      className="text-slate-400 group-hover:text-rose-600 hover:bg-rose-100 rounded p-0.5 transition-colors"
                      title="Remove from blocklist"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active User Sanctions (1 Col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Active User Sanctions</h3>
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Volunteers currently under temporary mute, suspension, or active moderation sanctions.
              </p>

              <div className="space-y-3">
                {sanctionedUsers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                    No users currently under sanction.
                  </div>
                ) : (
                  sanctionedUsers.map((u) => (
                    <div key={u.id} className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{u.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white uppercase">
                          {u.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 italic">
                        {u.sanctions[0]?.reason}
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>By {u.sanctions[0]?.imposedBy}</span>
                        <button
                          onClick={() => liftSanction(u.id)}
                          className="font-bold text-chel-700 hover:underline"
                        >
                          Lift Sanction
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Automatic unmute timer: Active</span>
              <span className="font-semibold text-emerald-600">PHT Synchronized</span>
            </div>
          </div>
        </div>
      )}

      {/* Topic Editor Modal */}
      <TopicEditorModal
        isOpen={isTopicEditorOpen}
        onClose={() => setIsTopicEditorOpen(false)}
        topicToEdit={editingTopic}
      />

      {/* Report Details and Moderation Action Modal */}
      <ReportDetailModal
        isOpen={!!inspectReport}
        onClose={() => setInspectReport(null)}
        report={inspectReport}
      />
    </div>
  );
};

