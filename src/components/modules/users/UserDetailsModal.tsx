import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  Calendar,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Clock,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { User, UserRole } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { ConfirmationModal } from '../../common/ConfirmationModal';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const {
    updateUserRole,
    approveModeratorApplication,
    rejectModeratorApplication,
    processAccountDeletion,
    liftSanction
  } = useData();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'sanctions'>('profile');
  const [selectedRole, setSelectedRole] = useState<UserRole>('volunteer');
  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!isOpen || !user) return null;

  const handleRoleChangeConfirm = () => {
    updateUserRole(user.id, selectedRole);
    setRoleChangeModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    processAccountDeletion(user.id);
    setDeleteConfirmOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header Profile Summary */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-chel-500/30 shrink-0 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <Badge
                  variant={
                    user.role === 'admin'
                      ? 'primary'
                      : user.role === 'moderator'
                      ? 'purple'
                      : 'secondary'
                  }
                  size="sm"
                >
                  <span className="uppercase">{user.role}</span>
                </Badge>
              </div>

              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user.city ? `${user.city}, ` : ''}{user.province}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deletion Request Alert */}
        {user.status === 'deletion_requested' && (
          <div className="my-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-rose-950">
                  Account Deletion Requested (Data Privacy Act)
                </div>
                <div className="text-[11px] text-rose-800">
                  Requested on {user.deletionRequestedAt ? new Date(user.deletionRequestedAt).toLocaleDateString() : 'Recently'}
                </div>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0"
              >
                Process & Purge Data
              </button>
            )}
          </div>
        )}

        {/* Moderator Application Alert */}
        {user.moderatorApplicationStatus === 'pending' && isAdmin && (
          <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-950">
                  Moderator Application Pending Approval
                </div>
                <div className="text-[11px] text-amber-800">
                  Volunteer leader applied to become regional community moderator.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => rejectModeratorApplication(user.id)}
                className="px-3 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl"
              >
                Decline
              </button>
              <button
                onClick={() => approveModeratorApplication(user.id)}
                className="px-3.5 py-1 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-2xs"
              >
                Approve Moderator
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 my-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-chel-600 text-chel-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Volunteer Profile
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'badges'
                ? 'border-chel-600 text-chel-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Earned Badges ({user.badgesEarned.length})
          </button>
          <button
            onClick={() => setActiveTab('sanctions')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'sanctions'
                ? 'border-chel-600 text-chel-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Moderation History ({user.sanctions.length})
          </button>
        </div>

        {/* TAB 1: PROFILE DETAILS */}
        {activeTab === 'profile' && (
          <div className="space-y-4 text-xs">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Profile Status</span>
                <div className="text-base font-extrabold text-chel-700 mt-0.5">
                  {user.profileCompletion}% Complete
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Events Attended</span>
                <div className="text-base font-extrabold text-purple-700 mt-0.5">
                  {user.eventAttendanceCount} Events
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Community Posts</span>
                <div className="text-base font-extrabold text-indigo-700 mt-0.5">
                  {user.communityPostCount} Posts
                </div>
              </div>
            </div>

            {/* Demographic Info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Mobile Number</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <span>{user.phone}</span>
                    {user.isPhoneVerified ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.2 rounded">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Organization / Campus</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {user.organization || 'Independent Volunteer'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500">Advocacy Interests</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {user.interests.length > 0 ? (
                    user.interests.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific interests listed</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-400 flex justify-between">
                <span>Registered: {new Date(user.registeredAt).toLocaleDateString([], { dateStyle: 'long' })}</span>
                <span>User ID: {user.id}</span>
              </div>
            </div>

            {/* Role Change Control (Admin Only) */}
            {isAdmin && (
              <div className="p-4 bg-chel-50/50 rounded-2xl border border-chel-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Change Administrative Role</div>
                  <div className="text-[11px] text-slate-500">
                    Takes effect immediately across all system API endpoints.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-chel-300 rounded-xl"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <button
                    onClick={() => setRoleChangeModalOpen(true)}
                    disabled={selectedRole === user.role}
                    className="px-3 py-1.5 bg-chel-600 hover:bg-chel-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
                  >
                    Update Role
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EARNED BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-3">
            {user.badgesEarned.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No CHELlenge badges earned yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {user.badgesEarned.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{badge}</div>
                      <div className="text-[10px] text-amber-800">Confirmed Badge</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SANCTIONS HISTORY */}
        {activeTab === 'sanctions' && (
          <div className="space-y-3">
            {user.sanctions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Clean record. No moderation warnings or sanctions on file.
              </div>
            ) : (
              user.sanctions.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 uppercase tracking-wide">
                      {s.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {new Date(s.imposedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 italic">"{s.reason}"</p>
                  <div className="flex items-center justify-between pt-1 border-t border-rose-200/60 text-[10px] text-slate-500">
                    <span>Imposed by: {s.imposedBy}</span>
                    {s.active && (
                      <button
                        onClick={() => liftSanction(user.id)}
                        className="font-bold text-chel-700 hover:underline"
                      >
                        Lift Active Sanction
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-5 mt-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>

      {/* Role Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={roleChangeModalOpen}
        onClose={() => setRoleChangeModalOpen(false)}
        onConfirm={handleRoleChangeConfirm}
        title="Confirm Role Change"
        message={`Are you sure you want to change ${user.name}'s role from ${user.role.toUpperCase()} to ${selectedRole.toUpperCase()}? This immediately modifies their system dashboard and mobile access privileges.`}
        confirmLabel="Change Role"
        variant="primary"
      />

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Permanently Purge Volunteer Account"
        message={`Confirm permanent deletion of ${user.name}'s account data. All contact details, RSVPs, and submissions will be purged in compliance with the Philippine Data Privacy Act of 2012.`}
        confirmLabel="Purge Account Permanently"
        variant="danger"
      />
    </div>
  );
};

