import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  X
} from 'lucide-react';
import { DeclinedTopic } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { ConfirmationModal } from '../../common/ConfirmationModal';

export const DeclinedTopicsView: React.FC = () => {
  const { declinedTopics, addDeclinedTopic, updateDeclinedTopic, removeDeclinedTopic, toggleDeclinedTopicStatus } = useData();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<DeclinedTopic | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<DeclinedTopic | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<DeclinedTopic['category']>('legal_advice');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSamplePrompt, setFormSamplePrompt] = useState('');
  const [formDeclineResponse, setFormDeclineResponse] = useState('');

  const filteredTopics = declinedTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.samplePrompt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || topic.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingTopic(null);
    setFormCategory('legal_advice');
    setFormTitle('');
    setFormDescription('');
    setFormSamplePrompt('');
    setFormDeclineResponse('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (topic: DeclinedTopic) => {
    setEditingTopic(topic);
    setFormCategory(topic.category);
    setFormTitle(topic.title);
    setFormDescription(topic.description);
    setFormSamplePrompt(topic.samplePrompt);
    setFormDeclineResponse(topic.declineResponse);
    setIsEditorOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDeclineResponse.trim()) return;

    if (editingTopic) {
      updateDeclinedTopic(editingTopic.id, {
        category: formCategory,
        title: formTitle.trim(),
        description: formDescription.trim(),
        samplePrompt: formSamplePrompt.trim(),
        declineResponse: formDeclineResponse.trim()
      });
    } else {
      addDeclinedTopic({
        category: formCategory,
        title: formTitle.trim(),
        description: formDescription.trim(),
        samplePrompt: formSamplePrompt.trim(),
        declineResponse: formDeclineResponse.trim(),
        status: 'active'
      });
    }

    setIsEditorOpen(false);
  };

  const categoryLabels: Record<DeclinedTopic['category'], { label: string; variant: 'danger' | 'warning' | 'primary' | 'purple' | 'info' | 'secondary' }> = {
    legal_advice: { label: 'Legal Advice', variant: 'danger' },
    pending_cases: { label: 'Pending Cases', variant: 'warning' },
    endorsements: { label: 'Endorsements', variant: 'purple' },
    election_predictions: { label: 'Election Predictions', variant: 'info' },
    private_individuals: { label: 'Private Individuals', variant: 'danger' },
    personal_data: { label: 'Personal Data', variant: 'danger' },
    abusive_prompts: { label: 'Abusive Prompts', variant: 'danger' },
    jailbreak_attempts: { label: 'Jailbreak Attempts', variant: 'warning' }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Declined Topics & AI Safety Guardrails</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              8 Mandatory Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official policy guardrails that intercept prohibited inquiries and return standardized civic refusal statements.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guardrail Topic</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search guardrail topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium text-slate-700"
            >
              <option value="all">All 8 Guardrail Categories</option>
              <option value="legal_advice">Legal Advice</option>
              <option value="pending_cases">Pending Cases</option>
              <option value="endorsements">Endorsements</option>
              <option value="election_predictions">Election Predictions</option>
              <option value="private_individuals">Private Individuals</option>
              <option value="personal_data">Personal Data</option>
              <option value="abusive_prompts">Abusive Prompts</option>
              <option value="jailbreak_attempts">Jailbreak Attempts</option>
            </select>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            {filteredTopics.length} of {declinedTopics.length} Guardrails Active
          </div>
        </div>

        {/* Guardrails Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredTopics.map((topic) => {
            const cat = categoryLabels[topic.category] || { label: topic.category, variant: 'secondary' };

            return (
              <div
                key={topic.id}
                className={`p-5 rounded-2xl border transition-all ${
                  topic.status === 'active'
                    ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={cat.variant} size="sm">
                      {cat.label}
                    </Badge>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        topic.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {topic.status}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleDeclinedTopicStatus(topic.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title={topic.status === 'active' ? 'Deactivate Guardrail' : 'Activate Guardrail'}
                      >
                        {topic.status === 'active' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(topic)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit Guardrail"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setTopicToDelete(topic)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Guardrail"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{topic.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{topic.description}</p>

                {/* Sample Trigger Prompt */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">
                    Trigger Example:
                  </span>
                  <p className="text-slate-700 italic">"{topic.samplePrompt}"</p>
                </div>

                {/* Standard Decline Statement */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-chel-50/40 border border-chel-100 text-[11px]">
                  <span className="font-bold text-chel-900 uppercase tracking-wider block text-[10px] mb-0.5">
                    Standard System Decline Response:
                  </span>
                  <p className="text-slate-800 leading-relaxed">{topic.declineResponse}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTopic ? 'Edit Safety Guardrail Topic' : 'Add New Declined Topic Guardrail'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Safety Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 font-medium"
                >
                  <option value="legal_advice">Legal Advice (Private Representation / Retainer)</option>
                  <option value="pending_cases">Pending Cases (Sub-Judice Commentary)</option>
                  <option value="endorsements">Endorsements (Commercial / Partisan)</option>
                  <option value="election_predictions">Election Predictions (Speculative Forecasting)</option>
                  <option value="private_individuals">Private Individuals (Non-Public Allegations)</option>
                  <option value="personal_data">Personal Data (Private Contact Info)</option>
                  <option value="abusive_prompts">Abusive Prompts (Profanity & Hate Speech)</option>
                  <option value="jailbreak_attempts">Jailbreak Attempts (Prompt Injection)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Topic Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiries on Pending Sandiganbayan Trials"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Policy Description</label>
                <textarea
                  rows={2}
                  placeholder="Explanation of why this topic is declined under official ethics rules..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sample Trigger Prompt</label>
                <input
                  type="text"
                  placeholder="e.g. Sino sa tingin ni Chel ang may sala sa kaso ni Mayor X?"
                  value={formSamplePrompt}
                  onChange={(e) => setFormSamplePrompt(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Standard Decline Response <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="The verbatim polite refusal message returned to the citizen..."
                  value={formDeclineResponse}
                  onChange={(e) => setFormDeclineResponse(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chel-600 hover:bg-chel-700 text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  {editingTopic ? 'Save Changes' : 'Create Guardrail'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!topicToDelete}
        onClose={() => setTopicToDelete(null)}
        onConfirm={() => {
          if (topicToDelete) {
            removeDeclinedTopic(topicToDelete.id);
            setTopicToDelete(null);
          }
        }}
        title="Remove Safety Guardrail?"
        message={`Are you sure you want to remove the guardrail for "${topicToDelete?.title}"? Inquiries matching this topic will no longer be intercepted.`}
        confirmLabel="Yes, Remove Guardrail"
        variant="danger"
      />
    </div>
  );
};
