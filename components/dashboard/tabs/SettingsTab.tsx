"use client";
import React from 'react';
import { FaCog, FaSave, FaShieldAlt, FaMobileAlt, FaDesktop } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function SettingsTab() {
    const { user } = useAuth(); // 💡 نقلنا استدعاء المستخدم هنا عشان الإعدادات
    
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaCog /> إعدادات الحساب والأمان</h2>
            <div className="settings-card">
                <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>البيانات الشخصية</h3>
                <div className="form-grid">
                    <div className="input-group"><label>الاسم الرباعي</label><input type="text" defaultValue={user?.name || ""} /></div>
                    <div className="input-group"><label>رقم الهاتف</label><input type="text" defaultValue={user?.phone || ""} readOnly /></div>
                    <div className="input-group"><label>البريد الإلكتروني</label><input type="email" placeholder="example@gmail.com" /></div>
                </div>
                <button className="btn-save"><FaSave /> حفظ البيانات</button>
            </div>
            <div className="settings-card" style={{ borderColor: 'var(--danger)' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--danger)' }}><FaShieldAlt /> الأجهزة المتصلة بحسابك</h3>
                <div className="table-responsive">
                    <table>
                        <thead><tr><th>الجهاز</th><th>الموقع / IP</th><th>آخر نشاط</th><th>إجراء</th></tr></thead>
                        <tbody>
                            {dashboardData.devices.map(dev => (
                                <tr key={dev.id}>
                                    <td>{dev.icon === 'mobile' ? <FaMobileAlt /> : <FaDesktop />} {dev.name}</td>
                                    <td>{dev.location}</td><td style={{ color: dev.isCurrent ? 'var(--success)' : '' }}>{dev.activity}</td>
                                    <td>{dev.isCurrent ? <span className="badge success">مسموح</span> : <button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>تسجيل خروج</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}