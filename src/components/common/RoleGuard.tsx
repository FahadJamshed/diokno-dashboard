import React from 'react';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole?: 'admin';
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRole = 'admin',
  fallbackTitle = 'Administrator Access Required',
  fallbackMessage = 'This module is restricted to system administrators. Moderators have view-only or restricted access to this area.'
}) => {
  const { user, isAdmin, switchRole } = useAuth();

  if (allowedRole === 'admin' && !isAdmin) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-slate-200/90 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-3">
          Current Role: <span className="uppercase text-chel-700">{user?.role}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{fallbackTitle}</h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{fallbackMessage}</p>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => switchRole('admin')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-chel-600 rounded-xl hover:bg-chel-700 shadow-sm transition-all"
          >
            <UserCheck className="w-4 h-4" />
            Switch to Administrator View
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

