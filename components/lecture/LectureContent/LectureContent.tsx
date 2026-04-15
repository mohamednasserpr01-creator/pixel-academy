import React from 'react';
import Link from 'next/link';
import { FaLock, FaClipboardCheck, FaPencilAlt, FaFilePdf, FaDownload, FaArrowRight } from 'react-icons/fa';
import { PlaylistItem } from '../../../types';

export default function LectureContent({ activeItem, lang }: { activeItem: PlaylistItem, lang: string }) {
    if (activeItem.status === 'locked') {
        return (
            <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center', padding: '20px' }}>
                <FaLock style={{ fontSize: '4rem', color: '#7f8c8d', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '10px' }}>{lang === 'ar' ? 'هذا المحتوى مغلق' : 'Content Locked'}</h2>
                <p style={{ opacity: 0.8 }}>{lang === 'ar' ? 'يجب إنهاء المهام السابقة أولاً لفتح هذا الجزء.' : 'You must complete previous tasks to unlock this.'}</p>
            </div>
        );
    }

    if (activeItem.type === 'exam' || activeItem.type === 'homework') {
        // تحديد الرابط حسب النوع (امتحان أو واجب)
        const linkHref = activeItem.type === 'exam' ? `/exam/${activeItem.id}` : `/homework/${activeItem.id}`;

        return (
            <div style={{ padding: '50px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center' }}>
                {activeItem.type === 'exam' ? <FaClipboardCheck style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '20px' }} /> : <FaPencilAlt style={{ fontSize: '4rem', color: '#f1c40f', marginBottom: '20px' }} />}
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>{lang === 'ar' ? activeItem.titleAr : activeItem.titleEn}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', opacity: 0.8, fontWeight: 'bold' }}>
                    <span>📋 {activeItem.questions} {lang === 'ar' ? 'سؤال' : 'Questions'}</span>
                    {activeItem.timeLimit && <span>⏱️ {activeItem.timeLimit} {lang === 'ar' ? 'دقيقة' : 'Mins'}</span>}
                </div>
                
                {/* زرار التحويل الفعلي لصفحة الحل */}
                <Link href={linkHref} className="glow-btn" style={{ padding: '15px 40px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                    {lang === 'ar' ? 'ابدأ الحل الآن' : 'Start Now'} <FaArrowRight style={{ margin: '0 8px', transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                </Link>
            </div>
        );
    }

    if (activeItem.type === 'pdf') {
        return (
            <div style={{ padding: '50px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center' }}>
                <FaFilePdf style={{ fontSize: '5rem', color: '#e74c3c', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{lang === 'ar' ? activeItem.titleAr : activeItem.titleEn}</h2>
                <p style={{ opacity: 0.8, marginBottom: '30px' }}>{lang === 'ar' ? 'يمكنك تصفح الملزمة أو تحميلها على جهازك.' : 'You can view or download the file.'}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <button className="btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaDownload /> {lang === 'ar' ? 'تحميل (PDF)' : 'Download PDF'}
                    </button>
                </div>
            </div>
        );
    }

    return null;
}