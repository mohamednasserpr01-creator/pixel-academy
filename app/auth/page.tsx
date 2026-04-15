"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { AnimatePresence } from 'framer-motion';

import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import WelcomeModal from '../../components/auth/WelcomeModal';
import TermsModal from '../../components/auth/TermsModal';

import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { lang } = useSettings();

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, router]);

    if (isLoggedIn) return null;

    return (
        // 💡 شيلنا كلاس page-wrapper عشان نتحكم إحنا في المقاسات 100% ونلغي الـ Padding اللي كان بيبعد الفوتر
        <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: '70px', width: '100%', margin: 0, paddingBottom: 0 }}>
            
            {/* 💡 خلينا الـ Container ياخد الـ flex: 1 عشان يطرد الفوتر لتحت خالص */}
            <div className="auth-split-layout" style={{ display: 'flex', flexWrap: 'wrap', flex: 1, width: '100%' }}>
                
                {/* ======== 1. قسم الصورة (على اليمين) ======== */}
                <div className="auth-hero-section" style={{ 
                    flex: '1 1 50%', 
                    position: 'relative', 
                    display: 'flex', 
                    overflow: 'hidden',
                    background: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000") center/cover no-repeat',
                }}>
                    {/* 💡 درجة اللبني والشفافية اتظبطت زي صورتك بالظبط (0.4 شفافية) */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(9, 132, 227, 0.4), rgba(108, 92, 231, 0.45))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: '40px' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                            {lang === 'ar' ? 'مرحباً بك في بيكسل 🚀' : 'Welcome to Pixel 🚀'}
                        </h1>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', maxWidth: '80%', lineHeight: '1.8' }}>
                            {lang === 'ar' ? 'أكاديمية بيكسل.. بوابتك للتعليم التفاعلي الذكي وتجربة دراسية لا تُنسى.' : 'Pixel Academy.. Your gateway to smart interactive education and an unforgettable study experience.'}
                        </p>
                    </div>
                </div>

                {/* ======== 2. قسم الفورم (على الشمال) ======== */}
                <div className="auth-form-section" style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 5%', background: 'var(--bg)' }}>
                    
                    {/* صندوق الدخول أو التسجيل */}
                    <div className="auth-box" style={{ width: '100%', maxWidth: '450px', background: 'var(--card)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                        <AnimatePresence mode="wait">
                            {isLoginView ? (
                                <LoginForm onSwitchView={() => setIsLoginView(false)} />
                            ) : (
                                <RegisterForm 
                                    onSwitchView={() => setIsLoginView(true)} 
                                    onSuccess={() => setShowWelcome(true)}
                                    onShowTerms={() => setShowTerms(true)}
                                    termsAccepted={termsAccepted}
                                    lang={lang} 
                                />
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {showTerms && <TermsModal onAccept={() => { setShowTerms(false); setTermsAccepted(true); }} onClose={() => setShowTerms(false)} lang={lang} />}
                {showWelcome && <WelcomeModal />}
                
            </div>

            {/* ستايل الموبايل */}
            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 992px) {
                    .auth-split-layout { flex-direction: column; }
                    .auth-hero-section { display: none !important; }
                    .auth-form-section { padding-top: 50px !important; flex: 1 1 100% !important; }
                }
            `}} />
        </main>
    );
}