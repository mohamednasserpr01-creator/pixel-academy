"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import CoursesSection from '../components/home/CoursesSection';
import ServicesSection from '../components/home/ServicesSection';
import OffersSection from '../components/home/OffersSection';
import ChatBot from '../components/ui/ChatBot';
import Footer from '../components/layout/Footer';
import { FaWhatsapp, FaRobot } from 'react-icons/fa'; 

export default function Home() {
    const [mounted, setMounted] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('dark');
    const [lang, setLang] = useState<string>('ar');

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme);
        setLang(savedLang);
        
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLang;
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [mounted]);

    const toggleMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('pixel_theme', newTheme);
        document.body.classList.toggle('light-mode');
    };

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('pixel_lang', newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    if (!mounted) return null;

    return (
        <main style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
            {/* القائمة العلوية */}
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />
            
            {/* القسم الرئيسي - Hero */}
            <Hero lang={lang} />
            
            {/* قسم الكورسات */}
            <CoursesSection lang={lang} />
            
            {/* قسم الخدمات */}
            <ServicesSection lang={lang} />

            {/* بانر المجتمع الحصري */}
            <section className="section-padding">
                <div className="forum-card reveal active">
                    <div className="forum-glow-bg1"></div>
                    <div className="forum-glow-bg2"></div>
                    <div className="forum-content" style={{ zIndex: 2, position: 'relative' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '15px', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                            {lang === 'ar' ? 'مجتمع بيكسل الحصري 🚀' : 'Exclusive Pixel Community 🚀'}
                        </h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '30px', maxWidth: '600px', lineHeight: 1.8, opacity: 0.9 }}>
                            {lang === 'ar' ? 'مساحتك الخاصة للمناقشة مع أوائل الجمهورية ومدرسينك!' : 'Your space to discuss with top students and teachers!'}
                        </p>
                        <a href="#" className="glow-btn">{lang === 'ar' ? 'دخول إلى المنتدى الآن' : 'Enter Forum Now'}</a>
                    </div>
                </div>
            </section>

            {/* قسم العروض */}
            <OffersSection lang={lang} />
            
            {/* استدعاء الشات بوت */}
            <ChatBot lang={lang} />
            
            {/* الفوتر */}
            <Footer />

            {/* ================= الأزرار الطافية الثابتة ================= */}
            <div className="fab-container">
                {/* زرار واتساب الدعم الفني */}
                <a 
                    href="https://wa.me/201221466441" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="fab-btn fab-wa"
                    title={lang === 'ar' ? 'تواصل مع الدعم الفني' : 'Contact Support'}
                >
                    <FaWhatsapp />
                </a>

                {/* زرار الشات بوت */}
                <button 
                    className="fab-btn fab-ai" 
                    title={lang === 'ar' ? 'بيكسل AI' : 'Pixel AI'}
                    onClick={() => {
                        const chatWin = document.getElementById('chat-win');
                        if (chatWin) chatWin.classList.toggle('show');
                    }}
                >
                    <FaRobot />
                </button>
            </div>
        </main>
    );
}