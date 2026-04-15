// FILE: app/exam/[id]/page.tsx
"use client";
import React, { useState, useEffect, use } from 'react';
import { useQuery } from '@tanstack/react-query';

// استدعاء الخدمات والإعدادات
import { useSettings } from '../../../context/SettingsContext';
import { examService } from '../../../services/examService';

// استدعاء المكونات اللي فصلناها
import ExamIntro from '../../../components/exam/ExamIntro';
import ExamLive from '../../../components/exam/ExamLive';
import ExamResult from '../../../components/exam/ExamResult';
import ExamReview from '../../../components/exam/ExamReview';

export default function ExamRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const examId = resolvedParams.id;
    const { lang } = useSettings();

    // حالات الامتحان
    const [step, setStep] = useState<'intro' | 'live' | 'result' | 'review'>('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [score, setScore] = useState(0);

    // سحب بيانات الامتحان بـ React Query
    const { data: exam, isLoading, isError } = useQuery({
        queryKey: ['exam', examId],
        queryFn: () => examService.getExam(examId),
    });

    // دالة تسليم الامتحان (يدوي أو لو الوقت خلص)
    const handleFinalSubmit = (isForceSubmit = false) => {
        if (!exam) return;

        if (!isForceSubmit) {
            const unanswered = exam.questions.some(q => {
                const ans = answers[q.id];
                return ans === undefined || ans === null || ans.toString().trim() === '';
            });

            if (unanswered) {
                alert(lang === 'ar' ? '⚠️ برجاء الإجابة على جميع الأسئلة قبل التسليم!' : '⚠️ Please answer all questions before submitting!');
                return;
            }
            if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من تسليم الامتحان النهائي؟' : 'Are you sure you want to submit?')) return;
        } else {
            alert(lang === 'ar' ? 'انتهى الوقت! تم سحب الورقة وتسليم الامتحان تلقائياً.' : 'Time is up! Exam submitted automatically.');
        }

        // حساب الدرجة لأسئلة الـ MCQ فقط (المقالي بيتصحح من المدرس)
        let correctAnswers = 0;
        let totalMCQ = 0;
        exam.questions.forEach(q => {
            if (q.type === 'mcq') {
                totalMCQ++;
                if (answers[q.id] === q.correctAns) correctAnswers++;
            }
        });
        
        const finalScore = totalMCQ > 0 ? Math.round((correctAnswers / totalMCQ) * 100) : 100;
        setScore(finalScore);
        setStep('result');
    };

    // شاشات التحميل والأخطاء
    if (isLoading || !exam) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </main>
    );

    if (isError) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h2 style={{ color: 'var(--danger)' }}>{lang === 'ar' ? 'حدث خطأ أثناء جلب بيانات الامتحان.' : 'Failed to load exam data.'}</h2>
        </main>
    );

    // الريندر النهائي (Orchestrator)
    return (
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            <div className="exam-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {step === 'intro' && (
                    <ExamIntro exam={exam} lang={lang} onStart={() => setStep('live')} />
                )}

                {step === 'live' && (
                    <ExamLive 
                        exam={exam} 
                        lang={lang} 
                        currentQIndex={currentQIndex} 
                        timeLeft={exam.timeLimit * 60} // مش بنستخدمه جوه Live بس بنمرره
                        answers={answers} 
                        onAnswerChange={(qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }))} 
                        onNext={() => setCurrentQIndex(prev => prev + 1)} 
                        onPrev={() => setCurrentQIndex(prev => prev - 1)} 
                        onSubmit={() => handleFinalSubmit(false)} 
                        onTimeUp={() => handleFinalSubmit(true)} 
                        onNavigateTo={(idx) => setCurrentQIndex(idx)}
                    />
                )}

                {step === 'result' && (
                    <ExamResult lang={lang} scorePercentage={score} onReview={() => setStep('review')} />
                )}

                {step === 'review' && (
                    <ExamReview exam={exam} lang={lang} answers={answers} onBackToResult={() => setStep('result')} />
                )}

            </div>
        </main>
    );
}