import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Pin,
  PinOff,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Announcement, AnnouncementCategory, AnnouncementStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { AnnouncementEditorModal } from './AnnouncementEditorModal';
import { AnnouncementPreviewModal } from './AnnouncementPreviewModal';

export const AnnouncementsList: React.FC = () => {
  const { announcements, deleteAnnouncement, togglePinAnnouncement, publishAnnouncement, unpublishAnnouncement } = useData();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [previewItem, setPreviewItem] = useState<Partial<Announcement> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Pinned count
  const pinnedCount = announcements.filter((a) => a.isPinned).length;

  // Filtered announcements
  const filtered = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.authorName.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setIsEditorOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteAnnouncement(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Announcements</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {announcements.length} Total
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                pinnedCount >= 3
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-chel-50 text-chel-700 border-chel-200'
              }`}
            >
              <Pin className="w-3 h-3 inline mr-1" />
              {pinnedCount} / 3 Pinned (Max 3)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast official statements, legislative updates, and mobilize volunteers.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-chel-600 hover:bg-chel-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, primer, author..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 focus:border-chel-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-200 text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Social Media">Social Media</option>
            <option value="Legislative Updates">Legislative Updates</option>
            <option value="Volunteer Events">Volunteer Events</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-200 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No announcements match your search"
            description="Try adjusting your filters or create a new announcement."
            actionLabel={isAdmin ? 'Create Announcement' : undefined}
            onAction={isAdmin ? handleOpenCreate : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Publish Date</th>
                  <th className="py-3.5 px-4 text-center">Pinned</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginated.map((ann) => (
                  <tr
                    key={ann.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="max-w-xs sm:max-w-sm">
                        <div className="font-bold text-slate-900 line-clamp-1">{ann.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {ann.content}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          ann.category === 'Legislative Updates'
                            ? 'info'
                            : ann.category === 'Volunteer Events'
                            ? 'purple'
                            : 'primary'
                        }
                        size="sm"
                      >
                        {ann.category}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          ann.status === 'published'
                            ? 'success'
                            : ann.status === 'scheduled'
                            ? 'warning'
                            : ann.status === 'draft'
                            ? 'secondary'
                            : 'danger'
                        }
                        dot
                        size="sm"
                      >
                        <span className="capitalize">{ann.status}</span>
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {ann.authorName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {ann.publishedAt ? (
                        <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                      ) : ann.scheduledAt ? (
                        <span className="text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ann.scheduledAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="italic text-slate-400">Unpublished</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePinAnnouncement(ann.id)}
                        disabled={!isAdmin}
                        className={`p-1.5 rounded-lg transition-colors ${
                          ann.isPinned
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                        } ${!isAdmin ? 'cursor-default' : ''}`}
                        title={ann.isPinned ? 'Unpin announcement' : 'Pin to top (max 3)'}
                      >
                        {ann.isPinned ? <Pin className="w-4 h-4 fill-amber-600" /> : <Pin className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Preview button */}
                        <button
                          onClick={() => setPreviewItem(ann)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-chel-600 hover:bg-chel-50 transition-colors"
                          title="Preview Card"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Admin actions */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(ann)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit Announcement"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {ann.status === 'published' ? (
                              <button
                                onClick={() => unpublishAnnouncement(ann.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                title="Unpublish (Return to Draft)"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => publishAnnouncement(ann.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Publish Now"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setDeleteConfirmId(ann.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Announcement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <AnnouncementEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        announcementToEdit={editingAnnouncement}
        onPreview={(ann) => setPreviewItem(ann)}
      />

      {/* Preview Modal */}
      <AnnouncementPreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        announcement={previewItem}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message="Are you sure you want to permanently delete this announcement? This action will remove it from all volunteer feeds and cannot be undone."
        confirmLabel="Delete Permanently"
        variant="danger"
      />
    </div>
  );
};

