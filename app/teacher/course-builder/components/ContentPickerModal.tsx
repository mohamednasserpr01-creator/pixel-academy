"use client";
import React, { useState } from 'react';
import { FaBookOpen, FaTimes, FaSearch, FaFilePdf, FaLink } from 'react-icons/fa';
import { LectureItem } from '../types/curriculum.types';
import { getIconForType } from '../utils/icon.utils';

// 💡 (في المستقبل دي هتيجي من الـ API)
const mockLibrary: Partial<LectureItem>[] = [
    { id: 'lib-1', type: 'lesson', title: 'حصة: قوانين كيرشوف', hasPdf: true, hasRef: true },
    { id: 'lib-2', type: 'homework', title: 'واجب: الباب الأول كامل' },
    { id: 'lib-3', type: 'exam', title: 'امتحان: شامل على الكهربية' },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: Partial<LectureItem>) => void;
}

export const ContentPickerModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    if (!isOpen) return null;

    const filteredLibrary = mockLibrary.filter(item => {
        const matchSearch = item.title!.includes(search);
        const matchFilter = filter === 'all' || item.type === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: '#1e1e2d', width: '100%', maxWidth: '600px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaBookOpen color="var(--p-purple)"/> مكتبة المحتوى</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaTimes size={20}/></button>
                </div>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <input type="text" placeholder="ابحث باسم الحصة..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '15px' }} />
                </div>
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {filteredLibrary.map(item => (
                        <div key={item.id} onClick={() => { onSelect(item); onClose(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {getIconForType(item.type!)} 
                                <span style={{ color: 'white' }}>{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};  