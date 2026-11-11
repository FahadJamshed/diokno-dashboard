import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Award,
  Calendar,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Challenge, ChallengeTask } from '../../../types';
import { useData } from '../../../context/DataContext';

interface ChallengeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeToEdit?: Challenge | null;
}

export const ChallengeEditorModal: React.FC<ChallengeEditorModalProps> = ({
  isOpen,
  onClose,
  challengeToEdit
}) => {
  const { createChallenge, updateChallenge, challenges } = useData();

  const [name, setName] = useState('');
  const [month, setMonth] = useState('December');
  const [year, setYear] = useState(2025);
  const [description, setDescription] = useState('');
  const [badgeTitle, setBadgeTitle] = useState('');
  const [badgeImageUrl, setBadgeImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [tasks, setTasks] = useState<ChallengeTask[]>([]);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('draft');
  const [error, setError] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (challengeToEdit) {
      setName(challengeToEdit.name);
      setMonth(challengeToEdit.month);
      setYear(challengeToEdit.year);
      setDescription(challengeToEdit.description);
      setBadgeTitle(challengeToEdit.badgeTitle);
      setBadgeImageUrl(challengeToEdit.badgeImageUrl);
      setStartDate(challengeToEdit.startDate.substring(0, 10));
      setClosingDate(challengeToEdit.closingDate.substring(0, 10));
      setTasks(challengeToEdit.tasks);
      setStatus(challengeToEdit.status);
    } else {
      setName('');
      setMonth('December');
      setYear(2025);
      setDescription('');
      setBadgeTitle('');
      setBadgeImageUrl('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80');
      setStartDate('2025-12-01');
      setClosingDate('2025-12-31');
      setStatus('draft');
      // Default 3 initial tasks (minimum 3 required)
      setTasks([
        {
          id: 'tsk-' + Math.random().toString(36).substring(2, 7),
          title: 'Task 1: Verify Civic Registration',
          instructions: 'Upload proof of active voter status or civic council membership.',
          acceptedProofTypes: ['photo'],
          order: 1
        },
        {
          id: 'tsk-' + Math.random().toString(36).substring(2, 7),
          title: 'Task 2: Community Outreach or Clean-up',
          instructions: 'Participate in a community project and document your work.',
          acceptedProofTypes: ['photo', 'video'],
          order: 2
        },
        {
          id: 'tsk-' + Math.random().toString(36).substring(2, 7),
          title: 'Task 3: Share Civic Rights Primer Online',
          instructions: 'Share know-your-rights infographic and submit post link.',
          acceptedProofTypes: ['link'],
          order: 3
        }
      ]);
    }
    setError('');
  }, [challengeToEdit, isOpen]);

  if (!isOpen) return null;

  // Task reordering & modification
  const handleAddTask = () => {
    if (tasks.length >= 10) {
      setError('A challenge can contain a maximum of 10 tasks.');
      return;
    }
    const newTask: ChallengeTask = {
      id: 'tsk-' + Math.random().toString(36).substring(2, 7),
      title: `Task ${tasks.length + 1}: `,
      instructions: '',
      acceptedProofTypes: ['photo'],
      order: tasks.length + 1
    };
    setTasks([...tasks, newTask]);
    setError('');
  };

  const handleRemoveTask = (index: number) => {
    if (tasks.length <= 3) {
      setError('A challenge must contain at least 3 tasks.');
      return;
    }
    const filtered = tasks.filter((_, i) => i !== index);
    const reordered = filtered.map((t, idx) => ({ ...t, order: idx + 1 }));
    setTasks(reordered);
    setError('');
  };

  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === tasks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newTasks = [...tasks];
    const [moved] = newTasks.splice(index, 1);
    newTasks.splice(targetIndex, 0, moved);

    const reordered = newTasks.map((t, idx) => ({ ...t, order: idx + 1 }));
    setTasks(reordered);
  };

  const handleUpdateTaskField = (index: number, field: keyof ChallengeTask, val: any) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: val };
    setTasks(updated);
  };

  const handleToggleProofType = (taskIndex: number, type: 'photo' | 'video' | 'link') => {
    const task = tasks[taskIndex];
    const exists = task.acceptedProofTypes.includes(type);
    let newTypes: ('photo' | 'video' | 'link')[];

    if (exists) {
      if (task.acceptedProofTypes.length === 1) {
        setError('At least one proof type must be accepted for each task.');
        return;
      }
      newTypes = task.acceptedProofTypes.filter((t) => t !== type);
    } else {
      newTypes = [...task.acceptedProofTypes, type];
    }

    handleUpdateTaskField(taskIndex, 'acceptedProofTypes', newTypes);
    setError('');
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Challenge title is required.');
      return;
    }
    if (!badgeTitle.trim()) {
      setError('Badge reward title is required.');
      return;
    }
    if (tasks.length < 3 || tasks.length > 10) {
      setError('Each CHELlenge must contain between 3 and 10 tasks.');
      return;
    }

    // Check: One active challenge per month
    if (status === 'published') {
      const existingForMonth = challenges.find(
        (c) =>
          c.month === month &&
          c.year === year &&
          c.status === 'published' &&
          c.id !== challengeToEdit?.id
      );
      if (existingForMonth) {
        setError(`An active published challenge already exists for ${month} ${year}: "${existingForMonth.name}". Only one active challenge per month is permitted.`);
        return;
      }
    }

    const payload = {
      name: name.trim(),
      month,
      year: Number(year),
      description: description.trim(),
      badgeTitle: badgeTitle.trim(),
      badgeImageUrl: badgeImageUrl.trim() || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
      startDate: new Date(startDate).toISOString(),
      closingDate: new Date(closingDate).toISOString(),
      tasks,
      status
    };

    if (challengeToEdit) {
      const res = updateChallenge(challengeToEdit.id, payload);
      if (!res.success) {
        setError(res.error || 'Failed to update challenge.');
        return;
      }
    } else {
      const res = createChallenge(payload);
      if (!res.success) {
        setError(res.error || 'Failed to create challenge.');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {challengeToEdit ? 'Edit Monthly CHELlenge' : 'Create Monthly Volunteer CHELlenge'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set monthly civic tasks (3–10 required), define verification proof rules, and badge artwork
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

        <div className="mt-5 space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          {/* Title & Month/Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Challenge Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. December Holiday Solidarity & Community Drive"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Challenge Month <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-20 px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-center"
                />
              </div>
            </div>
          </div>

          {/* Dates & Badge reward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Opening & Closing Dates <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Earned Badge Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={badgeTitle}
                onChange={(e) => setBadgeTitle(e.target.value)}
                placeholder="e.g. December Solidarity Champion 2025"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
              />
            </div>
          </div>

          {/* Badge artwork image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Monthly Badge Artwork URL</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={badgeImageUrl}
                onChange={(e) => setBadgeImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or CDN badge link"
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
              {badgeImageUrl && (
                <img
                  src={badgeImageUrl}
                  alt="Badge preview"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400 shrink-0"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Challenge Overview & Goals
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the mission, civic theme, and community impact of this monthly sprint..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white leading-relaxed"
            />
          </div>

          {/* Tasks Builder (3 to 10 tasks) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Challenge Tasks ({tasks.length} / 10)
                </span>
                <span className="text-[11px] text-slate-500 ml-2">
                  (Enforced requirement: 3 to 10 tasks)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddTask}
                disabled={tasks.length >= 10}
                className="px-3 py-1.5 text-xs font-semibold text-chel-700 bg-chel-50 hover:bg-chel-100 disabled:opacity-40 rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleUpdateTaskField(index, 'title', e.target.value)}
                        placeholder="Task Title (e.g. Host a Civic Study Circle)"
                        className="w-full px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-chel-500"
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveTask(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveTask(index, 'down')}
                        disabled={index === tasks.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(index)}
                        disabled={tasks.length <= 3}
                        className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20"
                        title={tasks.length <= 3 ? 'Minimum 3 tasks required' : 'Delete Task'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Task Instructions */}
                  <textarea
                    rows={2}
                    value={task.instructions}
                    onChange={(e) => handleUpdateTaskField(index, 'instructions', e.target.value)}
                    placeholder="Instructions for the volunteer on how to complete and prove this task..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-chel-500 leading-relaxed"
                  />

                  {/* Accepted Proof Types */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Accepted Proof Formats:
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.acceptedProofTypes.includes('photo')}
                          onChange={() => handleToggleProofType(index, 'photo')}
                          className="rounded text-chel-600 focus:ring-chel-500"
                        />
                        <span className="text-[11px] text-slate-700">Photo</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.acceptedProofTypes.includes('video')}
                          onChange={() => handleToggleProofType(index, 'video')}
                          className="rounded text-chel-600 focus:ring-chel-500"
                        />
                        <span className="text-[11px] text-slate-700">Video</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={task.acceptedProofTypes.includes('link')}
                          onChange={() => handleToggleProofType(index, 'link')}
                          className="rounded text-chel-600 focus:ring-chel-500"
                        />
                        <span className="text-[11px] text-slate-700">Link</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Publishing State</div>
              <div className="text-[11px] text-slate-500">
                Only one challenge can be published and active per calendar month.
              </div>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl"
            >
              <option value="published">Published & Active</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors"
          >
            {challengeToEdit ? 'Save Challenge' : 'Create Monthly Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};

