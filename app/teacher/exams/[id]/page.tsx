// FILE: app/teacher/exams/[id]/page.tsx
"use client";
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaListOl, FaPlus, FaSave } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../context/ToastContext';

import { useExamBuilder } from '../../../../features/teacherExams/hooks/useExamReducer';
import ExamSettings from '../../../../features/teacherExams/components/ExamSettings';
import { QuestionCard } from '../../../../features/teacherExams/components/QuestionCard';

export default function ExamBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings');
    const { state, dispatch } = useExamBuilder();

    const handleSaveExam = () => {
        console.log("Exam Data:", state);
        showToast('تم حفظ الامتحان وإعدادات العشوائية بنجاح!', 'success');
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/exams')} icon={<FaArrowRight />}>الرجوع</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>مُنشئ الامتحانات: <span style={{ color: 'var(--p-purple)' }}>{state.title}</span></h1>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings')}><FaCog /> إعدادات الامتحان</button>
                    <button onClick={() => setActiveTab('questions')} style={getTabStyle(activeTab === 'questions')}><FaListOl /> بناء الأسئلة</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    {activeTab === 'settings' && <ExamSettings state={state} dispatch={dispatch} />}
                    {activeTab === 'questions' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>أسئلة الامتحان ({state.questions.length})</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'mcq' })}>اختياري</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'tf' })}>صح وخطأ</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'essay' })}>مقالي</Button>
                                </div>
                            </div>

                            {state.questions.map((q, index) => <QuestionCard key={q.id} q={q} index={index} dispatch={dispatch} />)}
                            
                            {state.questions.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)', background: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>لم يتم إضافة أي أسئلة بعد.</div>}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" icon={<FaSave />} onClick={handleSaveExam} style={{ padding: '15px 30px' }}>حفظ الامتحان نهائياً</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', 
    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? 'rgba(108,92,231,0.1)' : 'transparent', color: isActive ? 'var(--p-purple)' : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? '4px solid var(--p-purple)' : '4px solid transparent'
});