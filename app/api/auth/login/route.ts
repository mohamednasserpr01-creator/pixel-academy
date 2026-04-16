// FILE: app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// 💡 نفس السر اللي حطيناه في الـ Middleware
const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'pixel_academy_super_secret_key_2026'
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // 💡 هنا بنتحقق من الداتا (مؤقتاً بنقبل أي حاجة لحد ما تربط بقاعدة البيانات)
        if (email && password) {
            
            // 1. توليد التوكن الحقيقي المشفر (JWT)
            const token = await new SignJWT({ 
                email, 
                role: 'student',
                userId: 'user_12345' // مجرد مثال
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('7d') // التوكن صالح لمدة 7 أيام
                .sign(SECRET_KEY);

            // 2. تجهيز الرد (Response) مع إرفاق الكوكي المشفرة
            const response = NextResponse.json({ 
                success: true, 
                message: 'تم تسجيل الدخول بنجاح' 
            });
            
            response.cookies.set({
                name: 'pixel_auth',
                value: token,
                httpOnly: true, // حماية من هجمات XSS
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 7 أيام بالثواني
            });

            return response;
        }

        return NextResponse.json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, message: 'حدث خطأ في السيرفر' }, { status: 500 });
    }
}