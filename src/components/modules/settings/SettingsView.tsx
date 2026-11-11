import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Smartphone,
  BookOpen,
  UserCheck,
  Save,
  KeyRound,
  QrCode,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Globe
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { RoleGuard } from '../../common/RoleGuard';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useData();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'app' | 'guidelines' | 'account'>('app');

  // Application Settings State
  const [minVersion, setMinVersion] = useState(settings.minimumAppVersion);
  const [forcedUpdate, setForcedUpdate] = useState(settings.forcedUpdate);
  const [forcedMessage, setForcedMessage] = useState(settings.forcedUpdateMessage);
  const [flags, setFlags] = useState({ ...settings.featureFlags });

  // Community Guidelines State (Bilingual)
  const [guidelinesLang, setGuidelinesLang] = useState<'en' | 'fil'>('en');
  const [englishText, setEnglishText] = useState(settings.guidelinesEnglish);
  const [filipinoText, setFilipinoText] = useState(settings.guidelinesFilipino);

  // Account Settings State
  const [adminName, setAdminName] = useState(user?.name || '');
  const [adminEmail, setAdminEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!isAdmin) {
    return (
      <RoleGuard
        fallbackTitle="Settings Restricted to Administrators"
        fallbackMessage="Application configuration, version deprecation, feature toggles, and community guidelines are reserved exclusively for Administrators."
      >
        <div />
      </RoleGuard>
    );
  }

  const handleSaveAppSettings = () => {
    updateSettings({
      minimumAppVersion: minVersion,
      forcedUpdate,
      forcedUpdateMessage: forcedMessage,
      featureFlags: flags
    });
  };

  const handleSaveGuidelines = () => {
    updateSettings({
      guidelinesEnglish: englishText,
      guidelinesFilipino: filipinoText
    });
  };

  const handleToggleFlag = (key: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please input your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-chel-50 text-chel-700 border border-chel-200">
              Administrator Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure mobile app release gates, feature toggles, bilingual community standards, and 2FA credentials.
          </p>
        </div>

        <button
          onClick={resetAllData}
          className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          title="Reset database to fresh initial demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('app')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'app'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Application Settings & Versioning</span>
        </button>

        <button
          onClick={() => setActiveTab('guidelines')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'guidelines'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Community Guidelines (Bilingual)</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'account'
              ? 'border-chel-600 text-chel-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin Profile & 2FA</span>
        </button>
      </div>

      {/* TAB 1: APPLICATION SETTINGS & FEATURE FLAGS */}
      {activeTab === 'app' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mobile App Release & Version Control</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enforce minimum client versions across iOS App Store and Google Play Store
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Supported Mobile App Version
                </label>
                <input
                  type="text"
                  value={minVersion}
                  onChange={(e) => setMinVersion(e.target.value)}
                  placeholder="e.g. 1.4.2"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Users running builds below this version will be prompted to upgrade before using the app.
                </p>
              </div>

              {/* Forced Update Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Forced App Update Gate</div>
                  <div className="text-[11px] text-slate-500">
                    Blocks older versions from accessing backend APIs until updated
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forcedUpdate}
                    onChange={(e) => setForcedUpdate(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chel-600" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Forced Update Modal Message (Displayed in Mobile App)
              </label>
              <textarea
                rows={2}
                value={forcedMessage}
                onChange={(e) => setForcedMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 leading-relaxed"
              />
            </div>

            {/* Feature Flags */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Feature Flags & Remote Configurations
              </h4>

              <div className="space-y-3">
                {[
                  {
                    key: 'enableVoterEducationLeaderboard',
                    label: 'Voter Education CHELlenge Leaderboard',
                    desc: 'Displays competitive regional rankings for youth voter drives in the mobile app.'
                  },
                  {
                    key: 'enableInAppPushV2',
                    label: 'In-App Notification Center V2',
                    desc: 'Enhanced in-app inbox supporting categorized alerts and deep links.'
                  },
                  {
                    key: 'enableCommunityDirectReplies',
                    label: 'Community Threaded Replies',
                    desc: 'Enables nested comment replies inside volunteer forum topics.'
                  },
                  {
                    key: 'enableCivicBadgeQrSharing',
                    label: 'Civic Badge QR Social Sharing',
                    desc: 'Allows volunteers to generate high-res shareable image cards of their earned badges.'
                  },
                  {
                    key: 'enableLiveEventCheckInAlerts',
                    label: 'Real-time Event Check-in Push Alerts',
                    desc: 'Sends instant confirmation push when scanned at on-site registration desks.'
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flags[item.key as keyof typeof flags]}
                        onChange={() => handleToggleFlag(item.key as keyof typeof flags)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chel-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveAppSettings}
                className="px-5 py-2.5 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Application Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY GUIDELINES (BILINGUAL) */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Community Guidelines Editor</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published in the mobile app terms of service and community onboarding screens
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setGuidelinesLang('en')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    guidelinesLang === 'en' ? 'bg-white text-chel-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setGuidelinesLang('fil')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    guidelinesLang === 'fil' ? 'bg-white text-chel-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Filipino (Tagalog)
                </button>
              </div>
            </div>

            {guidelinesLang === 'en' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  English Community Standards (Markdown Supported)
                </label>
                <textarea
                  rows={10}
                  value={englishText}
                  onChange={(e) => setEnglishText(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-2xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 leading-relaxed"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Filipino / Tagalog Community Standards (Markdown Supported)
                </label>
                <textarea
                  rows={10}
                  value={filipinoText}
                  onChange={(e) => setFilipinoText(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-2xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 leading-relaxed"
                />
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveGuidelines}
                className="px-5 py-2.5 text-xs font-bold text-white bg-chel-600 hover:bg-chel-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Bilingual Guidelines</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN PROFILE & 2FA */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile & 2FA Status (1 Col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Administrator Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your privileged staff account details</p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={user?.avatar}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-chel-500/30"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
                <div className="mt-1 text-[11px] font-bold text-chel-700 uppercase">
                  Role: {user?.role}
                </div>
              </div>
            </div>

            {/* 2FA Status Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      Two-Factor Authentication Active
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Mandatory hardware / authenticator app TOTP verification
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  ENFORCED
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 flex items-center justify-between">
                <span>Backup Authenticator Key:</span>
                <span className="font-mono font-bold text-slate-900">DIOK-NO25-AUTH-FLAG</span>
              </div>
            </div>
          </div>

          {/* Password Management Form (1 Col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Change Admin Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Passwords must be at least 8 characters with numbers and symbols
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully. Recorded in audit log.</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong new password"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

