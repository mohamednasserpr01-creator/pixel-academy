// FILE: components/auth/RegisterForm.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';

interface Props {
    onSwitchView: () => void;
    onSuccess: () => void;
    onShowTerms: () => void;
    termsAccepted: boolean;
    lang: string; // 💡 تم حل المشكلة: تم تعديل النوع إلى string عشان يقبل القيمة من صفحة الأوث
}

export default function RegisterForm({ onSwitchView, onSuccess, onShowTerms, termsAccepted, lang }: Props) {
    const isAr = lang === 'ar';
    const { login } = useAuth();
    
    const [regData, setRegData] = useState({ name: '', phone: '', parent: '', gov: '', address: '', school: '', pass: '' });
    const [regErrors, setRegErrors] = useState({ name: '', phone: '', parent: '', school: '', pass: '' });
    const [showPassword, setShowPassword] = useState(false);

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
        // 💡 تم حل المشكلة: إرسال الـ phone و الـ pass معاً للـ Context
        login(regData.phone, regData.pass);
        onSuccess();
    };

    const inputStyle = {
        width: '100%', padding: '12px 15px', borderRadius: '10px', 
        border: '2px solid rgba(108,92,231,0.2)', background: 'var(--bg)', 
        color: 'var(--txt)', outline: 'none', fontSize: '0.95rem', transition: '0.3s'
    };

    return (
        <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} dir={isAr ? 'rtl' : 'ltr'}>
            <h2 style={{ marginBottom: '25px', fontWeight: 900, color: 'var(--txt)', textAlign: 'center' }}>
                {isAr ? 'طالب جديد' : 'New Student'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ width: '100%' }}>
                    <input type="text" id="r-name" className={regErrors.name ? 'invalid' : ''} placeholder={isAr ? 'الاسم الرباعي (بالعربي)' : 'Full Name (Arabic)'} value={regData.name} onChange={handleRegChange} style={{ ...inputStyle, border: regErrors.name ? '2px solid #e74c3c' : inputStyle.border }} />
                    {regErrors.name && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: '#e74c3c', marginTop: '5px', fontWeight: 'bold' }}>{regErrors.name}</span>}
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <input type="tel" id="r-phone" className={regErrors.phone ? 'invalid' : ''} placeholder={isAr ? 'رقم الطالب (واتساب)' : 'Student Phone'} value={regData.phone} onChange={handleRegChange} style={{ ...inputStyle, border: regErrors.phone ? '2px solid #e74c3c' : inputStyle.border }} />
                        {regErrors.phone && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: '#e74c3c', marginTop: '5px', fontWeight: 'bold' }}>{regErrors.phone}</span>}
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <input type="tel" id="r-parent" className={regErrors.parent ? 'invalid' : ''} placeholder={isAr ? 'رقم ولي الأمر (واتساب)' : 'Parent Phone'} value={regData.parent} onChange={handleRegChange} style={{ ...inputStyle, border: regErrors.parent ? '2px solid #e74c3c' : inputStyle.border }} />
                        {regErrors.parent && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: '#e74c3c', marginTop: '5px', fontWeight: 'bold' }}>{regErrors.parent}</span>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <select id="r-gov" value={regData.gov} onChange={handleRegChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="">{isAr ? 'المحافظة' : 'Governorate'}</option>
                            <option value="Cairo">{isAr ? 'القاهرة' : 'Cairo'}</option>
                            <option value="Giza">{isAr ? 'الجيزة' : 'Giza'}</option>
                            <option value="Alex">{isAr ? 'الإسكندرية' : 'Alexandria'}</option>
                        </select>
                    </div>
                    <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                        <input type="text" id="r-school" placeholder={isAr ? 'المدرسة' : 'School'} value={regData.school} onChange={handleRegChange} style={inputStyle} />
                    </div>
                </div>

                <div style={{ width: '100%' }}>
                    <input type="text" id="r-address" placeholder={isAr ? 'العنوان بالتفصيل' : 'Detailed Address'} value={regData.address} onChange={handleRegChange} style={inputStyle} />
                </div>

                <div style={{ width: '100%' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="r-pass" 
                            className={regErrors.pass ? 'invalid' : ''} 
                            placeholder={isAr ? 'الرقم السري (6 أرقام/حروف على الأقل)' : 'Password (Min 6 chars)'} 
                            value={regData.pass} 
                            onChange={e => { e.target.value = e.target.value.replace(/\s/g, ''); handleRegChange(e); }} 
                            style={{ ...inputStyle, border: regErrors.pass ? '2px solid #e74c3c' : inputStyle.border }} 
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: isAr ? '15px' : 'auto', right: isAr ? 'auto' : '15px', cursor: 'pointer', color: 'var(--p-purple)', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {regErrors.pass && <span className="err-hint" style={{ display: 'block', fontSize: '0.8rem', color: '#e74c3c', marginTop: '5px', fontWeight: 'bold' }}>{regErrors.pass}</span>}
                </div>
            </div>
            
            <div style={{ margin: '20px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--txt)' }}>
                <input type="checkbox" readOnly checked={termsAccepted} onClick={onShowTerms} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--p-purple)' }} /> 
                <span>
                    {isAr ? 'أوافق على ' : 'I agree to '} 
                    <span onClick={onShowTerms} style={{ color: 'var(--p-purple)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </span>
                </span>
            </div>
            
            <button 
                className="btn-submit glow-btn" 
                disabled={!isRegValid()} 
                onClick={handleRegister} 
                style={{ 
                    width: '100%', background: isRegValid() ? 'var(--p-purple)' : 'var(--h-bg)', 
                    color: isRegValid() ? '#fff' : 'var(--txt-mut)', border: 'none', padding: '15px', 
                    borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: isRegValid() ? 'pointer' : 'not-allowed', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.3s' 
                }}
            >
                {isAr ? 'إنشاء حساب' : 'Create Account'} <FaUserPlus style={{ margin: isAr ? '0 10px 0 0' : '0 0 0 10px' }} />
            </button>

            <div className="switch-link" style={{ textAlign: 'center', marginTop: '20px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                {isAr ? 'لديك حساب؟ ' : 'Have an account? '} 
                <span onClick={onSwitchView} style={{ color: 'var(--p-purple)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>{isAr ? 'دخول' : 'Login'}</span>
            </div>
        </motion.div>
    );
}