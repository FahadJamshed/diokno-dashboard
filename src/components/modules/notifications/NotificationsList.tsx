import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart3,
  Moon,
  X
} from 'lucide-react';
import { NotificationItem, NotificationCategory, NotificationStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { EmptyState } from '../../common/EmptyState';
import { RoleGuard } from '../../common/RoleGuard';
import { ComposeNotificationModal } from './ComposeNotificationModal';

export const NotificationsList: React.FC = () => {
  const { notifications } = useData();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [inspectNotif, setInspectNotif] = useState<NotificationItem | null>(null);

  // If accessed by moderator, show RoleGuard
  if (!isAdmin) {
    return (
      <RoleGuard
        fallbackTitle="Notifications Publishing Restricted"
        fallbackMessage="Global push broadcast dispatching through FCM and APNs is restricted to System Administrators. Moderators cannot publish global push notifications."
      >
        <div />
      </RoleGuard>
    );
  }

  const filtered = notifications.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === 'all' || n.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || n.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Push Notifications</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {notifications.length} Broadcasts
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Moon className="w-3 h-3" />
              Quiet Hours (10PM–7AM PHT) Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch real-time push updates to volunteers across Apple Push Notification (APNs) and Firebase Cloud Messaging (FCM).
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-chel-600 hover:bg-chel-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Push Notification</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search notification title or body..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">All Categories</option>
            <option value="Announcements">Announcements</option>
            <option value="Events">Events</option>
            <option value="Community">Community</option>
            <option value="CHELlenges">CHELlenges</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No push notifications found"
            description="No broadcasts matched your search criteria."
            actionLabel="Compose Notification"
            onAction={() => setIsComposeOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Title & Message</th>
                  <th className="py-3.5 px-4">Target Audience</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Scheduled / Sent Date</th>
                  <th className="py-3.5 px-4">Delivery Status</th>
                  <th className="py-3.5 px-4">Stats (Sent / Opened)</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((notif) => {
                  const openRate =
                    notif.stats && notif.stats.sent > 0
                      ? Math.round((notif.stats.opened / notif.stats.sent) * 100)
                      : 0;

                  return (
                    <tr
                      key={notif.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => setInspectNotif(notif)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="max-w-xs sm:max-w-sm">
                          <div className="font-bold text-slate-900 group-hover:text-chel-600 transition-colors line-clamp-1">
                            {notif.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {notif.message}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 capitalize">
                        {notif.audience === 'everyone' ? (
                          <span className="text-chel-700 font-bold">Everyone (All)</span>
                        ) : notif.audience === 'province' ? (
                          <span>Province: {notif.targetProvince}</span>
                        ) : notif.audience === 'event_rsvp' ? (
                          <span className="line-clamp-1">Event: {notif.targetEventName}</span>
                        ) : (
                          <span>Members Only</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" size="sm">
                          {notif.category}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {notif.sentAt ? (
                          <span>{new Date(notif.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        ) : notif.scheduledAt ? (
                          <span className="text-amber-700 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {new Date(notif.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          <span className="italic text-slate-400">Draft</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            notif.status === 'sent'
                              ? 'success'
                              : notif.status === 'scheduled'
                              ? 'warning'
                              : notif.status === 'draft'
                              ? 'secondary'
                              : 'danger'
                          }
                          dot
                          size="sm"
                        >
                          <span className="capitalize">{notif.status}</span>
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        {notif.stats && notif.status === 'sent' ? (
                          <div>
                            <div className="font-bold text-slate-800">
                              {notif.stats.sent.toLocaleString()} delivered
                            </div>
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              {openRate}% opened ({notif.stats.opened.toLocaleString()})
                            </div>
                          </div>
                        ) : notif.status === 'scheduled' ? (
                          <span className="text-slate-400 italic">Queued for delivery</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setInspectNotif(notif)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-chel-700 bg-slate-100 hover:bg-chel-50 rounded-lg transition-colors"
                        >
                          Inspect
                        </button>
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

      {/* Compose Notification Modal */}
      <ComposeNotificationModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />

      {/* Inspect Notification Detail Modal */}
      {inspectNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-chel-50 text-chel-700 uppercase">
                  {inspectNotif.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{inspectNotif.title}</h3>
              </div>
              <button
                onClick={() => setInspectNotif(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-mono">
                "{inspectNotif.message}"
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Audience</span>
                  <div className="font-bold text-slate-800 capitalize mt-0.5">{inspectNotif.audience}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                  <div className="font-bold text-slate-800 capitalize mt-0.5">{inspectNotif.status}</div>
                </div>
              </div>

              {inspectNotif.stats && (
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-950">Delivery Metrics (APNs & FCM)</span>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{inspectNotif.stats.sent.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Sent</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-emerald-700">{inspectNotif.stats.opened.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Opened</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-rose-700">{inspectNotif.stats.failed.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Failed / Unreachable</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectNotif(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
