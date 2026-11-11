import React, { useState } from 'react';
import {
  X,
  Send,
  Calendar,
  Clock,
  Smartphone,
  AlertTriangle,
  Users,
  Bell,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { NotificationCategory, NotificationAudience, NotificationStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { PHILIPPINE_PROVINCES } from '../../../data/mockData';

interface ComposeNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeNotificationModal: React.FC<ComposeNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { composeNotification, events } = useData();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('Announcements');
  const [audience, setAudience] = useState<NotificationAudience>('everyone');
  const [targetProvince, setTargetProvince] = useState('Metro Manila');
  const [targetEventId, setTargetEventId] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState<'ios' | 'android'>('ios');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real-time Quiet Hour Check for Manila Time (10 PM to 7 AM PHT)
  const checkQuietHours = (datetimeString?: string) => {
    const target = datetimeString ? new Date(datetimeString) : new Date();
    const utcHour = target.getUTCHours();
    const manilaHour = (utcHour + 8) % 24;
    return manilaHour >= 22 || manilaHour < 7;
  };

  const isCurrentScheduleQuietHour = isScheduled && scheduledAt
    ? checkQuietHours(scheduledAt)
    : !isScheduled
    ? checkQuietHours()
    : false;

  const handleSend = () => {
    if (!title.trim()) {
      setError('Notification title is required.');
      return;
    }
    if (!message.trim()) {
      setError('Notification message body is required.');
      return;
    }
    if (isScheduled && !scheduledAt) {
      setError('Please choose a schedule date and time.');
      return;
    }

    const selectedEvent = events.find((e) => e.id === targetEventId);

    const payload = {
      title: title.trim(),
      message: message.trim(),
      category,
      audience,
      targetProvince: audience === 'province' ? targetProvince : undefined,
      targetEventId: audience === 'event_rsvp' ? targetEventId : undefined,
      targetEventName: audience === 'event_rsvp' ? selectedEvent?.title : undefined,
      scheduledAt: isScheduled ? new Date(scheduledAt).toISOString() : undefined,
      status: (isScheduled ? 'scheduled' : 'sent') as NotificationStatus
    };

    composeNotification(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Compose Push Notification</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Broadcast mobile notifications via Apple APNs & Google FCM
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
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Columns (3 Cols) */}
          <div className="lg:col-span-3 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Notification Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Free Legal Aid Caravan Schedules for November"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 font-medium"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Message Body <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Short, actionable message (recommended under 140 characters)..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 leading-relaxed"
              />
              <div className="text-[11px] text-slate-400 text-right mt-0.5">
                {message.length} characters
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Notification Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Announcements', 'Events', 'Community', 'CHELlenges'] as NotificationCategory[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
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

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Audience Segmentation
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as NotificationAudience)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
              >
                <option value="everyone">Everyone (All 10,482 Registered Volunteers)</option>
                <option value="members_only">Members Only (Verified Profiles &gt;80%)</option>
                <option value="province">Specific Province / Region</option>
                <option value="event_rsvp">Users Who RSVP'd to a Specific Event</option>
              </select>
            </div>

            {/* Conditional Province Selection */}
            {audience === 'province' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Select Target Province
                </label>
                <select
                  value={targetProvince}
                  onChange={(e) => setTargetProvince(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                >
                  {PHILIPPINE_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Conditional Event Selection */}
            {audience === 'event_rsvp' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Select Target Event
                </label>
                <select
                  value={targetEventId}
                  onChange={(e) => setTargetEventId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                >
                  <option value="">Select an event...</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.rsvpCount} attendees)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Scheduling and Quiet Hours */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Schedule Broadcast</div>
                  <div className="text-[11px] text-slate-500">
                    Send now or schedule for optimal volunteer delivery time
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chel-600" />
                </label>
              </div>

              {isScheduled && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Scheduled Date & Time (PHT Manila)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              )}

              {/* Quiet Hours Policy Alert */}
              {isCurrentScheduleQuietHour && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Manila Quiet Hours Warning (10 PM – 7 AM PHT):</span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Target schedule falls within the mandated quiet hours. Delivery will be queued or silent on volunteer devices until 7:00 AM.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Device Mockup Lock Screen Preview (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-100 rounded-3xl border border-slate-200">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold text-slate-700">Lock Screen Preview</span>
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('ios')}
                  className={`px-2 py-0.5 rounded ${previewPlatform === 'ios' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  iOS
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('android')}
                  className={`px-2 py-0.5 rounded ${previewPlatform === 'android' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  Android
                </button>
              </div>
            </div>

            {/* Lock Screen Simulation Card */}
            <div className="w-full max-w-[260px] bg-slate-900/90 text-white rounded-[28px] p-3 shadow-xl border border-slate-700/60 font-sans">
              <div className="text-center text-[10px] text-slate-400 font-mono mb-2">9:41 AM</div>

              {/* Simulated Push Card */}
              <div className="p-3 bg-white/95 text-slate-900 rounded-2xl shadow-md border border-white/40 space-y-1 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-chel-700">
                    <div className="w-3.5 h-3.5 rounded bg-chel-600 text-white text-[8px] flex items-center justify-center">
                      CD
                    </div>
                    <span>DIOKNO VOLUNTEER</span>
                  </div>
                  <span>now</span>
                </div>

                <div className="text-xs font-bold text-slate-900 line-clamp-1">
                  {title || 'Announcement Title'}
                </div>

                <div className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {message || 'Your push notification preview will render here across iOS & Android lock screens.'}
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 text-center">
              Supports FCM & APNs high-priority delivery tokens.
            </div>
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
            onClick={handleSend}
            className="px-5 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isScheduled ? 'Schedule Broadcast' : 'Send Push Notification Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

