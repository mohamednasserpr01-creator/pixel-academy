import React from 'react';
import { FaLock, FaCheck, FaPlay, FaClipboardCheck, FaPencilAlt, FaFilePdf } from 'react-icons/fa';
import { LectureData, PlaylistItem } from '../../../types';

interface Props {
    lecture: LectureData;
    activeItem: PlaylistItem;
    setActiveItem: (item: PlaylistItem) => void;
    lang: string;
}

export default function LectureSidebar({ lecture, activeItem, setActiveItem, lang }: Props) {
    const getIcon = (type: string) => { 
        switch(type) { 
            case 'exam': return <FaClipboardCheck />; 
            case 'video': return <FaPlay />; 
            case 'homework': return <FaPencilAlt />; 
            case 'pdf': return <FaFilePdf />; 
            default: return <FaPlay />; 
        } 
    };

    return (
        <aside className="playlist-sidebar">
            <div className="playlist-header">
                <h3>{lang === 'ar' ? 'محتويات المحاضرة' : 'Lecture Content'}</h3>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.8 }}>
                    {lang === 'ar' ? 'نسبة الإنجاز:' : 'Progress:'} 12%
                </div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: '12%' }}></div>
                </div>
            </div>
            <div className="playlist-items">
                {lecture.playlist.map((item) => (
                    <div 
                        key={item.id} 
                        className={`pl-item ${item.status} ${activeItem.id === item.id ? 'active' : ''}`}
                        onClick={() => { if(item.status !== 'locked') setActiveItem(item); }}
                    >
                        <div className="pl-icon">
                            {item.status === 'locked' ? <FaLock /> : (item.status === 'completed' ? <FaCheck /> : getIcon(item.type))}
                        </div>
                        <div className="pl-info">
                            <h4>{lang === 'ar' ? item.titleAr : item.titleEn} {item.isReq && <span className="req-badge">{lang === 'ar' ? 'إجباري' : 'Req'}</span>}</h4>
                            <span className="pl-meta">
                                {item.status === 'locked' ? (lang === 'ar' ? 'مغلق' : 'Locked') : 
                                (item.status === 'completed' ? (lang === 'ar' ? 'تم الاجتياز' : 'Completed') : 
                                (item.time ? `${item.time} ${lang === 'ar' ? 'دقيقة' : 'Mins'}` : (lang === 'ar' ? 'متاح الآن' : 'Available')))}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}