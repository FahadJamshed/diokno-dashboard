import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Pin,
  Calendar,
  Bell,
  Eye,
  AlertCircle,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Announcement, AnnouncementCategory, AnnouncementStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';

interface AnnouncementEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementToEdit?: Announcement | null;
  onPreview?: (announcement: Partial<Announcement>) => void;
}

export const AnnouncementEditorModal: React.FC<AnnouncementEditorModalProps> = ({
  isOpen,
  onClose,
  announcementToEdit,
  onPreview
}) => {
  const { createAnnouncement, updateAnnouncement, events, announcements } = useData();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Legislative Updates');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [associatedEventId, setAssociatedEventId] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [publishMode, setPublishMode] = useState<'immediate' | 'schedule' | 'draft'>('immediate');
  const [scheduledAt, setScheduledAt] = useState('');
  const [sendPushNotification, setSendPushNotification] = useState(true);
  const [error, setError] = useState('');

  // Count current pinned
  const currentPinnedCount = announcements.filter(
    (a) => a.isPinned && a.id !== announcementToEdit?.id
  ).length;

  useEffect(() => {
    if (announcementToEdit) {
      setTitle(announcementToEdit.title);
      setCategory(announcementToEdit.category);
      setContent(announcementToEdit.content);
      setImages(announcementToEdit.images || []);
      setExternalLink(announcementToEdit.externalLink || '');
      setAssociatedEventId(announcementToEdit.associatedEventId || '');
      setIsPinned(announcementToEdit.isPinned);
      setPublishMode(
        announcementToEdit.status === 'scheduled'
          ? 'schedule'
          : announcementToEdit.status === 'draft'
          ? 'draft'
          : 'immediate'
      );
      setScheduledAt(announcementToEdit.scheduledAt ? announcementToEdit.scheduledAt.substring(0, 16) : '');
      setSendPushNotification(announcementToEdit.sendPushNotification);
    } else {
      setTitle('');
      setCategory('Legislative Updates');
      setContent('');
      setImages([]);
      setNewImageUrl('');
      setExternalLink('');
      setAssociatedEventId('');
      setIsPinned(false);
      setPublishMode('immediate');
      setScheduledAt('');
      setSendPushNotification(true);
    }
    setError('');
  }, [announcementToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (images.length >= 4) {
      setError('A maximum of 4 images can be attached to an announcement.');
      return;
    }
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
    setError('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = (asDraft = false) => {
    if (!title.trim()) {
      setError('Announcement title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content body is required.');
      return;
    }
    if (isPinned && currentPinnedCount >= 3) {
      setError('Maximum of 3 pinned announcements reached. Please unpin an announcement first.');
      return;
    }

    let status: AnnouncementStatus = 'published';
    if (asDraft || publishMode === 'draft') {
      status = 'draft';
    } else if (publishMode === 'schedule') {
      if (!scheduledAt) {
        setError('Please set a schedule date and time.');
        return;
      }
      status = 'scheduled';
    }

    const payload = {
      title: title.trim(),
      category,
      content: content.trim(),
      images,
      externalLink: externalLink.trim() || undefined,
      linkPreview: externalLink.trim()
        ? {
            title: title.trim(),
            description: content.substring(0, 100) + '...',
            domain: new URL(externalLink.startsWith('http') ? externalLink : 'https://' + externalLink).hostname,
            imageUrl: images[0]
          }
        : undefined,
      associatedEventId: associatedEventId || undefined,
      isPinned,
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      sendPushNotification: status === 'published' ? sendPushNotification : false
    };

    if (announcementToEdit) {
      const res = updateAnnouncement(announcementToEdit.id, payload);
      if (!res.success) {
        setError(res.error || 'Failed to update announcement.');
        return;
      }
    } else {
      const res = createAnnouncement(payload);
      if (!res.success) {
        setError(res.error || 'Failed to create announcement.');
        return;
      }
    }

    onClose();
  };

  const handleTriggerPreview = () => {
    if (onPreview) {
      onPreview({
        title: title || 'Untitled Announcement',
        category,
        content: content || 'No content provided yet.',
        images,
        externalLink,
        isPinned,
        authorName: user?.name || 'Administrator',
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {announcementToEdit ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish news, social campaigns, or legislative alerts to all volunteers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="mt-5 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Announcement Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free Legal Aid Caravan Schedules for November"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 focus:border-chel-600 font-medium"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Social Media', 'Legislative Updates', 'Volunteer Events'] as AnnouncementCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                      category === cat
                        ? 'bg-chel-50 border-chel-500 text-chel-700 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Content & Primer <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the announcement description, context, and clear instructions for volunteers..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 focus:border-chel-600 leading-relaxed"
            />
          </div>

          {/* Image Upload (Max 4) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Attached Photos (Maximum 4)</span>
              </label>
              <span className="text-xs font-semibold text-slate-500">{images.length} / 4 attached</span>
            </div>

            {/* Existing Images Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image URL input */}
            {images.length < 4 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (e.g. Unsplash or CDN link)..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-2 text-xs font-semibold text-chel-700 bg-chel-50 hover:bg-chel-100 border border-chel-200 rounded-xl transition-colors"
                >
                  Add Image
                </button>
              </div>
            )}
          </div>

          {/* External Link & Live Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>External Link / Press Release (Optional)</span>
            </label>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://cheldiokno.ph/article-link"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
            />
          </div>

          {/* Optional Associated Event */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Link Associated Event (Optional)</span>
            </label>
            <select
              value={associatedEventId}
              onChange={(e) => setAssociatedEventId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
            >
              <option value="">No associated event</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.province})
                </option>
              ))}
            </select>
          </div>

          {/* Pinned Setting (Enforce Max 3) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-chel-100 text-chel-700">
                <Pin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Pin Announcement to Top</div>
                <div className="text-[11px] text-slate-500">
                  Currently pinned: {currentPinnedCount}/3 (Maximum 3 pinned announcements)
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                disabled={!isPinned && currentPinnedCount >= 3}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chel-600 peer-disabled:opacity-40" />
            </label>
          </div>

          {/* Publishing Options: Immediate vs Schedule vs Draft */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="text-xs font-bold text-slate-900">Publishing Schedule</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPublishMode('immediate')}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  publishMode === 'immediate'
                    ? 'bg-chel-600 text-white border-chel-600 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Publish Now
              </button>
              <button
                type="button"
                onClick={() => setPublishMode('schedule')}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  publishMode === 'schedule'
                    ? 'bg-chel-600 text-white border-chel-600 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Schedule Release
              </button>
              <button
                type="button"
                onClick={() => setPublishMode('draft')}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  publishMode === 'draft'
                    ? 'bg-chel-600 text-white border-chel-600 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Save as Draft
              </button>
            </div>

            {publishMode === 'schedule' && (
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Schedule Date & Time (PHT Manila)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-200"
                />
              </div>
            )}

            {publishMode === 'immediate' && (
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sendPushNotification}
                  onChange={(e) => setSendPushNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-chel-600 focus:ring-chel-500 border-slate-300"
                />
                <span className="font-medium flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-chel-600" />
                  Dispatch push notification to all volunteers on publish
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTriggerPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Card</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors"
            >
              {announcementToEdit ? 'Save Changes' : publishMode === 'draft' ? 'Save Draft' : publishMode === 'schedule' ? 'Schedule Announcement' : 'Publish Announcement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

