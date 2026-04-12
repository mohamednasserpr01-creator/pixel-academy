"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// ضفنا أيقونات العين هنا
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

interface Props {
    onSwitchView: () => void;
    onSuccess: () => void;
    onShowTerms: () => void;
    termsAccepted: boolean;
    lang: 'ar' | 'en';
}

export default function RegisterForm({ onSwitchView, onSuccess, onShowTerms, termsAccepted, lang }: Props) {
    const isAr = lang === 'ar';
    
    const [regData, setRegData] = useState({ name: '', phone: '', parent: '', gov: '', address: '', school: '', pass: '' });
    const [regErrors, setRegErrors] = useState({ name: '', phone: '', parent: '', school: '', pass: '' });

    // حالة إظهار/إخفاء الباسورد
    const [showPassword, setShowPassword] = useState(false);

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('pixel_device_id');
        if (!deviceId) {
            deviceId = 'DEV-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pixel_device_id', deviceId);
        }
        return deviceId;
    };

    const validateReg = (field: string, value: string) => {
        let errors = { ...regErrors };
        let isValid = true;

        if (field === 'name') {
            isValid = /^[\u0600-\u06FF\s]+$/.test(value) && value.trim().length >= 15;
            errors.name = !isValid && value ? (isAr ? 'الاسم بالعربي ولا يقل عن 15 حرفاً' : 'Arabic name, min 15 chars') : '';
        }
        if (field === 'phone') {
            isValid = /^01[0125][0-9]{8}$/.test(value);
            errors.phone = !isValid && value ? (isAr ? 'رقم غير صحيح' : 'Invalid number') : '';
        }
        if (field === 'parent') {
            isValid = /^01[0125][0-9]{8}$/.test(value);
            errors.parent = (!isValid && value) ? (isAr ? 'رقم غير صحيح' : 'Invalid number') : (isValid && value === regData.phone) ? (isAr ? 'لا يمكن أن يكون نفس رقم الطالب' : 'Cannot match student phone') : '';
        }
        if (field === 'pass') {
            isValid = value.length >= 6;
            errors.pass = !isValid && value ? (isAr ? '6 أحرف/أرقام على الأقل' : 'Min 6 chars') : '';
        }
        setRegErrors(errors);
    };

    const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const key = id.replace('r-', '');
        setRegData(prev => ({ ...prev, [key]: value }));
        validateReg(key, value);
    };

    const isRegValid = () => {
        return (
            regData.name.length >= 15 && !regErrors.name &&
            regData.phone.length === 11 && !regErrors.phone &&
            regData.parent.length === 11 && !regErrors.parent &&
            regData.pass.length >= 6 && !regErrors.pass &&
            regData.gov !== '' && regData.address !== '' && termsAccepted
        );
    };

    const handleRegister = () => {
        const users = JSON.parse(localStorage.getItem('pixel_users_db') || '[]');
        users.push({ phone: regData.phone, password: regData.pass, registeredDevice: getDeviceId() });
        localStorage.setItem('pixel_users_db', JSON.stringify(users));
        localStorage.setItem('pixel_logged_in', 'true');
        localStorage.setItem('pixel_current_user_phone', regData.phone);
        onSuccess();
    };

    return (
        <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} dir={isAr ? 'rtl' : 'ltr'}>
            <h2 style={{ marginBottom: '25px', fontWeight: 900, color: 'var(--p-purple)', textAlign: 'center' }}>
                {isAr ? 'طالب جديد' : 'New Student'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* صف 1: الاسم (كامل) */}
                <div style={{ width: '100%' }}>
                    <input type="text" id="r-name" className={`form-control ${regErrors.name ? 'invalid' : ''}`} placeholder={isAr ? 'الاسم الرباعي (بالعربي)' : 'Full Name (Arabic)'} value={regData.name} onChange={handleRegChange} style={{ width: '100%' }} />
                    {regErrors.name && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--danger)', marginTop: '5px' }}>{regErrors.name}</span>}
                </div>

                {/* صف 2: التليفونات (مقسمين بالنص) */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <input type="tel" id="r-phone" className={`form-control ${regErrors.phone ? 'invalid' : ''}`} placeholder={isAr ? 'رقم الطالب (واتساب)' : 'Student Phone (WhatsApp)'} value={regData.phone} onChange={handleRegChange} style={{ width: '100%' }} />
                        {regErrors.phone && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--danger)', marginTop: '5px' }}>{regErrors.phone}</span>}
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <input type="tel" id="r-parent" className={`form-control ${regErrors.parent ? 'invalid' : ''}`} placeholder={isAr ? 'رقم ولي الأمر (واتساب)' : 'Parent Phone (WhatsApp)'} value={regData.parent} onChange={handleRegChange} style={{ width: '100%' }} />
                        {regErrors.parent && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--danger)', marginTop: '5px' }}>{regErrors.parent}</span>}
                    </div>
                </div>

                {/* صف 3: المحافظة والمدرسة (مقسمين بالنص) */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <select id="r-gov" className="form-control" value={regData.gov} onChange={handleRegChange} style={{ width: '100%', cursor: 'pointer' }}>
                            <option value="">{isAr ? 'المحافظة' : 'Governorate'}</option>
                            <option value="Cairo">{isAr ? 'القاهرة' : 'Cairo'}</option>
                            <option value="Giza">{isAr ? 'الجيزة' : 'Giza'}</option>
                            <option value="Alex">{isAr ? 'الإسكندرية' : 'Alexandria'}</option>
                        </select>
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <input type="text" id="r-school" className="form-control" placeholder={isAr ? 'المدرسة' : 'School'} value={regData.school} onChange={handleRegChange} style={{ width: '100%' }} />
                    </div>
                </div>

                {/* صف 4: العنوان (كامل) */}
                <div style={{ width: '100%' }}>
                    <input type="text" id="r-address" className="form-control" placeholder={isAr ? 'العنوان بالتفصيل' : 'Detailed Address'} value={regData.address} onChange={handleRegChange} style={{ width: '100%' }} />
                </div>

                {/* صف 5: الرقم السري (كامل) + العين */}
                <div style={{ width: '100%' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="r-pass" 
                            className={`form-control ${regErrors.pass ? 'invalid' : ''}`} 
                            placeholder={isAr ? 'الرقم السري (6 أرقام/حروف على الأقل)' : 'Password (Min 6 chars)'} 
                            value={regData.pass} 
                            onChange={e => { e.target.value = e.target.value.replace(/\s/g, ''); handleRegChange(e); }} 
                            style={{ width: '100%' }} 
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                left: isAr ? '15px' : 'auto',
                                right: isAr ? 'auto' : '15px',
                                cursor: 'pointer',
                                color: 'var(--p-purple)',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {regErrors.pass && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--danger)', marginTop: '5px' }}>{regErrors.pass}</span>}
                </div>
            </div>
            
            <div style={{ margin: '20px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" readOnly checked={termsAccepted} onClick={onShowTerms} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /> 
                <span>
                    {isAr ? 'أوافق على ' : 'I agree to '} 
                    <span onClick={onShowTerms} style={{ color: 'var(--p-purple)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </span>
                </span>
            </div>
            
            <button className="btn-submit" disabled={!isRegValid()} onClick={handleRegister} style={{ width: '100%' }}>
                {isAr ? 'إنشاء حساب' : 'Create Account'} <FaUserPlus style={{ margin: isAr ? '0 10px 0 0' : '0 0 0 10px' }} />
            </button>
            <div className="switch-link" style={{ textAlign: 'center', marginTop: '15px' }}>
                {isAr ? 'لديك حساب؟ ' : 'Have an account? '} 
                <span onClick={onSwitchView} style={{ color: 'var(--p-purple)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>{isAr ? 'دخول' : 'Login'}</span>
            </div>
        </motion.div>
    );
}