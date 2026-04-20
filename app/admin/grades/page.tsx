// FILE: app/admin/grades/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
    FaLayerGroup, FaPlus, FaEdit, FaTrash, 
    FaGraduationCap, FaTags, FaBookOpen, FaUserTie, FaUsers 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';

// داتا وهمية ابتدائية
const initialData = [
    {
        id: 'g1',
        name: 'الصف الأول الثانوي',
        streams: [
            {
                id: 's1',
                name: 'عام',
                subjects: [
                    { id: 'sub1', name: 'فيزياء', teacherCount: 5, studentCount: 1200 },
                    { id: 'sub2', name: 'كيمياء', teacherCount: 3, studentCount: 1150 },
                    { id: 'sub3', name: 'لغة عربية', teacherCount: 4, studentCount: 1400 },
                ]
            }
        ]
    },
    {
        id: 'g2',
        name: 'الصف الثاني الثانوي',
        streams: [
            {
                id: 's2',
                name: 'علمي',
                subjects: [
                    { id: 'sub4', name: 'فيزياء', teacherCount: 4, studentCount: 800 },
                    { id: 'sub5', name: 'أحياء', teacherCount: 2, studentCount: 750 },
                ]
            },
            {
                id: 's3',
                name: 'أدبي',
                subjects: [
                    { id: 'sub6', name: 'تاريخ', teacherCount: 2, studentCount: 600 },
                    { id: 'sub7', name: 'جغرافيا', teacherCount: 3, studentCount: 550 },
                ]
            }
        ]
    }
];

export default function GradesManagement() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [grades, setGrades] = useState(initialData);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        type: 'grade' | 'stream' | 'subject';
        parentId?: string; // ID الصف أو الشعبة عشان نعرف هنضيف فين
        data?: any; // الداتا اللي بتتعدل
    }>({ isOpen: false, mode: 'add', type: 'grade' });

    const [inputValue, setInputValue] = useState('');

    useEffect(() => setMounted(true), []);

    const openModal = (mode: 'add' | 'edit', type: 'grade' | 'stream' | 'subject', parentId?: string, data?: any) => {
        setInputValue(data ? data.name : '');
        setModalConfig({ isOpen: true, mode, type, parentId, data });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, mode: 'add', type: 'grade' });
        setInputValue('');
    };

    // 💡 اللوجيك الحقيقي للإضافة والتعديل
    const handleSave = () => {
        if (!inputValue.trim()) {
            showToast('يرجى إدخال الاسم', 'error');
            return;
        }

        const newId = Math.random().toString(36).substr(2, 9); // توليد ID عشوائي

        if (modalConfig.mode === 'add') {
            if (modalConfig.type === 'grade') {
                setGrades([...grades, { id: newId, name: inputValue, streams: [] }]);
            } 
            else if (modalConfig.type === 'stream') {
                setGrades(grades.map(g => g.id === modalConfig.parentId ? { ...g, streams: [...g.streams, { id: newId, name: inputValue, subjects: [] }] } : g));
            } 
            else if (modalConfig.type === 'subject') {
                setGrades(grades.map(g => ({
                    ...g,
                    streams: g.streams.map(s => s.id === modalConfig.parentId ? { ...s, subjects: [...s.subjects, { id: newId, name: inputValue, teacherCount: 0, studentCount: 0 }] } : s)
                })));
            }
            showToast('تمت الإضافة بنجاح! ✅', 'success');
        } 
        else if (modalConfig.mode === 'edit') {
            if (modalConfig.type === 'grade') {
                setGrades(grades.map(g => g.id === modalConfig.data.id ? { ...g, name: inputValue } : g));
            } 
            else if (modalConfig.type === 'stream') {
                setGrades(grades.map(g => g.id === modalConfig.parentId ? {
                    ...g,
                    streams: g.streams.map(s => s.id === modalConfig.data.id ? { ...s, name: inputValue } : s)
                } : g));
            } 
            else if (modalConfig.type === 'subject') {
                setGrades(grades.map(g => ({
                    ...g,
                    streams: g.streams.map(s => s.id === modalConfig.parentId ? {
                        ...s,
                        subjects: s.subjects.map(sub => sub.id === modalConfig.data.id ? { ...sub, name: inputValue } : sub)
                    } : s)
                })));
            }
            showToast('تم التعديل بنجاح! 💾', 'success');
        }

        closeModal();
    };

    // 💡 اللوجيك الحقيقي للحذف
    const handleDelete = (type: 'grade' | 'stream' | 'subject', id: string, name: string, parentId?: string) => {
        if (confirm(`هل أنت متأكد من حذف (${name}) وكل ما يحتويه؟`)) {
            if (type === 'grade') {
                setGrades(grades.filter(g => g.id !== id));
            } else if (type === 'stream') {
                setGrades(grades.map(g => g.id === parentId ? { ...g, streams: g.streams.filter(s => s.id !== id) } : g));
            } else if (type === 'subject') {
                setGrades(grades.map(g => ({
                    ...g,
                    streams: g.streams.map(s => s.id === parentId ? { ...s, subjects: s.subjects.filter(sub => sub.id !== id) } : s)
                })));
            }
            showToast(`تم حذف ${name} بنجاح! 🗑️`, 'success');
        }
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaLayerGroup style={{ color: 'var(--p-purple)' }} /> شجرة المنهج الدراسي
                    </h1>
                    <p style={{ color: 'var(--txt-mut)' }}>إدارة الصفوف، الشعب الدراسية، والمواد التعليمية.</p>
                </div>
                <Button variant="primary" icon={<FaPlus />} onClick={() => openModal('add', 'grade')}>
                    إضافة صف دراسي جديد
                </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {grades.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'var(--txt-mut)', background: 'var(--card)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <h3>لا توجد صفوف دراسية مسجلة حالياً.</h3>
                    </div>
                ) : (
                    grades.map(grade => (
                        <div key={grade.id} style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '3px solid var(--p-purple)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                                        <FaGraduationCap />
                                    </div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', margin: 0 }}>{grade.name}</h2>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => openModal('add', 'stream', grade.id)}>إضافة شعبة</Button>
                                    <button onClick={() => openModal('edit', 'grade', undefined, grade)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.1rem', transition: '0.3s' }} className="hover-purple"><FaEdit /></button>
                                    <button onClick={() => handleDelete('grade', grade.id, grade.name)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', transition: '0.3s', opacity: 0.7 }} className="hover-danger"><FaTrash /></button>
                                </div>
                            </div>

                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {grade.streams.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--txt-mut)' }}>لا توجد شعب مسجلة في هذا الصف.</div>
                                ) : (
                                    grade.streams.map(stream => (
                                        <div key={stream.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)', padding: '15px' }}>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <FaTags style={{ color: 'var(--warning)' }} />
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--txt)', margin: 0 }}>شعبة: <span style={{ color: 'var(--warning)' }}>{stream.name}</span></h3>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => openModal('add', 'subject', stream.id)} style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FaPlus/> إضافة مادة</button>
                                                    <button onClick={() => openModal('edit', 'stream', grade.id, stream)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaEdit /></button>
                                                    <button onClick={() => handleDelete('stream', stream.id, stream.name, grade.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}><FaTrash /></button>
                                                </div>
                                            </div>

                                            {stream.subjects.length === 0 ? (
                                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', textAlign: 'center', padding: '10px' }}>لم يتم إضافة مواد لهذه الشعبة بعد.</div>
                                            ) : (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                                                    {stream.subjects.map(subject => (
                                                        <div key={subject.id} style={{ background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' }} className="subject-card">
                                                            <style>{`
                                                                .subject-card:hover { border-color: rgba(108,92,231,0.5); transform: translateY(-2px); }
                                                                .hover-purple:hover { color: var(--p-purple) !important; }
                                                                .hover-danger:hover { color: var(--danger) !important; opacity: 1 !important; }
                                                            `}</style>
                                                            <div>
                                                                <div style={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                                                    <FaBookOpen style={{ color: 'var(--success)' }}/> {subject.name}
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--txt-mut)', display: 'flex', gap: '10px' }}>
                                                                    <span title="عدد المدرسين للمادة"><FaUserTie /> {subject.teacherCount}</span>
                                                                    <span title="إجمالي الطلاب بالمادة"><FaUsers /> {subject.studentCount}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                                                <button onClick={() => openModal('edit', 'subject', stream.id, subject)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }} className="hover-purple"><FaEdit size={14} /></button>
                                                                <button onClick={() => handleDelete('subject', subject.id, subject.name, stream.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }} className="hover-danger"><FaTrash size={14} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal 
                isOpen={modalConfig.isOpen} 
                onClose={closeModal} 
                title={`${modalConfig.mode === 'add' ? 'إضافة' : 'تعديل'} ${modalConfig.type === 'grade' ? 'صف دراسي' : modalConfig.type === 'stream' ? 'شعبة' : 'مادة'}`} 
                maxWidth="400px"
            >
                <div style={{ padding: '10px 0' }}>
                    <Input 
                        label={`اسم الـ ${modalConfig.type === 'grade' ? 'الصف' : modalConfig.type === 'stream' ? 'شعبة' : 'مادة'} باللغة العربية`} 
                        placeholder={modalConfig.type === 'grade' ? "مثال: الصف الأول الثانوي" : modalConfig.type === 'stream' ? "مثال: علمي رياضة" : "مثال: كيمياء"} 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSave() }}
                    />
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <Button variant="primary" fullWidth onClick={handleSave}>حفظ البيانات</Button>
                        <Button variant="outline" fullWidth onClick={closeModal}>إلغاء</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}