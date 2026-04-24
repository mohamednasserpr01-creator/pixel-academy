"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaArrowRight, FaSave, FaBookOpen, FaTags, 
    FaChartPie, FaWhatsapp, FaCheck, FaPlus 
} from 'react-icons/fa';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useCurriculum } from '@/features/course-builder/hooks/useCurriculum';
import { LectureCard } from '@/features/course-builder/components/LectureCard';
import { ItemSettingsDrawer } from '@/features/course-builder/components/ItemSettingsDrawer';
import { ContentPickerModal } from '@/features/course-builder/components/ContentPickerModal';
import { PricingTab } from '@/features/course-builder/components/PricingTab'; 
import { StudentsTab } from '@/features/course-builder/components/StudentsTab'; 

import { ItemReportsModal } from '@/features/course-builder/components/ItemReportsModal'; 
import { LectureReportsModal } from '@/features/course-builder/components/LectureReportsModal'; 
import { ItemGradingModal } from '@/features/course-builder/components/ItemGradingModal'; 

// 🚀 استدعاء محرك الإشعارات
import { NotificationsTab } from '@/features/course-builder/components/NotificationsTab';

import { Lecture, LectureItem as LectureItemType } from '@/features/course-builder/types/curriculum.types';

const initialData: Lecture[] = [
    { 
        id: 'lec-1', 
        title: 'المحاضرة الأولى: أساسيات الكهربية', 
        items: [
            { id: 'item-1', type: 'lesson', title: 'حصة: شرح قانون أوم', viewsLimit: 3, hasPdf: true },
            { id: 'item-2', type: 'homework', title: 'واجب: تدريبات على القانون' }
        ] 
    },
    { 
        id: 'lec-2', 
        title: 'المحاضرة الثانية: قوانين كيرشوف', 
        items: [
            { id: 'item-3', type: 'lesson', title: 'حصة: كيرشوف الأول' }
        ] 
    }
];

export default function CourseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'curriculum' | 'pricing' | 'students' | 'notifications'>('curriculum');
    
    const { 
        curriculum, addLecture, updateLecture,
        addItem, updateItem, reorderItems, moveItemBetweenLectures 
    } = useCurriculum(initialData);

    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [settingsItem, setSettingsItem] = useState<{ lectureId: string, item: LectureItemType } | null>(null);
    
    const [reportItem, setReportItem] = useState<LectureItemType | null>(null);
    const [reportLecture, setReportLecture] = useState<Lecture | null>(null);
    const [gradingItem, setGradingItem] = useState<LectureItemType | null>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let sourceLectureId = '';
        let sourceIndex = -1;
        curriculum.forEach((lec: Lecture) => {
            const index = lec.items.findIndex((i: LectureItemType) => i.id === activeId);
            if (index !== -1) { sourceLectureId = lec.id; sourceIndex = index; }
        });

        let targetLectureId = '';
        let targetIndex = -1;
        curriculum.forEach((lec: Lecture) => {
            const index = lec.items.findIndex((i: LectureItemType) => i.id === overId);
            if (index !== -1) { targetLectureId = lec.id; targetIndex = index; }
        });

        if (sourceLectureId === targetLectureId) {
            reorderItems(sourceLectureId, sourceIndex, targetIndex);
        } else if (sourceLectureId && targetLectureId) {
            moveItemBetweenLectures(sourceLectureId, targetLectureId, activeId, targetIndex);
        }
    };

    const stats = {
        lectures: curriculum.length,
        lessons: curriculum.flatMap((l: Lecture) => l.items).filter((i: LectureItemType) => i.type === 'lesson').length,
        exams: curriculum.flatMap((l: Lecture) => l.items).filter((i: LectureItemType) => i.type === 'exam').length,
    };

    if (!isMounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', marginTop: '30px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/teacher/courses')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.6rem', margin: '0 0 5px 0', color: 'var(--txt)', fontWeight: 'bold' }}>كورس المراجعة النهائية (فيزياء)</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                            <span style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheck size={12}/> منشور</span>
                            <span>•</span>
                            <span>ID: {resolvedParams.id}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaSave size={18} /> حفظ التعديلات
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)', marginBottom: '30px' }}>
                <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>📚 المحاضرات: <strong style={{ color: 'white' }}>{stats.lectures}</strong></div>
                <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>▶️ الحصص: <strong style={{ color: 'white' }}>{stats.lessons}</strong></div>
                <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>🧪 الامتحانات: <strong style={{ color: 'white' }}>{stats.exams}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', overflowX: 'auto' }}>
                {[ 
                    { id: 'curriculum', label: 'المنهج', icon: <FaBookOpen /> }, 
                    { id: 'pricing', label: 'التسعير', icon: <FaTags /> }, 
                    { id: 'students', label: 'الطلاب', icon: <FaChartPie /> }, 
                    { id: 'notifications', label: 'الإشعارات', icon: <FaWhatsapp /> } 
                ].map((tab) => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)} 
                        style={{ 
                            background: 'transparent', border: 'none', 
                            borderBottom: activeTab === tab.id ? '3px solid var(--p-purple)' : '3px solid transparent', 
                            padding: '0 0 15px 0', color: activeTab === tab.id ? 'var(--txt)' : 'var(--txt-mut)', 
                            cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal', 
                            fontSize: '1rem', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' 
                        }}
                    >
                        <span style={{ color: activeTab === tab.id ? 'var(--p-purple)' : 'inherit' }}>{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'curriculum' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <button onClick={() => addLecture()} style={{ width: '100%', background: 'transparent', border: '2px dashed rgba(255,255,255,0.1)', color: 'var(--txt)', padding: '15px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--p-purple)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                            <FaPlus color="var(--p-purple)" /> إضافة محاضرة جديدة
                        </button>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            {curriculum.map((lecture: Lecture) => (
                                <LectureCard 
                                    key={lecture.id} 
                                    lecture={lecture} 
                                    onUpdateLecture={updateLecture}
                                    onOpenContentPicker={(lecId: string) => setActiveLectureId(lecId)}
                                    onOpenSettings={(item: LectureItemType) => setSettingsItem({ lectureId: lecture.id, item })}
                                    onOpenReports={(item: LectureItemType) => setReportItem(item)}
                                    onOpenLectureReports={(lec: Lecture) => setReportLecture(lec)}
                                    onOpenGrading={(item: LectureItemType) => setGradingItem(item)}
                                />
                            ))}
                        </DndContext>
                    </div>
                )}

                {activeTab === 'pricing' && <PricingTab curriculum={curriculum} />}
                {activeTab === 'students' && <StudentsTab courseId={resolvedParams.id} curriculum={curriculum} />}
                
                {/* 🚀 حقن المحرك هنا بدل قيد الإنشاء */}
                {activeTab === 'notifications' && <NotificationsTab curriculum={curriculum} />}
            </div>

            <ContentPickerModal isOpen={!!activeLectureId} onClose={() => setActiveLectureId(null)} onSelect={(item: Partial<LectureItemType>) => { if (activeLectureId) addItem(activeLectureId, { ...item, id: `new-${Date.now()}` } as LectureItemType); }} />
            <ItemSettingsDrawer isOpen={!!settingsItem} onClose={() => setSettingsItem(null)} item={settingsItem?.item || null} curriculum={curriculum} onSave={(itemId: string, updates: Partial<LectureItemType>) => { if (settingsItem) updateItem(settingsItem.lectureId, itemId, updates); }} />
            <ItemReportsModal isOpen={!!reportItem} onClose={() => setReportItem(null)} item={reportItem} />
            <LectureReportsModal isOpen={!!reportLecture} onClose={() => setReportLecture(null)} lecture={reportLecture} />
            <ItemGradingModal isOpen={!!gradingItem} onClose={() => setGradingItem(null)} item={gradingItem} />

        </div>
    );
}