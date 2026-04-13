"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
    FaGraduationCap, FaBook, FaChalkboardTeacher, 
    FaFilePdf, FaUserEdit, FaHdd, FaDownload, FaFolderOpen 
} from 'react-icons/fa';

// 💡 استدعاء الداتا من الفولدر الخارجي بدلاً من كتابتها هنا
import { libraryDB } from '../../data/libraryData';

export default function LibraryPage() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');

    // 💡 States للفلترة
    const [stageFilter, setStageFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [teacherFilter, setTeacherFilter] = useState('all');
    
    // Toast State
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme); setLang(savedLang);
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const toggleMode = () => { setTheme(theme === 'dark' ? 'light' : 'dark'); if(theme === 'dark') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode'); localStorage.setItem('pixel_theme', theme === 'dark' ? 'light' : 'dark'); };
    const toggleLang = () => { const newLang = lang === 'ar' ? 'en' : 'ar'; setLang(newLang); document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'; localStorage.setItem('pixel_lang', newLang); };

    // 💡 دالة محاكاة التحميل
    const handleDownload = (title: string) => {
        setToastMsg(lang === 'ar' ? `جاري تحضير ملف: ${title}...` : `Preparing file: ${title}...`);
        setTimeout(() => setToastMsg(null), 3000);
    };

    if (!mounted) return null;

    // 💡 فلترة الداتا بناءً على الاختيارات الحالية
    const filteredFiles = libraryDB.filter(file => {
        const matchStage = stageFilter === 'all' || file.stage === stageFilter;
        const matchSubject = subjectFilter === 'all' || file.subject === subjectFilter;
        const matchTeacher = teacherFilter === 'all' || file.teacher === teacherFilter;
        return matchStage && matchSubject && matchTeacher;
    });

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            {/* ======== HERO SECTION ======== */}
            <div className="library-hero">
                <h1>{lang === 'ar' ? 'مكتبة بيكسل 📚' : 'Pixel Library 📚'}</h1>
                <p>{lang === 'ar' ? 'أكبر مستودع مجاني لمذكرات الشرح، المراجعات النهائية، والكتب الخارجية. حمل اللي تحتاجه بضغطة زر.' : 'The largest free repository for study notes, final reviews, and external books. Download what you need with one click.'}</p>
            </div>

            {/* ======== FILTERS ======== */}
            <section className="filters-section">
                <div className="filters-wrapper">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label><FaGraduationCap style={{ margin: '0 5px' }}/> {lang === 'ar' ? 'المرحلة التعليمية' : 'Educational Stage'}</label>
                            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
                                <option value="all">{lang === 'ar' ? 'جميع المراحل' : 'All Stages'}</option>
                                <option value="sec3">{lang === 'ar' ? 'الصف الثالث الثانوي' : 'Grade 12'}</option>
                                <option value="sec2">{lang === 'ar' ? 'الصف الثاني الثانوي' : 'Grade 11'}</option>
                                <option value="sec1">{lang === 'ar' ? 'الصف الأول الثانوي' : 'Grade 10'}</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label><FaBook style={{ margin: '0 5px' }}/> {lang === 'ar' ? 'المادة' : 'Subject'}</label>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                                <option value="all">{lang === 'ar' ? 'جميع المواد' : 'All Subjects'}</option>
                                <option value="physics">{lang === 'ar' ? 'فيزياء' : 'Physics'}</option>
                                <option value="chemistry">{lang === 'ar' ? 'كيمياء' : 'Chemistry'}</option>
                                <option value="arabic">{lang === 'ar' ? 'لغة عربية' : 'Arabic'}</option>
                                <option value="math">{lang === 'ar' ? 'رياضيات' : 'Math'}</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label><FaChalkboardTeacher style={{ margin: '0 5px' }}/> {lang === 'ar' ? 'المدرس المشارك' : 'Teacher'}</label>
                            <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
                                <option value="all">{lang === 'ar' ? 'جميع المدرسين' : 'All Teachers'}</option>
                                <option value="t1">{lang === 'ar' ? 'أ. محمد ناصر (فيزياء)' : 'Mr. Mohamed Nasser (Physics)'}</option>
                                <option value="t2">{lang === 'ar' ? 'أ. محمود سعيد (كيمياء)' : 'Mr. Mahmoud Saeed (Chemistry)'}</option>
                                <option value="t3">{lang === 'ar' ? 'أ. عبد الله السيد (عربي)' : 'Mr. Abdallah Elsayed (Arabic)'}</option>
                                <option value="external">{lang === 'ar' ? 'كتب خارجية عامة' : 'External Books'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== GRID ======== */}
            <section className="library-container">
                {filteredFiles.length === 0 ? (
                    <div className="no-results">
                        <FaFolderOpen style={{ fontSize: '3rem', color: 'var(--p-purple)', marginBottom: '15px' }} /><br/>
                        {lang === 'ar' ? 'عفواً، لا توجد ملفات متطابقة مع بحثك الحالي.' : 'Sorry, no files match your current search.'}
                    </div>
                ) : (
                    filteredFiles.map(f => {
                        // 💡 لون الأيقونة يتغير ديناميكياً حسب المادة
                        let iconColor = '#e74c3c'; // Default Red
                        if(f.subject === 'physics') iconColor = '#3498db';
                        if(f.subject === 'chemistry') iconColor = '#2ecc71';
                        if(f.subject === 'arabic') iconColor = '#e67e22';

                        return (
                            <div key={f.id} className="pdf-card">
                                <div className="free-badge">{lang === 'ar' ? 'مجاني' : 'Free'}</div>
                                <div className="pdf-icon-wrapper">
                                    <FaFilePdf style={{ fontSize: '4rem', color: iconColor }} />
                                </div>
                                <div><span className="pdf-stage">{f.stageName}</span></div>
                                <h3 className="pdf-title">{f.title}</h3>
                                <div className="pdf-teacher"><FaUserEdit /> {f.teacherName}</div>
                                
                                <div className="pdf-footer">
                                    <span className="file-size"><FaHdd /> {lang === 'ar' ? 'الحجم:' : 'Size:'} {f.size}</span>
                                    <button className="btn-download" onClick={() => handleDownload(f.title)}>
                                        {lang === 'ar' ? 'تحميل' : 'Download'} <FaDownload />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/* Toast Notification */}
            <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ zIndex: 9999 }}>
                <FaDownload /> <span>{toastMsg}</span>
            </div>

            <Footer />
        </main>
    );
}