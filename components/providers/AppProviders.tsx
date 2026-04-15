"use client";
import React, { useState } from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 💡 1. استدعاء السحر

export function AppProviders({ children }: { children: React.ReactNode }) {
    // 💡 2. تجهيز محطة الكاشينج
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // الداتا تفضل متكيشة 5 دقايق
                refetchOnWindowFocus: false, // ميعملش ريفريش كل ما الطالب يغير التاب
            },
        },
    }));

    return (
        // 💡 3. تغليف المنصة كلها بـ React Query
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}