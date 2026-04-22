"use client";
import React, { useState } from 'react';
import { FaBookOpen, FaChevronDown, FaChevronUp, FaPlus, FaLock } from 'react-icons/fa';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lecture, LectureItem as LectureItemType } from '../types/curriculum.types';
import { LectureItem } from './LectureItem';
import styles from '../styles/builder.module.css';

interface Props {
    lecture: Lecture;
    onUpdateLecture: (lectureId: string, updates: Partial<Lecture>) => void; // 🚀 تم تعديل الـ Prop
    onOpenContentPicker: (lectureId: string) => void;
    onOpenSettings: (item: LectureItemType) => void;
}

export const LectureCard: React.FC<Props> = ({ lecture, onUpdateLecture, onOpenContentPicker, onOpenSettings }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(lecture.title);

    const handleTitleSave = () => {
        setIsEditing(false);
        if (title.trim() !== '' && title !== lecture.title) {
            onUpdateLecture(lecture.id, { title }); // 🚀 إرسال التعديل للـ Hook
        } else {
            setTitle(lecture.title);
        }
    };

    return (
        <div className={styles.cardWrapper}>
            {/* 🖊️ هيدر المحاضرة */}
            <div className={styles.cardHeader}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
                    <div className={styles.cardTitleSection}>
                        <FaBookOpen style={{ color: 'var(--p-purple)' }} size={20} />
                        {isEditing ? (
                            <input 
                                autoFocus value={title} onChange={(e) => setTitle(e.target.value)} 
                                onBlur={handleTitleSave} onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} 
                                className={styles.titleInput}
                            />
                        ) : (
                            <h3 onClick={() => setIsEditing(true)} className={styles.titleText}>
                                {title}
                            </h3>
                        )}
                    </div>
                    
                    {/* 🚀 زرار إجبار المحاضرة السابقة */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', paddingRight: '28px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: lecture.requirePrevious ? '#e74c3c' : 'var(--txt-mut)' }}>
                            <input 
                                type="checkbox" 
                                checked={!!lecture.requirePrevious} 
                                onChange={(e) => onUpdateLecture(lecture.id, { requirePrevious: e.target.checked })}
                            />
                            إجبار اجتياز المحاضرة السابقة أولاً
                        </label>
                        {lecture.requirePrevious && (
                            <span style={{ fontSize: '0.7rem', color: '#f39c12', background: 'rgba(243, 156, 18, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                (لا يُطبق عند الشراء المنفصل)
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.cardControls} style={{ alignSelf: 'flex-start', marginTop: '5px' }}>
                    <span className={styles.itemsCount}>{lecture.items.length} عناصر</span>
                    <button onClick={() => setIsExpanded(!isExpanded)} className={styles.iconBtn} style={{ borderRadius: '50%' }}>
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>

            {/* 📜 محتوى المحاضرة */}
            {isExpanded && (
                <div className={styles.cardBody}>
                    <SortableContext items={lecture.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {lecture.items.map((item) => (
                            <LectureItem key={item.id} item={item} onOpenSettings={onOpenSettings} />
                        ))}
                    </SortableContext>

                    <button onClick={() => onOpenContentPicker(lecture.id)} className={styles.addContentBtn}>
                        <FaPlus /> إضافة محتوى للمحاضرة
                    </button>
                </div>
            )}
        </div>
    );
};