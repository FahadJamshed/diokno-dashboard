import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

export const LoginScreen: React.FC = () => {
  const { login, setAuthScreen } = useAuth();

  const [email, setEmail] = useState('admin@diokno.ph');
  const [password, setPassword] = useState('DioknoAdmin2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide your administrative email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    // Simulate brief authentication check
    setTimeout(async () => {
      const res = await login(email, password, rememberMe);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const handleFillDemo = (type: 'admin' | 'moderator') => {
    if (type === 'admin') {
      setEmail('admin@diokno.ph');
      setPassword('DioknoAdmin2025!');
    } else {
      setEmail('mod.juan@diokno.ph');
      setPassword('DioknoMod2025!');
    }
    setError('');
  };

  return (
    <AuthLayout>
        <div>
          <div className="mb-8">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#3269a6]">Welcome back</p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500">Access the Diokno Volunteer administration dashboard.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@diokno.ph"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm focus:border-[#3269a6] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 pr-10 text-sm text-slate-900 shadow-sm focus:border-[#3269a6] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#193e69] focus:ring-[#3269a6]"
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => setAuthScreen('forgot_password')}
                className="font-semibold text-[#3269a6] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#193e69] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#12345a] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-lg bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-700">
            <span className="font-bold">Demo access:</span> Use the prefilled account for Administrator. Use <button type="button" onClick={() => { setEmail('moderator@diokno.ph'); setPassword('DioknoMod2025!'); }} className="font-bold hover:underline">moderator@diokno.ph</button> to preview Moderator permissions.
          </div>
        </div>
    </AuthLayout>
  );
};

