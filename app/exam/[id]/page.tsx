"use client";
import React, { useState, useEffect, use } from 'react';
import { 
    FaClock, FaListOl, FaHourglassHalf, FaCamera, FaEye, 
    FaPlayCircle, FaArrowRight, FaClipboardCheck 
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 💡 1. استدعاء مركز الإعدادات الموحد
import { useSettings } from '../../../context/SettingsContext';

// =========================================================================
// 💡 MOCK EXAM DATA
// =========================================================================
const fetchExamData = async (examId: string) => {
    return {
        id: examId,
        titleAr: "امتحان العبور الإجباري 📝", titleEn: "Mandatory Exam 📝",
        lectureAr: "المحاضرة الأولى: التأسيس الذهني والمنهجي", lectureEn: "Lecture 1: Foundation",
        timeLimit: 15, // بالدقائق
        questions: [
            { 
                id: 1, type: 'mcq', 
                textAr: "ما هو القانون الفيزيائي الذي يعبر عن مقاومة الجسم للتغيير؟", textEn: "Which physical law expresses a body's resistance to change?",
                optionsAr: ["قانون نيوتن الأول", "قانون الجذب العام", "قانون نيوتن الثالث", "معادلة أينشتاين"],
                optionsEn: ["Newton's First Law", "Law of Universal Gravitation", "Newton's Third Law", "Einstein's Equation"],
                correctAns: 0, explanationAr: "قانون نيوتن الأول (القصور الذاتي).", explanationEn: "Newton's First Law (Inertia)."
            },
            { 
                id: 2, type: 'essay', 
                textAr: "اكتب باختصار استنتاج معادلة الحركة، أو ارفع صورة للحل.", textEn: "Briefly write the derivation of the equation of motion, or upload a picture.",
                correctAns: "essay", explanationAr: "يجب ذكر معادلة التسارع وتكاملها بالنسبة للزمن للوصول لمعادلة الإزاحة كاملة.", explanationEn: "You must mention the acceleration equation and integrate it."
            }
        ]
    };
};

export default function ExamRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const examId = resolvedParams.id;
    const router = useRouter();

    // 💡 2. سحب اللغة من الـ Context
    const { lang } = useSettings();

    const [mounted, setMounted] = useState(false);
    const [exam, setExam] = useState<any>(null);

    // Exam Logic States
    const [step, setStep] = useState<'intro' | 'live' | 'result' | 'review'>('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    
    // Load Initial Data
    useEffect(() => {
        setMounted(true);
        fetchExamData(examId).then(data => {
            setExam(data);
            setTimeLeft(data.timeLimit * 60);
        });
    }, [examId]);

    // Timer Effect
    useEffect(() => {
        let timer: any;
        if (step === 'live' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (step === 'live' && timeLeft === 0) {
            handleForceSubmit(); // الوقت خلص، اسحب الورقة!
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    // Helpers
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Actions
    const startExam = () => setStep('live');
    
    const handleAnswerChange = (qId: number, val: any) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleNext = () => {
        if (currentQIndex < exam.questions.length - 1) setCurrentQIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
    };

    const handleSubmit = () => {
        // Validation: التأكد إن كل الأسئلة متجاوبة
        const unanswered = exam.questions.some((q: any) => !answers[q.id] || answers[q.id].toString().trim() === '');
        if (unanswered) {
            alert(lang === 'ar' ? '⚠️ برجاء الإجابة على جميع الأسئلة قبل التسليم!' : '⚠️ Please answer all questions before submitting!');
            return;
        }

        if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من تسليم الامتحان النهائي؟' : 'Are you sure you want to submit?')) {
            setStep('result');
        }
    };

    const handleForceSubmit = () => {
        alert(lang === 'ar' ? 'انتهى الوقت! تم سحب الورقة وتسليم الامتحان تلقائياً.' : 'Time is up! Exam submitted automatically.');
        setStep('result');
    };

    // 💡 3. شاشة تحميل شيك
    if (!mounted || !exam) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </main>
    );

    const currentQ = exam.questions[currentQIndex];

    return (
        // 💡 4. استخدام الكلاس السحري لحماية التصميم
        <main className="page-wrapper">

            <div className="exam-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {/* 🟢 STEP 1: INTRO */}
                {step === 'intro' && (
                    <div className="exam-intro" style={{ textAlign: 'center' }}>
                        <h1 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>{lang === 'ar' ? exam.titleAr : exam.titleEn}</h1>
                        <p style={{ fontWeight: 'bold', color: 'var(--txt-mut)', marginBottom: '30px' }}>{lang === 'ar' ? exam.lectureAr : exam.lectureEn}</p>
                        
                        <div className="exam-stats" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                            <div className="ex-stat-box" style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '15px', minWidth: '120px' }}>
                                <FaClock style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '10px' }} />
                                <h4>{exam.timeLimit} {lang === 'ar' ? 'دقيقة' : 'Mins'}</h4>
                            </div>
                            <div className="ex-stat-box" style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '15px', minWidth: '120px' }}>
                                <FaListOl style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '10px' }} />
                                <h4>{exam.questions.length} {lang === 'ar' ? 'أسئلة' : 'Questions'}</h4>
                            </div>
                        </div>

                        <button className="btn-start-exam glow-btn" onClick={startExam} style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                            {lang === 'ar' ? 'ابدأ الامتحان الآن' : 'Start Exam Now'}
                        </button>
                    </div>
                )}

                {/* 🔴 STEP 2: LIVE EXAM */}
                {step === 'live' && (
                    <div>
                        <div className="exam-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid var(--h-bg)' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--p-purple)', fontSize: '1.2rem' }}>
                                {lang === 'ar' ? 'السؤال' : 'Question'} {currentQIndex + 1} {lang === 'ar' ? 'من' : 'of'} {exam.questions.length}
                            </div>
                            <div className={`timer ${timeLeft < 60 ? 'danger' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: timeLeft < 60 ? 'rgba(231, 76, 60, 0.1)' : 'var(--h-bg)', color: timeLeft < 60 ? '#e74c3c' : 'var(--warning)', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <FaHourglassHalf /> {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="question-card" style={{ marginBottom: '40px' }}>
                            <div className="q-meta" style={{ marginBottom: '15px' }}>
                                <span className="q-type" style={{ background: 'var(--p-purple)', color: '#fff', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {currentQ.type === 'mcq' ? (lang === 'ar' ? 'اختيار من متعدد' : 'Multiple Choice') : (lang === 'ar' ? 'مقالي' : 'Essay')}
                                </span>
                            </div>
                            <h3 className="q-text" style={{ fontSize: '1.5rem', lineHeight: '1.6', marginBottom: '25px', color: 'var(--txt)' }}>
                                {lang === 'ar' ? currentQ.textAr : currentQ.textEn}
                            </h3>
                            
                            {currentQ.type === 'mcq' && (
                                <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {(lang === 'ar' ? currentQ.optionsAr : currentQ.optionsEn).map((opt: string, i: number) => (
                                        <label key={i} className={`opt-label ${answers[currentQ.id] === i ? 'selected' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answers[currentQ.id] === i ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answers[currentQ.id] === i ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', transition: '0.3s', fontWeight: answers[currentQ.id] === i ? 'bold' : 'normal', color: 'var(--txt)' }}>
                                            <input 
                                                type="radio" 
                                                name={`q_${currentQ.id}`} 
                                                checked={answers[currentQ.id] === i}
                                                onChange={() => handleAnswerChange(currentQ.id, i)}
                                                style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }}
                                            /> 
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'essay' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <textarea 
                                        className="essay-area" 
                                        placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                        style={{ width: '100%', minHeight: '150px', padding: '20px', borderRadius: '15px', background: 'var(--h-bg)', border: '2px solid transparent', color: 'var(--txt)', outline: 'none', resize: 'vertical', fontSize: '1rem' }}
                                    ></textarea>
                                    
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <button className="btn-upload glow-btn" style={{ width: '100%', padding: '15px', background: 'var(--bg)', color: 'var(--p-purple)', border: '2px dashed var(--p-purple)', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <FaCamera /> {lang === 'ar' ? 'التقط صورة أو ارفع ملف للإجابة' : 'Upload Picture of Answer'}
                                        </button>
                                        <input 
                                            type="file" accept="image/*" 
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                            onChange={(e) => {
                                                if(e.target.files && e.target.files[0]) handleAnswerChange(currentQ.id, `[File Attached: ${e.target.files[0].name}]`);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="exam-footer" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--h-bg)', paddingTop: '20px' }}>
                            <button className="btn-nav-exam" onClick={handlePrev} disabled={currentQIndex === 0} style={{ padding: '12px 25px', borderRadius: '10px', background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQIndex === 0 ? 0.5 : 1, fontWeight: 'bold' }}>
                                {lang === 'ar' ? 'السابق' : 'Previous'}
                            </button>
                            
                            {currentQIndex === exam.questions.length - 1 ? (
                                <button className="btn-submit-exam glow-btn" onClick={handleSubmit} style={{ padding: '12px 30px', borderRadius: '10px', background: 'var(--success)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {lang === 'ar' ? 'تسليم الامتحان' : 'Submit Exam'}
                                </button>
                            ) : (
                                <button className="btn-nav-exam glow-btn" onClick={handleNext} style={{ padding: '12px 30px', borderRadius: '10px', background: 'var(--p-purple)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {lang === 'ar' ? 'التالي' : 'Next'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 🔵 STEP 3: RESULT */}
                {step === 'result' && (
                    <div className="result-card" style={{ textAlign: 'center', padding: '40px 0' }}>
                        <h2 style={{ color: 'var(--txt)', marginBottom: '30px' }}>{lang === 'ar' ? 'نتيجة الامتحان' : 'Exam Result'}</h2>
                        <div className="score-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--success), #2ecc71)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, margin: '0 auto 30px', boxShadow: '0 10px 30px rgba(46, 204, 113, 0.4)' }}>
                            100%
                        </div>
                        <h3 style={{ color: 'var(--success)', marginBottom: '40px', fontWeight: 900, fontSize: '1.5rem' }}>
                            {lang === 'ar' ? 'لقد اجتزت الامتحان بتفوق 🎉' : 'You passed the exam successfully 🎉'}
                        </h3>
                        
                        <div className="action-buttons-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-nav-exam glow-btn" onClick={() => setStep('review')} style={{ padding: '12px 25px', borderRadius: '50px', background: 'var(--p-purple)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                <FaEye /> {lang === 'ar' ? 'عرض الإجابات' : 'Review Answers'}
                            </button>
                            <button className="btn-continue glow-btn" onClick={() => router.back()} style={{ padding: '12px 25px', borderRadius: '50px', background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                <FaPlayCircle /> {lang === 'ar' ? 'العودة للمحاضرة' : 'Back to Lecture'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 🟡 STEP 4: REVIEW */}
                {step === 'review' && (
                    <div>
                        <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid var(--h-bg)' }}>
                            <h2 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaClipboardCheck /> {lang === 'ar' ? 'مراجعة الإجابات' : 'Review Answers'}</h2>
                            <button className="btn-continue" onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontWeight: 'bold' }}>
                                <FaArrowRight style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /> 
                                {lang === 'ar' ? 'العودة' : 'Back'}
                            </button>
                        </div>

                        {exam.questions.map((q: any, i: number) => {
                            const isCorrect = q.type === 'mcq' ? answers[q.id] === q.correctAns : false; 
                            
                            return (
                                <div key={q.id} className="review-box" style={{ background: 'var(--bg)', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: `1px solid ${q.type === 'mcq' ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--warning)'}` }}>
                                    <h3 style={{ marginBottom: '15px', color: 'var(--txt)', lineHeight: '1.5' }}>
                                        <span style={{ color: 'var(--p-purple)', marginRight: lang==='ar'?'0':'10px', marginLeft: lang==='ar'?'10px':'0' }}>{lang === 'ar' ? 'س' : 'Q'}{i + 1}:</span> 
                                        {lang === 'ar' ? q.textAr : q.textEn}
                                    </h3>
                                    
                                    <div style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '10px' }}>
                                        {q.type === 'mcq' && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <span style={{ display: 'inline-block', padding: '5px 15px', borderRadius: '50px', background: isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                    {isCorrect ? (lang === 'ar' ? 'إجابتك صحيحة' : 'Correct') : (lang === 'ar' ? 'إجابة خاطئة' : 'Wrong')}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div style={{ marginBottom: '15px', color: 'var(--txt)' }}>
                                            <strong style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> <br/>
                                            <span style={{ display: 'inline-block', marginTop: '5px' }}>
                                                {q.type === 'mcq' ? (answers[q.id] !== undefined ? (lang === 'ar' ? q.optionsAr[answers[q.id]] : q.optionsEn[answers[q.id]]) : '---') : (answers[q.id] || '---')}
                                            </span>
                                        </div>
                                        
                                        <div style={{ color: 'var(--txt)' }}>
                                            <strong style={{ color: 'var(--success)' }}>{lang === 'ar' ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> <br/>
                                            <span style={{ display: 'inline-block', marginTop: '5px' }}>
                                                {lang === 'ar' ? q.explanationAr : q.explanationEn}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </main>
    );
}