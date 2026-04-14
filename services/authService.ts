import { fetchAPI } from '../lib/api';
import { User } from '../types';

export const authService = {
    // دالة تسجيل الدخول
    login: async (email: string, pass: string): Promise<User> => {
        // return fetchAPI<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, pass }) });
        
        // 💡 داتا وهمية مؤقتة لحد ما نربط الباك إند
        return {
            id: 'u1',
            name: 'محمد ناصر',
            email: 'admin@pixel.com',
            role: 'admin', // 💡 الصلاحية (Role) هنا أهيه!
            token: 'fake-jwt-token-12345'
        };
    },

    // دالة إنشاء حساب
    register: async (userData: any): Promise<User> => {
        // return fetchAPI<User>('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
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