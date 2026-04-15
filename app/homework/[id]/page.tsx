// FILE: app/homework/[id]/page.tsx
"use client";
import React, { useState, useEffect, use } from 'react';
import { FaExclamationTriangle, FaStar, FaCheckDouble } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import { useSettings } from '../../../context/SettingsContext';
import { homeworkService } from '../../../services/homeworkService';

// استدعاء المكونات اللي فصلناها
import HomeworkToast from '../../../components/homework/HomeworkToast';
import HomeworkProgress from '../../../components/homework/HomeworkProgress';
import QuestionCard from '../../../components/homework/QuestionCard';
import HomeworkResult from '../../../components/homework/HomeworkResult';
import HomeworkReview from '../../../components/homework/HomeworkReview';

export default function HomeworkRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const hwId = resolvedParams.id;
    const router = useRouter();
    const { lang } = useSettings();

    // States
    const [hw, setHw] = useState<any>(null);
    const [step, setStep] = useState<'live' | 'result' | 'review'>('live');
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    
    // Grading States
    const [earnedScore, setEarnedScore] = useState(0);
    const [scorePercentage, setScorePercentage] = useState(0);

    useEffect(() => {
        homeworkService.getHomework(hwId).then(data => setHw(data));
    }, [hwId]);

    // Helpers
    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleAnswerChange = (qId: string, val: any) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleFileChange = (qId: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [qId]: file }));
        if(file) handleAnswerChange(qId, `[Attached: ${file.name}]`);
    };

    const saveProgress = () => {
        showToast(lang === 'ar' ? 'تم الحفظ بنجاح! يمكنك العودة لاحقاً.' : 'Progress saved successfully!');
    };

    const submitHomework = () => {
        const answeredCount = hw.questions.filter((q: any) => answers[q.id] && answers[q.id].toString().trim() !== '').length;
        
        if (answeredCount < hw.questions.length) {
            if(!window.confirm(lang === 'ar' ? `لقد أجبت على ${answeredCount} من أصل ${hw.questions.length} أسئلة فقط. هل أنت متأكد من التسليم النهائي؟` : `You answered ${answeredCount}/${hw.questions.length} questions. Submit anyway?`)) return;
        } else {
            if(!window.confirm(lang === 'ar' ? 'هل أنت متأكد من تسليم الواجب نهائياً؟' : 'Are you sure you want to submit the homework?')) return;
        }
        
        showToast(lang === 'ar' ? 'جاري تصحيح الواجب...' : 'Grading homework...');
        
        // حساب الدرجة (MCQ & TF فقط، المقالي بياخد صفر مؤقتاً لحد ما المدرس يصححه)
        let calculatedScore = 0;
        hw.questions.forEach((q: any) => {
            if (q.type !== 'essay' && answers[q.id] === q.correctAns) {
                calculatedScore += q.score;
            }
        });

        const percentage = Math.round((calculatedScore / hw.totalScore) * 100);
        setEarnedScore(calculatedScore);
        setScorePercentage(percentage);

        setTimeout(() => {
            setStep('result');
            window.scrollTo(0, 0);
        }, 1000);
    };

    if (!hw) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </main>
    );

    // Progress Calculation
    const answeredCount = hw.questions.filter((q: any) => answers[q.id] && answers[q.id].toString().trim() !== '').length;
    const progressPercent = Math.round((answeredCount / hw.questions.length) * 100);

    return (
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            <div className="hw-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {step === 'live' && (
                    <div id="step-live">
                        {/* Intro Header */}
                        <div className="hw-intro" style={{ marginBottom: '30px', textAlign: 'center' }}>
                            {hw.isMandatory && <span className="hw-badge" style={{ display: 'inline-block', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '5px 15px', borderRadius: '50px', fontWeight: 'bold', marginBottom: '15px' }}><FaExclamationTriangle style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'واجب إجباري' : 'Mandatory'}</span>}
                            <h1 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>{lang === 'ar' ? hw.titleAr : hw.titleEn}</h1>
                            <p style={{ color: 'var(--txt-mut)', marginBottom: '15px' }}>{lang === 'ar' ? hw.descAr : hw.descEn}</p>
                            <div className="hw-total-score" style={{ fontWeight: 'bold', color: '#f1c40f' }}><FaStar style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'إجمالي درجات الواجب:' : 'Total Score:'} {hw.totalScore}</div>
                        </div>

                        {/* Sticky Progress Bar */}
                        <HomeworkProgress 
                            answeredCount={answeredCount} totalCount={hw.questions.length} progressPercent={progressPercent} lang={lang}
                            onBack={() => router.back()} onSave={saveProgress} onSubmit={submitHomework}
                        />

                        {/* Questions List */}
                        <div className="questions-list">
                            {hw.questions.map((q: any, index: number) => (
                                <QuestionCard 
                                    key={q.id} q={q} index={index} lang={lang} answer={answers[q.id]} file={files[q.id] || null}
                                    onAnswerChange={handleAnswerChange} onFileChange={handleFileChange}
                                />
                            ))}
                        </div>

                        {/* Final Submit Button */}
                        <div className="hw-footer-actions" style={{ marginTop: '40px', textAlign: 'center' }}>
                            <button className="btn-submit-exam glow-btn" style={{ margin: '0 auto', fontSize: '1.2rem', padding: '15px 40px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitHomework}>
                                <FaCheckDouble /> {lang === 'ar' ? 'تسليم الواجب النهائي' : 'Final Submit'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <HomeworkResult scorePercentage={scorePercentage} earnedScore={earnedScore} totalScore={hw.totalScore} lang={lang} onReview={() => setStep('review')} />
                )}

                {step === 'review' && (
                    <HomeworkReview hw={hw} answers={answers} earnedScore={earnedScore} lang={lang} />
                )}

            </div>

            <HomeworkToast msg={toastMsg} lang={lang} />
        </main>
    );
}