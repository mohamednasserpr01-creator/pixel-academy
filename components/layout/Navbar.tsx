"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHome, FaChalkboardTeacher, FaPlayCircle, FaShoppingCart, FaGamepad, FaUserShield, FaTimes, FaGlobe, FaMoon, FaSun, FaBars } from 'react-icons/fa';

export default function Navbar({ lang, theme, toggleLang, toggleMode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* 1. ستايل داخلي سريع لضمان إخفاء زراير الكمبيوتر في الموبايل */}
            <style jsx>{`
                @media (max-width: 992px) {
                    .hide-on-mobile { display: none !important; }
                }
            `}</style>

            {/* 2. الـ Overlay اللي بيغطي الشاشة ورا القائمة */}
            <div 
                className="mobile-overlay" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                    display: isMenuOpen ? 'block' : 'none',
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 999,
                    backdropFilter: 'blur(3px)'
                }}
            ></div>

            <header style={{ zIndex: 1000 }}>
                <div className="logo">
                    <Image src="https://via.placeholder.com/180x50/6c5ce7/ffffff?text=Pixel+Academy" alt="Pixel Academy" width={180} height={50} priority />
                </div>
                
                {/* 3. التعديل السحري: الـ active بقت على الـ nav */}
                <nav className={isMenuOpen ? 'active' : ''}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li className="mobile-only" style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                            <h2 style={{ color: 'var(--p-purple)', fontWeight: 900, margin: 0 }}>PIXEL</h2>
                            <button className="icon-btn" style={{ marginRight: 'auto' }} onClick={() => setIsMenuOpen(false)}><FaTimes /></button>
                        </li>
                        
                        {/* ضفنا onClick عشان القائمة تقفل لوحدها لما الطالب يختار حاجة */}
                        <li><Link href="/" onClick={() => setIsMenuOpen(false)}><FaHome /> {lang === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
                        <li><a href="#" onClick={() => setIsMenuOpen(false)}><FaChalkboardTeacher /> {lang === 'ar' ? 'المدرسين' : 'Teachers'}</a></li>
                        <li><a href="#" onClick={() => setIsMenuOpen(false)}><FaPlayCircle /> {lang === 'ar' ? 'الكورسات' : 'Courses'}</a></li>
                        <li><a href="#" onClick={() => setIsMenuOpen(false)}><FaShoppingCart /> {lang === 'ar' ? 'المتجر' : 'Store'}</a></li>
                        <li><a href="#" onClick={() => setIsMenuOpen(false)}><FaGamepad /> {lang === 'ar' ? 'عباقرة بيكسل' : 'Pixel Geniuses'}</a></li>
                        <li><a href="#" onClick={() => setIsMenuOpen(false)}><FaUserShield /> {lang === 'ar' ? 'ولي الأمر' : 'Parents'}</a></li>
                        
                        {/* زراير الدخول واللغة جوه القائمة للموبايل */}
                        <li className="mobile-only" style={{ marginTop: '20px' }}>
                            <Link href="/auth" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} onClick={() => setIsMenuOpen(false)}>
                                {lang === 'ar' ? 'دخول المنصة' : 'Login'}
                            </Link>
                        </li>
                        <li className="mobile-only" style={{ marginTop: '10px' }}>
                            <button onClick={() => { toggleLang(); setIsMenuOpen(false); }} className="btn-outline" style={{ width: '100%', padding: '12px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <FaGlobe /> {lang === 'ar' ? 'English' : 'العربية'}
                            </button>
                        </li>
                    </ul>
                </nav>
                
                <div className="toolbar">
                    <button className="icon-btn" onClick={toggleMode} title={lang === 'ar' ? 'تبديل الوضع' : 'Toggle Theme'}>
                        {theme === 'dark' ? <FaMoon /> : <FaSun />}
                    </button>
                    
                    {/* زراير الكمبيوتر بتختفي في الموبايل */}
                    <button className="btn-outline hide-on-mobile" onClick={toggleLang}>AR/EN</button>
                    
                    <Link href="/auth" className="btn-primary hide-on-mobile">
                        {lang === 'ar' ? 'دخول المنصة' : 'Login'}
                    </Link>
                    
                    {/* زرار الهمبرجر */}
                    <button className="icon-btn mobile-only" onClick={() => setIsMenuOpen(true)}>
                        <FaBars />
                    </button>
                </div>
            </header>
        </>
    );
}