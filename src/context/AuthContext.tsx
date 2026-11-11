import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { CURRENT_ADMIN, CURRENT_MODERATOR } from '../data/mockData';

export type AuthScreenState = 'login' | '2fa' | 'forgot_password' | 'authenticated';

interface AuthContextType {
  user: AuthUser | null;
  authScreen: AuthScreenState;
  pendingEmail: string;
  pendingRole: 'admin' | 'moderator';
  rememberMe: boolean;
  resendCooldown: number;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  resend2FACode: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setAuthScreen: (screen: AuthScreenState) => void;
  switchRole: (role: 'admin' | 'moderator') => void;
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
    // Start authenticated by default with Admin for immediate review ease, or default to login
    return CURRENT_ADMIN;
  });

  const [authScreen, setAuthScreen] = useState<AuthScreenState>(() => {
    return user ? 'authenticated' : 'login';
  });

  const [pendingEmail, setPendingEmail] = useState<string>('admin@diokno.ph');
  const [pendingRole, setPendingRole] = useState<'admin' | 'moderator'>('admin');
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

    // Identify role by email or default
    if (cleanEmail.includes('mod') || cleanEmail.includes('juan')) {
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

    // Authenticate user
    const authenticatedUser = pendingRole === 'moderator' ? CURRENT_MODERATOR : CURRENT_ADMIN;
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

  const switchRole = (newRole: 'admin' | 'moderator') => {
    const updatedUser = newRole === 'admin' ? CURRENT_ADMIN : CURRENT_MODERATOR;
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
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
        isAdmin: user?.role === 'admin',
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

