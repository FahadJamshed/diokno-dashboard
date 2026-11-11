'use client';

import React from 'react';
import App from '../src/App';
import { ToastProvider } from '../src/context/ToastContext';
import { AuthProvider } from '../src/context/AuthContext';
import { DataProvider } from '../src/context/DataContext';

export default function DashboardClient() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
