import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 💡 ضفنا كلمة default عشان Next.js يقدر يتعرف على الملف كـ Proxy أساسي
export default function proxy(request: NextRequest) {
    const isLoggedIn = request.cookies.get('pixel_auth');

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/library/:path*',
        '/exam/:path*',
        '/homework/:path*'
    ],
};