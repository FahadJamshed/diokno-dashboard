import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Eye,
  Edit,
  Download,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Video
} from 'lucide-react';
import { Event, EventType, EventStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { EmptyState } from '../../common/EmptyState';
import { EventEditorModal } from './EventEditorModal';
import { EventDetailsModal } from './EventDetailsModal';
import { PHILIPPINE_PROVINCES } from '../../../data/mockData';

export const EventsList: React.FC = () => {
  const { events, cancelEvent } = useData();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<Event | null>(null);

  // Filters
  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.province.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'all' || e.eventType === typeFilter;
    const matchProvince = provinceFilter === 'all' || e.province === provinceFilter;
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;

    return matchSearch && matchType && matchProvince && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (evt: Event) => {
    setEditingEvent(evt);
    setIsEditorOpen(true);
  };

  const handleExportAllEventsCSV = () => {
    const headers = 'ID,Title,Type,Start Date,End Date,Venue,Province,Capacity,RSVP Count,Attendance,Status\n';
    const rows = events
      .map(
        (e) =>
          `"${e.id}","${e.title}","${e.eventType}","${e.startDateTime}","${e.endDateTime}","${e.venue}","${e.province}","${e.capacity}","${e.rsvpCount}","${e.attendanceCount}","${e.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `diokno-events-directory-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Events Management</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {events.length} Events Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate townhalls, free legal missions, youth rallies, and manage check-ins nationwide.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportAllEventsCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Export CSV Directory"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-chel-600 hover:bg-chel-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center gap-3 justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search event, venue, city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">All Event Types</option>
            <option value="Townhall">Townhall</option>
            <option value="Legal Mission">Legal Mission</option>
            <option value="Volunteer Training">Volunteer Training</option>
            <option value="Community Outreach">Community Outreach</option>
            <option value="Youth Rally">Youth Rally</option>
            <option value="Webinar">Webinar</option>
          </select>

          {/* Province Filter */}
          <select
            value={provinceFilter}
            onChange={(e) => {
              setProvinceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200 max-w-[150px]"
          >
            <option value="all">All Provinces</option>
            <option value="Metro Manila">Metro Manila</option>
            <option value="Cebu">Cebu</option>
            <option value="Iloilo">Iloilo</option>
            <option value="Batangas">Batangas</option>
            <option value="Pampanga">Pampanga</option>
            <option value="Davao del Sur">Davao del Sur</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="No events match your selected filters. Try broadening your criteria."
            actionLabel={isAdmin ? 'Create New Event' : undefined}
            onAction={isAdmin ? handleOpenCreate : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Event & Type</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue & Province</th>
                  <th className="py-3.5 px-4">Capacity / RSVPs</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginated.map((evt) => {
                  const fillRate = Math.round((evt.rsvpCount / evt.capacity) * 100);

                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => setDetailsEvent(evt)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="max-w-xs sm:max-w-sm">
                          <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-chel-600 transition-colors">
                            {evt.title}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {evt.eventType}
                            </span>
                            {evt.isMembersOnly && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700">
                                Members
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div>
                          {new Date(evt.startDateTime).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(evt.startDateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="line-clamp-1 font-medium">{evt.venue}</div>
                        <div className="text-[11px] text-slate-400">{evt.province}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                fillRate >= 100 ? 'bg-amber-500' : 'bg-chel-600'
                              }`}
                              style={{ width: `${Math.min(100, fillRate)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800">
                            {evt.rsvpCount} / {evt.capacity}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{fillRate}% filled</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {evt.status === 'completed' || evt.attendanceCount > 0 ? (
                          <div>
                            <span className="font-bold text-emerald-700">{evt.attendanceCount}</span>
                            <span className="text-[11px] text-slate-400"> checked in</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not started</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            evt.status === 'upcoming'
                              ? 'info'
                              : evt.status === 'in_progress'
                              ? 'warning'
                              : evt.status === 'completed'
                              ? 'success'
                              : 'danger'
                          }
                          dot
                          size="sm"
                        >
                          <span className="capitalize">{evt.status.replace('_', ' ')}</span>
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailsEvent(evt)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-chel-600 hover:bg-chel-50 transition-colors"
                            title="View RSVPs & Check-in Tools"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => handleOpenEdit(evt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit Event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Event Details & Attendees Modal */}
      <EventDetailsModal
        isOpen={!!detailsEvent}
        onClose={() => setDetailsEvent(null)}
        event={detailsEvent}
        onOpenEdit={(evt) => handleOpenEdit(evt)}
      />

      {/* Event Create / Edit Modal */}
      <EventEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        eventToEdit={editingEvent}
      />
    </div>
  );
};

