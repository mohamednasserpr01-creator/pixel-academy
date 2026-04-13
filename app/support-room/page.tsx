"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
    FaHandsHelping, FaLock, FaUserPlus, FaUserTie, FaUserNurse, 
    FaCalendarDay, FaCalendarTimes, FaCalendarCheck, FaPhoneVolume, 
    FaCheck, FaTimesCircle, FaCheckCircle, FaExclamationCircle 
} from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';

// =========================================================================
// 💡 MOCK DATA: الهيكل الجديد يدعم عدد المقاعد المتبقية
// =========================================================================
const initialScheduleData = {
    male: [
        { 
            day: "السبت", date: "21 مارس 2026", 
            slots: [
                { time: "10:00 ص", isBooked: false, remaining: 3 },
                { time: "10:30 ص", isBooked: false, remaining: 1 }, // هيظهر بلون أحمر للتحفيز
                { time: "11:00 ص", isBooked: false, remaining: 2 },
                { time: "11:30 ص", isBooked: true, remaining: 0 },
                { time: "12:00 م", isBooked: false, remaining: 4 },
                { time: "12:30 م", isBooked: false, remaining: 1 },
                { time: "02:00 م", isBooked: true, remaining: 0 },
            ] 
        },
        { 
            day: "الإثنين", date: "23 مارس 2026", 
            slots: [
                { time: "05:00 م", isBooked: false, remaining: 2 },
                { time: "07:00 م", isBooked: false, remaining: 5 },
                { time: "08:30 م", isBooked: false, remaining: 1 },
            ] 
        },
        { 
            day: "الأربعاء", date: "25 مارس 2026", 
            slots: [
                { time: "01:00 م", isBooked: true, remaining: 0 },
                { time: "03:00 م", isBooked: false, remaining: 2 }
            ] 
        }
    ],
    female: [] 
};

export default function SupportRoomPage() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');

    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [specType, setSpecType] = useState<'male' | 'female'>('male');
    const [scheduleData, setScheduleData] = useState(initialScheduleData);
    const [hasBookedThisWeek, setHasBookedThisWeek] = useState(false); 
    
    const [showModal, setShowModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<{ day: string, date: string, time: string } | null>(null);
    
    // 💡 تطوير الـ Toast ليدعم الخطأ والنجاح
    const [toastData, setToastData] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

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

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastData({ msg, type });
        setTimeout(() => setToastData(null), 3000);
    };

    const handleSlotClick = (day: string, date: string, time: string) => {
        if (hasBookedThisWeek) {
            // 💡 استبدال الـ alert بـ Error Toast
            showToast(lang === 'ar' ? "عذراً! لقد حجزت جلسة بالفعل هذا الأسبوع." : "Sorry! You already booked a session this week.", 'error');
            return;
        }
        setPendingBooking({ day, date, time });
        setShowModal(true);
    };

    const confirmBooking = () => {
        if (!pendingBooking) return;

        setScheduleData(prev => {
            const newData = { ...prev };
            const dayData = newData[specType].find(d => d.day === pendingBooking.day);
            if (dayData) {
                const slotIndex = dayData.slots.findIndex(s => s.time === pendingBooking.time);
                if (slotIndex !== -1) {
                    // 💡 تقليل عدد المقاعد برمجياً
                    dayData.slots[slotIndex].remaining -= 1;
                    if (dayData.slots[slotIndex].remaining <= 0) {
                        dayData.slots[slotIndex].isBooked = true;
                    }
                }
            }
            return newData;
        });

        setHasBookedThisWeek(true);
        setShowModal(false);
        showToast(lang === 'ar' ? "تم تأكيد الحجز بنجاح!" : "Booking confirmed successfully!", 'success');
    };

    if (!mounted) return null;

    const currentData = scheduleData[specType];

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '100px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            <div className="support-hero">
                <h1><FaHandsHelping style={{ color: '#0984e3' }} /> {lang === 'ar' ? 'الدعم النفسي والأكاديمي' : 'Psychological & Academic Support'}</h1>
                <p>{lang === 'ar' ? 'نحن هنا لمساعدتك على تجاوز ضغوط الدراسة وتوجيهك نفسياً وأكاديمياً لتحقيق أفضل نسخة من نفسك.' : 'We are here to help you overcome study pressures and guide you to become the best version of yourself.'}</p>
            </div>

            <div className="support-container">
                
                {/* ======== STATE 1: LOCKED ======== */}
                {!isLoggedIn && (
                    <div className="locked-state">
                        <FaLock className="locked-icon" />
                        <h2>{lang === 'ar' ? 'المواعيد غير متاحة للزوار' : 'Appointments are not available for visitors'}</h2>
                        <p>{lang === 'ar' ? 'لحماية خصوصيتك ولتتمكن من حجز جلسة إرشادية، يرجى تسجيل الدخول.' : 'To protect your privacy and book a session, please log in.'}</p>
                        <button className="btn-register-now" onClick={() => setIsLoggedIn(true)}>
                            <FaUserPlus /> {lang === 'ar' ? 'سجل الآن لظهور المواعيد' : 'Login to view schedule'}
                        </button>
                    </div>
                )}

                {/* ======== STATE 2: BOOKING ======== */}
                {isLoggedIn && (
                    <div className="booking-state">
                        <div className="specialist-tabs">
                            <button className={`tab-btn ${specType === 'male' ? 'active' : ''}`} onClick={() => setSpecType('male')}>
                                <FaUserTie /> {lang === 'ar' ? 'حجز مع متخصص' : 'Male Specialist'}
                            </button>
                            <button className={`tab-btn ${specType === 'female' ? 'active' : ''}`} onClick={() => setSpecType('female')}>
                                <FaUserNurse /> {lang === 'ar' ? 'حجز مع متخصصة' : 'Female Specialist'}
                            </button>
                        </div>
                        
                        <div className="schedule-grid">
                            {currentData.length === 0 ? (
                                <div className="empty-state">
                                    <FaCalendarTimes style={{ fontSize: '4rem', color: 'var(--locked)', marginBottom: '20px' }} />
                                    <h3>{lang === 'ar' ? 'لا تتوفر مواعيد حالياً' : 'No appointments available'}</h3>
                                    <p>{lang === 'ar' ? 'برجاء التواصل مع الدعم الفني في حالة وجود مشكلة تقنية.' : 'Please contact support if there is a technical issue.'}</p>
                                    <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ textDecoration: 'none' }}>
                                        <FaWhatsapp /> {lang === 'ar' ? 'تواصل مع الدعم الفني' : 'Contact Support'}
                                    </a>
                                </div>
                            ) : (
                                currentData.map((dayObj, idx) => (
                                    <div key={idx} className="day-card">
                                        <div className="day-header">
                                            <div className="day-icon"><FaCalendarDay /></div>
                                            <div>
                                                <div className="day-title">{dayObj.day}</div>
                                                <div className="day-date">{dayObj.date}</div>
                                            </div>
                                        </div>
                                        <div className="slots-container">
                                            {dayObj.slots.map((slot, sIdx) => {
                                                return (
                                                    <button 
                                                        key={sIdx} 
                                                        className={`time-slot ${slot.isBooked ? 'booked' : ''}`} 
                                                        disabled={slot.isBooked}
                                                        onClick={() => handleSlotClick(dayObj.day, dayObj.date, slot.time)}
                                                        // 💡 تنسيق لدعم إظهار المقاعد المتبقية تحت الوقت
                                                        style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <span>{slot.time}</span>
                                                        
                                                        {/* إظهار المقاعد لو مش محجوز بالكامل */}
                                                        {!slot.isBooked && (
                                                            <span style={{ fontSize: '0.75rem', opacity: slot.remaining === 1 ? 1 : 0.8, color: slot.remaining === 1 ? '#ff7675' : 'inherit' }}>
                                                                {lang === 'ar' ? `(${slot.remaining} أماكن)` : `(${slot.remaining} seats)`}
                                                            </span>
                                                        )}
                                                        
                                                        {/* إظهار كلمة محجوز لو خلصت المقاعد */}
                                                        {slot.isBooked && (
                                                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                                                {lang === 'ar' ? '(محجوز)' : '(Booked)'}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* ======== BOOKING MODAL ======== */}
            {showModal && pendingBooking && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: 'var(--card)', width: '100%', maxWidth: '450px', borderRadius: '20px', border: '2px solid #0984e3', padding: '30px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', left: lang === 'ar' ? '15px' : 'auto', right: lang === 'ar' ? 'auto' : '15px', background: 'none', border: 'none', color: '#e74c3c', fontSize: '1.5rem', cursor: 'pointer' }}>
                            <FaTimesCircle />
                        </button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <FaCalendarCheck style={{ fontSize: '3rem', color: '#0984e3', marginBottom: '15px' }} />
                            <h2 style={{ color: 'var(--txt)', fontWeight: 900, fontSize: '1.5rem' }}>{lang === 'ar' ? 'تأكيد حجز الجلسة' : 'Confirm Booking'}</h2>
                        </div>

                        <div style={{ background: 'rgba(128,128,128,0.1)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(128,128,128,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '1px dashed rgba(128,128,128,0.3)', paddingBottom: '10px', color: 'var(--txt)' }}>
                                <span>{lang === 'ar' ? 'النوع:' : 'Specialist:'}</span>
                                <span style={{ color: '#0984e3' }}>{specType === 'male' ? (lang === 'ar' ? 'متخصص (دعم نفسي)' : 'Male Specialist') : (lang === 'ar' ? 'متخصصة (دعم نفسي)' : 'Female Specialist')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '1px dashed rgba(128,128,128,0.3)', paddingBottom: '10px', color: 'var(--txt)' }}>
                                <span>{lang === 'ar' ? 'اليوم:' : 'Day:'}</span>
                                <span style={{ color: '#0984e3' }}>{pendingBooking.day}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '1px dashed rgba(128,128,128,0.3)', paddingBottom: '10px', color: 'var(--txt)' }}>
                                <span>{lang === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                                <span style={{ color: '#0984e3' }}>{pendingBooking.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--txt)' }}>
                                <span>{lang === 'ar' ? 'الساعة:' : 'Time:'}</span>
                                <span style={{ color: '#0984e3' }}>{pendingBooking.time}</span>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(9, 132, 227, 0.1)', border: '1px dashed #0984e3', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
                            <FaPhoneVolume style={{ fontSize: '1.5rem', color: '#0984e3', marginBottom: '10px' }} />
                            <p style={{ fontSize: '0.95rem', opacity: 0.9, fontWeight: 'bold', lineHeight: 1.6, color: 'var(--txt)' }}>
                                {lang === 'ar' ? 'سيقوم المتخصص بالتواصل معك هاتفياً على الرقم المسجل بحسابك في الموعد المحدد. يرجى التأكد من تواجدك في مكان هادئ.' : 'The specialist will call you on your registered phone number. Please ensure you are in a quiet place.'}
                            </p>
                        </div>

                        <button onClick={confirmBooking} style={{ width: '100%', background: '#2ecc71', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)' }}>
                            <FaCheck /> {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm'}
                        </button>
                    </div>
                </div>
            )}

            {/* 💡 Toast Notification with Dynamic Colors */}
            <div className={`toast ${toastData ? 'show' : ''}`} style={{ 
                position: 'fixed', bottom: '30px', 
                right: lang === 'ar' ? '30px' : 'auto', 
                left: lang === 'ar' ? 'auto' : '30px', 
                background: toastData?.type === 'error' ? '#e74c3c' : '#2ecc71', 
                color: 'white', padding: '15px 25px', borderRadius: '10px', 
                fontWeight: 'bold', boxShadow: '0 5px 20px rgba(0,0,0,0.3)', 
                transform: toastData ? 'translateY(0)' : 'translateY(100px)', 
                opacity: toastData ? 1 : 0, transition: '0.4s ease', 
                zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' 
            }}>
                {toastData?.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />} 
                <span>{toastData?.msg}</span>
            </div>

            <Footer />
        </main>
    );
}