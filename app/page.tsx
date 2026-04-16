// FILE: app/page.tsx
"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';

import Hero from '../components/home/Hero';
import CoursesSection from '../components/home/CoursesSection';
import ServicesSection from '../components/home/ServicesSection';
import OffersSection from '../components/home/OffersSection';

// استدعاء اللغة
import { useSettings } from '../context/SettingsContext';

// 💡 استدعاء زر الـ Enterprise
import { Button } from '../components/ui/Button';

export default function Home() {
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    useEffect(() => {
        // أنيميشن الظهور (Reveal) خفيف وسريع جداً
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
        <main className="main-content-wrapper" style={{ paddingTop: '80px' }}>            
            <Hero lang={lang} />
            <CoursesSection lang={lang} />
            <ServicesSection lang={lang} />

            <section className="section-padding">
                {/* 💡 شيلت كلمة active من هنا عشان الـ Observer هو اللي يضيفها وقت السكرول ويدينا الأنيميشن */}
                <div className="forum-card reveal">
                    <div className="forum-glow-bg1"></div>
                    <div className="forum-glow-bg2"></div>
                    
                    <div className="forum-content" style={{ zIndex: 2, position: 'relative', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '15px', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                            {isAr ? 'مجتمع بيكسل الحصري 🚀' : 'Exclusive Pixel Community 🚀'}
                        </h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.8, opacity: 0.9 }}>
                            {isAr ? 'مساحتك الخاصة للمناقشة مع أوائل الجمهورية ومدرسينك!' : 'Your space to discuss with top students and teachers!'}
                        </p>
                        
                        {/* 💡 وداعاً للـ a tag العادي، أهلاً بالـ Button الخارق متغلف بـ Next Link */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Link href="/forum" style={{ textDecoration: 'none' }}>
                                <Button size="lg" icon={<FaUsers />}>
                                    {isAr ? 'دخول إلى المنتدى الآن' : 'Enter Forum Now'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <OffersSection lang={lang} />
            
        </main>
    );
}