import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Shield,
  Eye,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  MapPin
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Pagination } from '../../common/Pagination';
import { EmptyState } from '../../common/EmptyState';
import { UserDetailsModal } from './UserDetailsModal';
import { PHILIPPINE_PROVINCES } from '../../../data/mockData';

export const UsersList: React.FC = () => {
  const { users } = useData();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtered users
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.province.toLowerCase().includes(search.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(search.toLowerCase()));

    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchProvince = provinceFilter === 'all' || u.province === provinceFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;

    let matchCompletion = true;
    if (completionFilter === 'complete') {
      matchCompletion = u.profileCompletion >= 80;
    } else if (completionFilter === 'incomplete') {
      matchCompletion = u.profileCompletion < 80;
    }

    return matchSearch && matchRole && matchProvince && matchStatus && matchCompletion;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Phone,Role,Province,City,Organization,Profile Completion,Status,Registered At\n';
    const rows = users
      .map(
        (u) =>
          `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.province}","${u.city}","${u.organization || ''}","${u.profileCompletion}%","${u.status}","${u.registeredAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `diokno-volunteers-export-${new Date().toISOString().substring(0, 10)}.csv`);
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {users.length} Active Profiles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Directory of registered volunteers, moderator promotions, profile verification, and privacy compliance.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Volunteer CSV</span>
          </button>
        )}
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
            placeholder="Search name, email, province, campus..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
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
            <option value="volunteer">Volunteer</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Administrator</option>
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
            <option value="Pampanga">Pampanga</option>
            <option value="Batangas">Batangas</option>
            <option value="Pangasinan">Pangasinan</option>
            <option value="Davao del Sur">Davao del Sur</option>
            <option value="Albay">Albay</option>
          </select>

          {/* Profile Completion */}
          <select
            value={completionFilter}
            onChange={(e) => {
              setCompletionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-chel-200"
          >
            <option value="all">Profile Completion</option>
            <option value="complete">Complete (≥80%)</option>
            <option value="incomplete">Incomplete (&lt;80%)</option>
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
            <option value="active">Active</option>
            <option value="muted">Muted</option>
            <option value="deletion_requested">Deletion Requested</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No volunteers found"
            description="No user records matched your criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Volunteer Name & Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Profile Completion</th>
                  <th className="py-3.5 px-4">Province & City</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-chel-600 transition-colors">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.role === 'admin'
                            ? 'primary'
                            : u.role === 'moderator'
                            ? 'purple'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        <span className="uppercase">{u.role}</span>
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              u.profileCompletion >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${u.profileCompletion}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">{u.profileCompletion}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div>{u.province}</div>
                      <div className="text-[11px] text-slate-400">{u.city}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(u.registeredAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.status === 'active'
                            ? 'success'
                            : u.status === 'deletion_requested'
                            ? 'danger'
                            : 'warning'
                        }
                        dot
                        size="sm"
                      >
                        <span className="capitalize">{u.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-chel-700 bg-slate-100 hover:bg-chel-50 rounded-xl transition-colors"
                      >
                        View Profile
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

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
};

