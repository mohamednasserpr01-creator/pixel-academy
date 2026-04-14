"use client";
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import CoursesSection from '../components/home/CoursesSection';
import ServicesSection from '../components/home/ServicesSection';
import OffersSection from '../components/home/OffersSection';
import Footer from '../components/layout/Footer';

// 💡 سحب الإعدادات المركزية
import { useSettings } from '../context/SettingsContext';

export default function Home() {
    // 💡 سحبنا اللغة بس عشان نبعتها للأقسام (بدون ما نكتب دوال التغيير هنا)
    const { lang } = useSettings();

    useEffect(() => {
        // أنيميشن الظهور (Reveal) بس هو اللي يفضل هنا
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
    }, []);

    return (
        <main style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
            {/* 💡 الناف بار بقى طلقة ومش محتاج نبعتله أي Props */}
            <Navbar />
            
            <Hero lang={lang} />
            <CoursesSection lang={lang} />
            <ServicesSection lang={lang} />

            <section className="section-padding">
                <div className="forum-card reveal active">
                    <div className="forum-glow-bg1"></div>
                    <div className="forum-glow-bg2"></div>
                    <div className="forum-content" style={{ zIndex: 2, position: 'relative' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '15px', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                            {lang === 'ar' ? 'مجتمع بيكسل الحصري 🚀' : 'Exclusive Pixel Community 🚀'}
                        </h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.8, opacity: 0.9 }}>
                            {lang === 'ar' ? 'مساحتك الخاصة للمناقشة مع أوائل الجمهورية ومدرسينك!' : 'Your space to discuss with top students and teachers!'}
                        </p>
                        <a href="#" className="glow-btn">{lang === 'ar' ? 'دخول إلى المنتدى الآن' : 'Enter Forum Now'}</a>
                    </div>
                </div>
            </section>

            <OffersSection lang={lang} />
            <Footer />
        </main>
    );
}