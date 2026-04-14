"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    phone: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (phone: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // بنقرأ الكوكي لما الموقع يفتح
        const hasAuthCookie = document.cookie.includes('pixel_auth=true');
        const phone = localStorage.getItem('pixel_current_user_phone');
        
        if (hasAuthCookie && phone) {
            setUser({ phone });
        }
    }, []);

    const login = (phone: string) => {
        setUser({ phone });
        localStorage.setItem('pixel_current_user_phone', phone);
        // 💡 الضربة القاضية: إنشاء Cookie صالحة لمدة 30 يوم
        document.cookie = "pixel_auth=true; path=/; max-age=2592000; SameSite=Strict";
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pixel_current_user_phone');
        // 💡 مسح الـ Cookie
        document.cookie = "pixel_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};