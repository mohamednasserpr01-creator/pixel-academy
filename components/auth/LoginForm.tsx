"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaWhatsapp } from 'react-icons/fa';

// 💡 استدعاء Context تسجيل الدخول
import { useAuth } from '../../context/AuthContext';

interface Props {
    onSwitchView: () => void;
}

export default function LoginForm({ onSwitchView }: Props) {
    const [loginData, setLoginData] = useState({ phone: '', pass: '' });
    const [globalError, setGlobalError] = useState('');

    // 💡 استخدام دالة الدخول من الـ Context
    const { login } = useAuth();

    const handleLogin = () => {
        setGlobalError('');
        
        // محاكاة للتحقق المبدئي (سيتم استبدالها بـ API الباك إند لاحقاً)
        if (!loginData.phone || !loginData.pass) {
            return setGlobalError("يرجى إدخال رقم الهاتف وكلمة المرور.");
        }
        
        if (loginData.phone.length < 11) {
            return setGlobalError("رقم الهاتف غير صحيح، يجب أن يتكون من 11 رقم.");
        }

        // 💡 تشغيل تسجيل الدخول المركزي
        login(loginData.phone);
        
        // التوجيه للوحة التحكم هيتم أوتوماتيك من الصفحة الرئيسية (AuthPage)
        // لأنها بتراقب حالة الـ isLoggedIn
    };

    return (
        <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <h2 style={{ marginBottom: '20px', fontWeight: 900, color: 'var(--p-purple)' }}>تسجيل الدخول</h2>
            <div className="form-group full-width">
                <input type="tel" className="form-control" placeholder="رقم الهاتف" value={loginData.phone} onChange={e => setLoginData({...loginData, phone: e.target.value})} />
            </div>
            <div className="form-group full-width" style={{ marginTop: '15px' }}>
                <input type="password" className="form-control" placeholder="كلمة المرور" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} />
            </div>
            
            {globalError && <div className="global-error" style={{display: 'block'}}>{globalError}</div>}

            <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" className="forgot-pass">
                نسيت كلمة السر؟ تواصل معنا <FaWhatsapp />
            </a>

            <button className="btn-submit" onClick={handleLogin}>دخول <FaSignInAlt /></button>
            <div className="switch-link">طالب جديد؟ <span onClick={onSwitchView}>سجل الآن</span></div>
        </motion.div>
    );
}