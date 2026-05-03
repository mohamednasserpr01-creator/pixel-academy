// FILE: lib/api/client.ts
// 💡 ده مركز القيادة لأي طلب API بيخرج من المنصة (Global Fetch Client)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

// 💡 احتفظنا باسم دالتك (fetchAPI) عشان الأكواد القديمة متضربش إيرور
export async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...customOptions } = options;

    // 1. تجميع الـ Query Params لو موجودة
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const url = `${BASE_URL}${endpoint}${queryString}`;

    // 2. جلب التوكن (Token) أوتوماتيك
    let token = '';
    if (typeof window !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'));
        if (match) token = match[2];
    }

    // 3. تجهيز الـ Headers
    const config: RequestInit = {
        ...customOptions,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => ({}));

        // 🚀 GLOBAL ERROR HANDLING (التحسين اللي التيم طالبه)
        if (!response.ok) {
            // لو التوكن منتهي أو مش موجود، اطرده على صفحة الدخول فوراً
            if (response.status === 401) {
                console.error('🚨 Unauthorized - Redirecting to login...');
                if (typeof window !== 'undefined') window.location.href = '/auth';
            }
            throw new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
        }

        return data as T;
    } catch (error) {
        console.error('🌐 Network/API Error:', error);
        throw error;
    }
}