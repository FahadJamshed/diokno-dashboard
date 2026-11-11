import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Award,
  Calendar,
  CheckSquare,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Challenge, ChallengeProof, ProofStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { EmptyState } from '../../common/EmptyState';
import { ChallengeEditorModal } from './ChallengeEditorModal';
import { ProofReviewModal } from './ProofReviewModal';

export const ChallengesList: React.FC = () => {
  const {
    challenges,
    challengeProofs,
    approveProof,
    rejectProof,
    bulkApproveProofs
  } = useData();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'queue' | 'challenges'>('queue');
  const [proofStatusFilter, setProofStatusFilter] = useState<string>('pending_review');
  const [challengeFilter, setChallengeFilter] = useState<string>('all');
  const [proofSearch, setProofSearch] = useState('');
  const [selectedProofIds, setSelectedProofIds] = useState<string[]>([]);

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [activeReviewProof, setActiveReviewProof] = useState<ChallengeProof | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter Proof Queue
  const filteredProofs = challengeProofs.filter((p) => {
    const matchSearch =
      p.userName.toLowerCase().includes(proofSearch.toLowerCase()) ||
      p.taskTitle.toLowerCase().includes(proofSearch.toLowerCase()) ||
      p.province.toLowerCase().includes(proofSearch.toLowerCase());

    const matchStatus = proofStatusFilter === 'all' || p.status === proofStatusFilter;
    const matchChallenge = challengeFilter === 'all' || p.challengeId === challengeFilter;

    return matchSearch && matchStatus && matchChallenge;
  });

  const paginatedProofs = filteredProofs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingProofsCount = challengeProofs.filter((p) => p.status === 'pending_review').length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProofIds(paginatedProofs.map((p) => p.id));
    } else {
      setSelectedProofIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedProofIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    if (selectedProofIds.length === 0) return;
    bulkApproveProofs(selectedProofIds);
    setSelectedProofIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CHELlenges Management</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-chel-50 text-chel-700 border border-chel-200">
              {pendingProofsCount} Submissions Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review volunteer proof submissions, issue confirmed monthly badges, and configure monthly sprints.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingChallenge(null);
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Monthly Challenge</span>
          </button>
        )}
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('queue');
            setCurrentPage(1);
          }}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'queue'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Proof Review Queue</span>
          {pendingProofsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-chel-500 text-white">
              {pendingProofsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('challenges');
            setCurrentPage(1);
          }}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'challenges'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Monthly Challenges Roster ({challenges.length})</span>
        </button>
      </div>

      {activeTab === 'queue' ? (
        /* PROOF REVIEW QUEUE TAB */
        <div className="space-y-4">
          {/* Queue Filter Bar & Bulk Actions */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center gap-3 justify-between">
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={proofSearch}
                onChange={(e) => {
                  setProofSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search volunteer, task, province..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Status Filter */}
              <select
                value={proofStatusFilter}
                onChange={(e) => {
                  setProofStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
              >
                <option value="all">All Proof Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="submitted">Submitted</option>
              </select>

              {/* Challenge Filter */}
              <select
                value={challengeFilter}
                onChange={(e) => {
                  setChallengeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200 max-w-[200px]"
              >
                <option value="all">All Monthly Challenges</option>
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Bulk Approve Button */}
              {selectedProofIds.length > 0 && (
                <button
                  onClick={handleBulkApprove}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Bulk Approve ({selectedProofIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Proof Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {filteredProofs.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No submissions match your queue filter"
                description="All volunteer submissions for this category have been evaluated."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                      <th className="py-3 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            paginatedProofs.length > 0 &&
                            selectedProofIds.length === paginatedProofs.length
                          }
                          onChange={handleSelectAll}
                          className="rounded text-chel-600 focus:ring-chel-500"
                        />
                      </th>
                      <th className="py-3.5 px-4">Volunteer</th>
                      <th className="py-3.5 px-4">Challenge & Task</th>
                      <th className="py-3.5 px-4">Proof Type & Preview</th>
                      <th className="py-3.5 px-4">Submitted Date</th>
                      <th className="py-3.5 px-4">Badge Status</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedProofs.map((p) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          selectedProofIds.includes(p.id) ? 'bg-chel-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProofIds.includes(p.id)}
                            onChange={() => handleToggleSelectOne(p.id)}
                            className="rounded text-chel-600 focus:ring-chel-500"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.userAvatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{p.userName}</div>
                              <div className="text-[11px] text-slate-400">
                                {p.province} • {p.userEmail}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 line-clamp-1">{p.taskTitle}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{p.challengeName}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {p.proofType === 'photo' && (
                              <img
                                src={p.proofUrl}
                                alt="Proof thumbnail"
                                className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200 cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setActiveReviewProof(p)}
                              />
                            )}
                            <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {p.proofType}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(p.submittedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              p.badgeStatus === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : p.badgeStatus === 'provisional'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Award className="w-3 h-3" />
                            <span className="capitalize">{p.badgeStatus}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              p.status === 'approved'
                                ? 'success'
                                : p.status === 'pending_review'
                                ? 'warning'
                                : p.status === 'submitted'
                                ? 'info'
                                : 'danger'
                            }
                            dot
                            size="sm"
                          >
                            <span className="capitalize">{p.status.replace('_', ' ')}</span>
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveReviewProof(p)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-chel-700 bg-slate-100 hover:bg-chel-50 rounded-lg transition-colors"
                            >
                              Inspect
                            </button>
                            {p.status !== 'approved' && (
                              <button
                                onClick={() => approveProof(p.id)}
                                className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Quick Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredProofs.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MONTHLY CHALLENGES ROSTER TAB */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Active accent strip */}
                {c.status === 'published' && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-chel-500" />
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.badgeImageUrl}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0 shadow-2xs"
                      />
                      <div>
                        <div className="text-xs font-bold text-amber-800">{c.month} {c.year}</div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                          {c.name}
                        </h3>
                      </div>
                    </div>
                    <Badge
                      variant={
                        c.status === 'published'
                          ? 'success'
                          : c.status === 'draft'
                          ? 'secondary'
                          : 'purple'
                      }
                      size="sm"
                    >
                      <span className="capitalize">{c.status}</span>
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 border border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="font-medium">Total Tasks:</span>
                      <span className="font-bold text-slate-800">{c.tasks.length} civic tasks</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="font-medium">Registered Participants:</span>
                      <span className="font-bold text-chel-700">{c.participationCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="font-medium">Badges Conferred:</span>
                      <span className="font-bold text-emerald-700">{c.completionCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                      <span>Schedule:</span>
                      <span>
                        {new Date(c.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} –{' '}
                        {new Date(c.closingDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingChallenge(c);
                        setIsEditorOpen(true);
                      }}
                      className="text-xs font-bold text-chel-600 hover:text-chel-700 hover:underline"
                    >
                      Configure Tasks & Dates
                    </button>
                    <span className="text-[11px] text-slate-400">ID: {c.id}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <ChallengeEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        challengeToEdit={editingChallenge}
      />

      {/* Proof Inspection Modal */}
      <ProofReviewModal
        isOpen={!!activeReviewProof}
        onClose={() => setActiveReviewProof(null)}
        proof={activeReviewProof}
        onApprove={(id) => approveProof(id)}
        onReject={(id, reason) => rejectProof(id, reason)}
      />
    </div>
  );
};

