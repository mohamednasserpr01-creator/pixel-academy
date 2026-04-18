// FILE: app/courses/[id]/lecture/[lectureId]/page.tsx
"use client";
import React, { useState, useEffect, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

// 💡 تم تعديل كل المسارات هنا لـ 5 مستويات للخلف فقط لتطابق الشجرة الجديدة
import { useSettings } from '../../../../../context/SettingsContext';
import { lectureService } from '../../../../../services/lectureService';
import { PlaylistItem } from '../../../../../types'; 

import LectureSidebar from '../../../../../components/lecture/LectureSidebar/LectureSidebar';
import { Skeleton } from '../../../../../components/ui/Skeleton';
import './LectureRoom.css';

const VideoPlayer = dynamic(
    () => import('../../../../../components/lecture/VideoPlayer/VideoPlayer'), 
    { 
        ssr: false, 
        loading: () => <Skeleton variant="rectangular" height="400px" /> 
    }
);

const LectureChat = dynamic(
    () => import('../../../../../components/lecture/LectureChat/LectureChat'), 
    { 
        ssr: false, 
        loading: () => <Skeleton variant="rectangular" height="350px" /> 
    }
);

const LectureContent = dynamic(
    () => import('../../../../../components/lecture/LectureContent/LectureContent'), 
    { 
        ssr: false, 
        loading: () => <Skeleton variant="rectangular" height="400px" /> 
    }
);

export default function LectureRoom({ params }: { params: Promise<{ id: string, lectureId: string }> }) {
    const resolvedParams = use(params);
    const courseId = resolvedParams.id;
    const lectureId = resolvedParams.lectureId;

    const { lang } = useSettings();
    const [activeItem, setActiveItem] = useState<PlaylistItem | null>(null);

    const { data: lecture, isLoading, isError } = useQuery({
        queryKey: ['lecture', courseId, lectureId],
        queryFn: () => lectureService.getLecture(courseId, lectureId),
    });

    useEffect(() => {
        if (lecture && !activeItem) {
            const firstActive = lecture.playlist.find((i: PlaylistItem) => i.status === 'active' || i.status === 'available' || i.status === 'completed');
            setActiveItem(firstActive || lecture.playlist[0]);
        }
    }, [lecture, activeItem]);

    if (isLoading || !activeItem) return (
        <main className="page-wrapper" style={{ paddingTop: '40px' }}>
            <div className="lecture-page-container">
                <div className="lecture-sidebar-area">
                    <Skeleton variant="rectangular" height="500px" />
                </div>
                <div className="lecture-main-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Skeleton variant="rectangular" height="400px" />
                    <div style={{ marginBottom: '10px' }}>
                        <Skeleton variant="text" height="40px" width="60%" />
                    </div>
                    <Skeleton variant="text" height="20px" width="100%" />
                    <Skeleton variant="text" height="20px" width="80%" />
                </div>
            </div>
        </main>
    );

    if (isError || !lecture) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h2 style={{ color: 'var(--danger)' }}>
                {lang === 'ar' ? 'عفواً، حدث خطأ أثناء تحميل المحاضرة.' : 'Oops, failed to load lecture.'}
            </h2>
        </main>
    );

    return (
        <main className="page-wrapper" style={{ paddingTop: '40px' }}>
            <div className="lecture-page-container">
                
                {/* 1. القائمة الجانبية (يمين الشاشة) */}
                <div className="lecture-sidebar-area">
                    <LectureSidebar lecture={lecture} activeItem={activeItem} setActiveItem={setActiveItem} lang={lang} />
                </div>

                {/* 2. مساحة العرض الرئيسية (يسار الشاشة) */}
                <div className="lecture-main-area">
                    
                    {activeItem.type === 'video' && activeItem.status !== 'locked' ? (
                        <VideoPlayer activeItem={activeItem} studentName={lecture.studentName} />
                    ) : (
                        <LectureContent activeItem={activeItem} lang={lang} />
                    )}

                    <div className="lecture-details" style={{ marginTop: '25px', background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(108,92,231,0.1)' }}>
                        <h1 style={{ marginBottom: '15px', color: 'var(--p-purple)', fontSize: '1.6rem', fontWeight: 900 }}>
                            {lang === 'ar' ? activeItem.titleAr : activeItem.titleEn}
                        </h1>
                        <p style={{ opacity: 0.9, lineHeight: 1.8, fontWeight: 700, color: 'var(--txt)' }}>
                            {lang === 'ar' ? lecture.descAr : lecture.descEn}
                        </p>
                    </div>

                    <LectureChat lang={lang} />
                    
                </div>
            </div>
        </main>
    );
}