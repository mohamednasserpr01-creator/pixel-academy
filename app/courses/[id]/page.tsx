"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// استدعاء الخدمات والبيانات المركزية
import { useSettings } from '../../../../context/SettingsContext';
import { courseService } from '../../../../services/courseService';
import { Lecture } from '../../../../types';

// استدعاء أجزاء المحاضرة
import VideoPlayer from '../../../../components/lecture/VideoPlayer';
import LectureSidebar from '../../../../components/lecture/LectureSidebar';

export default function LecturePage() {
    const params = useParams();
    const courseId = params.id as string;
    const lectureId = params.lectureId as string;
    
    const { lang } = useSettings();
    
    // حالة البيانات
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
    const [loading, setLoading] = useState(true);

    // سحب البيانات من الـ Service أول ما الصفحة تفتح
    useEffect(() => {
        const fetchLectureData = async () => {
            try {
                // هنجيب كل محاضرات الكورس ده عشان القائمة الجانبية
                const courseLectures = await courseService.getCourseLectures(courseId);
                setLectures(courseLectures);
                
                // هنفلتر عشان نجيب المحاضرة اللي الطالب واقف عليها دلوقتي
                const activeLecture = courseLectures.find(lec => lec.id === lectureId);
                if (activeLecture) setCurrentLecture(activeLecture);
                
            } catch (error) {
                console.error("خطأ في جلب المحاضرة:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLectureData();
    }, [courseId, lectureId]);

    // 💡 شاشة تحميل احترافية (Spinner)
    if (loading) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </main>
    );

    // 💡 رسالة خطأ شيك لو المحاضرة مش موجودة
    if (!currentLecture) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h2 style={{ color: 'var(--txt-mut)' }}>{lang === 'ar' ? 'المحاضرة غير موجودة أو تم حذفها' : 'Lecture not found'}</h2>
        </main>
    );

    return (
        // 💡 الكلاس الموحد بيحمي الصفحة كلها من التداخل
        <main className="page-wrapper">
            
            <div className="lecture-layout" style={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'flex-start' }}>
                
                {/* الجزء الأول: مساحة الفيديو ومعلومات المحاضرة (بياخد 3 أضعاف المساحة) */}
                <section className="main-content" style={{ flex: '3', minWidth: 0 }}>
                    <VideoPlayer videoUrl={currentLecture.videoUrl} />
                    
                    <div className="lecture-info" style={{ marginTop: '20px', background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(108,92,231,0.1)', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                        <h1 style={{ marginBottom: '15px', color: 'var(--p-purple)', fontSize: '1.8rem', fontWeight: 900 }}>
                            {lang === 'ar' ? currentLecture.titleAr : currentLecture.titleEn}
                        </h1>
                        <div style={{ display: 'flex', gap: '20px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>
                            <span>{lang === 'ar' ? 'مدة المحاضرة:' : 'Duration:'} {currentLecture.duration}</span>
                            {/* تقدر تضيف هنا أي معلومات تانية زي عدد المشاهدات أو تاريخ النشر */}
                        </div>
                    </div>
                </section>

                {/* الجزء التاني: القائمة الجانبية (بياخد ضعف واحد) */}
                <section className="sidebar-content" style={{ flex: '1', minWidth: '300px', position: 'sticky', top: '100px' }}>
                    <LectureSidebar 
                        lectures={lectures} 
                        currentLectureId={lectureId} 
                        courseId={courseId} 
                        lang={lang} 
                    />
                </section>
            </div>

            {/* 💡 الحل الجذري للموبايل بدون استخدام jsx */}
            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 992px) {
                    .lecture-layout { flex-direction: column !important; }
                    .main-content { width: 100% !important; flex: auto !important; }
                    .sidebar-content { width: 100% !important; flex: auto !important; position: static !important; margin-top: 20px; }
                }
            `}} />
            
        </main>
    );
}