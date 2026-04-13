"use client";
import React, { useState, useEffect, use } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { 
    FaExclamationTriangle, FaStar, FaPlayCircle, FaSave, FaPaperPlane, 
    FaMedal, FaCamera, FaCheckCircle, FaCheckDouble, FaEye, FaClipboardCheck, FaArrowRight 
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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

    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');
    const [hw, setHw] = useState<any>(null);

    // Homework Logic States
    const [step, setStep] = useState<'live' | 'result' | 'review'>('live');
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme); setLang(savedLang);
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

        fetchHomeworkData(hwId).then(data => setHw(data));
    }, [hwId]);

    const toggleMode = () => { setTheme(theme === 'dark' ? 'light' : 'dark'); if(theme === 'dark') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); localStorage.setItem('pixel_theme', theme === 'dark' ? 'light' : 'dark'); };
    const toggleLang = () => { const newLang = lang === 'ar' ? 'en' : 'ar'; setLang(newLang); document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('pixel_lang', newLang); };

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

    if (!mounted || !hw) return null;

    // Progress Calculation
    const answeredCount = hw.questions.filter((q: any) => answers[q.id] && answers[q.id].toString().trim() !== '').length;
    const progressPercent = Math.round((answeredCount / hw.questions.length) * 100);

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            <div className="hw-container">
                
                {/* 🔴 STEP 1: LIVE HOMEWORK */}
                {step === 'live' && (
                    <div id="step-live">
                        <div className="hw-intro">
                            {hw.isMandatory && <span className="hw-badge"><FaExclamationTriangle style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'واجب إجباري' : 'Mandatory'}</span>}
                            <h1>{lang === 'ar' ? hw.titleAr : hw.titleEn}</h1>
                            <p>{lang === 'ar' ? hw.descAr : hw.descEn}</p>
                            <div className="hw-total-score"><FaStar style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'إجمالي درجات الواجب:' : 'Total Score:'} {hw.totalScore}</div>
                        </div>

                        <div className="hw-sticky-bar">
                            <div className="progress-info">
                                <div className="progress-text">
                                    <span>{lang === 'ar' ? 'الأسئلة المجابة:' : 'Answered:'} <b>{answeredCount}</b> {lang === 'ar' ? 'من' : 'of'} <b>{hw.questions.length}</b></span>
                                    <span style={{ color: 'var(--txt)', opacity: 0.8, fontSize: '0.9rem' }}>{progressPercent}%</span>
                                </div>
                                <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercent}%` }}></div></div>
                            </div>
                            <div className="hw-actions">
                                <button className="btn-nav-exam" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent' }} onClick={() => router.back()}>
                                    <FaPlayCircle /> {lang === 'ar' ? 'المحاضرة' : 'Lecture'}
                                </button>
                                <button className="btn-save-hw" onClick={saveProgress}>
                                    <FaSave /> {lang === 'ar' ? 'حفظ مؤقت' : 'Save'}
                                </button>
                                <button className="btn-submit-exam" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={submitHomework}>
                                    <FaPaperPlane /> {lang === 'ar' ? 'تسليم' : 'Submit'}
                                </button>
                            </div>
                        </div>

                        <div className="questions-list">
                            {hw.questions.map((q: any, index: number) => {
                                const isAnswered = !!answers[q.id] && answers[q.id].toString().trim() !== '';
                                
                                return (
                                    <div key={q.id} className={`q-card ${isAnswered ? 'answered' : ''}`}>
                                        <div className="q-header">
                                            <div className="q-number">{lang === 'ar' ? 'السؤال' : 'Q'} {index + 1}</div>
                                            <div className="q-score" style={{ fontWeight: 'bold', color: '#f1c40f', background: 'rgba(241, 196, 15, 0.1)', padding: '5px 12px', borderRadius: '8px' }}>
                                                <FaMedal /> {lang === 'ar' ? 'الدرجة:' : 'Score:'} {q.score}
                                            </div>
                                        </div>
                                        <h3 className="q-text" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '15px' }}>{lang === 'ar' ? q.textAr : q.textEn}</h3>
                                        
                                        {q.type === 'mcq' && (
                                            <div className="options-grid">
                                                {(lang === 'ar' ? q.optionsAr : q.optionsEn).map((opt: string, i: number) => (
                                                    <label key={i} className="opt-label">
                                                        <input 
                                                            type="radio" 
                                                            name={`q_${q.id}`} 
                                                            checked={answers[q.id] === i}
                                                            onChange={() => handleAnswerChange(q.id, i)}
                                                        /> 
                                                        {opt}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {q.type === 'tf' && (
                                            <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                                <label className="opt-label">
                                                    <input type="radio" name={`q_${q.id}`} checked={answers[q.id] === 'true'} onChange={() => handleAnswerChange(q.id, 'true')} /> 
                                                    {lang === 'ar' ? 'صواب' : 'True'}
                                                </label>
                                                <label className="opt-label">
                                                    <input type="radio" name={`q_${q.id}`} checked={answers[q.id] === 'false'} onChange={() => handleAnswerChange(q.id, 'false')} /> 
                                                    {lang === 'ar' ? 'خطأ' : 'False'}
                                                </label>
                                            </div>
                                        )}

                                        {q.type === 'essay' && (
                                            <div>
                                                <textarea 
                                                    className="essay-area" 
                                                    placeholder={lang === 'ar' ? 'اكتب حلك أو ملاحظاتك هنا...' : 'Type your answer here...'}
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                ></textarea>
                                                <div style={{ position: 'relative', width: '100%' }}>
                                                    <button className="btn-upload"><FaCamera /> {lang === 'ar' ? 'إرفاق صورة للحل (اختياري)' : 'Attach Image (Optional)'}</button>
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

                        <div className="hw-footer-actions">
                            <button className="btn-submit-exam" style={{ margin: '0 auto', fontSize: '1.2rem', padding: '15px 40px', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={submitHomework}>
                                <FaCheckDouble /> {lang === 'ar' ? 'تسليم الواجب النهائي' : 'Final Submit'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 🔵 STEP 2: RESULT */}
                {step === 'result' && (
                    <div className="hw-result" style={{ display: 'block', textAlign: 'center' }}>
                        <div className="result-card" style={{ background: 'var(--card)', border: '2px solid #2ecc71', borderRadius: '20px', padding: '40px' }}>
                            <h2 style={{ marginBottom: '20px', color: 'var(--p-purple)', fontWeight: 900 }}>{lang === 'ar' ? 'نتيجة الواجب 📝' : 'Homework Result 📝'}</h2>
                            <div className="score-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid #2ecc71', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#2ecc71' }}>
                                90%
                            </div>
                            <div className="grade-text"><FaStar /> {lang === 'ar' ? 'الدرجة:' : 'Score:'} 9 / 10</div>
                            <h3 style={{ color: '#2ecc71', marginBottom: '25px', fontWeight: 900, fontSize: '1.4rem' }}>
                                {lang === 'ar' ? 'أحسنت يا بطل! تم تسليم الواجب بنجاح.' : 'Great job! Homework submitted successfully.'}
                            </h3>
                            
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
                                <button className="btn-nav-exam" style={{ background: 'transparent', padding: '13px 30px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setStep('review')}>
                                    <FaEye /> {lang === 'ar' ? 'مراجعة الإجابات' : 'Review Answers'}
                                </button>
                                <button className="btn-continue" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '13px 30px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                                    <FaPlayCircle /> {lang === 'ar' ? 'استكمال المحاضرة' : 'Back to Lecture'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🟡 STEP 3: REVIEW */}
                {step === 'review' && (
                    <div id="step-review">
                        <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid var(--p-purple)', paddingBottom: '15px' }}>
                            <div>
                                <h2><FaClipboardCheck /> {lang === 'ar' ? 'نموذج إجابات الواجب' : 'Model Answers'}</h2>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '10px', background: 'rgba(241, 196, 15, 0.1)', padding: '5px 15px', borderRadius: '8px', display: 'inline-block', border: '1px solid rgba(241, 196, 15, 0.3)' }}>
                                    {lang === 'ar' ? 'الدرجة النهائية:' : 'Final Score:'} <span style={{ color: '#f1c40f' }}>9 / 10</span>
                                </div>
                            </div>
                            <button className="btn-continue" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                                <FaPlayCircle /> {lang === 'ar' ? 'استكمال المحاضرة' : 'Back to Lecture'}
                            </button>
                        </div>

                        {hw.questions.map((q: any, i: number) => {
                            // Mocking correct/wrong states for demo purposes based on question type
                            const isCorrect = q.type !== 'essay'; 
                            const ansClass = isCorrect ? 'ans-correct' : 'ans-wrong';

                            return (
                                <div key={q.id} className="review-box" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '25px', marginBottom: '20px' }}>
                                    <h3 style={{ marginBottom: '10px' }}>{lang === 'ar' ? 'س' : 'Q'}{i + 1}: {lang === 'ar' ? q.textAr : q.textEn}</h3>
                                    
                                    <div className={ansClass} style={{ background: isCorrect ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)', border: `1px solid ${isCorrect ? '#2ecc71' : '#e74c3c'}`, padding: '15px', borderRadius: '10px', marginTop: '15px', fontWeight: 'bold', lineHeight: 1.6 }}>
                                        <span style={{ background: isCorrect ? '#2ecc71' : '#e74c3c', color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '0.8rem' }}>
                                            {isCorrect ? (lang === 'ar' ? `إجابتك صحيحة (${q.score}/${q.score})` : `Correct (${q.score}/${q.score})`) : (lang === 'ar' ? `إجابة غير مكتملة (4/${q.score})` : `Incomplete (4/${q.score})`)}
                                        </span> 
                                        <br /><br />
                                        <strong>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> 
                                        {q.type === 'mcq' ? (answers[q.id] !== undefined ? (lang === 'ar' ? q.optionsAr[answers[q.id]] : q.optionsEn[answers[q.id]]) : '---') : (answers[q.id] || '---')}
                                        <br /><br />
                                        <strong>{lang === 'ar' ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> {lang === 'ar' ? q.reviewAr : q.reviewEn}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Toast Notification Element */}
            <div className={`toast ${toastMsg ? 'show' : ''}`}>
                <FaCheckCircle /> <span>{toastMsg}</span>
            </div>

            <Footer />
        </main>
    );
}