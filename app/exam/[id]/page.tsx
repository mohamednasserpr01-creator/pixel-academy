"use client";
import React, { useState, useEffect, use } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { 
    FaClock, FaListOl, FaHourglassHalf, FaCamera, FaEye, 
    FaPlayCircle, FaArrowRight, FaClipboardCheck 
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');
    const [exam, setExam] = useState<any>(null);

    // Exam Logic States
    const [step, setStep] = useState<'intro' | 'live' | 'result' | 'review'>('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    
    // Load Initial Data
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme); setLang(savedLang);
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

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

    const toggleMode = () => { setTheme(theme === 'dark' ? 'light' : 'dark'); if(theme === 'dark') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); localStorage.setItem('pixel_theme', theme === 'dark' ? 'light' : 'dark'); };
    const toggleLang = () => { const newLang = lang === 'ar' ? 'en' : 'ar'; setLang(newLang); document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('pixel_lang', newLang); };

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

    if (!mounted || !exam) return null;

    const currentQ = exam.questions[currentQIndex];

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            <div className="exam-container">
                
                {/* 🟢 STEP 1: INTRO */}
                {step === 'intro' && (
                    <div className="exam-intro">
                        <h1>{lang === 'ar' ? exam.titleAr : exam.titleEn}</h1>
                        <p style={{ fontWeight: 'bold', opacity: 0.8 }}>{lang === 'ar' ? exam.lectureAr : exam.lectureEn}</p>
                        
                        <div className="exam-stats">
                            <div className="ex-stat-box">
                                <FaClock />
                                <h4>{exam.timeLimit} {lang === 'ar' ? 'دقيقة' : 'Mins'}</h4>
                            </div>
                            <div className="ex-stat-box">
                                <FaListOl />
                                <h4>{exam.questions.length} {lang === 'ar' ? 'أسئلة' : 'Questions'}</h4>
                            </div>
                        </div>

                        <button className="btn-start-exam" onClick={startExam}>
                            {lang === 'ar' ? 'ابدأ الامتحان الآن' : 'Start Exam Now'}
                        </button>
                    </div>
                )}

                {/* 🔴 STEP 2: LIVE EXAM */}
                {step === 'live' && (
                    <div>
                        <div className="exam-header">
                            <div style={{ fontWeight: 'bold', color: 'var(--p-purple)' }}>
                                {lang === 'ar' ? 'السؤال' : 'Question'} {currentQIndex + 1} {lang === 'ar' ? 'من' : 'of'} {exam.questions.length}
                            </div>
                            <div className={`timer ${timeLeft > 60 ? 'safe' : ''}`}>
                                <FaHourglassHalf /> {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="question-card">
                            <div className="q-meta">
                                <span className="q-type">{currentQ.type === 'mcq' ? (lang === 'ar' ? 'اختيار من متعدد' : 'Multiple Choice') : (lang === 'ar' ? 'مقالي' : 'Essay')}</span>
                            </div>
                            <h3 className="q-text">{lang === 'ar' ? currentQ.textAr : currentQ.textEn}</h3>
                            
                            {currentQ.type === 'mcq' && (
                                <div className="options-grid">
                                    {(lang === 'ar' ? currentQ.optionsAr : currentQ.optionsEn).map((opt: string, i: number) => (
                                        <label key={i} className={`opt-label ${answers[currentQ.id] === i ? 'selected' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name={`q_${currentQ.id}`} 
                                                checked={answers[currentQ.id] === i}
                                                onChange={() => handleAnswerChange(currentQ.id, i)}
                                            /> 
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'essay' && (
                                <div>
                                    <textarea 
                                        className="essay-area" 
                                        placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                    ></textarea>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <button className="btn-upload"><FaCamera /> {lang === 'ar' ? 'التقط صورة أو ارفع ملف' : 'Upload Picture'}</button>
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

                        <div className="exam-footer">
                            <button className="btn-nav-exam" onClick={handlePrev} disabled={currentQIndex === 0}>
                                {lang === 'ar' ? 'السابق' : 'Previous'}
                            </button>
                            
                            {currentQIndex === exam.questions.length - 1 ? (
                                <button className="btn-submit-exam" onClick={handleSubmit}>
                                    {lang === 'ar' ? 'تسليم الامتحان' : 'Submit Exam'}
                                </button>
                            ) : (
                                <button className="btn-nav-exam" onClick={handleNext}>
                                    {lang === 'ar' ? 'التالي' : 'Next'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 🔵 STEP 3: RESULT */}
                {step === 'result' && (
                    <div className="result-card">
                        <h2>{lang === 'ar' ? 'نتيجة الامتحان' : 'Exam Result'}</h2>
                        <div className="score-circle">100%</div> {/* Mock Score */}
                        <h3 style={{ color: '#2ecc71', marginBottom: '25px', fontWeight: 900 }}>
                            {lang === 'ar' ? 'لقد اجتزت الامتحان بتفوق 🎉' : 'You passed the exam successfully 🎉'}
                        </h3>
                        
                        <div className="action-buttons-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-nav-exam" onClick={() => setStep('review')}>
                                <FaEye style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'عرض الإجابات' : 'Review Answers'}
                            </button>
                            <button className="btn-continue" onClick={() => router.back()}>
                                <FaPlayCircle /> {lang === 'ar' ? 'العودة للمحاضرة' : 'Back to Lecture'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 🟡 STEP 4: REVIEW */}
                {step === 'review' && (
                    <div>
                        <div className="review-header">
                            <h2><FaClipboardCheck /> {lang === 'ar' ? 'مراجعة الإجابات النموذجية' : 'Review Answers'}</h2>
                            <button className="btn-continue" onClick={() => router.back()}>
                                <FaArrowRight style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} /> 
                                {lang === 'ar' ? 'العودة للمحاضرة' : 'Back to Lecture'}
                            </button>
                        </div>

                        {exam.questions.map((q: any, i: number) => {
                            const isCorrect = q.type === 'mcq' ? answers[q.id] === q.correctAns : false; // Essay requires manual review usually
                            const ansClass = (q.type === 'mcq' && isCorrect) ? 'ans-correct' : 'ans-wrong';

                            return (
                                <div key={q.id} className="review-box">
                                    <h3 style={{ marginBottom: '10px' }}>{lang === 'ar' ? 'س' : 'Q'}{i + 1}: {lang === 'ar' ? q.textAr : q.textEn}</h3>
                                    
                                    <div className={ansClass}>
                                        {q.type === 'mcq' && (
                                            <span className={isCorrect ? 'badge-true' : 'badge-false'}>
                                                {isCorrect ? (lang === 'ar' ? 'إجابتك صحيحة' : 'Correct') : (lang === 'ar' ? 'إجابة خاطئة' : 'Wrong')}
                                            </span>
                                        )}
                                        <br /><br />
                                        <strong>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> 
                                        {q.type === 'mcq' ? (answers[q.id] !== undefined ? (lang === 'ar' ? q.optionsAr[answers[q.id]] : q.optionsEn[answers[q.id]]) : '---') : (answers[q.id] || '---')}
                                        
                                        <br /><br />
                                        <strong>{lang === 'ar' ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> {lang === 'ar' ? q.explanationAr : q.explanationEn}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
            <Footer />
        </main>
    );
}