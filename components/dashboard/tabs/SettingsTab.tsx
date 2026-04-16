// FILE: components/dashboard/tabs/SettingsTab.tsx
"use client";
import React, { useState } from 'react';
import { FaCog, FaSave, FaShieldAlt, FaMobileAlt, FaDesktop, FaUser, FaPhoneAlt, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

import { useAuth } from '../../../context/AuthContext';
import { dashboardData } from '../../../data/mock/dashboardData';
import { useSettings } from '../../../context/SettingsContext';

// 💡 استدعاء الـ UI System الخارق بتاعنا
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export default function SettingsTab() {
    const { user } = useAuth(); 
    const { lang } = useSettings(); 
    const { showToast } = useToast(); // 💡 تفعيل الإشعارات
    
    const isAr = lang === 'ar';

    // 💡 حالة التحميل للزرار عشان الـ UX
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // محاكاة تأخير الـ API
            await new Promise(resolve => setTimeout(resolve, 800));
            showToast(isAr ? 'تم حفظ بياناتك بنجاح! ✅' : 'Your data has been saved successfully! ✅', 'success');
        } catch (error) {
            showToast(isAr ? 'حدث خطأ أثناء الحفظ' : 'Error saving data', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoutDevice = (deviceId: number) => {
        showToast(isAr ? 'تم تسجيل الخروج من الجهاز بنجاح' : 'Logged out from device successfully', 'info');
    };

    return (
        <div className="tab-pane active">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCog /> {isAr ? 'إعدادات الحساب والأمان' : 'Account & Security Settings'}
            </h2>
            
            <div className="settings-card">
                <h3 style={{ marginBottom: '25px', color: 'var(--txt)' }}>
                    {isAr ? 'البيانات الشخصية' : 'Personal Information'}
                </h3>
                
                {/* 💡 وداعاً للـ HTML Inputs، أهلاً بالـ Enterprise Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <Input 
                        label={isAr ? 'الاسم الرباعي' : 'Full Name'}
                        defaultValue={user?.name || ""}
                        icon={<FaUser />}
                        inputSize="md"
                    />
                    
                    <Input 
                        label={isAr ? 'رقم الهاتف' : 'Phone Number'}
                        defaultValue={user?.phone || ""}
                        readOnly
                        disabled // 💡 رقم التليفون مبيتغيرش
                        icon={<FaPhoneAlt />}
                        inputSize="md"
                        message={isAr ? 'لا يمكن تعديل رقم الهاتف المرتبط بالحساب' : 'Phone number linked to account cannot be changed'}
                    />
                    
                    <Input 
                        label={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        type="email"
                        placeholder="example@gmail.com"
                        icon={<FaEnvelope />}
                        inputSize="md"
                    />
                </div>
                
                <div style={{ marginTop: '30px', maxWidth: '250px' }}>
                    <Button 
                        fullWidth 
                        size="md" 
                        icon={!isSaving && <FaSave />} 
                        onClick={handleSave}
                        isLoading={isSaving}
                    >
                        {isAr ? 'حفظ البيانات' : 'Save Changes'}
                    </Button>
                </div>
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
                                            {dev.icon === 'mobile' ? <FaMobileAlt size={18} /> : <FaDesktop size={18} />} 
                                            <span style={{ fontWeight: 'bold' }}>{dev.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ direction: 'ltr', textAlign: isAr ? 'right' : 'left', fontFamily: 'monospace', fontSize: '0.9rem' }}>
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
                                            // 💡 استخدام الـ Button بتاعنا بنوع danger
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                icon={<FaSignOutAlt />}
                                                onClick={() => handleLogoutDevice(dev.id)}
                                            >
                                                {isAr ? 'تسجيل خروج' : 'Logout'}
                                            </Button>
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