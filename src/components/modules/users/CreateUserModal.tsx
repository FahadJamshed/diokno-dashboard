import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserRole, ModeratorPermission } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { PHILIPPINE_PROVINCES } from '../../../data/mockData';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose
}) => {
  const { createUser, users } = useData();
  const { isSuperAdmin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+63 9');
  const [role, setRole] = useState<UserRole>('volunteer');
  const [province, setProvince] = useState('Metro Manila');
  const [city, setCity] = useState('Quezon City');
  const [organization, setOrganization] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'non_binary' | 'prefer_not_to_say'>('prefer_not_to_say');
  const [demographicsConsent, setDemographicsConsent] = useState(true);
  const [modPermissions, setModPermissions] = useState<ModeratorPermission[]>([
    'forum_moderation'
  ]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Legal Reform',
    'Voter Education'
  ]);
  const [error, setError] = useState<string | null>(null);

  const ALL_INTERESTS = [
    'Legal Reform',
    'Free Legal Aid',
    'Youth Empowerment',
    'Voter Education',
    'Human Rights Advocacy',
    'Barangay Outreach',
    'Campus Organizing',
    'Anti-Corruption'
  ];

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const togglePermission = (perm: ModeratorPermission) => {
    setModPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email address is required.');
      return;
    }

    const res = createUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      province,
      city: city.trim(),
      organization: organization.trim() || 'Independent Volunteer',
      interests: selectedInterests,
      age: age ? Number(age) : undefined,
      gender,
      demographicsConsent,
      moderatorPermissions: role === 'moderator' ? modPermissions : undefined
    });

    if (res.success) {
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  const superAdminCount = users.filter((u) => u.role === 'super_admin').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const modCount = users.filter((u) => u.role === 'moderator').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-chel-50 border border-chel-200 flex items-center justify-center text-chel-700 shadow-xs shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Volunteer / User</h2>
              <p className="text-xs text-slate-500">
                Register a new volunteer profile or assign administrative credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Maria Santos"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-chel-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@diokno.ph"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-chel-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+63 917 123 4567"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-chel-500/20 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Campus / Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., UP Diliman Paralegal Volunteers"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-chel-500/20"
              />
            </div>
          </div>

          {/* Role Selection & Hierarchy Enforcement */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 block">Assigned Administrative Role</label>
              <span className="text-[10px] text-slate-500">Enforces capacity caps</span>
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs"
            >
              <option value="volunteer">Volunteer Member</option>
              <option value="moderator">
                Moderator ({modCount} / 150 capacity)
              </option>
              <option value="admin">
                Administrator ({adminCount} / 12 capacity)
              </option>
              {isSuperAdmin && (
                <option value="super_admin">
                  Super Administrator ({superAdminCount} / 3 capacity - HQ)
                </option>
              )}
            </select>

            {/* Granular Moderator Permissions */}
            {role === 'moderator' && (
              <div className="pt-2 border-t border-slate-200 bg-white p-3 rounded-xl border">
                <div className="text-[11px] font-bold text-slate-800 mb-1.5">
                  Granular Moderator Permissions:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={modPermissions.includes('forum_moderation')}
                      onChange={() => togglePermission('forum_moderation')}
                      className="rounded text-chel-600"
                    />
                    <span>Forum Moderation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={modPermissions.includes('proof_review')}
                      onChange={() => togglePermission('proof_review')}
                      className="rounded text-chel-600"
                    />
                    <span>Proof Review</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={modPermissions.includes('content_drafting')}
                      onChange={() => togglePermission('content_drafting')}
                      className="rounded text-chel-600"
                    />
                    <span>Content Drafting</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {PHILIPPINE_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">City / Municipality</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Quezon City"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Demographics & Privacy Consent */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                min="15"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 24"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={demographicsConsent}
                  onChange={(e) => setDemographicsConsent(e.target.checked)}
                  className="rounded text-chel-600"
                />
                <span className="text-[11px] font-semibold text-slate-700">
                  R.A. 10173 Consent
                </span>
              </label>
            </div>
          </div>

          {/* Advocacy Interests */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Advocacy Interests & Pillars
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors border ${
                      isSelected
                        ? 'bg-chel-600 text-white border-chel-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Volunteer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
