"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaSearch, FaFrown, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

// ==============================================================
// 💡 دي البيانات المؤقتة (عمرو هيغيرها ويخليها تيجي من الباك إند)
// ==============================================================
const mockTeachers = [
    { id: 1, nameAr: "أ. محمد ناصر", nameEn: "Mr. Mohamed Nasser", subjectId: "marketing", subjectAr: "التسويق الرقمي", subjectEn: "Digital Marketing", bioAr: "خبير التسويق الرقمي وإدارة منصات التواصل الاجتماعي.", bioEn: "Digital marketing expert with years of experience.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
    { id: 2, nameAr: "أ. أحمد سمير", nameEn: "Mr. Ahmed Samir", subjectId: "arabic", subjectAr: "اللغة العربية", subjectEn: "Arabic", bioAr: "مدرس أول لغة عربية، متخصص في تبسيط النحو للبلاغة.", bioEn: "Senior Arabic teacher specialized in simplifying grammar.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
    { id: 3, nameAr: "أ. محمود طارق", nameEn: "Mr. Mahmoud Tarek", subjectId: "arabic", subjectAr: "اللغة العربية", subjectEn: "Arabic", bioAr: "خبير في تدريس النصوص والأدب بأساليب حديثة.", bioEn: "Expert in teaching literature with modern methods.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" },
    { id: 4, nameAr: "د. مصطفى كمال", nameEn: "Dr. Mostafa Kamal", subjectId: "physics", subjectAr: "الفيزياء", subjectEn: "Physics", bioAr: "مقدم تجارب علمية مبسطة لفهم قوانين الفيزياء.", bioEn: "Presents simplified scientific experiments for physics.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 5, nameAr: "م. سارة جمال", nameEn: "Eng. Sarah Gamal", subjectId: "math", subjectAr: "الرياضيات", subjectEn: "Mathematics", bioAr: "مهندسة متخصصة في شرح الرياضيات بأسلوب مبتكر.", bioEn: "Engineer specialized in teaching mathematics.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
    { id: 6, nameAr: "أ. خالد حسن", nameEn: "Mr. Khaled Hassan", subjectId: "chemistry", subjectAr: "الكيمياء", subjectEn: "Chemistry", bioAr: "شرح وافي للكيمياء العضوية مع تجارب تفاعلية.", bioEn: "Comprehensive teaching of organic chemistry.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }
];

const subjects = [
    { id: "all", nameAr: "الكل", nameEn: "All" },
    { id: "arabic", nameAr: "لغة عربية", nameEn: "Arabic" },
    { id: "physics", nameAr: "فيزياء", nameEn: "Physics" },
    { id: "math", nameAr: "رياضيات", nameEn: "Math" },
    { id: "chemistry", nameAr: "كيمياء", nameEn: "Chemistry" },
    { id: "marketing", nameAr: "التسويق الرقمي", nameEn: "Marketing" }
];

export default function TeachersPage() {
    // إعدادات الصفحة الأساسية
    const [mounted, setMounted] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('dark');
    const [lang, setLang] = useState<string>('ar');
    
    // إعدادات البحث والفلترة والصفحات
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        setTheme(savedTheme);
        setLang(savedLang);
    }, []);

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

    // فلترة المدرسين بناءً على المادة واسم المدرس
    const filteredTeachers = mockTeachers.filter(t => {
        const matchesSubject = activeFilter === 'all' || t.subjectId === activeFilter;
        const matchesSearch = t.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    // حساب عدد الصفحات وتقسيم المدرسين
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const currentData = filteredTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // لو الطالب بحث أو غير الفلتر، نرجعه للصفحة الأولى
    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeFilter]);

    if (!mounted) return null;

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* استدعاء الناف بار اللي عملناه */}
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            <div style={{ paddingTop: '80px' }}>
                {/* عنوان الصفحة */}
                <section className="page-header">
                    <h1>{lang === 'ar' ? 'نخبة التدريس' : 'Top Teachers'}</h1>
                    <p>
                        {lang === 'ar' 
                            ? 'تعرف على أفضل المدرسين على مستوى الجمهورية، واختر من يناسبك للبدء في رحلة التفوق.' 
                            : 'Meet the best teachers nationwide and choose who suits you.'}
                    </p>
                </section>

                {/* قسم البحث وأزرار المواد */}
                <div className="controls-container">
                    <div className="search-box">
                        <FaSearch />
                        <input 
                            type="text" 
                            placeholder={lang === 'ar' ? 'ابحث باسم المدرس...' : 'Search by teacher name...'} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filters">
                        {subjects.map(sub => (
                            <button 
                                key={sub.id}
                                className={`filter-btn ${activeFilter === sub.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(sub.id)}
                            >
                                {lang === 'ar' ? sub.nameAr : sub.nameEn}
                            </button>
                        ))}
                    </div>
                </div>

                {/* كروت المدرسين */}
                <div className="teachers-grid">
                    {currentData.length > 0 ? (
                        currentData.map((t) => (
                            <div key={t.id} className="teacher-card">
                                <div className="teacher-cover">
                                    <div className="img-wrapper">
                                        <img src={t.img} alt={t.nameEn} className="teacher-img" />
                                    </div>
                                </div>
                                <div className="teacher-info">
                                    <span className="subject-badge">{lang === 'ar' ? t.subjectAr : t.subjectEn}</span>
                                    <h3>{lang === 'ar' ? t.nameAr : t.nameEn}</h3>
                                    <p>{lang === 'ar' ? t.bioAr : t.bioEn}</p>
                                    <Link href={`/teachers/${t.id}`} className="glow-btn" style={{ padding: '8px 25px', fontSize: '0.9rem' }}>
                                        {lang === 'ar' ? 'الملف الشخصي' : 'View Profile'}
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', opacity: 0.7 }}>
                            <FaFrown size={50} style={{ color: 'var(--p-purple)', marginBottom: '15px' }} />
                            <h3>{lang === 'ar' ? 'عفواً، لا يوجد مدرس بهذا الاسم أو المادة.' : 'Sorry, no teacher found.'}</h3>
                        </div>
                    )}
                </div>

                {/* أزرار التقليب بين الصفحات (Pagination) */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            className="page-btn" 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            {lang === 'ar' ? <FaChevronRight /> : <FaChevronLeft />}
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i} 
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            className="page-btn" 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            {lang === 'ar' ? <FaChevronLeft /> : <FaChevronRight />}
                        </button>
                    </div>
                )}
            </div>

            {/* استدعاء الفوتر المظبوط بتاعنا */}
            <Footer />
        </main>
    );
}