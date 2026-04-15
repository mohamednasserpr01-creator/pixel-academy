"use client";
import React from 'react';
import { FaBookOpen, FaCheckCircle, FaClock, FaUserMd, FaVideo, FaBolt, FaPlay } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { dashboardData } from '../../../data/mock/dashboardData';

// 💡 1. استدعاء مركز الإعدادات عشان اللغة
import { useSettings } from '../../../context/SettingsContext';

export default function OverviewTab() {
    const { user } = useAuth();
    const { lang } = useSettings(); // 💡 2. سحب اللغة الحالية
    
    const isAr = lang === 'ar';

    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title">
                🚀 {isAr ? 'أهلاً بك يا' : 'Welcome back,'} {user?.name || user?.phone || (isAr ? 'بطل' : 'Champion')}!
            </h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)' }}><FaBookOpen /></div>
                    <div className="stat-info">
                        <h4>{isAr ? 'الكورسات النشطة' : 'Active Courses'}</h4>
                        <h2>{dashboardData.overview.activeCourses} {isAr ? 'كورسات' : 'Courses'}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--success), #27ae60)' }}><FaCheckCircle /></div>
                    <div className="stat-info">
                        <h4>{isAr ? 'نسبة الإنجاز العام' : 'Overall Completion Rate'}</h4>
                        <h2>{dashboardData.overview.completionRate}%</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--warning), #d35400)' }}><FaClock /></div>
                    <div className="stat-info">
                        <h4>{isAr ? 'واجبات متأخرة' : 'Late Homeworks'}</h4>
                        <h2>{dashboardData.overview.lateHomeworks} {isAr ? 'واجب' : 'Pending'}</h2>
                    </div>
                </div>
            </div>

            <div className="course-card" style={{ borderColor: 'var(--success)', background: 'rgba(46, 204, 113, 0.05)' }}>
                <div className="course-info">
                    {/* 💡 استخدام flex و gap بيظبط الأيقونة أوتوماتيك في العربي والإنجليزي */}
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUserMd style={{ color: 'var(--success)' }} /> 
                        {isAr ? 'جلسة الدعم النفسي القادمة' : 'Upcoming Psychological Support Session'}
                    </h3>
                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {isAr ? 'مع' : 'With'} {dashboardData.overview.nextSession.doctor} - {dashboardData.overview.nextSession.date}
                    </p>
                </div>
                <button className="btn-resume glow-btn" style={{ background: 'var(--success)', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isAr ? 'تفاصيل الجلسة' : 'Session Details'} <FaVideo />
                </button>
            </div>

            <div className="course-card" style={{ borderColor: 'var(--p-purple)' }}>
                <div className="course-info">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaBolt style={{ color: 'var(--warning)' }} /> 
                        {isAr ? 'استكمل من حيث توقفت' : 'Resume where you left off'}
                    </h3>
                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {dashboardData.overview.resume.title}
                    </p>
                </div>
                <button className="btn-resume glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isAr ? 'استكمال الآن' : 'Resume Now'} <FaPlay />
                </button>
            </div>
        </div>
    );
}