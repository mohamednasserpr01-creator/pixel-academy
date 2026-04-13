"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. تحديد شكل بيانات الطالب
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

// 2. إنشاء الـ Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. الـ Provider اللي هيشيل الداتا
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // لما الموقع يفتح، بنشيك لو في داتا قديمة مؤقتاً لحد ما نربط الباك إند
    useEffect(() => {
        const loggedIn = localStorage.getItem('pixel_logged_in');
        const phone = localStorage.getItem('pixel_current_user_phone');
        if (loggedIn === 'true' && phone) {
            setUser({ phone });
        }
    }, []);

    const login = (phone: string) => {
        setUser({ phone });
        localStorage.setItem('pixel_logged_in', 'true');
        localStorage.setItem('pixel_current_user_phone', phone);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pixel_logged_in');
        localStorage.removeItem('pixel_current_user_phone');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 4. Custom Hook عشان نستخدمه في أي صفحة
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};