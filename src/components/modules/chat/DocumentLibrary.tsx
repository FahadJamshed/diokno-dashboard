import React, { useState } from 'react';
import {
  FileText,
  Search,
  Upload,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  ExternalLink,
  RefreshCw,
  Plus,
  FileCode,
  Globe
} from 'lucide-react';
import { ChatDocument, DocumentApprovalStatus, DocumentFileType } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { DocumentUploadModal } from './DocumentUploadModal';
import { DocumentDetailModal } from './DocumentDetailModal';

export const DocumentLibrary: React.FC = () => {
  const { chatDocuments, approveChatDocument, startChatDocumentIndexing } = useData();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ChatDocument | null>(null);

  // Filter documents
  const filteredDocs = chatDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesApproval = approvalFilter === 'all' || doc.approvalStatus === approvalFilter;
    const matchesFileType = fileTypeFilter === 'all' || doc.fileType === fileTypeFilter;

    return matchesSearch && matchesApproval && matchesFileType;
  });

  const totalPages = Math.ceil(filteredDocs.length / pageSize) || 1;
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingCount = chatDocuments.filter((d) => d.approvalStatus === 'pending_approval').length;
  const approvedCount = chatDocuments.filter((d) => d.approvalStatus === 'approved').length;
  const indexedCount = chatDocuments.filter((d) => d.indexingStatus === 'indexed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Documents</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{chatDocuments.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approved public library</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Approval</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Requires admin review</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Approved Records</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{approvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Verified source materials</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-chel-700 uppercase tracking-wider">Indexed in Vector DB</div>
          <div className="text-2xl font-black text-chel-900 mt-1">{indexedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Live embeddings for AI</div>
        </div>
      </div>

      {/* Main Filter & Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search documents by title or source..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
            </div>

            <select
              value={approvalFilter}
              onChange={(e) => {
                setApprovalFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium text-slate-700"
            >
              <option value="all">All Approval States</option>
              <option value="pending_approval">Pending Approval ({pendingCount})</option>
              <option value="approved">Approved ({approvedCount})</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={fileTypeFilter}
              onChange={(e) => {
                setFileTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium text-slate-700"
            >
              <option value="all">All File Formats</option>
              <option value="pdf">PDF Documents</option>
              <option value="docx">Word (DOCX)</option>
              <option value="transcript">Speech Transcripts</option>
              <option value="webpage">Official Webpages</option>
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            )}
          </div>
        </div>

        {/* Documents Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Document Title & File</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4">Indexing Status</th>
                  <th className="py-3 px-4">Chunks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No documents found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 max-w-sm">
                        <div
                          onClick={() => setSelectedDoc(doc)}
                          className="font-bold text-slate-900 hover:text-chel-600 cursor-pointer line-clamp-1"
                        >
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span className="uppercase font-semibold">{doc.fileType}</span>
                          <span>•</span>
                          <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">{doc.source}</td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{doc.uploadedBy}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(doc.uploadedAt).toLocaleDateString([], { dateStyle: 'short' })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            doc.approvalStatus === 'approved'
                              ? 'success'
                              : doc.approvalStatus === 'pending_approval'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                          dot
                        >
                          <span className="capitalize">{doc.approvalStatus.replace('_', ' ')}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
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
                          size="sm"
                        >
                          <span className="capitalize">{doc.indexingStatus.replace(/_/g, ' ')}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {doc.chunkCount || 0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            Details
                          </button>

                          {isAdmin && doc.approvalStatus === 'pending_approval' && (
                            <button
                              onClick={() => approveChatDocument(doc.id)}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                            >
                              Approve
                            </button>
                          )}

                          {isAdmin && doc.approvalStatus === 'approved' && doc.indexingStatus !== 'indexed' && (
                            <button
                              onClick={() => startChatDocumentIndexing(doc.id)}
                              className="px-2.5 py-1 text-xs font-bold text-chel-700 bg-chel-50 hover:bg-chel-100 rounded-lg transition-colors border border-chel-200 flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Index</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredDocs.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Detail & Review Modal */}
      <DocumentDetailModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
      />
    </div>
  );
};
