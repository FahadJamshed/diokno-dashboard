import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
  Calendar,
  User,
  AlertTriangle,
  Award,
  FileText
} from 'lucide-react';
import { ChallengeProof } from '../../../types';
import { useData } from '../../../context/DataContext';

interface ProofReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proof: ChallengeProof | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const ProofReviewModal: React.FC<ProofReviewModalProps> = ({
  isOpen,
  onClose,
  proof,
  onApprove,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !proof) return null;

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setError('A mandatory rejection reason is required so the volunteer understands what to fix.');
      return;
    }
    onReject(proof.id, rejectionReason.trim());
    setIsRejecting(false);
    setRejectionReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                {proof.proofType} submission
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  proof.badgeStatus === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : proof.badgeStatus === 'provisional'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                Badge: {proof.badgeStatus.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{proof.taskTitle}</h3>
            <p className="text-xs text-slate-500">{proof.challengeName}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Volunteer Profile Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={proof.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-xs font-bold text-slate-900">{proof.userName}</div>
              <div className="text-[11px] text-slate-500">
                {proof.userEmail} • {proof.province}
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <div>Submitted:</div>
            <div className="font-medium text-slate-600">
              {new Date(proof.submittedAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Proof Content Preview Area */}
        <div className="my-4 space-y-3">
          <div className="text-xs font-bold text-slate-700">Submitted Proof Artifact</div>

          {proof.proofType === 'photo' && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-80 flex items-center justify-center">
              <img
                src={proof.proofUrl}
                alt="Submitted Proof"
                className="max-h-80 w-auto object-contain rounded-xl"
              />
            </div>
          )}

          {proof.proofType === 'link' && (
            <div className="p-4 rounded-2xl bg-chel-50/60 border border-chel-200">
              <div className="text-xs font-semibold text-slate-700 mb-1">External Evidence URL:</div>
              <a
                href={proof.proofUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-chel-700 hover:underline flex items-center gap-1.5 break-all"
              >
                <span>{proof.proofUrl}</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </div>
          )}

          {proof.proofType === 'video' && (
            <div className="p-6 rounded-2xl bg-slate-900 text-white text-center">
              <div className="text-xs text-slate-400">Video Evidence Player</div>
              <div className="text-sm font-semibold mt-1">Video clip: {proof.taskTitle}</div>
              <a
                href={proof.proofUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-chel-600 text-white rounded-xl text-xs font-bold hover:bg-chel-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Video in New Tab</span>
              </a>
            </div>
          )}

          {proof.proofNotes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Volunteer Notes
              </div>
              <p className="text-xs text-slate-700 italic">"{proof.proofNotes}"</p>
            </div>
          )}

          {proof.status === 'rejected' && proof.rejectionReason && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <span className="font-bold">Rejection Reason:</span> {proof.rejectionReason}
            </div>
          )}

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600">
            <Shield className="w-4 h-4 text-chel-600 shrink-0" />
            <span>
              Privacy Protected: Proof submissions are confidential to Administrators and Moderators.
            </span>
          </div>
        </div>

        {/* Reject Reason Form if rejecting */}
        {isRejecting && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <label className="block text-xs font-bold text-rose-900">
              Mandatory Rejection Reason <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={2}
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setError('');
              }}
              placeholder="Explain clearly what document was missing or why this proof cannot be verified..."
              className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-slate-900"
            />
            {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-2xs"
              >
                Submit Rejection & Notify
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        {!isRejecting && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {proof.status !== 'rejected' && (
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject Submission</span>
                </button>
              )}

              {proof.status !== 'approved' && (
                <button
                  onClick={() => {
                    onApprove(proof.id);
                    onClose();
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Confirm Badge</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

