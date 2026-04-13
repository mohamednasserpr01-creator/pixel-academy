"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
    FaSearch, FaUnlock, FaLock, FaArrowRight, FaChalkboardTeacher, 
    FaLayerGroup, FaDatabase, FaChartPie, FaPlay, FaRedo, FaRocket, 
    FaSave, FaCheckDouble, FaCheckCircle, FaTimesCircle, FaKey, FaTimes, FaArrowLeft, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';

// =========================================================================
// 💡 MOCK DATA
// =========================================================================
const initialBanks = [
    { id: 1, title: 'بنك أسئلة الفيزياء الشامل', subject: 'فيزياء', teacher: 'أ. محمد ناصر', isFree: false, isUnlocked: false, img: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500' },
    { id: 2, title: 'تحديات الكيمياء العضوية', subject: 'كيمياء', teacher: 'أ. محمود سعيد', isFree: true, isUnlocked: true, img: 'https://images.unsplash.com/photo-1603126857599-f6e157824f10?w=500' },
    { id: 3, title: 'بنك النحو والبلاغة 2026', subject: 'لغة عربية', teacher: 'أ. عبد الله السيد', isFree: false, isUnlocked: true, img: 'https://images.unsplash.com/photo-1546410531-ea4cea4331e2?w=500' }
];

const initialUnits = [
    { id: 101, bankId: 1, title: 'الوحدة الأولى: الكهربية والتيار', totalQ: 3, answered: 0, score: 0 },
    { id: 102, bankId: 1, title: 'الوحدة الثانية: التأثير المغناطيسي', totalQ: 180, answered: 0, score: 0 },
    { id: 103, bankId: 1, title: 'الوحدة الثالثة: الحث الكهرومغناطيسي', totalQ: 300, answered: 300, score: 290 },
    { id: 201, bankId: 2, title: 'أساسيات الكيمياء العضوية', totalQ: 100, answered: 0, score: 0 },
    { id: 301, bankId: 3, title: 'تدريبات النحو الشاملة', totalQ: 500, answered: 100, score: 95 }
];

const practiceQuestions = [
    { id: 'pq1', qText: "إذا زادت سرعة جسم للضعف، فإن طاقة حركته...", options: ["تظل ثابتة", "تزيد للضعف", "تزيد لأربعة أمثالها", "تقل للنصف"], correctIndex: 2, explanation: "لأن طاقة الحركة تتناسب طردياً مع مربع السرعة." },
    { id: 'pq2', qText: "وحدة قياس القوة في النظام الدولي هي:", options: ["الجول", "النيوتن", "الوات", "الباسكال"], correctIndex: 1, explanation: "النيوتن هو وحدة قياس القوة." },
    { id: 'pq3', qText: "الجسم الساكن يظل ساكناً ما لم تؤثر عليه قوة.. هذا يعبر عن:", options: ["قانون نيوتن الأول", "قانون نيوتن الثاني", "قانون بقاء الطاقة", "قانون الجذب العام"], correctIndex: 0, explanation: "هذا هو نص قانون القصور الذاتي." }
];

export default function KnowledgeBankPage() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');

    const [currentView, setCurrentView] = useState<'catalog' | 'details' | 'practice'>('catalog');
    
    const [banks, setBanks] = useState(initialBanks);
    const [units, setUnits] = useState(initialUnits);
    const [activeBank, setActiveBank] = useState<any>(null);
    const [activeUnit, setActiveUnit] = useState<any>(null);
    
    const [answeredState, setAnsweredState] = useState<Record<number, { selectedOpt: number, isCorrect: boolean }>>({});
    const [currentScore, setCurrentScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [reviewMode, setReviewMode] = useState(false); 
    
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [activationCode, setActivationCode] = useState('');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme); setLang(savedLang);
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const toggleMode = () => { setTheme(theme === 'dark' ? 'light' : 'dark'); if(theme === 'dark') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); localStorage.setItem('pixel_theme', theme === 'dark' ? 'light' : 'dark'); };
    const toggleLang = () => { const newLang = lang === 'ar' ? 'en' : 'ar'; setLang(newLang); document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('pixel_lang', newLang); };

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleBankClick = (bank: any) => {
        if (!bank.isUnlocked && !bank.isFree) {
            setActiveBank(bank);
            setActivationCode('');
            setShowCodeModal(true);
        } else {
            setActiveBank(bank);
            setCurrentView('details');
            window.scrollTo(0, 0);
        }
    };

    const handleUnlockBank = () => {
        if (activationCode.length < 4) {
            alert(lang === 'ar' ? "يرجى إدخال كود تفعيل صحيح." : "Please enter a valid code.");
            return;
        }
        setBanks(prev => prev.map(b => b.id === activeBank.id ? { ...b, isUnlocked: true } : b));
        setActiveBank((prev: any) => ({ ...prev, isUnlocked: true }));
        setShowCodeModal(false);
        showToast(lang === 'ar' ? "تم تفعيل البنك بنجاح!" : "Bank unlocked successfully!");
        setCurrentView('details');
        window.scrollTo(0, 0);
    };

    const startPractice = (unit: any, isResume: boolean) => {
        setActiveUnit(unit);
        setAnsweredState({});
        setReviewMode(false); 
        if (isResume) {
            const ratio = unit.totalQ ? unit.answered / unit.totalQ : 0;
            const simulatedCount = Math.round(ratio * practiceQuestions.length);
            setAnsweredCount(simulatedCount);
            setCurrentScore(unit.score);
        } else {
            setAnsweredCount(0);
            setCurrentScore(0);
        }
        setCurrentView('practice');
        window.scrollTo(0, 0);
    };

    const handleAnswerSelection = (qIndex: number, selectedOptIndex: number, correctIndex: number) => {
        if (answeredState[qIndex]) return; 

        const isCorrect = selectedOptIndex === correctIndex;
        setAnsweredState(prev => ({ ...prev, [qIndex]: { selectedOpt: selectedOptIndex, isCorrect } }));
        setAnsweredCount(prev => prev + 1);
        if (isCorrect) setCurrentScore(prev => prev + 1);
    };

    const updateUnitProgress = () => {
        setUnits(prev => prev.map(u => {
            if (u.id === activeUnit.id) {
                const ratio = answeredCount / practiceQuestions.length;
                return { ...u, answered: Math.round(ratio * u.totalQ), score: currentScore };
            }
            return u;
        }));
    };

    const saveProgress = () => {
        updateUnitProgress(); 
        showToast(lang === 'ar' ? "تم حفظ تقدمك بنجاح!" : "Progress saved successfully!");
        setTimeout(() => { setCurrentView('details'); window.scrollTo(0, 0); }, 1500);
    };

    const submitFinal = () => {
        const confirmMsg = answeredCount < practiceQuestions.length 
            ? (lang === 'ar' ? "لقد تركت بعض الأسئلة دون إجابة، هل أنت متأكد من حفظ التقدم والخروج؟" : "You have unanswered questions. Save and exit?")
            : (lang === 'ar' ? "هل أنت متأكد من إنهاء التدريب وتسليم الوحدة؟" : "Are you sure you want to submit the unit?");
            
        if (window.confirm(confirmMsg)) {
            updateUnitProgress(); 
            showToast(lang === 'ar' ? "تم تسجيل حلك بنجاح!" : "Progress recorded successfully!");
            setTimeout(() => { setCurrentView('details'); window.scrollTo(0, 0); }, 2000);
        }
    };

    const mistakesCount = useMemo(() => 
        Object.values(answeredState).filter(s => !s.isCorrect).length, 
    [answeredState]);

    if (!mounted) return null;

    const filteredUnits = activeBank ? units.filter(u => u.bankId === activeBank.id) : [];
    const ArrowIcon = lang === 'ar' ? FaArrowRight : FaArrowLeft;

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            <div className="kb-container" style={{ maxWidth: currentView === 'practice' ? '800px' : '1200px', margin: '0 auto' }}>

                {/* ======== 1. CATALOG VIEW ======== */}
                {currentView === 'catalog' && (
                    <div className="view-section active">
                        <div className="kb-hero">
                            <h1>{lang === 'ar' ? 'بنك المعرفة 🧠' : 'Knowledge Bank 🧠'}</h1>
                            <p>{lang === 'ar' ? 'مستودع ضخم لأسئلة المدرسين. تدرب، احفظ تقدمك، وراجع أخطاءك لتصل للعلامة الكاملة.' : 'A massive repository of questions. Practice, save progress, and review mistakes to achieve full marks.'}</p>
                        </div>

                        <div className="kb-filters">
                            <div className="kb-filters-grid">
                                <select defaultValue="all">
                                    <option value="all">{lang === 'ar' ? 'كل المراحل الدراسية' : 'All Stages'}</option>
                                </select>
                                <select defaultValue="all">
                                    <option value="all">{lang === 'ar' ? 'كل المواد' : 'All Subjects'}</option>
                                </select>
                                <select defaultValue="all">
                                    <option value="all">{lang === 'ar' ? 'كل المعلمين' : 'All Teachers'}</option>
                                </select>
                            </div>
                            <button className="btn-filter-search"><FaSearch /> {lang === 'ar' ? 'بحث متقدم' : 'Advanced Search'}</button>
                        </div>

                        <div className="kb-grid">
                            {banks.map(b => (
                                <div key={b.id} className="bank-card">
                                    <div style={{ position: 'relative' }}>
                                        {b.isFree ? (
                                            <span className="b-type-badge badge-free">{lang === 'ar' ? 'مجانى' : 'Free'}</span>
                                        ) : b.isUnlocked ? (
                                            <span className="b-type-badge badge-unlocked"><FaUnlock style={{ margin: '0 5px' }}/> {lang === 'ar' ? 'متاح لك' : 'Unlocked'}</span>
                                        ) : (
                                            <span className="b-type-badge badge-paid"><FaLock style={{ margin: '0 5px' }}/> {lang === 'ar' ? 'مدفوع' : 'Paid'}</span>
                                        )}
                                        <img src={b.img} className="b-img" alt={b.title} />
                                    </div>
                                    <div className="b-body">
                                        <span className="b-subj">{b.subject}</span>
                                        <h3 className="b-title">{b.title}</h3>
                                        <div className="b-teacher">
                                            <img src="https://via.placeholder.com/50/6c5ce7/fff?text=T" alt="Teacher" />
                                            <span>{b.teacher}</span>
                                        </div>
                                        <div className="b-footer">
                                            <button 
                                                className={`btn-enter ${!b.isFree && !b.isUnlocked ? 'locked' : ''}`}
                                                onClick={() => handleBankClick(b)}
                                            >
                                                {!b.isFree && !b.isUnlocked ? (lang === 'ar' ? 'تفعيل البنك' : 'Unlock Bank') : (lang === 'ar' ? 'تصفح البنك' : 'Browse Bank')} 
                                                {!b.isFree && !b.isUnlocked ? <FaLock /> : <ArrowIcon style={{ transform: lang==='ar' ? 'rotate(180deg)' : 'none' }}/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ======== 2. UNITS VIEW ======== */}
                {currentView === 'details' && activeBank && (
                    <div className="view-section active">
                        <div className="kb-header-action">
                            <button className="btn-back" onClick={() => setCurrentView('catalog')}>
                                <ArrowIcon /> {lang === 'ar' ? 'العودة للكتالوج' : 'Back to Catalog'}
                            </button>
                        </div>

                        <div className="bank-details-hero">
                            <h2>{activeBank.title}</h2>
                            <p><FaChalkboardTeacher style={{ margin: '0 8px' }}/> {activeBank.teacher}</p>
                        </div>

                        <h3 style={{ marginBottom: '20px', fontWeight: 900 }}><FaLayerGroup style={{ margin: '0 8px' }}/> {lang === 'ar' ? 'الوحدات التدريبية' : 'Training Units'}</h3>
                        
                        <div className="units-list">
                            {filteredUnits.map(u => {
                                const percent = u.totalQ ? Math.round((u.answered / u.totalQ) * 100) : 0;
                                return (
                                    <div key={u.id} className="unit-item">
                                        <div className="unit-info">
                                            <h3>{u.title}</h3>
                                            <p>
                                                <span><FaDatabase style={{ margin: '0 5px' }}/> {u.totalQ} {lang === 'ar' ? 'سؤال' : 'Q'}</span>
                                                <span style={{ color: '#f1c40f' }}>
                                                    <FaChartPie style={{ margin: '0 5px' }}/> 
                                                    {lang === 'ar' ? 'الإنجاز:' : 'Progress:'} {percent}% ({u.answered} {lang === 'ar' ? 'مجاب' : 'Answered'})
                                                </span>
                                            </p>
                                        </div>
                                        <div className="unit-actions">
                                            {u.answered > 0 && u.answered < u.totalQ ? (
                                                <>
                                                    <button className="btn-unit-action" style={{ background: 'var(--p-purple)', color: 'white' }} onClick={() => startPractice(u, true)}><FaPlay /> {lang === 'ar' ? 'استكمال' : 'Resume'}</button>
                                                    <button className="btn-unit-action" style={{ background: 'transparent', border: '2px solid var(--p-purple)', color: 'var(--txt)' }} onClick={() => startPractice(u, false)}><FaRedo /> {lang === 'ar' ? 'إعادة' : 'Restart'}</button>
                                                </>
                                            ) : u.answered === u.totalQ && u.totalQ > 0 ? (
                                                <button className="btn-unit-action" style={{ background: 'transparent', border: '2px solid var(--p-purple)', color: 'var(--txt)' }} onClick={() => startPractice(u, false)}><FaRedo /> {lang === 'ar' ? 'تدريب من جديد' : 'Practice Again'}</button>
                                            ) : (
                                                <button className="btn-unit-action" style={{ background: 'var(--p-purple)', color: 'white' }} onClick={() => startPractice(u, false)}><FaRocket /> {lang === 'ar' ? 'ابدأ التدريب' : 'Start Practice'}</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ======== 3. PRACTICE VIEW ======== */}
                {currentView === 'practice' && activeUnit && (
                    <div className="view-section active">
                        {/* 💡 الحل النهائي: Fixed + Spacer */}
                        <div style={{ 
                            position: 'fixed', 
                            top: '80px', 
                            left: 0,
                            right: 0,
                            background: 'var(--bg)', 
                            padding: '15px 20px', 
                            borderBottom: '2px solid rgba(108,92,231,0.2)', 
                            zIndex: 200, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center'
                        }}>
                            <div style={{ maxWidth: '800px', width: '100%' }}>
                                <div className="practice-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 900, fontSize: '1.1rem' }}>
                                    <div>{lang === 'ar' ? 'تم حل:' : 'Answered:'} {answeredCount} {lang === 'ar' ? 'من' : 'of'} {practiceQuestions.length}</div>
                                    <div className="live-score" style={{ color: '#f1c40f' }}>{lang === 'ar' ? 'النقاط:' : 'Score:'} <span style={{ fontWeight: 900 }}>{currentScore}</span></div>
                                </div>
                                <div className="practice-track" style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div className="practice-fill" style={{ height: '100%', background: '#2ecc71', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', width: `${Math.min((answeredCount / practiceQuestions.length) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* 💡 Spacer يحجز مكان الـ Fixed Bar عشان السؤال الأول يظهر سليم */}
                        <div style={{ height: '90px' }}></div>

                        <div className="questions-wrapper" style={{ paddingBottom: '40px' }}>
                            {practiceQuestions.map((q, qIndex) => {
                                const isAnswered = answeredState[qIndex] !== undefined;
                                const state = answeredState[qIndex] ?? null; 
                                const displayQNum = qIndex + 1; 

                                if (reviewMode && (!state || state.isCorrect)) return null;

                                return (
                                    <div key={q.id} className="kb-q-box" style={{ background: 'var(--card)', border: `2px solid ${isAnswered ? 'rgba(255,255,255,0.1)' : 'rgba(108,92,231,0.3)'}`, borderRadius: '20px', padding: '30px', marginBottom: '30px', transition: '0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                        <div className="kb-q-text" style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '25px', lineHeight: 1.6 }}><span style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'س' : 'Q'}{displayQNum}:</span> {q.qText}</div>
                                        
                                        <div className="kb-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {q.options.map((opt, optIndex) => {
                                                let btnClass = "kb-opt-btn";
                                                let icon = null;

                                                if (state) {
                                                    if (optIndex === q.correctIndex) {
                                                        btnClass += " kb-correct";
                                                        icon = <FaCheckCircle style={{ opacity: state.selectedOpt === q.correctIndex ? 1 : 0.5, fontSize: '1.2rem' }} />;
                                                    } else if (optIndex === state.selectedOpt) {
                                                        btnClass += " kb-wrong";
                                                        icon = <FaTimesCircle style={{ fontSize: '1.2rem' }}/>;
                                                    }
                                                }

                                                return (
                                                    <button 
                                                        key={optIndex} 
                                                        className={btnClass} 
                                                        disabled={isAnswered}
                                                        onClick={() => handleAnswerSelection(qIndex, optIndex, q.correctIndex)}
                                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', width: '100%', textAlign: lang === 'ar' ? 'right' : 'left', padding: '18px 20px', fontSize: '1.1rem' }}
                                                    >
                                                        <span style={{ flex: 1, wordBreak: 'break-word', lineHeight: '1.5' }}>{opt}</span> 
                                                        <span style={{ minWidth: '24px', textAlign: 'center' }}>{icon}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {state && (
                                            <div className={`kb-feedback ${state.isCorrect ? 'f-correct' : 'f-wrong'} show`} style={{ marginTop: '20px', padding: '15px 20px', borderRadius: '12px', fontWeight: 'bold', lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                                                <div style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                                                    {state.isCorrect ? (lang === 'ar' ? '✨ إجابة صحيحة رائعة!' : '✨ Correct Answer!') : (lang === 'ar' ? '❌ إجابة خاطئة.. تعلم من خطأك!' : '❌ Wrong Answer.. learn from it!')}
                                                </div>
                                                <div style={{ opacity: 0.9 }}><b>{lang === 'ar' ? 'التفسير:' : 'Explanation:'}</b> {q.explanation}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="practice-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', padding: '30px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', flexWrap: 'wrap', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)' }}>
                            {mistakesCount > 0 && (
                                <button className="btn-unit-action" style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }} onClick={() => setReviewMode(!reviewMode)}>
                                    {reviewMode ? <FaEyeSlash /> : <FaEye />} 
                                    {reviewMode ? (lang === 'ar' ? 'عرض كل الأسئلة' : 'Show All Questions') : (lang === 'ar' ? `راجع أخطاءك (${mistakesCount})` : `Review Mistakes (${mistakesCount})`)}
                                </button>
                            )}

                            <button className="btn-unit-action" style={{ background: 'transparent', border: '2px solid var(--p-purple)', color: 'var(--txt)', padding: '12px 25px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }} onClick={saveProgress}>
                                <FaSave /> {lang === 'ar' ? 'حفظ التقدم' : 'Save Progress'}
                            </button>
                            <button className="btn-unit-action" style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }} onClick={submitFinal}>
                                <FaCheckDouble /> {lang === 'ar' ? 'إنهاء وتسليم' : 'Submit'}
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* ======== CODE MODAL ======== */}
            {showCodeModal && (
                <div className="kb-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="kb-modal-box" style={{ background: 'var(--h-bg)', border: '2px solid var(--p-purple)', borderRadius: '20px', padding: '30px', textAlign: 'center', maxWidth: '450px', width: '100%', position: 'relative' }}>
                        <button className="kb-modal-close" style={{ position: 'absolute', top: '15px', left: lang === 'ar' ? '15px' : 'auto', right: lang === 'ar' ? 'auto' : '15px', background: 'none', border: 'none', color: '#e74c3c', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowCodeModal(false)}><FaTimes /></button>
                        <FaKey style={{ fontSize: '3rem', color: 'var(--p-purple)', marginBottom: '15px' }} />
                        <h3 style={{ fontSize: '1.6rem', color: 'var(--p-purple)', marginBottom: '10px', fontWeight: 900 }}>{lang === 'ar' ? 'تفعيل البنك المدفوع' : 'Activate Paid Bank'}</h3>
                        <p style={{ marginBottom: '25px', opacity: 0.9, fontWeight: 'bold' }}>{lang === 'ar' ? 'هذا البنك مغلق ويحتاج إلى كود تفعيل خاص لفتحه.' : 'This bank is locked and requires an activation code.'}</p>
                        
                        <div style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px dashed #25D366', padding: '10px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                            <FaWhatsapp style={{ fontSize: '1.5rem', color: '#25D366' }} />
                            <span>{lang === 'ar' ? 'للحصول على الكود، تواصل مع' : 'To get the code, contact'} <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'underline' }}>{lang === 'ar' ? 'الدعم الفني' : 'Support'}</a>.</span>
                        </div>

                        <div style={{ marginBottom: '25px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'أدخل كود التفعيل هنا:' : 'Enter Code Here:'}</label>
                            <input 
                                type="text" 
                                placeholder="XXXX-XXXX" 
                                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '2px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', fontWeight: 900, fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '3px', outline: 'none' }}
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                            />
                        </div>
                        
                        <button className="btn-unit-action" style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 900, width: '100%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} onClick={handleUnlockBank}>
                            <FaUnlock /> {lang === 'ar' ? 'تحقق وفتح البنك' : 'Verify & Unlock'}
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ position: 'fixed', bottom: '30px', right: lang === 'ar' ? '30px' : 'auto', left: lang === 'ar' ? 'auto' : '30px', background: '#2ecc71', color: 'white', padding: '15px 25px', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 5px 20px rgba(0,0,0,0.3)', transform: toastMsg ? 'translateY(0)' : 'translateY(100px)', opacity: toastMsg ? 1 : 0, transition: '0.4s ease', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' }}>
                <FaCheckCircle /> <span>{toastMsg}</span>
            </div>

            <Footer />
        </main>
    );
}