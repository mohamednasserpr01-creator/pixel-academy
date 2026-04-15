"use client";
import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

import { 
    FaHandsHelping, FaLock, FaUserPlus, FaUserTie, FaUserNurse, 
    FaCalendarAlt, FaCalendarTimes, FaCalendarCheck, FaPhoneVolume, 
    FaCheck, FaTimesCircle, FaCheckCircle, FaExclamationCircle 
} from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';

// =========================================================================
// 💡 MOCK DATA: مطابقة للتصميم ومجهزة لاستقبال الـ API
// =========================================================================
const initialScheduleData = {
    male: [
        { 
            day: "السبت", date: "21 مارس 2026", 
            slots: [
                { time: "10:00 ص", isBooked: false },
                { time: "10:30 ص", isBooked: false },
                { time: "11:00 ص", isBooked: false },
                { time: "11:30 ص", isBooked: true }, 
                { time: "12:00 م", isBooked: false },
                { time: "12:30 م", isBooked: false },
                { time: "01:00 م", isBooked: true }, 
                { time: "02:00 م", isBooked: true }, 
                { time: "03:00 م", isBooked: false },
                { time: "04:00 م", isBooked: false },
                { time: "05:00 م", isBooked: false },
                { time: "06:00 م", isBooked: true }, 
            ] 
        },
        { 
            day: "الإثنين", date: "23 مارس 2026", 
            slots: [
                { time: "05:00 م", isBooked: false },
                { time: "07:00 م", isBooked: false },
                { time: "08:30 م", isBooked: false },
                { time: "09:00 م", isBooked: false },
            ] 
        },
        { 
            day: "الأربعاء", date: "25 مارس 2026", 
            slots: [
                { time: "01:00 م", isBooked: true },
                { time: "03:00 م", isBooked: false },
                { time: "09:00 م", isBooked: false },
            ] 
        }
    ],
    female: [] 
};

export default function SupportRoomPage() {
    const { lang } = useSettings();

    // 💡 للحظة الحالية، بنفترض إن الطالب مسجل دخول عشان نعرض التصميم
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [specType, setSpecType] = useState<'male' | 'female'>('male');
    const [scheduleData, setScheduleData] = useState(initialScheduleData);
    const [hasBookedThisWeek, setHasBookedThisWeek] = useState(false); 
    
    const [showModal, setShowModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<{ day: string, date: string, time: string } | null>(null);
    const [toastData, setToastData] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastData({ msg, type });
        setTimeout(() => setToastData(null), 3000);
    };

    const handleSlotClick = (day: string, date: string, time: string) => {
        if (hasBookedThisWeek) {
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
                    dayData.slots[slotIndex].isBooked = true;
                }
            }
            return newData;
        });

        setHasBookedThisWeek(true);
        setShowModal(false);
        showToast(lang === 'ar' ? "تم تأكيد الحجز بنجاح!" : "Booking confirmed successfully!", 'success');
    };

    const currentData = scheduleData[specType];

    return (
        <main className="page-wrapper">

            <div className="support-hero" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
                <h1 style={{ color: '#0984e3', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    {lang === 'ar' ? 'الدعم النفسي والأكاديمي' : 'Psychological & Academic Support'} <FaHandsHelping />
                </h1>
                <p style={{ color: 'var(--txt)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', fontWeight: 'bold' }}>
                    {lang === 'ar' ? 'نحن هنا لمساعدتك على تجاوز ضغوط الدراسة وتوجيهك نفسياً وأكاديمياً لتحقيق أفضل نسخة من نفسك.' : 'We are here to help you overcome study pressures and guide you to become the best version of yourself.'}
                </p>
            </div>

            <div className="support-container">
                
                {/* ======== STATE 1: LOCKED ======== */}
                {!isLoggedIn && (
                    <div className="locked-state" style={{ background: 'var(--card)', padding: '50px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(108,92,231,0.1)' }}>
                        <FaLock className="locked-icon" style={{ fontSize: '4rem', color: '#7f8c8d', marginBottom: '20px' }} />
                        <h2 style={{ marginBottom: '15px', color: 'var(--txt)' }}>{lang === 'ar' ? 'المواعيد غير متاحة للزوار' : 'Appointments are not available for visitors'}</h2>
                        <p style={{ color: 'var(--txt-mut)', marginBottom: '30px' }}>{lang === 'ar' ? 'لحماية خصوصيتك ولتتمكن من حجز جلسة إرشادية، يرجى تسجيل الدخول.' : 'To protect your privacy and book a session, please log in.'}</p>
                        <button className="btn-register-now glow-btn" onClick={() => setIsLoggedIn(true)} style={{ padding: '12px 30px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                            <FaUserPlus /> {lang === 'ar' ? 'سجل الآن لظهور المواعيد' : 'Login to view schedule'}
                        </button>
                    </div>
                )}

                {/* ======== STATE 2: BOOKING (مطابق للتصميم الجديد) ======== */}
                {isLoggedIn && (
                    <div className="booking-state">
                        
                        {/* 💡 أزرار المتخصصين (Tabs) */}
                        <div className="specialist-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                            <button 
                                onClick={() => setSpecType('female')} 
                                style={{ 
                                    padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '10px',
                                    border: specType === 'female' ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                                    background: specType === 'female' ? '#0984e3' : 'transparent', 
                                    color: '#fff',
                                    boxShadow: specType === 'female' ? '0 0 15px rgba(9,132,227,0.5)' : 'none'
                                }}>
                                <FaUserNurse /> {lang === 'ar' ? 'حجز مع متخصصة' : 'Female Specialist'}
                            </button>
                            <button 
                                onClick={() => setSpecType('male')} 
                                style={{ 
                                    padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '10px',
                                    border: specType === 'male' ? 'none' : '1px solid rgba(255,255,255,0.2)', 
                                    background: specType === 'male' ? '#0984e3' : 'transparent', 
                                    color: '#fff',
                                    boxShadow: specType === 'male' ? '0 0 15px rgba(9,132,227,0.5)' : 'none'
                                }}>
                                <FaUserTie /> {lang === 'ar' ? 'حجز مع متخصص' : 'Male Specialist'}
                            </button>
                        </div>
                        
                        {/* 💡 شبكة الأيام (Cards) */}
                        <div className="schedule-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            {currentData.length === 0 ? (
                                <div className="empty-state" style={{ background: 'var(--card)', padding: '50px', borderRadius: '20px', textAlign: 'center', width: '100%' }}>
                                    <FaCalendarTimes style={{ fontSize: '4rem', color: 'var(--txt-mut)', marginBottom: '20px' }} />
                                    <h3 style={{ marginBottom: '15px', color: 'var(--txt)' }}>{lang === 'ar' ? 'لا تتوفر مواعيد حالياً' : 'No appointments available'}</h3>
                                    <p style={{ color: 'var(--txt-mut)' }}>{lang === 'ar' ? 'يرجى المحاولة لاحقاً أو اختيار متخصص آخر.' : 'Please try again later.'}</p>
                                </div>
                            ) : (
                                currentData.map((dayObj, idx) => (
                                    <div key={idx} className="day-card" style={{ background: 'var(--card)', borderRadius: '15px', padding: '25px', width: '100%', maxWidth: '350px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                        
                                        <div className="day-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '20px' }}>
                                            <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                                <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#fff', marginBottom: '5px' }}>{dayObj.day}</div>
                                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>{dayObj.date}</div>
                                            </div>
                                            <div style={{ background: 'rgba(9, 132, 227, 0.1)', color: '#0984e3', width: '45px', height: '45px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                                <FaCalendarAlt />
                                            </div>
                                        </div>

                                        {/* 💡 شبكة المواعيد (2 أعمدة) */}
                                        <div className="slots-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            {dayObj.slots.map((slot, sIdx) => {
                                                return (
                                                    <button 
                                                        key={sIdx} 
                                                        disabled={slot.isBooked}
                                                        onClick={() => handleSlotClick(dayObj.day, dayObj.date, slot.time)}
                                                        style={{ 
                                                            padding: '12px 10px', 
                                                            borderRadius: '8px', 
                                                            fontWeight: 'bold',
                                                            fontSize: '1rem',
                                                            fontFamily: 'monospace',
                                                            textAlign: 'center',
                                                            cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                                                            transition: '0.3s',
                                                            background: 'transparent',
                                                            // 💡 ستايل المتاح مقابل المحجوز
                                                            border: slot.isBooked ? '1px solid rgba(231,76,60,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                                            color: slot.isBooked ? '#e74c3c' : '#fff',
                                                            textDecoration: slot.isBooked ? 'line-through' : 'none',
                                                            opacity: slot.isBooked ? 0.6 : 1
                                                        }}
                                                    >
                                                        {slot.time}
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

                        <div style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(128,128,128,0.1)' }}>
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

            {/* 💡 Toast Notification */}
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

        </main>
    );
}