// FILE: app/courses/page.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaFolderOpen, FaChalkboardTeacher, FaFilter } from 'react-icons/fa';

import { useSettings } from '../../context/SettingsContext';
import { coursesData } from '../../data/courses';
import { Button } from '../../components/ui/Button';

export default function CoursesListPage() {
    const { lang } = useSettings();
    const isAr = lang === 'ar';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');

    // 💡 الأقسام والمواد المتاحة 
    const subjects = [
        { id: 'all', nameAr: 'الكل (الأحدث)', nameEn: 'All (Latest)' },
        { id: 'physics', nameAr: 'الفيزياء', nameEn: 'Physics' },
        { id: 'math', nameAr: 'الرياضيات', nameEn: 'Mathematics' },
        { id: 'chemistry', nameAr: 'الكيمياء', nameEn: 'Chemistry' }
    ];

    // فلترة الكورسات بناءً على البحث + المادة المختارة
    const filteredCourses = coursesData.filter(c => {
        const matchesSearch = (isAr ? c.titleAr : c.titleEn).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || (c as any).subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    return (
        <main className="page-wrapper" style={{ paddingBottom: '60px' }}>
            <div className="store-header" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
                <h1 style={{ color: 'var(--p-purple)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '20px' }}>
                    {isAr ? 'تصفح الكورسات المتاحة 📚' : 'Browse Available Courses 📚'}
                </h1>
                
                {/* 💡 مربع البحث + فلتر المواد */}
                <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder={isAr ? "ابحث عن كورس..." : "Search for a course..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '15px 45px 15px 15px', borderRadius: '15px', border: '2px solid rgba(108,92,231,0.2)', background: 'var(--card)', color: 'var(--txt)', outline: 'none', fontSize: '1rem' }}
                        />
                        <FaSearch style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '15px', color: 'var(--p-purple)' }} />
                    </div>
                    
                    <div style={{ width: '200px', flexGrow: '1', position: 'relative' }}>
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid rgba(108,92,231,0.2)', background: 'var(--card)', color: 'var(--txt)', outline: 'none', fontSize: '1rem', appearance: 'none', cursor: 'pointer' }}
                        >
                            {subjects.map(sub => (
                                /* 💡 هنا الحل: إعطاء خلفية ولون للـ option عشان تظهر في الدارك مود */
                                <option key={sub.id} value={sub.id} style={{ background: 'var(--bg)', color: 'var(--txt)' }}>
                                    {isAr ? sub.nameAr : sub.nameEn}
                                </option>
                            ))}
                        </select>
                        <FaFilter style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '15px', color: 'var(--p-purple)', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.1)' }}>
                    <FaFolderOpen style={{ fontSize: '4rem', color: 'var(--txt-mut)', marginBottom: '20px' }} />
                    <h2 style={{ color: 'var(--txt)' }}>{isAr ? 'لا توجد كورسات مطابقة لبحثك' : 'No courses match your criteria'}</h2>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                    {filteredCourses.map(course => (
                        <div key={course.id} style={{ background: 'var(--card)', border: '1px solid rgba(108,92,231,0.2)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--p-purple)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(108,92,231,0.2)'}>
                            <img src={course.img} alt={course.titleEn} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--txt)', fontWeight: 900 }}>
                                    {isAr ? course.titleAr : course.titleEn}
                                </h3>
                                <p style={{ color: 'var(--txt-mut)', marginBottom: '20px', flex: 1, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {isAr ? course.descAr : course.descEn}
                                </p>
                                <Link href={`/courses/${course.id}`} style={{ display: 'block', width: '100%' }}>
                                    <Button fullWidth icon={<FaChalkboardTeacher />}>
                                        {isAr ? 'التفاصيل والاشتراك' : 'Details & Subscribe'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}