import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Search,
  UserPlus,
  Clock,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Video
} from 'lucide-react';
import { Event, EventAttendee } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { ConfirmationModal } from '../../common/ConfirmationModal';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onOpenEdit?: (event: Event) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  onOpenEdit
}) => {
  const { eventAttendees, addEventAttendee, cancelRSVP, cancelEvent } = useData();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'going' | 'cancelled'>('all');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // New Attendee RSVP form state
  const [isAddAttendeeOpen, setIsAddAttendeeOpen] = useState(false);
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [newAttendeePhone, setNewAttendeePhone] = useState('+63 9');
  const [newAttendeeProvince, setNewAttendeeProvince] = useState(event?.province || 'Metro Manila');

  if (!isOpen || !event) return null;

  const attendees = eventAttendees.filter((a) => a.eventId === event.id);
  const goingAttendees = attendees.filter((a) => (a.status || 'going') === 'going');
  const cancelledAttendees = attendees.filter((a) => a.status === 'cancelled');

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch =
      a.userName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.userProvince.toLowerCase().includes(attendeeSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'going') return (a.status || 'going') === 'going';
    if (activeTab === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  const handleCreateRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendeeName || !newAttendeeEmail) return;

    addEventAttendee(
      event.id,
      newAttendeeName,
      newAttendeeEmail,
      newAttendeePhone,
      newAttendeeProvince
    );

    setNewAttendeeName('');
    setNewAttendeeEmail('');
    setNewAttendeePhone('+63 9');
    setIsAddAttendeeOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge
                variant={
                  event.status === 'upcoming'
                    ? 'info'
                    : event.status === 'in_progress'
                    ? 'warning'
                    : event.status === 'completed'
                    ? 'success'
                    : 'danger'
                }
                dot
              >
                <span className="capitalize">{event.status.replace('_', ' ')}</span>
              </Badge>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {event.eventType}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-chel-600" />
                {new Date(event.startDateTime).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
                {' - '}
                {new Date(event.endDateTime).toLocaleTimeString([], {
                  timeStyle: 'short'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-chel-600" />
                {event.venue}, {event.province}
              </span>
              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-chel-600 hover:underline flex items-center gap-1"
                >
                  <span>Map Location</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {event.onlineMeetingUrl && (
                <a
                  href={event.onlineMeetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Online Meeting Link</span>
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cancellation Notice if cancelled */}
        {event.status === 'cancelled' && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-sm mb-1 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
              <span>Event Cancelled</span>
            </div>
            <p>
              Cancellation Reason: <span className="font-medium">{event.cancellationReason || 'No reason specified'}</span>
            </p>
          </div>
        )}

        {/* Description */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Event Description & Briefing
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        {/* Phase 1 RSVP Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-chel-50/60 border border-chel-100">
            <div className="text-[11px] font-bold text-chel-700 uppercase tracking-wider">
              Total RSVPs (Going)
            </div>
            <div className="text-2xl font-black text-chel-900 mt-1">
              {goingAttendees.length}
            </div>
            <div className="text-[11px] text-chel-600 mt-0.5">
              Confirmed registered participants
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Cancelled Reservations
            </div>
            <div className="text-2xl font-black text-slate-700 mt-1">
              {cancelledAttendees.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Withdrawn or cancelled RSVPs
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Regional Jurisdiction
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {event.province}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Open to all registered volunteers
            </div>
          </div>
        </div>

        {/* RSVP Management Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All RSVPs ({attendees.length})
            </button>
            <button
              onClick={() => setActiveTab('going')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'going'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Going ({goingAttendees.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'cancelled'
                  ? 'bg-white text-rose-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancelled ({cancelledAttendees.length})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search volunteer by name/email..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
            </div>

            <button
              onClick={() => setIsAddAttendeeOpen(!isAddAttendeeOpen)}
              className="flex items-center gap-1 px-3 py-1.5 bg-chel-600 hover:bg-chel-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add RSVP</span>
            </button>
          </div>
        </div>

        {/* Add Attendee Manual Form */}
        {isAddAttendeeOpen && (
          <form
            onSubmit={handleCreateRSVP}
            className="p-4 my-4 rounded-2xl bg-slate-50 border border-slate-200 animate-slide-up space-y-3"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-800">Register Member RSVP</h5>
              <button
                type="button"
                onClick={() => setIsAddAttendeeOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={newAttendeeEmail}
                onChange={(e) => setNewAttendeeEmail(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={newAttendeePhone}
                onChange={(e) => setNewAttendeePhone(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Confirm RSVP
              </button>
            </div>
          </form>
        )}

        {/* Attendees Table */}
        <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Member Name</th>
                <th className="py-2.5 px-4">Contact Info</th>
                <th className="py-2.5 px-4">Province</th>
                <th className="py-2.5 px-4">RSVP Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No RSVP records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((attendee) => {
                  const isGoing = (attendee.status || 'going') === 'going';

                  return (
                    <tr key={attendee.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {attendee.userName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{attendee.userEmail}</div>
                        <div className="text-[10px] text-slate-400">{attendee.userPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {attendee.userProvince}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(attendee.rsvpDate).toLocaleDateString([], {
                          dateStyle: 'medium'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        {isGoing ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Going
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isGoing && (
                          <button
                            onClick={() => cancelRSVP(attendee.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Mark RSVP as Cancelled"
                          >
                            Mark Cancelled
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {isAdmin && event.status !== 'cancelled' && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
              >
                Cancel Event
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onOpenEdit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEdit(event);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Edit Event
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-chel-600 hover:bg-chel-700 rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

        {/* Cancel Event Confirmation Dialog */}
        <ConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={() => {
            cancelEvent(event.id, 'Administrative cancellation per volunteer scheduling changes.');
            setCancelModalOpen(false);
          }}
          title="Cancel This Event?"
          message={`Are you sure you want to cancel "${event.title}"? Registered participants will receive a push notification explaining the cancellation.`}
          confirmLabel="Yes, Cancel Event"
          variant="danger"
        />
      </div>
    </div>
  );
};
