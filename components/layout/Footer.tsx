"use client";
import React from 'react';
import Link from 'next/link';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#251744', color: '#ffffff', padding: '60px 0 20px', direction: 'rtl' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px', padding: '0 20px' }}>
                
                {/* 1. قسم اللوجو والسوشيال ميديا */}
                <div style={{ flex: '1.2', minWidth: '250px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px' }}>Pixel Academy</h2>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.8', opacity: '0.8', marginBottom: '20px', maxWidth: '300px' }}>
                        المنصة التعليمية الأولى المصممة لتوفير بيئة تفاعلية ذكية للطالب.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="https://www.tiktok.com/@nasourmedia" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '1.2rem', backgroundColor: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><FaTiktok /></a>
                        <a href="https://www.instagram.com/nasourr__media/" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '1.2rem', backgroundColor: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><FaInstagram /></a>
                        <a href="https://www.facebook.com/NasourMedia/" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '1.2rem', backgroundColor: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}><FaFacebookF /></a>
                    </div>
                </div>

                {/* 2. روابط سريعة */}
                <div style={{ flex: '0.8', minWidth: '150px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '25px', fontWeight: 700 }}>روابط سريعة</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <li><Link href="/teachers" style={{ color: '#fff', textDecoration: 'none', opacity: '0.8', transition: '0.3s' }}>المدرسين ❮</Link></li>
                        <li><Link href="/courses" style={{ color: '#fff', textDecoration: 'none', opacity: '0.8', transition: '0.3s' }}>الكورسات ❮</Link></li>
                        <li><Link href="/store" style={{ color: '#fff', textDecoration: 'none', opacity: '0.8', transition: '0.3s' }}>المتجر ❮</Link></li>
                    </ul>
                </div>

                {/* 3. الدعم النفسي */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '25px', fontWeight: 700 }}>الدعم النفسي</h3>
                    <p style={{ fontSize: '0.95rem', opacity: '0.8', marginBottom: '20px', lineHeight: '1.6' }}>
                        صحتك النفسية تهمنا، فريقنا من الأخصائيين متواجد دائماً.
                    </p>
                    <Link href="/support" style={{ display: 'inline-block', padding: '10px 25px', border: '1px solid #fff', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}>
                        احجز جلسة
                    </Link>
                </div>

                {/* 4. تواصل معنا */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '25px', fontWeight: 700 }}>تواصل معنا</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaPhoneAlt style={{ opacity: '0.8', transform: 'scaleX(-1)' }} /> <span style={{ direction: 'ltr' }}>01033259951</span> 
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaPhoneAlt style={{ opacity: '0.8', transform: 'scaleX(-1)' }} /> <span style={{ direction: 'ltr' }}>01221466441</span> 
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaEnvelope style={{ opacity: '0.8' }} /> <span>pixelacademy@gmail.com</span> 
                        </div>
                    </div>
                </div>

            </div>

            {/* حقوق الملكية */}
            <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', opacity: '0.8' }}>
                <p>جميع الحقوق محفوظة © 2026 لـ Nasour Media</p>
            </div>
        </footer>
    );
}