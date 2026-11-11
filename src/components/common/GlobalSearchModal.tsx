import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, Bell, Flag, Users, FileText, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string, itemId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const { users, events, announcements, challenges, communityReports } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search sets
  const filteredUsers = trimmed
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.email.toLowerCase().includes(trimmed) ||
          u.province.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredEvents = trimmed
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(trimmed) ||
          e.venue.toLowerCase().includes(trimmed) ||
          e.province.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredAnnouncements = trimmed
    ? announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          a.content.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const filteredChallenges = trimmed
    ? challenges.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.description.toLowerCase().includes(trimmed)
      ).slice(0, 2)
    : [];

  const filteredReports = trimmed
    ? communityReports.filter(
        (r) =>
          r.postSnippet.toLowerCase().includes(trimmed) ||
          r.postAuthorName.toLowerCase().includes(trimmed) ||
          r.reason.toLowerCase().includes(trimmed)
      ).slice(0, 2)
    : [];

  const totalResults =
    filteredUsers.length +
    filteredEvents.length +
    filteredAnnouncements.length +
    filteredChallenges.length +
    filteredReports.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search volunteers, events, announcements, challenges, reports..."
            className="w-full pl-3 pr-8 text-sm bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!trimmed && (
            <div className="py-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Type a name, keyword, province, or action to find records instantly.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Townhall', 'Cebu', 'Legal Aid', 'Voter', 'Moderator', 'Harassment'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-chel-50 hover:text-chel-700 text-slate-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trimmed && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">No records matching "{query}"</p>
            </div>
          )}

          {/* Users Results */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Volunteers & Staff ({filteredUsers.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onNavigate('users', u.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email} • {u.province}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Events ({filteredEvents.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredEvents.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onNavigate('events', e.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{e.title}</div>
                      <div className="text-xs text-slate-500">{e.venue} • {e.province}</div>
                    </div>
                    <span className="text-xs font-medium text-chel-700 flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Results */}
          {filteredAnnouncements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Bell className="w-3.5 h-3.5" />
                <span>Announcements ({filteredAnnouncements.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredAnnouncements.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onNavigate('announcements', a.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div className="max-w-md">
                      <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                      <div className="text-xs text-slate-500 truncate">{a.content}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-chel-50 text-chel-700 font-medium">
                      {a.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Results */}
          {filteredReports.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Flag className="w-3.5 h-3.5" />
                <span>Community Reports ({filteredReports.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onNavigate('community', r.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Report: {r.reason}</div>
                      <div className="text-xs text-slate-500 truncate max-w-sm">"{r.postSnippet}"</div>
                    </div>
                    <span className="text-xs text-rose-600 font-medium">Review</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Use Cmd+K / Ctrl+K anywhere to reopen</span>
          <span className="font-medium text-slate-600">Diokno Volunteer Platform v1.0</span>
        </div>
      </div>
    </div>
  );
};

