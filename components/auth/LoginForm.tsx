"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaWhatsapp } from 'react-icons/fa';

interface Props {
    onSwitchView: () => void;
}

export default function LoginForm({ onSwitchView }: Props) {
    const router = useRouter();
    const [loginData, setLoginData] = useState({ phone: '', pass: '' });
    const [globalError, setGlobalError] = useState('');

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('pixel_device_id');
        if (!deviceId) {
            deviceId = 'DEV-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pixel_device_id', deviceId);
        }
        return deviceId;
    };

    const handleLogin = () => {
        setGlobalError('');
        const users = JSON.parse(localStorage.getItem('pixel_users_db') || '[]');
        const user = users.find((u: any) => u.phone === loginData.phone);
        
        if (!user) return setGlobalError("هذا الرقم غير مسجل لدينا، يرجى إنشاء حساب جديد.");
        if (user.password !== loginData.pass) return setGlobalError("كلمة المرور غير صحيحة.");
        if (user.registeredDevice !== getDeviceId()) {
            return setGlobalError("⚠️ هذا الحساب مسجل على جهاز آخر. يرجى التواصل مع الدعم الفني.");
        }

        localStorage.setItem('pixel_logged_in', 'true');
        localStorage.setItem('pixel_current_user_phone', loginData.phone);
        router.push('/');
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