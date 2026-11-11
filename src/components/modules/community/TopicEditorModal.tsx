import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Shield, AlertCircle } from 'lucide-react';
import { ForumTopic, User } from '../../../types';
import { useData } from '../../../context/DataContext';

interface TopicEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicToEdit?: ForumTopic | null;
}

export const TopicEditorModal: React.FC<TopicEditorModalProps> = ({
  isOpen,
  onClose,
  topicToEdit
}) => {
  const { createForumTopic, updateForumTopic, users } = useData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedModeratorId, setAssignedModeratorId] = useState('');
  const [status, setStatus] = useState<'active' | 'archived'>('active');
  const [error, setError] = useState('');

  // List of staff/moderators/admins for assignment
  const eligibleModerators = users.filter((u) => u.role === 'moderator' || u.role === 'admin');

  useEffect(() => {
    if (topicToEdit) {
      setName(topicToEdit.name);
      setDescription(topicToEdit.description);
      setAssignedModeratorId(topicToEdit.assignedModeratorId || '');
      setStatus(topicToEdit.status);
    } else {
      setName('');
      setDescription('');
      setAssignedModeratorId('');
      setStatus('active');
    }
    setError('');
  }, [topicToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Topic name is required.');
      return;
    }

    const assignedUser = eligibleModerators.find((m) => m.id === assignedModeratorId);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      assignedModeratorId: assignedModeratorId || undefined,
      assignedModeratorName: assignedUser ? assignedUser.name : undefined,
      status
    };

    if (topicToEdit) {
      updateForumTopic(topicToEdit.id, payload);
    } else {
      createForumTopic(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {topicToEdit ? 'Edit Forum Topic' : 'Create Forum Topic'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize community discussion boards and assign dedicated moderators
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Topic Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Legal Aid & Constitutional Rights Q&A"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description & Guidelines
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What conversations belong in this forum category..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-chel-600" />
              <span>Assigned Lead Moderator</span>
            </label>
            <select
              value={assignedModeratorId}
              onChange={(e) => setAssignedModeratorId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
            >
              <option value="">Unassigned (Pooled moderation)</option>
              {eligibleModerators.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">Topic Status</div>
              <div className="text-[11px] text-slate-500">Archived topics become read-only</div>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-xl"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors"
            >
              {topicToEdit ? 'Save Changes' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

