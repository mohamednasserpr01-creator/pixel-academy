"use client";
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { SettingsProvider } from '../../context/SettingsContext';

// ده المُغلف السحري اللي هيشيل كل الإعدادات ويحمي الموقع من أي إيرور
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </AuthProvider>
    );
}