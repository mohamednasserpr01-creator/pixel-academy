"use client";
import React, { useState, useEffect, use } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { 
    FaVideo, FaFilePdf, FaClipboardCheck, FaWallet, FaLock, 
    FaPlayCircle, FaClock, FaTasks, FaCheckCircle, FaLink, FaPencilAlt, FaEye
} from 'react-icons/fa';
import Link from 'next/link'; // 💡 السطر اللي كان ناقص لحل الإيرور

// =========================================================================
// 💡 MOCK API DATA (هتستبدل بـ fetch request من الباك إند)
// =========================================================================
const fetchCourseData = async (id: string) => {
    // محاكاة سريعة لبيانات الكورس والحصص
    const mockLectures = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1, titleAr: `المحاضرة رقم ${i + 1}`, titleEn: `Lecture ${i + 1}`, 
        price: 50, isPurchased: i === 0, isCompleted: false,
        items: [
            { type: 'video', titleAr: "فيديو الشرح الأساسي", titleEn: "Main Video", time: "25:00", maxV: 3, currV: 1, req: true },
            { type: 'pdf', titleAr: "ملف الشرح (PDF)", titleEn: "Lecture PDF", req: false },
            { type: 'homework', titleAr: "الواجب المنزلي", titleEn: "Homework", req: true },
            { type: 'exam', titleAr: "امتحان العبور", titleEn: "Exam", req: true }
        ]
    }));

    return {
        id, titleAr: "المراجعة النهائية والتأسيس - 2026", titleEn: "Final Revision 2026", 
        price: 1500, isPurchased: false, img: "https://images.unsplash.com/photo-1434031211128-095490e7e73b?w=800",
        stats: { vid: 450, pdf: 120, mEx: 200 },
        lectures: mockLectures
    };
};

export default function CourseDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const courseId = resolvedParams.id;

    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');
    
    // Course & Wallet States
    const [course, setCourse] = useState<any>(null);
    const [wallet, setWallet] = useState(25); // الرصيد المبدئي
    const [openLectures, setOpenLectures] = useState<number[]>([]); // للتحكم في الحصص المفتوحة
    const [visibleCount, setVisibleCount] = useState(10);
    
    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<{type: 'course'|'lec', price: number, id?: number} | null>(null);
    const [rechargeCode, setRechargeCode] = useState('');

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme); setLang(savedLang);
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

        fetchCourseData(courseId).then(data => setCourse(data));
    }, [courseId]);

    const toggleMode = () => { setTheme(theme === 'dark' ? 'light' : 'dark'); if(theme === 'dark') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); localStorage.setItem('pixel_theme', theme === 'dark' ? 'light' : 'dark'); };
    const toggleLang = () => { const newLang = lang === 'ar' ? 'en' : 'ar'; setLang(newLang); document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('pixel_lang', newLang); };

    // ================= PURCHASE LOGIC =================
    const handlePurchaseClick = (type: 'course'|'lec', price: number, id?: number, e?: React.MouseEvent) => {
        if(e) e.stopPropagation();
        setPendingAction({ type, price, id });
        
        if (wallet < price) {
            setShowModal(true); // افتح مودال الشحن لو الرصيد ميكفيش
        } else {
            if(window.confirm(lang === 'ar' ? `تأكيد خصم ${price} ج.م والاشتراك؟` : `Confirm ${price} EGP deduction?`)) {
                executePurchase({ type, price, id });
            }
        }
    };

    const executePurchase = (action: {type: 'course'|'lec', price: number, id?: number}) => {
        setWallet(prev => prev - action.price);
        
        // Update Course State (عشان الـ UI يتحدث فوراً)
        setCourse((prev: any) => {
            const newData = { ...prev };
            if (action.type === 'course') {
                newData.isPurchased = true;
            } else {
                const lecIndex = newData.lectures.findIndex((l:any) => l.id === action.id);
                if (lecIndex > -1) newData.lectures[lecIndex].isPurchased = true;
            }
            return newData;
        });
        setShowModal(false);
    };

    const handleRechargeAndBuy = () => {
        if (rechargeCode.length < 16) {
            alert(lang === 'ar' ? 'برجاء إدخال كود الشحن الصحيح (16 رقم)' : 'Please enter a valid 16-digit code');
            return;
        }
        // Simulated API Recharge Success
        setWallet(prev => prev + 1500); 
        if (pendingAction) executePurchase(pendingAction);
    };

    const toggleLecture = (id: number) => {
        setOpenLectures(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    };

    if (!mounted || !course) return null;

    // Helper: Icons Mapper
    const iconMap: any = { video: <FaVideo />, pdf: <FaFilePdf />, homework: <FaPencilAlt />, exam: <FaClipboardCheck />, link: <FaLink /> };

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            
            {/* Custom Navbar (with Wallet) */}
            <header style={{ position: 'fixed', top:0, width:'100%', padding:'10px 3%', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:1000, backdropFilter:'blur(12px)', borderBottom: '2px solid var(--p-purple)', background: 'var(--h-bg)' }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.png" alt="Pixel Academy" style={{ height: '40px' }} />
                </div>
                <nav className="mobile-only" style={{ display: 'flex', gap: '15px' }}>
                    <Link href="/" style={{ color: 'var(--txt)', fontWeight: 'bold' }}>{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                    <Link href="/teachers" style={{ color: 'var(--txt)', fontWeight: 'bold' }}>{lang === 'ar' ? 'المدرسين' : 'Teachers'}</Link>
                </nav>
                <div className="toolbar" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button className="icon-btn" onClick={toggleMode} style={{ background:'transparent', border:'none', color:'var(--p-purple)', fontSize:'1.4rem' }}>{theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}</button>
                    <div style={{ border: '2px solid var(--p-purple)', padding: '6px 12px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaWallet style={{ color: 'var(--p-purple)' }} /> {wallet} <span className="mobile-hide">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="course-hero">
                <img src={course.img} alt="Course Cover" className="course-img" />
                <div className="course-info">
                    <h1>{lang === 'ar' ? course.titleAr : course.titleEn}</h1>
                    <div className="stats-grid">
                        <div className="stat-badge"><FaVideo style={{ color:'var(--p-purple)' }} /> {course.stats.vid} {lang === 'ar' ? 'فيديو' : 'Videos'}</div>
                        <div className="stat-badge"><FaFilePdf style={{ color:'var(--p-purple)' }} /> {course.stats.pdf} PDF</div>
                        <div className="stat-badge"><FaClipboardCheck style={{ color:'#e74c3c' }} /> {course.stats.mEx} {lang === 'ar' ? 'إجباري' : 'Mandatory'}</div>
                    </div>
                    <div className="purchase-card">
                        <div>
                            <span style={{ display:'block', marginBottom:'5px' }}>{lang === 'ar' ? 'سعر الكورس كاملاً' : 'Full Course Price'}</span>
                            <h3 style={{ fontSize:'1.5rem', margin:0 }}>{course.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</h3>
                        </div>
                        <button 
                            className="btn-main-buy" 
                            onClick={() => handlePurchaseClick('course', course.price)}
                            disabled={course.isPurchased}
                        >
                            {course.isPurchased ? (lang === 'ar' ? '✅ مشترك' : 'Subscribed') : (lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Syllabus Section */}
            <section className="syllabus-section">
                <h2 style={{ fontSize: '2rem', fontWeight: 900, borderRight: lang==='ar'?'6px solid var(--p-purple)':'none', borderLeft: lang==='en'?'6px solid var(--p-purple)':'none', paddingRight: lang==='ar'?'15px':'0', paddingLeft: lang==='en'?'15px':'0', marginBottom: '35px' }}>
                    {lang === 'ar' ? 'رحلتك التعليمية 📍' : 'Your Journey 📍'}
                </h2>
                
                {course.lectures.slice(0, visibleCount).map((lec: any, index: number) => {
                    const isBought = course.isPurchased || lec.isPurchased;
                    const isLocked = index > 0 && !course.lectures[index-1].isCompleted && !isBought; // Logic القفل
                    const reqCount = lec.items.filter((i:any) => i.req).length;
                    const isOpen = openLectures.includes(lec.id);

                    return (
                        <div key={lec.id} className="lec-wrapper">
                            <div className="lec-header" onClick={() => toggleLecture(lec.id)}>
                                <div className="lec-main">
                                    <h3>
                                        {isLocked ? <FaLock style={{ color:'var(--p-purple)' }}/> : <FaPlayCircle style={{ color:'var(--p-purple)' }}/>} 
                                        {lang === 'ar' ? lec.titleAr : lec.titleEn}
                                    </h3>
                                    <div className="lec-tags">
                                        <span className="tag"><FaClock style={{ color:'var(--p-purple)' }}/> 45 {lang === 'ar' ? 'دقيقة' : 'Mins'}</span>
                                        <span className="tag"><FaTasks style={{ color:'#f1c40f' }}/> {reqCount} {lang === 'ar' ? 'مهام إجبارية' : 'Mandatory Tasks'}</span>
                                    </div>
                                </div>
                                <div className="lec-actions">
                                    {isBought ? (
                                        <>
                                            <FaCheckCircle className="check-icon" />
                                            <button className="btn-start" onClick={(e) => { e.stopPropagation(); alert('Start!'); }}>{lang === 'ar' ? 'ابدأ' : 'Start'}</button>
                                        </>
                                    ) : (
                                        <button className="btn-subscribe-lec" onClick={(e) => handlePurchaseClick('lec', lec.price, lec.id, e)}>
                                            {lang === 'ar' ? `اشتراك ${lec.price} ج.م` : `Buy for ${lec.price} EGP`}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Lecture Items (Dropdown) */}
                            {isOpen && (
                                <div className="lec-body">
                                    {lec.items.map((item: any, i: number) => {
                                        const isVideoLimit = item.type === 'video' && item.currV >= item.maxV;
                                        return (
                                            <div key={i} className="item-row">
                                                <div style={{ flex: 1 }}>
                                                    <div className="item-title">
                                                        <h4><span className="item-icon">{iconMap[item.type]}</span> {lang === 'ar' ? item.titleAr : item.titleEn} {item.req && <span className="tag-mandatory">[{lang === 'ar' ? 'إجباري' : 'Req'}]</span>}</h4>
                                                    </div>
                                                    {item.type === 'video' && (
                                                        <div className="item-meta">
                                                            <span><FaClock style={{ color:'var(--p-purple)' }}/> {item.time}</span>
                                                            <span style={{ color: isVideoLimit ? '#e74c3c' : '#f1c40f' }}><FaEye /> {lang === 'ar' ? 'مشاهدات' : 'Views'}: {item.currV}/{item.maxV}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button className="btn-open" disabled={isVideoLimit}>
                                                    {isVideoLimit ? (lang === 'ar' ? 'انتهى' : 'Ended') : (lang === 'ar' ? 'فتح' : 'Open')}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
                
                {visibleCount < course.lectures.length && (
                    <button className="btn-open" style={{ display: 'block', margin: '40px auto', width: '220px' }} onClick={() => setVisibleCount(prev => prev + 10)}>
                        {lang === 'ar' ? 'عرض المزيد' : 'Load More'}
                    </button>
                )}
            </section>

            {/* Recharge Modal */}
            <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
                <div className="modal-box">
                    <div className="modal-icon-box"><FaWallet style={{ fontSize: '2rem', color: '#f1c40f' }} /></div>
                    <h2 style={{ color: '#f1c40f', marginBottom: '10px' }}>{lang === 'ar' ? 'رصيدك غير كافٍ!' : 'Insufficient Balance!'}</h2>
                    <p style={{ opacity: 0.8, lineHeight: 1.6 }}>{lang === 'ar' ? 'تحتاج لشحن محفظتك لإتمام عملية الاشتراك.' : 'You need to recharge your wallet.'}</p>
                    
                    <div className="code-input-wrapper">
                        <input 
                            type="text" 
                            className="code-input" 
                            placeholder="XXXX-XXXX-XXXX-XXXX" 
                            maxLength={16}
                            value={rechargeCode}
                            onChange={(e) => setRechargeCode(e.target.value)}
                        />
                    </div>

                    <button className="btn-open" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} onClick={handleRechargeAndBuy}>
                        {lang === 'ar' ? 'تأكيد العملية' : 'Confirm'}
                    </button>
                    <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--txt)', marginTop: '20px', cursor: 'pointer' }}>
                        {lang === 'ar' ? 'إلغاء العملية' : 'Cancel'}
                    </button>
                </div>
            </div>

            <Footer />
        </main>
    );
}