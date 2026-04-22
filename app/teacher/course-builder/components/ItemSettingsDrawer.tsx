"use client";
import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaLock, FaEye, FaCertificate } from 'react-icons/fa';
import { Lecture, LectureItem } from '../types/curriculum.types';
import { CustomSelect } from './CustomSelect';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: LectureItem | null;
    curriculum: Lecture[];
    onSave: (itemId: string, updates: Partial<LectureItem>) => void;
}

export const ItemSettingsDrawer: React.FC<Props> = ({ isOpen, onClose, item, curriculum, onSave }) => {
    // 💡 استخدام حالة محلية (Local State) عشان نعدل براحتنا قبل ما ندوس حفظ
    const [prereqType, setPrereqType] = useState('none');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedHw, setSelectedHw] = useState('');
    const [altExam, setAltExam] = useState('none');
    const [viewsLimit, setViewsLimit] = useState(3);
    const [passScore, setPassScore] = useState(50);

    // تحديث الحالة لما نفتح عنصر جديد
    useEffect(() => {
        if (item) {
            setPrereqType(item.prerequisite?.type || 'none');
            setSelectedExam(item.prerequisite?.type === 'specific_exam' ? item.prerequisite.targetId || '' : '');
            setSelectedHw(item.prerequisite?.type === 'specific_hw' ? item.prerequisite.targetId || '' : '');
            setAltExam(item.altExamId || 'none');
            setViewsLimit(item.viewsLimit || 3);
            setPassScore(item.passScore || 50);
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const courseExams = curriculum.flatMap(l => l.items).filter(i => i.type === 'exam');
    const courseHomeworks = curriculum.flatMap(l => l.items).filter(i => i.type === 'homework');

    const handleSave = () => {
        onSave(item.id, {
            viewsLimit,
            passScore,
            altExamId: altExam === 'none' ? undefined : altExam,
            prerequisite: {
                type: prereqType as any,
                targetId: prereqType === 'specific_exam' ? selectedExam : prereqType === 'specific_hw' ? selectedHw : undefined
            }
        });
        onClose();
    };

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 99998, animation: 'fadeIn 0.2s ease' }} />
            
            <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '450px', maxWidth: '100%', background: '#1e1e2d', borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 99999, boxShadow: '10px 0 50px rgba(0,0,0,0.8)', padding: '30px', transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflowY: 'auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaCog color="var(--txt-mut)"/> إعدادات المحتوى</h3>
                        <p style={{ margin: 0, color: 'var(--p-purple)', fontSize: '0.9rem', fontWeight: 'bold' }}>{item.title}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--txt-mut)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {/* شرط الفتح */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '10px', fontSize: '0.95rem' }}><FaLock color="#e74c3c"/> شرط فتح المحتوى</label>
                        <CustomSelect 
                            value={prereqType} onChange={setPrereqType} 
                            options={[
                                { value: 'none', label: 'بدون شروط (متاح فوراً)' },
                                { value: 'prev', label: 'بعد مشاهدة/إكمال العنصر السابق' },
                                { value: 'specific_exam', label: 'بعد النجاح في امتحان معين' },
                                { value: 'specific_hw', label: 'بعد تسليم واجب معين' }
                            ]} 
                        />
                        {prereqType === 'specific_exam' && (
                            <div style={{ marginTop: '15px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>اختر الامتحان المطلوب:</span>
                                <CustomSelect value={selectedExam} onChange={setSelectedExam} options={courseExams.map(ex => ({ value: ex.id, label: ex.title }))} />
                            </div>
                        )}
                        {prereqType === 'specific_hw' && (
                            <div style={{ marginTop: '15px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>اختر الواجب المطلوب تسليمه:</span>
                                <CustomSelect value={selectedHw} onChange={setSelectedHw} options={courseHomeworks.map(hw => ({ value: hw.id, label: hw.title }))} />
                            </div>
                        )}
                    </div>

                    {/* إعدادات الفيديو */}
                    {(item.type === 'lesson' || item.type === 'homework_lesson') && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '10px', fontSize: '0.95rem' }}><FaEye color="#3498db"/> عدد المشاهدات المسموحة</label>
                            <input type="number" value={viewsLimit} onChange={(e) => setViewsLimit(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    )}

                    <button onClick={handleSave} style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        حفظ الإعدادات والتأكيد
                    </button>
                </div>
            </div>
        </>
    );
};