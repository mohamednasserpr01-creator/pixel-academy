"use client";
import React, { useState, useEffect, use } from 'react';
import { 
    FaExclamationTriangle, FaStar, FaPlayCircle, FaSave, FaPaperPlane, 
    FaMedal, FaCamera, FaCheckCircle, FaCheckDouble, FaEye, FaClipboardCheck 
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// 💡 1. استدعاء المركز الموحد للإعدادات
import { useSettings } from '../../../context/SettingsContext';

// =========================================================================
// 💡 MOCK HOMEWORK DATA
// =========================================================================
const fetchHomeworkData = async (hwId: string) => {
    return {
        id: hwId,
        titleAr: "واجب المحاضرة الأولى: التأسيس الذهني", titleEn: "Lecture 1 Homework",
        descAr: "هذا الواجب يحتوي على 3 أسئلة متنوعة. يمكنك حفظ الإجابات والعودة للمحاضرة في أي وقت، لكن يجب التسليم النهائي لفتح المحاضرة الثانية.",
        descEn: "This homework contains 3 questions. You can save progress and return anytime. Final submission is required to unlock the next lecture.",
        isMandatory: true,
        totalScore: 10,
        questions: [
            { id: 'q1', type: 'mcq', score: 2, textAr: "ما هو القانون الفيزيائي المعبر عن القصور الذاتي؟", textEn: "Which law expresses inertia?", optionsAr: ["قانون نيوتن الأول", "قانون نيوتن الثاني"], optionsEn: ["Newton's First Law", "Newton's Second Law"], correctAns: 0, reviewAr: "قانون نيوتن الأول.", reviewEn: "Newton's First Law." },
            { id: 'q2', type: 'tf', score: 3, textAr: "السرعة المتجهة هي كمية قياسية لا تعتمد على الاتجاه.", textEn: "Velocity is a scalar quantity that does not depend on direction.", correctAns: 'false', reviewAr: "خطأ.", reviewEn: "False." },
            { id: 'q3', type: 'essay', score: 5, textAr: "بأسلوبك الخاص، اذكر تطبيقات على قانون نيوتن. (يمكنك كتابة الحل أو رفع صورة)", textEn: "Mention applications of Newton's law. (You can write or upload an image)", reviewAr: "يجب ذكر اندفاع الركاب للأمام، وأيضاً حركة الصواريخ.", reviewEn: "Mention passenger inertia and rocket motion." }
        ]
    };
};

export default function HomeworkRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const hwId = resolvedParams.id;
    const router = useRouter();

    // 💡 2. سحب اللغة من السياق الموحد
    const { lang } = useSettings();

    const [mounted, setMounted] = useState(false);
    const [hw, setHw] = useState<any>(null);

    // Homework Logic States
    const [step, setStep] = useState<'live' | 'result' | 'review'>('live');
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    
    useEffect(() => {
        setMounted(true);
        fetchHomeworkData(hwId).then(data => setHw(data));
    }, [hwId]);

    // ================= ACTIONS =================
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
        // Here you would typically send `answers` to the backend API
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
        
        setTimeout(() => {
            setStep('result');
            window.scrollTo(0, 0);
        }, 1000);
    };

    // 💡 3. شاشة تحميل (Spinner)
    if (!mounted || !hw) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </main>
    );

    // Progress Calculation
    const answeredCount = hw.questions.filter((q: any) => answers[q.id] && answers[q.id].toString().trim() !== '').length;
    const progressPercent = Math.round((answeredCount / hw.questions.length) * 100);

    return (
        // 💡 4. حماية التصميم بالـ page-wrapper
        <main className="page-wrapper">

            <div className="hw-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {/* 🔴 STEP 1: LIVE HOMEWORK */}
                {step === 'live' && (
                    <div id="step-live">
                        <div className="hw-intro" style={{ marginBottom: '30px', textAlign: 'center' }}>
                            {hw.isMandatory && <span className="hw-badge" style={{ display: 'inline-block', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '5px 15px', borderRadius: '50px', fontWeight: 'bold', marginBottom: '15px' }}><FaExclamationTriangle style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'واجب إجباري' : 'Mandatory'}</span>}
                            <h1 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>{lang === 'ar' ? hw.titleAr : hw.titleEn}</h1>
                            <p style={{ color: 'var(--txt-mut)', marginBottom: '15px' }}>{lang === 'ar' ? hw.descAr : hw.descEn}</p>
                            <div className="hw-total-score" style={{ fontWeight: 'bold', color: '#f1c40f' }}><FaStar style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'إجمالي درجات الواجب:' : 'Total Score:'} {hw.totalScore}</div>
                        </div>

                        <div className="hw-sticky-bar" style={{ position: 'sticky', top: '80px', background: 'var(--card)', zIndex: 100, padding: '15px 0', borderBottom: '2px solid var(--h-bg)', borderTop: '2px solid var(--h-bg)', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="progress-info">
                                <div className="progress-text" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
                                    <span>{lang === 'ar' ? 'الأسئلة المجابة:' : 'Answered:'} <b>{answeredCount}</b> {lang === 'ar' ? 'من' : 'of'} <b>{hw.questions.length}</b></span>
                                    <span style={{ color: 'var(--p-purple)' }}>{progressPercent}%</span>
                                </div>
                                <div className="progress-track" style={{ width: '100%', height: '10px', background: 'var(--h-bg)', borderRadius: '50px', overflow: 'hidden' }}>
                                    <div className="progress-fill" style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--p-purple), #ff007f)', transition: 'width 0.3s ease' }}></div>
                                </div>
                            </div>
                            <div className="hw-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button className="btn-nav-exam" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => router.back()}>
                                    <FaPlayCircle /> {lang === 'ar' ? 'المحاضرة' : 'Lecture'}
                                </button>
                                <button className="btn-save-hw" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={saveProgress}>
                                    <FaSave /> {lang === 'ar' ? 'حفظ مؤقت' : 'Save'}
                                </button>
                                <button className="btn-submit-exam glow-btn" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--p-purple)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitHomework}>
                                    <FaPaperPlane /> {lang === 'ar' ? 'تسليم' : 'Submit'}
                                </button>
                            </div>
                        </div>

                        <div className="questions-list">
                            {hw.questions.map((q: any, index: number) => {
                                const isAnswered = !!answers[q.id] && answers[q.id].toString().trim() !== '';
                                
                                return (
                                    <div key={q.id} className={`q-card ${isAnswered ? 'answered' : ''}`} style={{ background: isAnswered ? 'rgba(108,92,231,0.05)' : 'var(--bg)', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: `1px solid ${isAnswered ? 'var(--p-purple)' : 'var(--h-bg)'}` }}>
                                        <div className="q-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <div className="q-number" style={{ fontWeight: 'bold', color: 'var(--p-purple)' }}>{lang === 'ar' ? 'السؤال' : 'Q'} {index + 1}</div>
                                            <div className="q-score" style={{ fontWeight: 'bold', color: '#f1c40f', background: 'rgba(241, 196, 15, 0.1)', padding: '5px 12px', borderRadius: '8px' }}>
                                                <FaMedal /> {lang === 'ar' ? 'الدرجة:' : 'Score:'} {q.score}
                                            </div>
                                        </div>
                                        <h3 className="q-text" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--txt)' }}>{lang === 'ar' ? q.textAr : q.textEn}</h3>
                                        
                                        {q.type === 'mcq' && (
                                            <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {(lang === 'ar' ? q.optionsAr : q.optionsEn).map((opt: string, i: number) => (
                                                    <label key={i} className="opt-label" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answers[q.id] === i ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answers[q.id] === i ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', transition: '0.3s', fontWeight: answers[q.id] === i ? 'bold' : 'normal', color: 'var(--txt)' }}>
                                                        <input 
                                                            type="radio" 
                                                            name={`q_${q.id}`} 
                                                            checked={answers[q.id] === i}
                                                            onChange={() => handleAnswerChange(q.id, i)}
                                                            style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }}
                                                        /> 
                                                        {opt}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {q.type === 'tf' && (
                                            <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <label className="opt-label" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answers[q.id] === 'true' ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answers[q.id] === 'true' ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', fontWeight: answers[q.id] === 'true' ? 'bold' : 'normal', color: 'var(--txt)' }}>
                                                    <input type="radio" name={`q_${q.id}`} checked={answers[q.id] === 'true'} onChange={() => handleAnswerChange(q.id, 'true')} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} /> 
                                                    {lang === 'ar' ? 'صواب' : 'True'}
                                                </label>
                                                <label className="opt-label" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answers[q.id] === 'false' ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answers[q.id] === 'false' ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', fontWeight: answers[q.id] === 'false' ? 'bold' : 'normal', color: 'var(--txt)' }}>
                                                    <input type="radio" name={`q_${q.id}`} checked={answers[q.id] === 'false'} onChange={() => handleAnswerChange(q.id, 'false')} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} /> 
                                                    {lang === 'ar' ? 'خطأ' : 'False'}
                                                </label>
                                            </div>
                                        )}

                                        {q.type === 'essay' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <textarea 
                                                    className="essay-area" 
                                                    placeholder={lang === 'ar' ? 'اكتب حلك أو ملاحظاتك هنا...' : 'Type your answer here...'}
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    style={{ width: '100%', minHeight: '150px', padding: '20px', borderRadius: '15px', background: 'var(--h-bg)', border: '2px solid transparent', color: 'var(--txt)', outline: 'none', resize: 'vertical', fontSize: '1rem' }}
                                                ></textarea>
                                                <div style={{ position: 'relative', width: '100%' }}>
                                                    <button className="btn-upload glow-btn" style={{ width: '100%', padding: '15px', background: 'var(--bg)', color: 'var(--p-purple)', border: '2px dashed var(--p-purple)', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><FaCamera /> {lang === 'ar' ? 'إرفاق صورة للحل (اختياري)' : 'Attach Image (Optional)'}</button>
                                                    <input 
                                                        type="file" accept="image/*" 
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                                        onChange={(e) => {
                                                            if(e.target.files && e.target.files[0]) handleFileChange(q.id, e.target.files[0]);
                                                        }}
                                                    />
                                                </div>
                                                {files[q.id] && (
                                                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#2ecc71', fontWeight: 'bold' }}>
                                                        <FaCheckCircle style={{ margin: '0 5px' }}/> {lang === 'ar' ? 'تم إرفاق الصورة بنجاح.' : 'Image attached.'}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hw-footer-actions" style={{ marginTop: '40px', textAlign: 'center' }}>
                            <button className="btn-submit-exam glow-btn" style={{ margin: '0 auto', fontSize: '1.2rem', padding: '15px 40px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }} onClick={submitHomework}>
                                <FaCheckDouble /> {lang === 'ar' ? 'تسليم الواجب النهائي' : 'Final Submit'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 🔵 STEP 2: RESULT */}
                {step === 'result' && (
                    <div className="hw-result" style={{ display: 'block', textAlign: 'center' }}>
                        <div className="result-card" style={{ background: 'var(--bg)', border: '2px solid #2ecc71', borderRadius: '20px', padding: '40px' }}>
                            <h2 style={{ marginBottom: '20px', color: 'var(--p-purple)', fontWeight: 900 }}>{lang === 'ar' ? 'نتيجة الواجب 📝' : 'Homework Result 📝'}</h2>
                            <div className="score-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid #2ecc71', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#2ecc71' }}>
                                90%
                            </div>
                            <div className="grade-text" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--txt)', marginBottom: '15px' }}><FaStar style={{ color: '#f1c40f' }}/> {lang === 'ar' ? 'الدرجة:' : 'Score:'} 9 / 10</div>
                            <h3 style={{ color: '#2ecc71', marginBottom: '30px', fontWeight: 900, fontSize: '1.4rem' }}>
                                {lang === 'ar' ? 'أحسنت يا بطل! تم تسليم الواجب بنجاح.' : 'Great job! Homework submitted successfully.'}
                            </h3>
                            
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button className="btn-nav-exam glow-btn" style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '13px 30px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setStep('review')}>
                                    <FaEye /> {lang === 'ar' ? 'مراجعة الإجابات' : 'Review Answers'}
                                </button>
                                <button className="btn-continue glow-btn" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '13px 30px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                                    <FaPlayCircle /> {lang === 'ar' ? 'استكمال المحاضرة' : 'Back to Lecture'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🟡 STEP 3: REVIEW */}
                {step === 'review' && (
                    <div id="step-review">
                        <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid var(--h-bg)', paddingBottom: '20px' }}>
                            <div>
                                <h2 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaClipboardCheck /> {lang === 'ar' ? 'نموذج إجابات الواجب' : 'Model Answers'}</h2>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '10px', background: 'rgba(241, 196, 15, 0.1)', color: 'var(--txt)', padding: '5px 15px', borderRadius: '8px', display: 'inline-block', border: '1px solid rgba(241, 196, 15, 0.3)' }}>
                                    {lang === 'ar' ? 'الدرجة النهائية:' : 'Final Score:'} <span style={{ color: '#f1c40f' }}>9 / 10</span>
                                </div>
                            </div>
                            <button className="btn-continue" style={{ background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                                <FaPlayCircle /> {lang === 'ar' ? 'العودة' : 'Back'}
                            </button>
                        </div>

                        {hw.questions.map((q: any, i: number) => {
                            const isCorrect = q.type !== 'essay'; 
                            
                            return (
                                <div key={q.id} className="review-box" style={{ background: 'var(--bg)', border: '1px solid var(--h-bg)', borderRadius: '15px', padding: '25px', marginBottom: '20px' }}>
                                    <h3 style={{ marginBottom: '15px', color: 'var(--txt)' }}>
                                        <span style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'س' : 'Q'}{i + 1}:</span> {lang === 'ar' ? q.textAr : q.textEn}
                                    </h3>
                                    
                                    <div style={{ background: isCorrect ? 'rgba(46, 204, 113, 0.05)' : 'rgba(231, 76, 60, 0.05)', border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`, padding: '20px', borderRadius: '10px', marginTop: '15px', lineHeight: 1.6 }}>
                                        <span style={{ display: 'inline-block', background: isCorrect ? 'var(--success)' : 'var(--danger)', color: 'white', padding: '3px 10px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px' }}>
                                            {isCorrect ? (lang === 'ar' ? `إجابتك صحيحة (${q.score}/${q.score})` : `Correct (${q.score}/${q.score})`) : (lang === 'ar' ? `إجابة غير مكتملة (4/${q.score})` : `Incomplete (4/${q.score})`)}
                                        </span> 
                                        <br />
                                        <div style={{ color: 'var(--txt)' }}>
                                            <strong style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> <br/>
                                            {q.type === 'mcq' ? (answers[q.id] !== undefined ? (lang === 'ar' ? q.optionsAr[answers[q.id]] : q.optionsEn[answers[q.id]]) : '---') : (answers[q.id] || '---')}
                                        </div>
                                        <br />
                                        <div style={{ color: 'var(--txt)' }}>
                                            <strong style={{ color: 'var(--success)' }}>{lang === 'ar' ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> <br/>
                                            {lang === 'ar' ? q.reviewAr : q.reviewEn}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Toast Notification Element */}
            <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ 
                position: 'fixed', bottom: '30px', right: lang === 'ar' ? '30px' : 'auto', left: lang === 'ar' ? 'auto' : '30px', 
                background: '#2ecc71', color: 'white', padding: '15px 25px', borderRadius: '10px', fontWeight: 'bold', 
                boxShadow: '0 5px 20px rgba(0,0,0,0.3)', transform: toastMsg ? 'translateY(0)' : 'translateY(100px)', 
                opacity: toastMsg ? 1 : 0, transition: '0.4s ease', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' 
            }}>
                <FaCheckCircle /> <span>{toastMsg}</span>
            </div>
            
        </main>
    );
}