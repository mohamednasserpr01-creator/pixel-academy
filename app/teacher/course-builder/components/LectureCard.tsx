"use client";
import React, { useState } from 'react';
import { FaBookOpen, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lecture, LectureItem as LectureItemType } from '../types/curriculum.types';
import { LectureItem } from './LectureItem';
import styles from '../styles/builder.module.css'; // 💡 استدعاء ملف الـ CSS

interface Props {
    lecture: Lecture;
    onUpdateTitle: (lectureId: string, newTitle: string) => void;
    onOpenContentPicker: (lectureId: string) => void;
    onOpenSettings: (item: LectureItemType) => void;
}

export const LectureCard: React.FC<Props> = ({ lecture, onUpdateTitle, onOpenContentPicker, onOpenSettings }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(lecture.title);

    const handleTitleSave = () => {
        setIsEditing(false);
        if (title.trim() !== '' && title !== lecture.title) {
            onUpdateTitle(lecture.id, title);
        } else {
            setTitle(lecture.title);
        }
    };

    return (
        <div className={styles.cardWrapper}>
            {/* 🖊️ هيدر المحاضرة */}
            <div className={styles.cardHeader}>
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

                <div className={styles.cardControls}>
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