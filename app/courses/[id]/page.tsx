"use client";
import React, { use } from 'react';
import Link from 'next/link';
import { FaPlayCircle, FaShoppingCart, FaStar, FaChalkboardTeacher } from 'react-icons/fa';

// 💡 استدعاء الإعدادات بمسار صحيح (3 مستويات فقط مش 5)
import { useSettings } from '../../../context/SettingsContext';

export default function CourseDetails({ params }: { params: Promise<{ id: string }> }) {
    // فك الـ Params للكورس فقط (مفيش هنا lectureId)
    const resolvedParams = use(params);
    const courseId = resolvedParams.id;
    const { lang } = useSettings();

    // 💡 داتا محاكية للكورس (لحد ما نربطها بالـ courseService بتاعك)
    const course = {
        id: courseId,
        titleAr: "كورس الفيزياء الشامل - ثانوية عامة",
        titleEn: "Comprehensive Physics Course - High School",
        descAr: "شرح مفصل ومبسط لمنهج الفيزياء بالكامل مع حل آلاف الأسئلة والتدريبات، ومتابعة دورية وامتحانات مستمرة لضمان تفوقك.",
        descEn: "Detailed and simplified explanation of the entire physics curriculum with thousands of questions, periodic follow-ups, and continuous exams.",
        price: 500,
        level: lang === 'ar' ? 'الصف الثالث الثانوي' : 'Grade 12',
        instructor: lang === 'ar' ? 'أ. أحمد الفيزيائي' : 'Mr. Ahmed',
        img: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1000&auto=format&fit=crop"
    };

    return (
        <main className="page-wrapper" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                {/* معلومات الكورس (يمين) */}
                <div style={{ flex: '1 1 500px' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '8px 15px', borderRadius: '50px', fontWeight: 'bold', marginBottom: '20px' }}>
                        <FaStar style={{ color: '#f1c40f', marginRight: '5px' }} /> {course.level}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--txt)', marginBottom: '20px', lineHeight: 1.4 }}>
                        {lang === 'ar' ? course.titleAr : course.titleEn}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--txt-mut)', lineHeight: 1.8, marginBottom: '30px' }}>
                        {lang === 'ar' ? course.descAr : course.descEn}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', background: 'var(--h-bg)', padding: '15px', borderRadius: '15px', width: 'fit-content' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--p-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                            <FaChalkboardTeacher />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--txt-mut)' }}>{lang === 'ar' ? 'مقدم الدورة' : 'Instructor'}</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem' }}>{course.instructor}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {/* 💡 زرار الدخول للمحاضرة الأولى */}
                        <Link href={`/courses/${courseId}/lecture/1`} style={{ flex: '1', minWidth: '200px' }}>
                            <button className="glow-btn" style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                                <FaPlayCircle /> {lang === 'ar' ? 'ابدأ التعلم الآن' : 'Start Learning Now'}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* كارت السعر والصورة (يسار) */}
                <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'var(--card)', borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
                        <img src={course.img} alt="Course" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                        <div style={{ padding: '30px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--p-purple)', marginBottom: '20px' }}>
                                {course.price} {lang === 'ar' ? 'ج.م' : 'EGP'}
                            </div>
                            <button style={{ width: '100%', background: 'var(--bg)', color: 'var(--txt)', border: '2px solid var(--p-purple)', padding: '15px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--p-purple)'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--txt)'; }}>
                                <FaShoppingCart /> {lang === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}