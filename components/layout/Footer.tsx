"use client";
import React from 'react';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTiktok, FaAngleLeft, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer({ lang }) {
    return (
        <footer className="reveal active">
            <div className="footer-grid">
                <div className="footer-col">
                    <Image src="https://via.placeholder.com/200x70/6c5ce7/ffffff?text=Pixel+Academy" alt="Pixel Academy Logo" width={200} height={70} className="footer-logo" />
                    <p style={{ marginTop: '15px' }}>{lang === 'ar' ? 'المنصة التعليمية الأولى المصممة لتوفير بيئة تفاعلية ذكية للطالب.' : 'The leading educational platform designed to provide an interactive smart environment.'}</p>
                    <div className="social-links">
                        <a href="https://www.facebook.com/NasourMedia/" target="_blank" aria-label="فيسبوك"><FaFacebookF /></a>
                        <a href="https://www.instagram.com/nasourr__media/" target="_blank" aria-label="إنستغرام"><FaInstagram /></a>
                        <a href="https://www.tiktok.com/@nasourmedia" target="_blank" aria-label="تيك توك"><FaTiktok /></a>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><FaAngleLeft style={{ marginRight: '5px' }} /> {lang === 'ar' ? 'المدرسين' : 'Teachers'}</li>
                        <li style={{ marginBottom: '10px' }}><FaAngleLeft style={{ marginRight: '5px' }} /> {lang === 'ar' ? 'الكورسات' : 'Courses'}</li>
                        <li style={{ marginBottom: '10px' }}><FaAngleLeft style={{ marginRight: '5px' }} /> {lang === 'ar' ? 'المتجر' : 'Store'}</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>{lang === 'ar' ? 'الدعم النفسي' : 'Psychological Support'}</h4>
                    <p style={{ opacity: 0.9, marginBottom: '10px', fontSize: '0.9rem' }}>
                        {lang === 'ar' ? 'صحتك النفسية تهمنا. فريقنا من الأخصائيين متواجد دايماً.' : 'Your mental health matters. Our team is always here.'}
                    </p>
                    <button className="btn-outline" style={{ color: 'white', borderColor: 'white', padding: '5px 10px' }}>
                        {lang === 'ar' ? 'احجز جلسة' : 'Book a session'}
                    </button>
                </div>
                <div className="footer-col">
                    <h4>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><FaPhoneAlt style={{ color: 'var(--p-purple)', marginRight: '8px' }} /> 01000000000</li>
                        <li style={{ marginBottom: '10px' }}><FaEnvelope style={{ color: 'var(--p-purple)', marginRight: '8px' }} /> info@pixelacademy.com</li>
                    </ul>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '20px' }}>
                <p>جميع الحقوق محفوظة © 2026 لـ <a href="https://www.facebook.com/NasourMedia/" target="_blank" style={{ color: 'var(--p-purple)', fontWeight: 'bold', textDecoration: 'none' }}>Nasour Media</a></p>
            </div>
        </footer>
    );
}