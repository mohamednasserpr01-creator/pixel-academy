import React from 'react';
import Link from 'next/link';
import { Lecture } from '../../types';

// 💡 هنا اسم الكتالوج Props
interface Props {
    lectures: Lecture[];
    currentLectureId: string;
    courseId: string;
    lang: string; 
}

// 💡 التعديل هنا: غيرنا SidebarProps لـ Props عشان تطابق اللي فوق
export default function LectureSidebar({ lectures, currentLectureId, courseId, lang }: Props) {
    return (
        <aside className="lecture-sidebar" style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(108,92,231,0.2)' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                {lang === 'ar' ? 'محتوى الكورس' : 'Course Content'}
            </h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lectures.map((lec) => (
                    <li key={lec.id}>
                        <Link 
                            href={`/courses/${courseId}/lecture/${lec.id}`}
                            style={{
                                display: 'block',
                                padding: '12px 15px',
                                borderRadius: '10px',
                                background: currentLectureId === lec.id ? 'var(--p-purple)' : 'var(--h-bg)',
                                color: currentLectureId === lec.id ? '#fff' : 'var(--txt)',
                                transition: '0.3s'
                            }}
                        >
                            {lang === 'ar' ? lec.titleAr : lec.titleEn}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}