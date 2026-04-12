"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaMoon, FaSun, FaHome, FaGlobe } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

import AuthHero from '../../components/auth/AuthHero';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import WelcomeModal from '../../components/auth/WelcomeModal';
import TermsModal from '../../components/auth/TermsModal';

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState<'ar' | 'en'>('ar'); // حالة اللغة الأساسية
    const [showTerms, setShowTerms] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'light') document.body.classList.add('light-mode');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('pixel_theme', newTheme);
        document.body.classList.toggle('light-mode');
    };

    const toggleLang = () => {
        setLang(lang === 'ar' ? 'en' : 'ar');
    };

    return (
        <div className="auth-wrapper" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <AuthHero />

            <div className="auth-form-side">
                <div className="auth-header">
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={toggleTheme} className="icon-btn" style={{ color: 'var(--p-purple)', fontSize: '1.5rem' }}>
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                        </button>
                        {/* زرار تغيير اللغة */}
                        <button onClick={toggleLang} className="icon-btn" style={{ color: 'var(--p-purple)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaGlobe /> <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'EN' : 'AR'}</span>
                        </button>
                    </div>
                    <Link href="/" className="icon-btn" style={{ color: 'var(--p-purple)', fontSize: '1.5rem' }}>
                        <FaHome />
                    </Link>
                </div>

                <div className="auth-box">
                    <AnimatePresence mode="wait">
                        {isLoginView ? (
                            <LoginForm onSwitchView={() => setIsLoginView(false)} />
                        ) : (
                            <RegisterForm 
                                onSwitchView={() => setIsLoginView(true)} 
                                onSuccess={() => setShowWelcome(true)}
                                onShowTerms={() => setShowTerms(true)}
                                termsAccepted={termsAccepted}
                                lang={lang} // بنبعت اللغة لفورم التسجيل
                            />
                        )}
                    </AnimatePresence>
                </div>

                <footer className="auth-footer">
                    <p>© {new Date().getFullYear()} بيكسل أكاديمي - جميع الحقوق محفوظة</p>
                </footer>
            </div>

            {/* بنبعت اللغة لمودال الشروط عشان الإيرور يختفي */}
            {showTerms && <TermsModal onAccept={() => { setShowTerms(false); setTermsAccepted(true); }} onClose={() => setShowTerms(false)} lang={lang} />}
            {showWelcome && <WelcomeModal />}
        </div>
    );
}