"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../../components/layout/Navbar'; // تأكد من مسار الناف بار
import Footer from '../../../../components/layout/Footer'; // تأكد من مسار الفوتر

// استدعاء الخدمات والبيانات المركزية
import { useSettings } from '../../../../context/SettingsContext';
import { courseService } from '../../../../services/courseService';
import { Lecture } from '../../../../types';

// استدعاء أجزاء المحاضرة اللي لسه عاملينها
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

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>جاري التحميل...</div>;
    if (!currentLecture) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>المحاضرة غير موجودة</div>;

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div className="lecture-layout" style={{ flex: 1, padding: '100px 5% 50px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                
                {/* الجزء اليمين (أو الشمال حسب اللغة): مساحة الفيديو ومعلومات المحاضرة */}
                <section className="main-content">
                    <VideoPlayer videoUrl={currentLecture.videoUrl} />
                    
                    <div className="lecture-info" style={{ marginTop: '20px', background: 'var(--card)', padding: '25px', borderRadius: '15px' }}>
                        <h1 style={{ marginBottom: '15px', color: 'var(--p-purple)' }}>
                            {lang === 'ar' ? currentLecture.titleAr : currentLecture.titleEn}
                        </h1>
                        <p style={{ color: 'var(--txt-mut)' }}>مدة المحاضرة: {currentLecture.duration}</p>
                        {/* هنا ممكن تحط Component تاني للـ Chat أو المرفقات (LectureChat / LectureInfo) */}
                    </div>
                </section>

                {/* الجزء التاني: القائمة الجانبية */}
                <section className="sidebar-content">
                    <LectureSidebar 
                        lectures={lectures} 
                        currentLectureId={lectureId} 
                        courseId={courseId} 
                        lang={lang} 
                    />
                </section>
            </div>

            <Footer />

            {/* ستايل الموبايل عشان الشاشة متضربش */}
            <style jsx>{`
                @media (max-width: 992px) {
                    .lecture-layout { grid-template-columns: 1fr !important; padding-top: 80px !important; }
                    .sidebar-content { order: 2; } /* القائمة تنزل تحت الفيديو في الموبايل */
                }
            `}</style>
        </main>
    );
}