// FILE: components/layout/PlatformUI.tsx
"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; 
import Footer from './Footer';
import ChatBox from '../chat/ChatBox'; 

export default function PlatformUI({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // 💡 لو اللينك بيبدأ بـ /admin أو /teacher هنخفي كل دوشة الطلاب
    const isDashboardPanel = pathname?.startsWith('/admin') || pathname?.startsWith('/teacher');

    if (isDashboardPanel) {
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