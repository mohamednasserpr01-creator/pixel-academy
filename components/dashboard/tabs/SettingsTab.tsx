"use client";
import React from 'react';
import { FaCog, FaSave, FaShieldAlt, FaMobileAlt, FaDesktop } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { dashboardData } from '../../../data/mock/dashboardData';

// 💡 1. استدعاء مركز الإعدادات لضبط اللغة
import { useSettings } from '../../../context/SettingsContext';

export default function SettingsTab() {
    const { user } = useAuth(); 
    const { lang } = useSettings(); // 💡 2. سحب اللغة الحالية
    
    const isAr = lang === 'ar';

    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCog /> {isAr ? 'إعدادات الحساب والأمان' : 'Account & Security Settings'}
            </h2>
            
            <div className="settings-card">
                <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>
                    {isAr ? 'البيانات الشخصية' : 'Personal Information'}
                </h3>
                
                <div className="form-grid">
                    <div className="input-group">
                        <label>{isAr ? 'الاسم الرباعي' : 'Full Name'}</label>
                        <input type="text" defaultValue={user?.name || ""} />
                    </div>
                    <div className="input-group">
                        <label>{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                        <input type="text" defaultValue={user?.phone || ""} readOnly />
                    </div>
                    <div className="input-group">
                        <label>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <input type="email" placeholder="example@gmail.com" />
                    </div>
                </div>
                
                <button className="btn-save glow-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', maxWidth: '200px' }}>
                    <FaSave /> {isAr ? 'حفظ البيانات' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-card" style={{ borderColor: 'var(--danger)', marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaShieldAlt /> {isAr ? 'الأجهزة المتصلة بحسابك' : 'Devices Connected to Your Account'}
                </h3>
                
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'الجهاز' : 'Device'}</th>
                                <th>{isAr ? 'الموقع / IP' : 'Location / IP'}</th>
                                <th>{isAr ? 'آخر نشاط' : 'Last Activity'}</th>
                                <th>{isAr ? 'إجراء' : 'Action'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.devices.map(dev => (
                                <tr key={dev.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {dev.icon === 'mobile' ? <FaMobileAlt /> : <FaDesktop />} 
                                            {dev.name}
                                        </div>
                                    </td>
                                    <td style={{ direction: 'ltr', textAlign: isAr ? 'right' : 'left' }}>
                                        {dev.location}
                                    </td>
                                    <td style={{ color: dev.isCurrent ? 'var(--success)' : 'var(--txt-mut)', fontWeight: dev.isCurrent ? 'bold' : 'normal' }}>
                                        {dev.isCurrent && !isAr ? 'Online Now' : dev.activity}
                                    </td>
                                    <td>
                                        {dev.isCurrent ? (
                                            <span className="badge success" style={{ display: 'inline-block', textAlign: 'center' }}>
                                                {isAr ? 'مسموح (حالي)' : 'Active Now'}
                                            </span>
                                        ) : (
                                            <button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                                                {isAr ? 'تسجيل خروج' : 'Logout'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}