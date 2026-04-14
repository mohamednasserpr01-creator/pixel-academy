"use client";
import React from 'react';
import { FaBookOpen, FaCheckCircle, FaClock, FaUserMd, FaVideo, FaBolt, FaPlay } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function OverviewTab() {
    const { user } = useAuth();

    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title">🚀 أهلاً بك يا {user?.name || user?.phone || 'بطل'}!</h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)' }}><FaBookOpen /></div>
                    <div className="stat-info"><h4>الكورسات النشطة</h4><h2>{dashboardData.overview.activeCourses} كورسات</h2></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--success), #27ae60)' }}><FaCheckCircle /></div>
                    <div className="stat-info"><h4>نسبة الإنجاز العام</h4><h2>{dashboardData.overview.completionRate}%</h2></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--warning), #d35400)' }}><FaClock /></div>
                    <div className="stat-info"><h4>واجبات متأخرة</h4><h2>{dashboardData.overview.lateHomeworks} واجب</h2></div>
                </div>
            </div>

            <div className="course-card" style={{ borderColor: 'var(--success)', background: 'rgba(46, 204, 113, 0.05)' }}>
                <div className="course-info">
                    <h3><FaUserMd style={{ color: 'var(--success)', marginLeft: '8px' }} /> جلسة الدعم النفسي القادمة</h3>
                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.95rem' }}>مع {dashboardData.overview.nextSession.doctor} - {dashboardData.overview.nextSession.date}</p>
                </div>
                <button className="btn-resume" style={{ background: 'var(--success)', color: '#000' }}>تفاصيل الجلسة <FaVideo style={{ marginRight: '8px' }} /></button>
            </div>

            <div className="course-card" style={{ borderColor: 'var(--p-purple)' }}>
                <div className="course-info">
                    <h3><FaBolt style={{ color: 'var(--warning)', marginLeft: '8px' }} /> استكمل من حيث توقفت</h3>
                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.9rem' }}>{dashboardData.overview.resume.title}</p>
                </div>
                <button className="btn-resume">استكمال الآن <FaPlay style={{ marginRight: '8px' }} /></button>
            </div>
        </div>
    );
}