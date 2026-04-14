import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        
        {/* 1. العمود الأول: اللوجو ووصف الأكاديمية */}
        <div className="footer-col">
          <div className="logo" style={{ marginBottom: '15px' }}>
            <img src="/logo.png" alt="Pixel Academy" style={{ height: '50px' }} />
          </div>
          <p style={{ color: 'var(--txt-mut)', lineHeight: '1.8', fontSize: '0.95rem' }}>
            منصة بيكسل أكاديمي هي بوابتك للتعليم التفاعلي الذكي. نوفر لك أفضل الأدوات والتقنيات لتحقيق التفوق بأسلوب عصري.
          </p>
        </div>

        {/* 2. العمود الثاني: روابط سريعة */}
        <div className="footer-col">
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link href="/">الرئيسية</Link></li>
            <li><Link href="/courses">الكورسات</Link></li>
            <li><Link href="/teachers">المدرسين</Link></li>
            <li><Link href="/offers">العروض والخصومات</Link></li>
          </ul>
        </div>

        {/* 3. العمود الثالث: الدعم والمساعدة */}
        <div className="footer-col">
          <h3>الدعم والمساعدة</h3>
          <ul>
            <li><Link href="/knowledge-bank">بنك المعرفة</Link></li>
            <li><Link href="/support-room">غرفة الدعم</Link></li>
            <li><Link href="/contact">تواصل معنا</Link></li>
            <li><Link href="/faq">الأسئلة الشائعة</Link></li>
          </ul>
        </div>

        {/* 4. العمود الرابع: معلومات التواصل (أرقامك الحقيقية) */}
        <div className="footer-col">
          <h3>تواصل معنا</h3>
          <ul>
            <li>📍 الإسكندرية، مصر</li>
            <li>📞 الدعم الفني: <span dir="ltr">01033259951</span></li>
            <li>📞 واتساب السكرتارية: <span dir="ltr">01221466441</span></li>
            <li>✉️ info@pixelacademy.com</li>
          </ul>
        </div>

      </div>

      {/* الجزء السفلي: السوشيال ميديا وحقوق الملكية */}
      <div className="auth-footer">
        <div className="social-links">
          <a href="https://www.facebook.com/NasourMedia/" target="_blank" rel="noreferrer" title="Facebook">
             <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/nasourr__media/" target="_blank" rel="noreferrer" title="Instagram">
             <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/@nasourmedia" target="_blank" rel="noreferrer" title="TikTok">
             <FaTiktok />
          </a>
          <a href="#" target="_blank" rel="noreferrer" title="YouTube">
             <FaYoutube />
          </a>
        </div>
        
        <div className="copyright" style={{ marginTop: '20px' }}>
          جميع الحقوق محفوظة © {new Date().getFullYear()} بيكسل أكاديمي
        </div>
      </div>
    </footer>
  );
}