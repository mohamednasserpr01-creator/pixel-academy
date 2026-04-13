"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { 
    FaSearch, FaShoppingCart, FaArrowRight, FaArrowLeft, FaBan, 
    FaCheckCircle, FaTimesCircle, FaGraduationCap, FaCalendarAlt, 
    FaBoxOpen, FaTruck, FaSignInAlt, FaPaperPlane, FaExclamationCircle
} from 'react-icons/fa';

// =========================================================================
// 💡 MOCK DATA GENERATION: محاكاة لقاعدة بيانات المتجر (60 منتج)
// =========================================================================
const STAGES = { 'sec1':'الصف الأول الثانوي', 'sec2':'الصف الثاني الثانوي', 'sec3':'الصف الثالث الثانوي', 'all':'جميع المراحل' };

const generateProducts = () => {
    const products = [];
    for(let i = 1; i <= 60; i++) {
        let isBook = Math.random() > 0.3;
        let stock = i % 7 === 0 ? 0 : Math.floor(Math.random() * 50) + 1;
        let stageKeys = Object.keys(STAGES);
        let stageKey = stageKeys[Math.floor(Math.random() * 3)]; // excluding 'all'
        
        products.push({
            id: i,
            title: isBook ? `كتاب المراجعة النهائية - إصدار ${i}` : `أدوات مدرسية - صنف ${i}`,
            desc: `هذا النص هو وصف تفصيلي للمنتج رقم ${i}. يحتوي هذا الكتاب على أهم الأسئلة المتوقعة وتدريبات شاملة بنظام التقييم الجديد.`,
            price: Math.floor(Math.random() * 200) + 50,
            stock: stock,
            type: isBook ? 'books' : 'others',
            stageKey: stageKey,
            stageName: STAGES[stageKey as keyof typeof STAGES],
            publishDate: `1${Math.floor(Math.random()*9)}/02/2026`,
            image: `https://picsum.photos/600/800?random=${i}` // عشوائي للتجربة
        });
    }
    return products;
};

const productsDB = generateProducts();

export default function StorePage() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');

    // 💡 View Logic
    const [currentView, setCurrentView] = useState<'catalog' | 'product'>('catalog');
    const [activeProduct, setActiveProduct] = useState<any>(null);
    
    // 💡 Filter Logic
    const [searchText, setSearchText] = useState('');
    const [stageFilter, setStageFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [itemsToShow, setItemsToShow] = useState(12);

    // 💡 Auth & Modals
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeModal, setActiveModal] = useState<'none' | 'login' | 'checkout'>('none');
    const [trackingPin, setTrackingPin] = useState('------');
    
    // 💡 Form Validation State
    const [formData, setFormData] = useState({ name: '', address: '', phone: '', altPhone: '' });
    const [toastData, setToastData] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

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

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastData({ msg, type });
        setTimeout(() => setToastData(null), 3500);
    };

    const filteredProducts = useMemo(() => {
        return productsDB.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
            const matchStage = stageFilter === 'all' ? true : p.stageKey === stageFilter;
            const matchCat = categoryFilter === 'all' ? true : p.type === categoryFilter;
            return matchSearch && matchStage && matchCat;
        });
    }, [searchText, stageFilter, categoryFilter]);

    const openProduct = (product: any) => {
        setActiveProduct(product);
        setCurrentView('product');
        window.scrollTo(0, 0);
    };

    const showCatalog = () => {
        setCurrentView('catalog');
        setActiveProduct(null);
        window.scrollTo(0, 0);
    };

    const processPurchaseClick = () => {
        if (!isLoggedIn) {
            setActiveModal('login');
        } else {
            openCheckoutFlow();
        }
    };

    const simulateLogin = () => {
        setIsLoggedIn(true);
        if (currentView === 'product') {
            openCheckoutFlow();
        } else {
            setActiveModal('none');
            showToast(lang === 'ar' ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
        }
    };

    const openCheckoutFlow = () => {
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        setTrackingPin(pin);
        setActiveModal('checkout');
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitOrder = () => {
        const { name, address, phone, altPhone } = formData;

        if (!name.trim() || !address.trim() || !phone.trim()) {
            showToast(lang === 'ar' ? "يرجى ملء البيانات الأساسية (الاسم، العنوان، التليفون)." : "Please fill in all required fields.", 'error');
            return;
        }

        const phoneRegex = /^01[0125][0-9]{8}$/;

        if (!phoneRegex.test(phone.trim())) {
            showToast(lang === 'ar' ? "رقم الهاتف الأساسي غير صحيح! يجب أن يتكون من 11 رقم ويبدأ بـ (010, 011, 012, 015)." : "Invalid primary phone number.", 'error');
            return;
        }

        if (altPhone.trim() && !phoneRegex.test(altPhone.trim())) {
            showToast(lang === 'ar' ? "رقم الهاتف البديل غير صحيح!" : "Invalid alternative phone number.", 'error');
            return;
        }

        showToast(lang === 'ar' ? `تم إرسال طلبك بنجاح! رقم التتبع: ${trackingPin}` : `Order sent! Tracking PIN: ${trackingPin}`, 'success');
        
        setActiveModal('none');
        setFormData({ name: '', address: '', phone: '', altPhone: '' });
        showCatalog();
    };

    if (!mounted) return null;

    const ArrowIcon = lang === 'ar' ? FaArrowRight : FaArrowLeft;

    return (
        <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden', paddingTop: '80px' }}>
            <Navbar lang={lang} theme={theme} toggleLang={toggleLang} toggleMode={toggleMode} />

            {/* ======== VIEW 1: CATALOG ======== */}
            {currentView === 'catalog' && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                    <div className="store-hero">
                        <h1><FaShoppingCart /> {lang === 'ar' ? 'المتجر الأكاديمي' : 'Academic Store'}</h1>
                        <p>{lang === 'ar' ? 'اطلب مذكراتك وكتبك وتصلك لباب البيت، وادفع بالطريقة التي تناسبك بعد المراجعة.' : 'Order your books and notes to your doorstep, and pay securely.'}</p>
                    </div>

                    <section className="store-filters-section">
                        <div className="store-filters-wrapper">
                            <div className="search-box">
                                <input 
                                    type="text" 
                                    placeholder={lang === 'ar' ? 'ابحث باسم الكتاب أو المذكرة...' : 'Search by book or note name...'} 
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <FaSearch />
                            </div>
                            <div className="stage-select">
                                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
                                    <option value="all">{lang === 'ar' ? 'جميع المراحل الدراسية' : 'All Stages'}</option>
                                    <option value="sec3">{lang === 'ar' ? 'الصف الثالث الثانوي' : 'Grade 12'}</option>
                                    <option value="sec2">{lang === 'ar' ? 'الصف الثاني الثانوي' : 'Grade 11'}</option>
                                    <option value="sec1">{lang === 'ar' ? 'الصف الأول الثانوي' : 'Grade 10'}</option>
                                </select>
                            </div>
                            <div className="category-tabs">
                                <button className={`cat-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>{lang === 'ar' ? 'الكل' : 'All'}</button>
                                <button className={`cat-btn ${categoryFilter === 'books' ? 'active' : ''}`} onClick={() => setCategoryFilter('books')}>{lang === 'ar' ? 'كتب وملازم' : 'Books'}</button>
                                <button className={`cat-btn ${categoryFilter === 'others' ? 'active' : ''}`} onClick={() => setCategoryFilter('others')}>{lang === 'ar' ? 'أدوات أخرى' : 'Others'}</button>
                            </div>
                        </div>
                    </section>

                    <section className="catalog-container">
                        {filteredProducts.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', fontSize: '1.2rem', opacity: 0.7, background: 'var(--card)', borderRadius: '15px' }}>
                                {lang === 'ar' ? 'عفواً، لا توجد منتجات مطابقة لبحثك.' : 'Sorry, no products found.'}
                            </div>
                        ) : (
                            filteredProducts.slice(0, itemsToShow).map(p => {
                                const isOut = p.stock === 0;
                                return (
                                    <div key={p.id} className="prod-card">
                                        <div className="prod-img-box" onClick={() => !isOut && openProduct(p)}>
                                            <span className={`stock-badge ${isOut ? 'out' : ''}`}>
                                                {isOut ? (lang === 'ar' ? 'نفذت' : 'Out of Stock') : (lang === 'ar' ? 'متوفر' : 'In Stock')}
                                            </span>
                                            <img src={p.image} alt={p.title} loading="lazy" />
                                        </div>
                                        <div className="prod-body">
                                            <h3 className="prod-title" onClick={() => !isOut && openProduct(p)}>{p.title}</h3>
                                            <div className="prod-action">
                                                <span className="prod-price">{p.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                                                <button className={`btn-buy ${isOut ? 'disabled' : ''}`} onClick={() => !isOut && openProduct(p)} disabled={isOut}>
                                                    {isOut ? <><FaBan /> {lang === 'ar' ? 'غير متاح' : 'Unavailable'}</> : <>{lang === 'ar' ? 'شراء' : 'Buy'} <FaShoppingCart /></>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>

                    {itemsToShow < filteredProducts.length && (
                        <div className="load-more-container">
                            <button className="btn-load-more" onClick={() => setItemsToShow(prev => prev + 12)}>
                                {lang === 'ar' ? 'عرض المزيد' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ======== VIEW 2: PRODUCT DETAILS ======== */}
            {currentView === 'product' && activeProduct && (
                <div className="product-view-container">
                    <button className="back-btn" onClick={showCatalog}>
                        <ArrowIcon /> {lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
                    </button>
                    
                    <div className="details-grid">
                        <div className="details-media">
                            <img src={activeProduct.image} className="main-img" alt={activeProduct.title} />
                            <button className="btn-confirm-purchase" onClick={processPurchaseClick}>
                                <FaCheckCircle /> {lang === 'ar' ? 'تأكيد الشراء' : 'Confirm Purchase'}
                            </button>
                        </div>
                        <div className="details-info">
                            <span className="d-stage"><FaGraduationCap style={{ margin: '0 5px' }}/> {activeProduct.stageName}</span>
                            <h1 className="d-title">{activeProduct.title}</h1>
                            <div className="d-price">{activeProduct.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</div>
                            
                            <h3 className="d-desc-title">{lang === 'ar' ? 'وصف المنتج:' : 'Description:'}</h3>
                            <p className="d-desc">{activeProduct.desc}</p>
                            
                            <div className="d-meta-box">
                                <div className="d-meta-item"><FaCalendarAlt /> {lang === 'ar' ? 'تاريخ النشر:' : 'Published:'} {activeProduct.publishDate}</div>
                                <div className="d-meta-item"><FaBoxOpen /> {lang === 'ar' ? 'حالة المخزون:' : 'Stock:'} {lang === 'ar' ? 'متوفر للطلب' : 'Available'}</div>
                                <div className="d-meta-item"><FaTruck /> {lang === 'ar' ? 'شحن سريع متوفر' : 'Fast Shipping'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======== MODAL 1: LOGIN (Bulletproof Inline Styles) ======== */}
            {activeModal === 'login' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: 'var(--card)', width: '100%', maxWidth: '500px', borderRadius: '20px', border: '2px solid #6c5ce7', padding: '30px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        <button onClick={() => setActiveModal('none')} style={{ position: 'absolute', top: '15px', left: lang === 'ar' ? '15px' : 'auto', right: lang === 'ar' ? 'auto' : '15px', background: 'none', border: 'none', color: '#e74c3c', fontSize: '1.5rem', cursor: 'pointer' }}>
                            <FaTimesCircle />
                        </button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <h2 style={{ color: '#6c5ce7', fontWeight: 900, fontSize: '1.8rem', marginBottom: '5px' }}>{lang === 'ar' ? 'تسجيل الدخول مطلوب' : 'Login Required'}</h2>
                            <p style={{ fontSize: '0.95rem', opacity: 0.8, fontWeight: 'bold' }}>{lang === 'ar' ? 'يجب تسجيل الدخول لحسابك لتتمكن من إتمام عملية الشراء.' : 'Please login to complete your purchase.'}</p>
                        </div>

                        <div style={{ marginBottom: '15px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'رقم الهاتف أو البريد الإلكتروني' : 'Phone or Email'}</label>
                            <input type="text" style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none' }} placeholder={lang === 'ar' ? 'أدخل بيانات الدخول...' : 'Enter your details...'} />
                        </div>
                        <div style={{ marginBottom: '20px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                            <input type="password" style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none' }} placeholder={lang === 'ar' ? 'أدخل كلمة المرور...' : 'Enter password...'} />
                        </div>

                        <button onClick={simulateLogin} style={{ width: '100%', background: '#6c5ce7', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <FaSignInAlt /> {lang === 'ar' ? 'تسجيل الدخول والمتابعة' : 'Login & Continue'}
                        </button>
                    </div>
                </div>
            )}

            {/* ======== MODAL 2: CHECKOUT (Bulletproof Inline Styles) ======== */}
            {activeModal === 'checkout' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: 'var(--card)', width: '100%', maxWidth: '500px', borderRadius: '20px', border: '2px solid #6c5ce7', padding: '30px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setActiveModal('none')} style={{ position: 'absolute', top: '15px', left: lang === 'ar' ? '15px' : 'auto', right: lang === 'ar' ? 'auto' : '15px', background: 'none', border: 'none', color: '#e74c3c', fontSize: '1.5rem', cursor: 'pointer' }}>
                            <FaTimesCircle />
                        </button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <h2 style={{ color: '#6c5ce7', fontWeight: 900, fontSize: '1.8rem', marginBottom: '5px' }}>{lang === 'ar' ? 'تأكيد بيانات الشحن' : 'Shipping Details'}</h2>
                            <p style={{ fontSize: '0.95rem', opacity: 0.8, fontWeight: 'bold' }}>{lang === 'ar' ? 'يرجى إدخال بياناتك بدقة لضمان وصول المندوب.' : 'Enter accurate details to ensure delivery.'}</p>
                        </div>

                        <div style={{ marginBottom: '15px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'الاسم بالكامل رباعي' : 'Full Name'} <span style={{ color: '#e74c3c' }}>*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none' }} placeholder={lang === 'ar' ? 'مثال: محمد ناصر...' : 'John Doe'} />
                        </div>
                        <div style={{ marginBottom: '15px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'العنوان بالتفصيل' : 'Full Address'} <span style={{ color: '#e74c3c' }}>*</span></label>
                            <input type="text" name="address" value={formData.address} onChange={handleFormChange} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none' }} placeholder={lang === 'ar' ? 'المحافظة، المنطقة، الشارع، رقم العمارة...' : 'City, Area, Street...'} />
                        </div>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'} <span style={{ color: '#e74c3c' }}>*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="01xxxxxxxxx" maxLength={11} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', textAlign: 'left', direction: 'ltr' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{lang === 'ar' ? 'رقم بديل (اختياري)' : 'Alt Phone'}</label>
                                <input type="tel" name="altPhone" value={formData.altPhone} onChange={handleFormChange} placeholder="01xxxxxxxxx" maxLength={11} style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.4)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', textAlign: 'left', direction: 'ltr' }} />
                            </div>
                        </div>

                        <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '2px dashed #f1c40f', padding: '15px', borderRadius: '12px', textAlign: 'center', margin: '25px 0' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>{lang === 'ar' ? 'رقم تتبع طلبك السري' : 'Your Secret Tracking PIN'}</p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f1c40f', letterSpacing: '10px', fontFamily: 'monospace' }}>{trackingPin}</div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>{lang === 'ar' ? 'احتفظ بهذا الرقم لمعرفة حالة طلبك من حسابك' : 'Save this PIN to track your order.'}</p>
                        </div>

                        <button onClick={submitOrder} style={{ width: '100%', background: '#2ecc71', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)' }}>
                            <FaPaperPlane /> {lang === 'ar' ? 'إرسال البيانات' : 'Submit Order'}
                        </button>
                    </div>
                </div>
            )}

            {/* 💡 Dynamic Toast Notification */}
            <div className={`toast ${toastData ? 'show' : ''}`} style={{ 
                position: 'fixed', bottom: '30px', 
                right: lang === 'ar' ? '30px' : 'auto', 
                left: lang === 'ar' ? 'auto' : '30px', 
                background: toastData?.type === 'error' ? '#e74c3c' : '#2ecc71', 
                color: 'white', padding: '15px 25px', borderRadius: '10px', 
                fontWeight: 'bold', boxShadow: '0 5px 20px rgba(0,0,0,0.3)', 
                transform: toastData ? 'translateY(0)' : 'translateY(100px)', 
                opacity: toastData ? 1 : 0, transition: '0.4s ease', 
                zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' 
            }}>
                {toastData?.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />} 
                <span>{toastData?.msg}</span>
            </div>

            <Footer />
        </main>
    );
}