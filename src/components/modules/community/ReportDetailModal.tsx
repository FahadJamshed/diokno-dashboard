import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Lock,
  Trash2,
  AlertOctagon,
  Clock,
  Ban,
  CheckCircle2,
  UserX,
  MessageSquare,
  Shield,
  FileText
} from 'lucide-react';
import { CommunityReport } from '../../../types';
import { useData } from '../../../context/DataContext';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: CommunityReport | null;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  report
}) => {
  const { resolveReportAction } = useData();
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<
    'remove_post' | 'lock_post' | 'warn_user' | 'mute_24h' | 'mute_7d' | 'ban_user' | 'dismiss' | null
  >(null);

  if (!isOpen || !report) return null;

  const handleExecuteAction = (
    action: 'remove_post' | 'lock_post' | 'warn_user' | 'mute_24h' | 'mute_7d' | 'ban_user' | 'dismiss'
  ) => {
    resolveReportAction(report.id, action, moderatorNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
                Flagged for: {report.reason}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                in {report.topicName}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Community Incident Review</h3>
            <p className="text-xs text-slate-500">
              Report submitted by <span className="font-semibold text-slate-700">{report.reportingUserName}</span> on{' '}
              {new Date(report.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flagged Post Content Section */}
        <div className="my-4 space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={report.postAuthorAvatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">{report.postAuthorName}</span>
                  <span className="text-[10px] text-slate-400 ml-2">Author of reported post</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {report.repliesCount} thread replies
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-slate-900 leading-relaxed font-mono">
              "{report.postFullContent}"
            </div>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Context: Posted inside discussion topic "{report.topicName}".</span>
            </div>
          </div>

          {/* Current Status banner if action already taken */}
          {report.status !== 'pending' && (
            <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 flex items-center justify-between">
              <span className="font-semibold">Status: {report.status.toUpperCase()}</span>
              <span>Action: {report.actionTaken} ({report.actionNote})</span>
            </div>
          )}

          {/* Moderator Resolution Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Administrative Action Note (Recorded in Audit Log)
            </label>
            <input
              type="text"
              value={moderatorNotes}
              onChange={(e) => setModeratorNotes(e.target.value)}
              placeholder="e.g. Violation of Rule 2: Harassment & Profanity in public thread..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
            />
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3">Select Moderation Action:</div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleExecuteAction('remove_post')}
              className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Remove Post</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteAction('lock_post')}
              className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Lock Post</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteAction('warn_user')}
              className="p-2.5 rounded-xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <AlertOctagon className="w-4 h-4 text-yellow-600" />
              <span>Warn User</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteAction('mute_24h')}
              className="p-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Mute 24 Hours</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteAction('mute_7d')}
              className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Mute 7 Days</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteAction('ban_user')}
              className="p-2.5 rounded-xl border border-rose-300 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex flex-col items-center gap-1 transition-colors shadow-2xs"
            >
              <Ban className="w-4 h-4 text-white" />
              <span>Ban User Account</span>
            </button>

            <button
              type="button"
              onClick={() => handleExecuteAction('dismiss')}
              className="sm:col-span-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              <span>Dismiss Report (No Violation)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

