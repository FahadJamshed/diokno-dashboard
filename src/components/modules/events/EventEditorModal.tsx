import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Link2, Users, AlertCircle, Shield } from 'lucide-react';
import { Event, EventType, EventStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { PHILIPPINE_PROVINCES } from '../../../data/mockData';

interface EventEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: Event | null;
}

export const EventEditorModal: React.FC<EventEditorModalProps> = ({
  isOpen,
  onClose,
  eventToEdit
}) => {
  const { createEvent, updateEvent } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('Townhall');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [province, setProvince] = useState('Metro Manila');
  const [mapsUrl, setMapsUrl] = useState('');
  const [onlineMeetingUrl, setOnlineMeetingUrl] = useState('');
  const [capacity, setCapacity] = useState(250);
  const [isMembersOnly, setIsMembersOnly] = useState(false);
  const [status, setStatus] = useState<EventStatus>('upcoming');
  const [bannerImage, setBannerImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setEventType(eventToEdit.eventType);
      setStartDateTime(eventToEdit.startDateTime ? eventToEdit.startDateTime.substring(0, 16) : '');
      setEndDateTime(eventToEdit.endDateTime ? eventToEdit.endDateTime.substring(0, 16) : '');
      setVenue(eventToEdit.venue);
      setProvince(eventToEdit.province);
      setMapsUrl(eventToEdit.mapsUrl || '');
      setOnlineMeetingUrl(eventToEdit.onlineMeetingUrl || '');
      setCapacity(eventToEdit.capacity);
      setIsMembersOnly(eventToEdit.isMembersOnly);
      setStatus(eventToEdit.status);
      setBannerImage(eventToEdit.bannerImage || '');
    } else {
      setTitle('');
      setDescription('');
      setEventType('Townhall');
      setStartDateTime('');
      setEndDateTime('');
      setVenue('');
      setProvince('Metro Manila');
      setMapsUrl('');
      setOnlineMeetingUrl('');
      setCapacity(300);
      setIsMembersOnly(false);
      setStatus('upcoming');
      setBannerImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80');
    }
    setError('');
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!venue.trim()) {
      setError('Venue address or location is required.');
      return;
    }
    if (!startDateTime || !endDateTime) {
      setError('Start and end date/time are required.');
      return;
    }
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setError('Event end date must be after start date.');
      return;
    }
    if (capacity <= 0) {
      setError('Capacity limit must be at least 1 person.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      eventType,
      startDateTime: new Date(startDateTime).toISOString(),
      endDateTime: new Date(endDateTime).toISOString(),
      venue: venue.trim(),
      province,
      mapsUrl: mapsUrl.trim() || undefined,
      onlineMeetingUrl: onlineMeetingUrl.trim() || undefined,
      capacity: Number(capacity),
      isMembersOnly,
      status,
      bannerImage: bannerImage.trim() || undefined
    };

    if (eventToEdit) {
      const res = updateEvent(eventToEdit.id, payload);
      if (!res.success) {
        setError(res.error || 'Failed to update event.');
        return;
      }
    } else {
      const res = createEvent(payload);
      if (!res.success) {
        setError(res.error || 'Failed to create event.');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {eventToEdit ? 'Edit Event Details' : 'Create New Volunteer Event'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure venue, attendance capacity, and live registration links
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

        <form onSubmit={handleSave} className="mt-5 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. People’s Legislative Townhall – UP Diliman Theater"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
              required
            />
          </div>

          {/* Type & Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Event Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
              >
                <option value="Townhall">Townhall</option>
                <option value="Legal Mission">Legal Mission</option>
                <option value="Volunteer Training">Volunteer Training</option>
                <option value="Community Outreach">Community Outreach</option>
                <option value="Youth Rally">Youth Rally</option>
                <option value="Webinar">Webinar (Virtual)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Province / Region <span className="text-rose-500">*</span>
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
              >
                {PHILIPPINE_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Start Date & Time (PHT) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                End Date & Time (PHT) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                required
              />
            </div>
          </div>

          {/* Venue & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Venue Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. University Theater, Osmeña Ave, Diliman"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Capacity Limit <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="50000"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                required
              />
            </div>
          </div>

          {/* Map link & Online Meeting Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Google / Apple Maps URL</span>
              </label>
              <input
                type="url"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Online Meeting Link (If Webinar)</span>
              </label>
              <input
                type="url"
                value={onlineMeetingUrl}
                onChange={(e) => setOnlineMeetingUrl(e.target.value)}
                placeholder="https://zoom.us/j/... or Google Meet"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Event Description & Agenda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the program, speakers, and requirements for attendees..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 leading-relaxed"
            />
          </div>

          {/* Members only toggle & Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Members-Only Event</div>
              <div className="text-[11px] text-slate-500">
                Restrict registration to verified volunteers with complete profiles
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMembersOnly}
                onChange={(e) => setIsMembersOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chel-600" />
            </label>
          </div>

          {/* Footer Actions */}
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
              {eventToEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

