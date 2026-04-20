// FILE: components/layout/PlatformUI.tsx
"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; 
import Footer from './Footer';
import ChatBox from '../chat/ChatBox'; 

export default function PlatformUI({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // 💡 لو اللينك بيبدأ بـ /admin هنخفي كل دوشة الطلاب
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    // 💡 لو إحنا في منصة الطلاب العادية، هنعرض الهيدر والفوتر والواتساب
    return (
        <>
            <Navbar />
            <div className="main-content-wrapper">
                {children}
            </div>
            <ChatBox />
            <Footer />
        </>
    );
}