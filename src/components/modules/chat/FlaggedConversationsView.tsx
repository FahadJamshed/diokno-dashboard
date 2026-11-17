import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MessageSquare,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { ChatConversation, ConversationFlagReason, ConversationReviewStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';

export const FlaggedConversationsView: React.FC = () => {
  const { chatConversations, updateChatConversationReview } = useData();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Flagged conversations
  const flagged = chatConversations.filter((c) => c.flagReason || c.reviewStatus || c.feedback);

  const filtered = flagged.filter((c) => {
    const userMatch = c.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = c.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSearch = userMatch || contentMatch;

    const matchesStatus = statusFilter === 'all' || (c.reviewStatus || 'new') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalFlagged = chatConversations.filter((c) => c.flagReason).length;
  const newFlagged = chatConversations.filter((c) => c.reviewStatus === 'new' && c.flagReason).length;
  const positiveFeedback = chatConversations.filter((c) => c.feedback === 'positive').length;
  const negativeFeedback = chatConversations.filter((c) => c.feedback === 'negative').length;

  const flagReasonLabels: Record<ConversationFlagReason, { label: string; variant: 'danger' | 'warning' | 'primary' | 'purple' | 'info' | 'secondary' }> = {
    inappropriate_question: { label: 'Inappropriate Prompt', variant: 'danger' },
    incorrect_response: { label: 'Factual Accuracy Flag', variant: 'danger' },
    low_confidence: { label: 'Low Confidence Trigger', variant: 'warning' },
    user_report: { label: 'Citizen Reported', variant: 'danger' },
    sensitive_topic: { label: 'Private Counsel Solicitation', variant: 'purple' }
  };

  const handleOpenDetail = (conv: ChatConversation) => {
    setSelectedConversation(conv);
    setReviewNotes(conv.reviewNotes || '');
  };

  const handleApplyAction = (status: 'under_review' | 'resolved' | 'dismissed') => {
    if (!selectedConversation) return;
    updateChatConversationReview(selectedConversation.id, status, reviewNotes);
    setSelectedConversation(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Flagged</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalFlagged}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Triaged by safety guardrails</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">New Action Required</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{newFlagged}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting administrative review</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Positive Feedback</span>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{positiveFeedback}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Citizens verified answer accuracy</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Negative Feedback</span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">{negativeFeedback}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Responses flagged for review</div>
        </div>
      </div>

      {/* Main Review Queue */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search citizen or prompt keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium text-slate-700"
            >
              <option value="all">All Review Statuses</option>
              <option value="new">New ({newFlagged})</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            {filtered.length} Flagged Conversations in Queue
          </div>
        </div>

        {/* Queue Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Citizen / User</th>
                <th className="py-3 px-4">Initial Inquiry Preview</th>
                <th className="py-3 px-4">Flag Reason</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No flagged conversations found in this view.
                  </td>
                </tr>
              ) : (
                filtered.map((conv) => {
                  const firstUserMsg = conv.messages.find((m) => m.role === 'user')?.content || 'Inquiry...';
                  const flagCat = conv.flagReason ? flagReasonLabels[conv.flagReason] : null;

                  return (
                    <tr key={conv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={conv.userAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div className="font-bold text-slate-900">{conv.userName}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-800 font-medium">{firstUserMsg}</p>
                      </td>
                      <td className="py-3 px-4">
                        {flagCat ? (
                          <Badge variant={flagCat.variant} size="sm">
                            {flagCat.label}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {conv.feedback === 'positive' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful</span>
                          </span>
                        ) : conv.feedback === 'negative' ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 text-xs font-semibold">
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>Unhelpful</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No rating</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            (conv.reviewStatus || 'new') === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : (conv.reviewStatus || 'new') === 'under_review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : (conv.reviewStatus || 'new') === 'dismissed'
                              ? 'bg-slate-100 text-slate-500 border border-slate-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {(conv.reviewStatus || 'new').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(conv.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(conv)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversation Detail Drawer */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.userAvatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedConversation.userName}</h3>
                  <div className="text-[11px] text-slate-400">
                    ID: {selectedConversation.id} • {new Date(selectedConversation.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedConversation(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Transcript */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-80 overflow-y-auto space-y-4">
              {selectedConversation.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-chel-700 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      CD
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-chel-600 text-white rounded-tr-xs font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs space-y-2'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>

                    {/* Citations if assistant */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Source Citations:
                        </span>
                        {m.citations.map((c, idx) => (
                          <div key={idx} className="p-1.5 rounded-lg bg-chel-50/60 text-[11px] text-chel-800">
                            <strong>{c.documentTitle}</strong> {c.pageNumber ? `(p. ${c.pageNumber})` : ''}
                            <p className="italic text-[10.5px] text-slate-600 mt-0.5">"{c.excerpt}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Flag Trigger Context */}
            {selectedConversation.flagReason && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 mb-4">
                <span className="font-bold flex items-center gap-1.5 text-rose-700 mb-0.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Flag Reason: {selectedConversation.flagReason.replace('_', ' ').toUpperCase()}</span>
                </span>
                <p className="text-[11.5px] leading-relaxed">
                  Automatically captured for administrative verification of legal ethics, safety guardrails, or model grounding.
                </p>
              </div>
            )}

            {/* Review Notes Textarea */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 block">Internal Administrative Review Notes</label>
              <textarea
                rows={2}
                placeholder="Document resolution reason or changes made to knowledge base..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Current status: <strong className="capitalize">{selectedConversation.reviewStatus || 'new'}</strong>
              </span>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyAction('under_review')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleApplyAction('dismissed')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleApplyAction('resolved')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Resolve Flag
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
