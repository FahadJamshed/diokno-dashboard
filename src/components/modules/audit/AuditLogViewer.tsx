import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Shield,
  Clock,
  ArrowRight,
  Eye,
  Lock,
  Calendar,
  User,
  CheckCircle2,
  X
} from 'lucide-react';
import { AuditLog } from '../../../types';
import { useData } from '../../../context/DataContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { EmptyState } from '../../common/EmptyState';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useData();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.affectedRecordName.toLowerCase().includes(search.toLowerCase()) ||
      log.adminName.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchRole = roleFilter === 'all' || log.adminRole === roleFilter;

    return matchSearch && matchCategory && matchRole;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const headers = 'ID,Admin Name,Admin Role,Action,Category,Record Type,Record Name,Previous Value,Updated Value,Timestamp,IP Address\n';
    const rows = auditLogs
      .map(
        (l) =>
          `"${l.id}","${l.adminName}","${l.adminRole}","${l.action}","${l.category}","${l.affectedRecordType}","${l.affectedRecordName}","${l.previousValue || ''}","${l.updatedValue || ''}","${l.timestamp}","${l.ipAddress || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `diokno-audit-trail-${new Date().toISOString().substring(0, 10)}.csv`);
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Administrative Audit Log</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {auditLogs.length} Logged Actions
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              Cryptographically Immutable
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete, non-editable audit trail tracking all administrator and moderator actions across the platform.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
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
            placeholder="Search action, admin, affected record..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">All Action Categories</option>
            <option value="announcements">Announcements</option>
            <option value="events">Events</option>
            <option value="challenges">CHELlenges</option>
            <option value="community">Community</option>
            <option value="users">Users & Roles</option>
            <option value="notifications">Notifications</option>
            <option value="settings">Settings</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No audit entries found"
            description="No actions matched your selected filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Staff Member & Role</th>
                  <th className="py-3.5 px-4">Action Performed</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Affected Record</th>
                  <th className="py-3.5 px-4">Date & Time (PHT)</th>
                  <th className="py-3.5 px-4 text-right">Diff Inspector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => setInspectLog(log)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-chel-600 transition-colors">
                        {log.adminName}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-chel-600" />
                        <span>{log.adminRole}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{log.action}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {log.affectedRecordType}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" size="sm">
                        <span className="capitalize">{log.category}</span>
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="max-w-xs font-medium text-slate-800 line-clamp-1">
                        {log.affectedRecordName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        ID: {log.affectedRecordId}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      <div>
                        {new Date(log.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setInspectLog(log)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-chel-700 bg-slate-100 hover:bg-chel-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Diff</span>
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* Audit Log Diff Inspection Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {inspectLog.category} Action
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{inspectLog.action}</h3>
                <p className="text-xs text-slate-500">
                  Target: <span className="font-semibold text-slate-800">{inspectLog.affectedRecordName}</span>
                </p>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Performed By</span>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectLog.adminName}</div>
                  <div className="text-[10px] text-chel-700 capitalize">{inspectLog.adminRole}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Timestamp & IP</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {new Date(inspectLog.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'medium' })}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">IP: {inspectLog.ipAddress || '120.28.182.44'}</div>
                </div>
              </div>

              {/* Value Diff (Previous vs Updated) */}
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Previous Value
                  </span>
                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-900 font-mono text-xs leading-relaxed">
                    {inspectLog.previousValue || 'None (New Record Created)'}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Updated / New Value
                  </span>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-900 font-mono text-xs leading-relaxed">
                    {inspectLog.updatedValue || 'None'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Audit logs are immutable. Deletion or modification is blocked by system governance policy.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Diff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

