"use client";
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// 🚀 استدعاء أيقونة التقارير (FaChartBar)
import { FaGripVertical, FaCog, FaFilePdf, FaLink, FaChartBar } from 'react-icons/fa'; 
import { LectureItem as LectureItemType } from '../types/curriculum.types';
import { getIconForType } from '../utils/icon.utils';
import styles from '../styles/builder.module.css';

interface Props {
    item: LectureItemType;
    onOpenSettings: (item: LectureItemType) => void;
    // 🚀 ضفنا الدالة اللي بتفتح مودال التقارير
    onOpenReports?: (item: LectureItemType) => void; 
}

export const LectureItem: React.FC<Props> = ({ item, onOpenSettings, onOpenReports }) => {
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

            {/* 🚀 قسم الأزرار (التقارير + الإعدادات) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                
                {/* زرار التقارير اللي بيفتح الـ Modal */}
                {onOpenReports && (
                    <button 
                        onClick={() => onOpenReports(item)}
                        style={{ background: 'rgba(241, 196, 15, 0.1)', border: 'none', color: '#f1c40f', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', transition: '0.2s' }}
                        title="التقارير والإحصائيات"
                    >
                        <FaChartBar /> التقارير
                    </button>
                )}

                {/* زرار الإعدادات الأساسي */}
                <button onClick={() => onOpenSettings(item)} className={styles.iconBtn}>
                    <FaCog />
                </button>
            </div>
        </div>
    );
};