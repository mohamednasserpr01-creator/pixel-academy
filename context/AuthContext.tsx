"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    checkRole: (allowedRoles: string[]) => boolean; // 💡 دالة جديدة للتحقق من الصلاحيات
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // التحقق من وجود توكن قديم أول ما الموقع يفتح
    useEffect(() => {
        const tokenMatch = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'));
        if (tokenMatch) {
            // هنا المفروض نكلم الباك إند بالتوكن ده عشان نجيب بيانات اليوزر
            // مؤقتاً هنعتبره أدمن
            setUser({ id: 'u1', name: 'محمد ناصر', email: 'admin@pixel.com', role: 'admin' });
            setIsLoggedIn(true);
        }
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const userData = await authService.login(email, pass);
            setUser(userData);
            setIsLoggedIn(true);
            
            // حفظ التوكن في الـ Cookie عشان الـ Middleware يشوفه
            document.cookie = `pixel_auth=${userData.token}; path=/; max-age=86400; secure; samesite=strict`;
        } catch (error) {
            console.error("فشل تسجيل الدخول:", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsLoggedIn(false);
    };

    // 💡 دالة عبقرية: بتديها مصفوفة فيها الـ Roles المسموحة، وتقولك اليوزر ده مسموحله يدخل ولا لأ
    const checkRole = (allowedRoles: string[]) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, checkRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}