import React, { useState, useRef, useEffect } from 'react';
import { KeyRound, ArrowLeft, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const TwoFactorScreen: React.FC = () => {
  const { pendingEmail, pendingRole, verify2FA, resend2FACode, resendCooldown, setAuthScreen } = useAuth();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first digit
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // numbers only

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1); // keep last typed char
    setDigits(newDigits);
    setError('');

    // Advance to next input
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split('');
      setDigits(arr);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');

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

  const handleQuickFillCode = () => {
    setDigits(['2', '4', '6', '8', '1', '0']);
    setError('');
  };

  const handleExpiredCodeTest = () => {
    setDigits(['0', '0', '0', '0', '0', '0']);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-chel-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          <button
            onClick={() => setAuthScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-chel-50 text-chel-600 mb-3 border border-chel-100 shadow-2xs">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Two-Factor Authentication
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Mandatory 2FA security check for{' '}
              <span className="font-semibold text-slate-800">{pendingEmail}</span> (
              <span className="capitalize font-bold text-chel-700">{pendingRole}</span>).
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Input Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 text-center mb-2.5">
                Enter 6-digit Authenticator Code
              </label>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 sm:w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-chel-200 focus:border-chel-600 text-slate-900 transition-all shadow-2xs"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || digits.join('').length !== 6}
              className="w-full py-2.5 px-4 bg-chel-600 hover:bg-chel-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-chel-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify & Access Console</span>
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={resend2FACode}
                disabled={resendCooldown > 0}
                className="text-xs font-medium text-slate-600 hover:text-chel-600 disabled:text-slate-400 disabled:cursor-not-allowed inline-flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'text-chel-600'}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : 'Resend verification code'}
                </span>
              </button>
            </div>
          </form>

          {/* Testing Helpers */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <span>Demo testing:</span>
            <button
              type="button"
              onClick={handleQuickFillCode}
              className="text-chel-600 hover:underline font-semibold"
            >
              Fill Valid (246810)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleExpiredCodeTest}
              className="text-rose-600 hover:underline font-semibold"
            >
              Test Expired (000000)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

