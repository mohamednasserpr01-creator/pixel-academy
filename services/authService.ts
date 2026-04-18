// FILE: services/authService.ts
import { User } from '../types';

export const authService = {
    // دالة تسجيل الدخول
    login: async (emailOrPhone: string, pass: string): Promise<User> => {
        
        // 💡 1. إرسال الطلب للـ API الحقيقي اللي عملناه
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailOrPhone, password: pass })
        });
        
        const data = await res.json();

        // 💡 2. التعامل مع الأخطاء لو البيانات غلط
        if (!res.ok) {
            throw new Error(data.message || 'خطأ في تسجيل الدخول');
        }

        // 💡 3. إرجاع التوكن الحقيقي للمتصفح
        return {
            id: 'u1',
            name: 'طالب بيكسل',
            email: emailOrPhone,
            role: 'student',
            token: data.token // 👈 التوكن المشفر الحقيقي
        };
    },

    // دالة إنشاء حساب (Mock مؤقت)
    register: async (userData: any): Promise<User> => {
        return { id: 'u2', name: 'طالب جديد', email: 'student@pixel.com', role: 'student', token: 'fake-token' };
    },

    // دالة تسجيل الخروج (مسح الكوكي)
    logout: () => {
        if (typeof window !== 'undefined') {
            document.cookie = 'pixel_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/';
        }
    }
};