"use client";
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaGripVertical, FaCog, FaFilePdf, FaLink } from 'react-icons/fa';
import { LectureItem as LectureItemType } from '../types/curriculum.types';
import { getIconForType } from '../utils/icon.utils';
import styles from '../styles/builder.module.css'; // 💡 استدعاء ملف الـ CSS

interface Props {
    item: LectureItemType;
    onOpenSettings: (item: LectureItemType) => void;
}

export const LectureItem: React.FC<Props> = ({ item, onOpenSettings }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    
    const dndStyle = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={dndStyle} className={styles.itemWrapper}>
            <div className={styles.itemLeft}>
                <div {...attributes} {...listeners} className={styles.dragHandle}>
                    <FaGripVertical />
                </div>
                
                <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>
                        {getIconForType(item.type)} {item.title}
                    </span>
                    
                    <div className={styles.badges}>
                        {item.hasPdf && <span className={`${styles.badge} ${styles.badgePdf}`}><FaFilePdf /> PDF</span>}
                        {item.hasRef && <span className={`${styles.badge} ${styles.badgeRef}`}><FaLink /> مراجع</span>}
                    </div>
                </div>
            </div>

            <button onClick={() => onOpenSettings(item)} className={styles.iconBtn}>
                <FaCog />
            </button>
        </div>
    );
};