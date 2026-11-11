import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  QrCode,
  Download,
  AlertTriangle,
  Search,
  UserPlus,
  Clock,
  ExternalLink,
  ShieldCheck,
  Camera
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
  const { eventAttendees, checkInAttendee, addEventAttendee, cancelEvent } = useData();
  const { isAdmin, isModerator } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'checked_in' | 'absent' | 'waitlist'>('all');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [manualQrInput, setManualQrInput] = useState('');
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // New Attendee Walk-in form state
  const [isAddAttendeeOpen, setIsAddAttendeeOpen] = useState(false);
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [newAttendeePhone, setNewAttendeePhone] = useState('+63 9');
  const [newAttendeeProvince, setNewAttendeeProvince] = useState(event?.province || 'Metro Manila');

  if (!isOpen || !event) return null;

  const attendees = eventAttendees.filter((a) => a.eventId === event.id);
  const checkedInAttendees = attendees.filter((a) => a.checkedIn);
  const absentAttendees = attendees.filter((a) => !a.checkedIn && !a.waitlisted);
  const waitlistedAttendees = attendees.filter((a) => a.waitlisted);

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch =
      a.userName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.qrCodeId.toLowerCase().includes(attendeeSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'checked_in') return a.checkedIn;
    if (activeTab === 'absent') return !a.checkedIn && !a.waitlisted;
    if (activeTab === 'waitlist') return a.waitlisted;
    return true;
  });

  const rsvpPercentage = Math.min(100, Math.round((event.rsvpCount / event.capacity) * 100));
  const attendancePercentage =
    event.rsvpCount > 0 ? Math.round((checkedInAttendees.length / event.rsvpCount) * 100) : 0;

  // Manual QR or Search Check-in
  const handleQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQrInput.trim()) return;

    const query = manualQrInput.trim().toLowerCase();
    const found = attendees.find(
      (a) => a.qrCodeId.toLowerCase() === query || a.userEmail.toLowerCase() === query
    );

    if (found) {
      checkInAttendee(found.id);
      setManualQrInput('');
    } else {
      alert(`No attendee found with QR Code or Email "${manualQrInput}". Check input.`);
    }
  };

  const handleSimulateScanCamera = () => {
    setIsQrScannerActive(true);
    setTimeout(() => {
      // Pick first unchecked-in attendee or alert
      const unchecked = attendees.find((a) => !a.checkedIn);
      if (unchecked) {
        checkInAttendee(unchecked.id);
      }
      setIsQrScannerActive(false);
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Phone,Province,RSVP Date,Status,QR Code\n';
    const rows = attendees
      .map(
        (a) =>
          `"${a.id}","${a.userName}","${a.userEmail}","${a.userPhone}","${a.userProvince}","${a.rsvpDate}","${
            a.checkedIn ? 'Checked In' : a.waitlisted ? 'Waitlist' : 'Registered'
          }","${a.qrCodeId}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendees-${event.title.replace(/\s+/g, '-').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
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
            <div className="flex items-center gap-2 mb-1">
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
              {event.isMembersOnly && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Members Only
                </span>
              )}
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
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
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
              Cancellation Reason: <span className="font-medium">{event.cancellationReason}</span>
            </p>
          </div>
        )}

        {/* Capacity & Attendance Analytics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              RSVP vs Capacity
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {event.rsvpCount} <span className="text-xs font-normal text-slate-500">/ {event.capacity} max</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${rsvpPercentage >= 100 ? 'bg-amber-500' : 'bg-chel-600'}`}
                style={{ width: `${rsvpPercentage}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{rsvpPercentage}% capacity filled</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Actual Attendance
            </div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1">
              {checkedInAttendees.length}{' '}
              <span className="text-xs font-normal text-slate-500">checked in</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {attendancePercentage}% attendance check-in rate
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Waitlist & Walk-ins
            </div>
            <div className="text-xl font-extrabold text-purple-600 mt-1">
              {waitlistedAttendees.length}{' '}
              <span className="text-xs font-normal text-slate-500">on waitlist</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Auto-advances when an attendee cancels their reservation.
            </div>
          </div>
        </div>

        {/* QR Code On-Site Check-in Tool (Crucial for Moderator & Admin!) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-chel-50 to-sky-50 border border-chel-200/80 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-chel-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  On-Site QR & Pass Check-in Scanner
                </h4>
                <p className="text-[11px] text-slate-600">
                  Scan volunteer mobile app QR pass or type pass ID to verify attendance instantly.
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateScanCamera}
              disabled={isQrScannerActive}
              className="px-3 py-1.5 bg-chel-600 hover:bg-chel-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isQrScannerActive ? 'Scanning Camera...' : 'Simulate Camera Scan'}</span>
            </button>
          </div>

          <form onSubmit={handleQuickCheckIn} className="flex gap-2">
            <input
              type="text"
              value={manualQrInput}
              onChange={(e) => setManualQrInput(e.target.value)}
              placeholder="e.g. QR-EVT1-USR4-7890 or volunteer email..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-chel-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-chel-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Verify Pass
            </button>
          </form>
        </div>

        {/* Attendees Table Section */}
        <div className="space-y-3">
          {/* Sub Header & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                All RSVPs ({attendees.length})
              </button>
              <button
                onClick={() => setActiveTab('checked_in')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'checked_in' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Checked In ({checkedInAttendees.length})
              </button>
              <button
                onClick={() => setActiveTab('absent')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'absent' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Absent ({absentAttendees.length})
              </button>
              {waitlistedAttendees.length > 0 && (
                <button
                  onClick={() => setActiveTab('waitlist')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'waitlist' ? 'bg-white text-purple-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Waitlist ({waitlistedAttendees.length})
                </button>
              )}
            </div>

            {/* Actions: Search, Add Walk-in, Export CSV */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  placeholder="Search attendee..."
                  className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                onClick={() => setIsAddAttendeeOpen(!isAddAttendeeOpen)}
                className="p-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition-colors"
                title="Add Walk-in Attendee"
              >
                <UserPlus className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-xs font-semibold text-chel-700 bg-chel-50 hover:bg-chel-100 border border-chel-200 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Walk-in Add Form Drawer */}
          {isAddAttendeeOpen && (
            <form onSubmit={handleCreateWalkIn} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Add Walk-in Volunteer RSVP</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newAttendeeName}
                  onChange={(e) => setNewAttendeeName(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={newAttendeeEmail}
                  onChange={(e) => setNewAttendeeEmail(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={newAttendeePhone}
                  onChange={(e) => setNewAttendeePhone(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-chel-600 hover:bg-chel-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm RSVP
                </button>
              </div>
            </form>
          )}

          {/* Attendees List Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
            {filteredAttendees.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No attendees found in this filter category.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">Volunteer</th>
                    <th className="py-2.5 px-3">Province</th>
                    <th className="py-2.5 px-3">Pass QR Code</th>
                    <th className="py-2.5 px-3">Check-in Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendees.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{att.userName}</div>
                        <div className="text-[11px] text-slate-500">{att.userEmail}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{att.userProvince}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {att.qrCodeId}
                      </td>
                      <td className="py-2.5 px-3">
                        {att.checkedIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Checked In
                          </span>
                        ) : att.waitlisted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            Waitlist
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Pending Arrival
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => checkInAttendee(att.id)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                            att.checkedIn
                              ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                        >
                          {att.checkedIn ? 'Revert Check-in' : 'Mark Checked In'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100">
          <div>
            {isAdmin && event.status !== 'cancelled' && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cancel Event</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin && onOpenEdit && (
              <button
                type="button"
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
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Event Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={(reason) => {
          if (reason) {
            cancelEvent(event.id, reason);
            setCancelModalOpen(false);
          }
        }}
        title="Cancel Volunteer Event"
        message="Are you sure you want to cancel this event? A mandatory cancellation reason is required and will be dispatched as an automated notification to all registered attendees."
        confirmLabel="Cancel Event & Notify Attendees"
        variant="danger"
        requireReason={true}
        reasonPlaceholder="e.g. Typhoon warning Signal #2, venue scheduling conflict, or health emergency..."
      />
    </div>
  );
};

