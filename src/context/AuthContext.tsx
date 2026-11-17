import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, ModeratorPermission } from '../types';
import { CURRENT_SUPER_ADMIN, CURRENT_ADMIN, CURRENT_MODERATOR } from '../data/mockData';

export type AuthScreenState = 'login' | '2fa' | 'forgot_password' | 'authenticated';

interface AuthContextType {
  user: AuthUser | null;
  authScreen: AuthScreenState;
  pendingEmail: string;
  pendingRole: 'super_admin' | 'admin' | 'moderator';
  rememberMe: boolean;
  resendCooldown: number;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  resend2FACode: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setAuthScreen: (screen: AuthScreenState) => void;
  switchRole: (role: 'super_admin' | 'admin' | 'moderator', permissions?: ModeratorPermission[]) => void;
  toggleModeratorPermission: (permission: ModeratorPermission) => void;
  hasPermission: (permission: ModeratorPermission) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'diokno_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return CURRENT_SUPER_ADMIN; // default to Super Admin for complete developer/reviewer preview
  });

  const [authScreen, setAuthScreen] = useState<AuthScreenState>(() => {
    return user ? 'authenticated' : 'login';
  });

  const [pendingEmail, setPendingEmail] = useState<string>('superadmin@diokno.ph');
  const [pendingRole, setPendingRole] = useState<'super_admin' | 'admin' | 'moderator'>('super_admin');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Timer countdown for 2FA resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const login = async (email: string, password: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    // Basic validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    setRememberMe(remember);
    setPendingEmail(cleanEmail);

    // Identify role by email
    if (cleanEmail.includes('super')) {
      setPendingRole('super_admin');
    } else if (cleanEmail.includes('mod') || cleanEmail.includes('juan')) {
      setPendingRole('moderator');
    } else {
      setPendingRole('admin');
    }

    // Advance to 2FA screen (mandatory two-factor verification)
    setAuthScreen('2fa');
    setResendCooldown(45);
    return { success: true };
  };

  const verify2FA = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!code || code.length !== 6) {
      return { success: false, error: 'Please enter a valid 6-digit verification code.' };
    }

    if (code === '000000') {
      return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }

    // Authenticate user based on role
    let authenticatedUser: AuthUser = CURRENT_SUPER_ADMIN;
    if (pendingRole === 'super_admin') {
      authenticatedUser = CURRENT_SUPER_ADMIN;
    } else if (pendingRole === 'admin') {
      authenticatedUser = CURRENT_ADMIN;
    } else {
      authenticatedUser = CURRENT_MODERATOR;
    }

    setUser(authenticatedUser);
    setAuthScreen('authenticated');

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    }

    return { success: true };
  };

  const resend2FACode = async () => {
    if (resendCooldown === 0) {
      setResendCooldown(60);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid registered email address.' };
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthScreen('login');
  };

  const switchRole = (newRole: 'super_admin' | 'admin' | 'moderator', permissions?: ModeratorPermission[]) => {
    let updatedUser: AuthUser;
    if (newRole === 'super_admin') {
      updatedUser = { ...CURRENT_SUPER_ADMIN };
    } else if (newRole === 'admin') {
      updatedUser = { ...CURRENT_ADMIN };
    } else {
      updatedUser = {
        ...CURRENT_MODERATOR,
        moderatorPermissions: permissions || ['forum_moderation', 'proof_review', 'content_drafting']
      };
    }
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const toggleModeratorPermission = (permission: ModeratorPermission) => {
    if (!user || user.role !== 'moderator') return;
    const current = user.moderatorPermissions || [];
    const next = current.includes(permission)
      ? current.filter((p) => p !== permission)
      : [...current, permission];
    const updatedUser = { ...user, moderatorPermissions: next };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const hasPermission = (permission: ModeratorPermission): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin') return true;
    if (user.role === 'moderator') {
      return (user.moderatorPermissions || []).includes(permission);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authScreen,
        pendingEmail,
        pendingRole,
        rememberMe,
        resendCooldown,
        login,
        verify2FA,
        resend2FACode,
        requestPasswordReset,
        logout,
        setAuthScreen,
        switchRole,
        toggleModeratorPermission,
        hasPermission,
        isSuperAdmin: user?.role === 'super_admin',
        isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
        isModerator: user?.role === 'moderator',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

