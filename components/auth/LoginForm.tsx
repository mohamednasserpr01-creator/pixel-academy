// FILE: components/auth/LoginForm.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaWhatsapp } from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface Props {
    onSwitchView: () => void;
}

export default function LoginForm({ onSwitchView }: Props) {
    const [loginData, setLoginData] = useState({ phone: '', pass: '' });
    const [globalError, setGlobalError] = useState('');

    const { login } = useAuth();
    const { lang } = useSettings();

    const handleLogin = () => {
        setGlobalError('');
        
        if (!loginData.phone || !loginData.pass) {
            return setGlobalError(lang === 'ar' ? "يرجى إدخال رقم الهاتف وكلمة المرور." : "Please enter phone number and password.");
        }
        
        if (loginData.phone.length < 11) {
            return setGlobalError(lang === 'ar' ? "رقم الهاتف غير صحيح، يجب أن يتكون من 11 رقم." : "Invalid phone number, must be 11 digits.");
        }

        // 💡 تم حل المشكلة: إرسال الـ phone و الـ pass معاً للـ Context
        login(loginData.phone, loginData.pass);
    };

    return (
        <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <h2 style={{ marginBottom: '25px', fontWeight: 900, color: 'var(--txt)', textAlign: 'center' }}>
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </h2>
            
            <div className="form-group full-width">
                <input 
                    type="tel" 
                    className="form-control" 
                    placeholder={lang === 'ar' ? "رقم الهاتف" : "Phone Number"} 
                    value={loginData.phone} 
                    onChange={e => setLoginData({...loginData, phone: e.target.value})} 
                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid rgba(108,92,231,0.2)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', fontSize: '1rem', transition: '0.3s' }}
                />
            </div>
            
            <div className="form-group full-width" style={{ marginTop: '15px' }}>
                <input 
                    type="password" 
                    className="form-control" 
                    placeholder={lang === 'ar' ? "كلمة المرور" : "Password"} 
                    value={loginData.pass} 
                    onChange={e => setLoginData({...loginData, pass: e.target.value})} 
                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid rgba(108,92,231,0.2)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', fontSize: '1rem', transition: '0.3s' }}
                />
            </div>
            
            {globalError && <div className="global-error" style={{ display: 'block', color: '#e74c3c', marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>{globalError}</div>}

            <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" className="forgot-pass" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2ecc71', marginTop: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {lang === 'ar' ? 'نسيت كلمة السر؟ تواصل معنا' : 'Forgot Password? Contact us'} <FaWhatsapp style={{ fontSize: '1.2rem' }} />
            </a>

            <button className="btn-submit glow-btn" onClick={handleLogin} style={{ width: '100%', background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', marginTop: '25px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(108,92,231,0.3)' }}>
                {lang === 'ar' ? 'دخول' : 'Login'} <FaSignInAlt />
            </button>
            
            <div className="switch-link" style={{ textAlign: 'center', marginTop: '25px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                {lang === 'ar' ? 'طالب جديد؟' : 'New student?'} <span onClick={onSwitchView} style={{ color: 'var(--p-purple)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', margin: '0 5px' }}>{lang === 'ar' ? 'سجل الآن' : 'Register Now'}</span>
            </div>
        </motion.div>
    );
}