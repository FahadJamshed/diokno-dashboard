import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  User,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { ChatDocument } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { ConfirmationModal } from '../../common/ConfirmationModal';

interface DocumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ChatDocument | null;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  isOpen,
  onClose,
  document: doc
}) => {
  const { approveChatDocument, rejectChatDocument, startChatDocumentIndexing, removeChatDocument } = useData();
  const { isAdmin } = useAuth();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!isOpen || !doc) return null;

  const isApproved = doc.approvalStatus === 'approved';
  const isIndexed = doc.indexingStatus === 'indexed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge
                variant={
                  doc.approvalStatus === 'approved'
                    ? 'success'
                    : doc.approvalStatus === 'pending_approval'
                    ? 'warning'
                    : 'danger'
                }
                dot
              >
                <span className="capitalize">{doc.approvalStatus.replace('_', ' ')}</span>
              </Badge>

              <Badge
                variant={
                  doc.indexingStatus === 'indexed'
                    ? 'success'
                    : doc.indexingStatus === 'indexing'
                    ? 'primary'
                    : doc.indexingStatus === 'ready_for_indexing'
                    ? 'info'
                    : 'secondary'
                }
              >
                <span className="capitalize">{doc.indexingStatus.replace(/_/g, ' ')}</span>
              </Badge>

              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {doc.fileType}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
              {doc.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rejection notice if rejected */}
        {doc.approvalStatus === 'rejected' && doc.rejectionReason && (
          <div className="my-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-sm mb-1 text-rose-700">
              <XCircle className="w-4 h-4" />
              <span>Administrative Rejection Reason</span>
            </div>
            <p className="leading-relaxed">{doc.rejectionReason}</p>
          </div>
        )}

        {/* Metadata Details */}
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              File Details
            </span>
            <div className="font-semibold text-slate-800 truncate">{doc.fileName}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Size: {(doc.fileSize / 1024).toFixed(1)} KB • Type: {doc.fileType.toUpperCase()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Official Source
            </span>
            <div className="font-semibold text-slate-800">{doc.source}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">Uploaded by: {doc.uploadedBy}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Upload Date
            </span>
            <div className="font-semibold text-slate-800">
              {new Date(doc.uploadedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
            {doc.approvedAt && (
              <div className="text-emerald-700 text-[11px] mt-0.5">
                Approved: {new Date(doc.approvedAt).toLocaleDateString()} by {doc.approvedBy}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Vector Indexing
            </span>
            <div className="font-semibold text-slate-800">
              {doc.chunkCount ? `${doc.chunkCount} Text Chunks / Embeddings` : 'Not Indexed'}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {doc.indexedAt ? `Indexed: ${new Date(doc.indexedAt).toLocaleDateString()}` : 'Pending Indexing Execution'}
            </div>
          </div>
        </div>

        {/* Summary Description */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Summary & Scope
          </span>
          <p className="text-slate-700 leading-relaxed">{doc.description}</p>
        </div>

        {/* Processing Timeline */}
        <div className="mt-5 p-4 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Approval & Indexing Lifecycle
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Document uploaded & parsed into text chunks</span>
            </div>
            <div className={`flex items-center gap-2.5 ${isApproved ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isApproved ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>Administrative content review & public record verification</span>
            </div>
            <div className={`flex items-center gap-2.5 ${isIndexed ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isIndexed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Database className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>Vector embeddings generated & published to live assistant</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {isAdmin && (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Document</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && doc.approvalStatus === 'pending_approval' && (
              <>
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    approveChatDocument(doc.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Approve Document
                </button>
              </>
            )}

            {isAdmin && isApproved && (
              <button
                onClick={() => {
                  startChatDocumentIndexing(doc.id);
                  onClose();
                }}
                disabled={doc.indexingStatus === 'indexing'}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-chel-600 hover:bg-chel-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${doc.indexingStatus === 'indexing' ? 'animate-spin' : ''}`} />
                <span>{isIndexed ? 'Re-index Embeddings' : 'Start Vector Indexing'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Reject Confirmation Modal with Mandatory Reason */}
        <ConfirmationModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={(reason) => {
            if (reason) {
              rejectChatDocument(doc.id, reason);
              setRejectModalOpen(false);
              onClose();
            }
          }}
          title="Reject Document Approval?"
          message={`Please specify why "${doc.title}" should not be approved for the Chat with Chel public knowledge base.`}
          confirmLabel="Reject Document"
          variant="danger"
          requireReason
          reasonPlaceholder="e.g. Unverified draft, contains non-public contact data, or pending committee clearance..."
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            removeChatDocument(doc.id);
            setDeleteModalOpen(false);
            onClose();
          }}
          title="Remove Document from Knowledge Base?"
          message={`Are you sure you want to permanently delete "${doc.title}"? Any active embeddings in Chat with Chel will be invalidated.`}
          confirmLabel="Yes, Remove"
          variant="danger"
        />
      </div>
    </div>
  );
};
