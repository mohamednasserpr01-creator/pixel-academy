"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
    FaHeadset, FaPhoneAlt, FaWhatsapp, FaShareAlt, 
    FaFacebookF, FaInstagram, FaTiktok, FaYoutube, 
    FaPaperPlane, FaCheckCircle 
} from 'react-icons/fa';

export default function ContactPage() {
    // initialize with defaults for SSR safety
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        // Sync with localStorage after hydration
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme); 
        setLang(savedLang);
        
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const toggleMode = () => { 
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme); 
        if(newTheme === 'light') document.body.classList.add('light-mode'); 
        else document.body.classList.remove('light-mode'); 
        localStorage.setItem('pixel_theme', newTheme); 
    };

    const toggleLang = () => { 
        const newLang = lang === 'ar' ? 'en' : 'ar'; 
        setLang(newLang); 
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'; 
        localStorage.setItem('pixel_lang', newLang); 
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setToastMsg(lang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!');
            setTimeout(() => { setToastMsg(null); }, 3000);
            (e.target as HTMLFormElement).reset();
        }, 2000);
    };

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            <div className="contact-hero">
                <h1>{lang === 'ar' ? 'إحنا دايماً معاك 🎧' : 'We Are Always Here 🎧'}</h1>
                <p>{lang === 'ar' ? 'سواء عندك استفسار أو واجهتك مشكلة، فريق الدعم جاهز للرد عليك.' : 'Whether you have an inquiry or an issue, our team is ready to help.'}</p>
            </div>

            <div className="contact-container">
                {/* FORM SECTION */}
                <div className="contact-form-wrapper">
                    <h2>{lang === 'ar' ? 'أرسل رسالة ✉️' : 'Send a Message ✉️'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                            <input type="text" className="contact-form-control" placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'} required />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}</label>
                            <select className="contact-form-control" required defaultValue="">
                                <option value="" disabled>{lang === 'ar' ? 'اختر نوع المشكلة...' : 'Select issue type...'}</option>
                                <option value="tech">{lang === 'ar' ? 'مشكلة تقنية' : 'Technical Issue'}</option>
                                <option value="payment">{lang === 'ar' ? 'الدفع والمحفظة' : 'Payment & Wallet'}</option>
                                <option value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'رسالتك' : 'Message'}</label>
                            <textarea className="contact-form-control" placeholder={lang === 'ar' ? 'اكتب تفاصيل استفسارك...' : 'Type your details...'} required></textarea>
                        </div>
                        
                        <button type="submit" className="btn-submit" disabled={isSubmitting} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            {isSubmitting ? <div className="spinner"></div> : <><span>{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span><FaPaperPlane /></>}
                        </button>
                    </form>
                </div>

                {/* INFO SECTION */}
                <div className="contact-info-wrapper">
                    <div className="info-card">
                        <h3><FaHeadset /> {lang === 'ar' ? 'الدعم المباشر' : 'Direct Support'}</h3>
                        <div className="contact-methods">
                            {/* روابط الاتصال القياسية - أسرع وأفضل للـ SEO والـ PWA */}
                            <a href="tel:+201033259951" className="contact-btn btn-call" style={{ textDecoration: 'none' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>01033259951</span>
                                <FaPhoneAlt />
                            </a>
                            
                            <a href="tel:+201221466441" className="contact-btn btn-call" style={{ textDecoration: 'none' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>01221466441</span>
                                <FaPhoneAlt />
                            </a>

                            {/* رابط واتساب السكرتارية */}
                            <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" className="contact-btn btn-wa" style={{ textDecoration: 'none' }}>
                                <span>{lang === 'ar' ? 'واتساب السكرتارية' : 'WhatsApp Support'}</span>
                                <FaWhatsapp style={{ fontSize: '1.5rem' }} />
                            </a>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3><FaShareAlt /> {lang === 'ar' ? 'السوشيال ميديا' : 'Social Media'}</h3>
                        <div className="social-grid">
                            <a href="https://www.facebook.com/NasourMedia/" target="_blank" rel="noreferrer" className="social-btn s-fb"><FaFacebookF /> <span>Facebook</span></a>
                            <a href="https://www.instagram.com/nasourr__media/" target="_blank" rel="noreferrer" className="social-btn s-ig"><FaInstagram /> <span>Instagram</span></a>
                            <a href="https://www.tiktok.com/@nasourmedia" target="_blank" rel="noreferrer" className="social-btn s-tk"><FaTiktok /> <span>TikTok</span></a>
                            <a href="#" target="_blank" rel="noreferrer" className="social-btn s-yt"><FaYoutube /> <span>YouTube</span></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ zIndex: 9999 }}>
                <FaCheckCircle /> <span>{toastMsg}</span>
            </div>

            <Footer />
        </main>
    );
}