// lib/api.ts
// ده المركز اللي هيتولى كل الطلبات للباك إند، وبيحط التوكن أوتوماتيك لو موجود

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // 1. نجيب التوكن من الكوكيز (لو مسجل دخول)
    // هنا ممكن نستخدم مكتبة js-cookie أو نقرأها مباشرة
    let token = ''; 
    if (typeof window !== 'undefined') {
        // قراءة الكوكي في الفرونت إند
        const match = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'));
        if (match) token = match[2];
    }

    // 2. تجهيز الـ Headers
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // 3. إرسال الطلب
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'حدث خطأ في الاتصال بالخادم');
    }

    return response.json();
}