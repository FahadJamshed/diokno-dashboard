import React, { useState, useRef, useEffect } from 'react';
import { Check, ArrowLeft, RefreshCw, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

export const TwoFactorScreen: React.FC = () => {
  const { pendingEmail, pendingRole, verify2FA, resend2FACode, resendCooldown, setAuthScreen } = useAuth();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first digit
    inputsRef.current[0]?.focus();
  }, []);

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      e.preventDefault();
      setCode(pasted);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please input all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const res = await verify2FA(code);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid code.');
      }
    }, 400);
  };

  return (
    <AuthLayout>
        <div>
          <button
            onClick={() => setAuthScreen('login')}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#193e69]">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900">
              Two-factor verification
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Enter the 6-digit verification code sent to <span className="font-semibold text-slate-700">{pendingEmail}</span>.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 6 Digit Input Group */}
            <div>
              <label className="mb-2.5 block text-xs font-semibold text-slate-700">
                Verification code <span className="text-rose-500">*</span>
              </label>
              <div className="relative" onPaste={handlePaste}>
                <input
                  ref={(el) => (inputsRef.current[0] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-4 text-center font-mono text-2xl font-semibold tracking-[0.45em] text-slate-800 outline-none placeholder:tracking-[0.45em] placeholder:text-slate-400 focus:border-[#3269a6] focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••"
                />
              </div>
              <p className="mt-3 text-center text-xs text-slate-500">Demo verification code: <span className="font-bold text-slate-700">246810</span></p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#193e69] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#12345a] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify and continue</span>
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={resend2FACode}
                disabled={resendCooldown > 0}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold text-[#3269a6] transition-colors hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
              >
                <RefreshCw className="h-4 w-4 shrink-0" />
                <span>
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : 'Didn’t receive it? Resend code'}
                </span>
              </button>
            </div>
          </form>

        </div>
    </AuthLayout>
  );
};

