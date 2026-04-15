"use client";
import React from 'react';
import { useSettings } from '../../context/SettingsContext'; // 💡 صلحنا المسار هنا بـ ../../

export default function TeachersPage() { 
    const { lang } = useSettings();

    return (
        <main className="page-wrapper">
            <div className="page-container" style={{ flex: 1, padding: '120px 5% 50px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                
                <h1 style={{ color: 'var(--p-purple)', marginBottom: '20px' }}>
                    {lang === 'ar' ? 'نخبة التدريس' : 'Our Teachers'}
                </h1>
                
                <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px' }}>
                     محتوى صفحة المدرسين هييجي هنا مسطرة ومفيش حاجة هتضرب.
                </div>

            </div>
        </main>
    );
}