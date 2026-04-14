"use client";
import React from 'react';
import Navbar from '../components/layout/Navbar'; // اتأكد إن مسار الناف بار صح
import Footer from '../components/layout/Footer'; // اتأكد إن مسار الفوتر صح

// استدعاء المركز عشان نعرف اللغة لو محتاجينها
import { useSettings } from '../context/SettingsContext';

export default function TeachersPage() { 
    const { lang } = useSettings();

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. الناف بار بتاعنا بقى سادة ومبيستقبلش أي Props */}
            <Navbar />
            
            {/* 2. الكونتينر ده هو اللي بيحمي التصميم من إنه يضرب أو يدخل تحت الناف بار */}
            <div className="page-container" style={{ flex: 1, padding: '120px 5% 50px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                
                <h1 style={{ color: 'var(--p-purple)', marginBottom: '20px' }}>
                    {lang === 'ar' ? 'نخبة التدريس' : 'Our Teachers'}
                </h1>
                
                {/* 👇 هنا تحط الكروت أو الجريد بتاع المدرسين اللي إنت مصممه 👇 */}
                <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px' }}>
                     (هنا هتحط كود تصميم المدرسين بتاعك)
                </div>
                {/* 👆 نهاية تصميم المدرسين 👆 */}

            </div>

            {/* 3. الفوتر في آخر الصفحة */}
            <Footer />
            
        </main>
    );
}