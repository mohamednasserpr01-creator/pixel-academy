// FILE: app/teacher/homework/[id]/page.tsx
"use client";
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaListOl, FaPlus, FaTrash, FaSave, FaFilePdf } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { useToast } from '../../../../context/ToastContext';

export default function HomeworkBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings');
    const [hwTitle, setHwTitle] = useState('واجب الباب الأول');
    const [hwDescription, setHwDescription] = useState('يجب حل هذا الواجب قبل الدخول للحصة القادمة.');
    const [hwFile, setHwFile] = useState('');

    const [questions, setQuestions] = useState([
        { id: 1, type: 'text', text: '', score: 5 } // text = مقالي (الطالب يرفع صورة/يكتب)، choice = اختياري
    ]);

    const handleAddQuestion = (type: 'text' | 'choice') => {
        setQuestions([...questions, { id: Date.now(), type, text: '', score: 1 }]);
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/homework')} icon={<FaArrowRight />}>الرجوع</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>
                    مُنشئ الواجبات: <span style={{ color: 'var(--p-purple)' }}>{hwTitle}</span>
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings')}><FaCog /> إعدادات الواجب</button>
                    <button onClick={() => setActiveTab('questions')} style={getTabStyle(activeTab === 'questions')}><FaListOl /> أسئلة الواجب</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    
                    {activeTab === 'settings' && (
                        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h2 style={{ color: 'var(--txt)', margin: 0 }}>الإعدادات العامة للواجب</h2>
                            <Input label="اسم الواجب" value={hwTitle} onChange={e => setHwTitle(e.target.value)} />
                            
                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontWeight: 'bold' }}>وصف الواجب وملاحظات للطالب</label>
                                <textarea value={hwDescription} onChange={e => setHwDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none' }}></textarea>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontWeight: 'bold' }}>إرفاق ملف للواجب (اختياري - Sheet مثلاً)</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(108,92,231,0.1)', border: '1px dashed var(--p-purple)', padding: '15px', borderRadius: '10px', color: 'var(--p-purple)', cursor: 'pointer', width: 'max-content' }}>
                                    <FaFilePdf /> {hwFile || 'اضغط لرفع ملف'}
                                    <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setHwFile(e.target.files?.[0]?.name || '')} />
                                </label>
                            </div>

                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم حفظ إعدادات الواجب', 'success')}>حفظ الإعدادات</Button>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>أسئلة الواجب</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => handleAddQuestion('text')}>سؤال مقالي</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => handleAddQuestion('choice')}>سؤال اختياري</Button>
                                </div>
                            </div>

                            {questions.map((q, qIndex) => (
                                <div key={q.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', padding: '25px', marginBottom: '25px', position: 'relative' }}>
                                    <button onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><FaTrash /></button>
                                    
                                    <h4 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>{q.type === 'text' ? 'سؤال مقالي (يرفع الطالب صورة للحل)' : 'سؤال اختياري'}</h4>
                                    
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ flex: 3 }}><Input label="نص السؤال" value={q.text} onChange={e => { const n = [...questions]; n[qIndex].text = e.target.value; setQuestions(n); }} /></div>
                                        <div style={{ flex: 1 }}><Input label="الدرجة" type="number" value={q.score.toString()} onChange={e => { const n = [...questions]; n[qIndex].score = Number(e.target.value); setQuestions(n); }} /></div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="primary" icon={<FaSave />} onClick={() => showToast('تم حفظ الأسئلة بنجاح!', 'success')}>حفظ الأسئلة</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', 
    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? 'rgba(108,92,231,0.1)' : 'transparent', color: isActive ? 'var(--p-purple)' : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? '4px solid var(--p-purple)' : '4px solid transparent'
});