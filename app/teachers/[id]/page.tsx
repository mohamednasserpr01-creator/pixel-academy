"use client";
import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { 
    FaPhoneAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok, 
    FaPlay, FaMicrophone, FaPaperPlane, FaCommentAlt, FaLock, FaBolt
} from 'react-icons/fa';

// 💡 1. استدعاء مركز الإعدادات
import { useSettings } from '../../../context/SettingsContext';

// =========================================================================
// 💡 MOCK API DATA 
// =========================================================================
const fetchTeacherData = async (id: string) => {
    return {
        id, 
        nameAr: "أ. محمد ناصر", nameEn: "Mr. Mohamed Nasser", 
        subjectAr: "التسويق الرقمي", subjectEn: "Digital Marketing",
        bioAr: "مؤسس شركة Nasour Media. خبير في التسويق الرقمي، إدارة منصات التواصل الاجتماعي، وبناء الخطط التسويقية.",
        bioEn: "Founder of Nasour Media. Expert in digital marketing and social media.", 
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400", phone: "01033259951",
        socials: { whatsapp: "https://wa.me/201221466441", facebook: "https://facebook.com/NasourMedia/", instagram: "https://instagram.com/nasourr__media/", tiktok: "https://tiktok.com/@nasourmedia" },
        courses: [
            { id: 101, grade: 1, titleAr: "أساسيات التسويق 1", titleEn: "Marketing Basics 1", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400" },
            { id: 102, grade: 1, titleAr: "أساسيات التسويق 2", titleEn: "Marketing Basics 2", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" },
            { id: 103, grade: 1, titleAr: "أساسيات التسويق 3", titleEn: "Marketing Basics 3", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
            { id: 104, grade: 1, titleAr: "أساسيات التسويق 4", titleEn: "Marketing Basics 4", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
            { id: 105, grade: 1, titleAr: "أساسيات التسويق 5", titleEn: "Marketing Basics 5", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400" },
            { id: 106, grade: 1, titleAr: "أساسيات التسويق 6", titleEn: "Marketing Basics 6", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" },
            { id: 107, grade: 1, titleAr: "أساسيات التسويق 7", titleEn: "Marketing Basics 7", descAr: "مقدمة شاملة", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
            { id: 201, grade: 2, titleAr: "إعلانات الممول", titleEn: "Ads", descAr: "احتراف الاستهداف والحملات.", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
            { id: 301, grade: 3, titleAr: "خطة تسويقية", titleEn: "Marketing Plan", descAr: "دراسة حالة عملية للشركات.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" }
        ]
    };
};

export default function TeacherProfile({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const teacherId = resolvedParams.id;

    // 💡 2. سحب اللغة من المركز الموحد
    const { lang } = useSettings();

    const [mounted, setMounted] = useState(false);
    const [teacher, setTeacher] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    // Courses State
    const [currentGrade, setCurrentGrade] = useState(1);
    const [visibleCourses, setVisibleCourses] = useState(6);

    // Chatbot State
    const [chatInput, setChatInput] = useState("");
    const [replyFormat, setReplyFormat] = useState("text");
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<{id: number, sender: 'bot'|'user', type: 'text'|'voice', content: string}[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    // Initial Load & Fetch Data
    useEffect(() => {
        setMounted(true);

        fetchTeacherData(teacherId).then(data => {
            setTeacher(data);
            setMessages([{ 
                id: 1, sender: 'bot', type: 'text', 
                content: lang === 'ar' ? `أهلاً بيك! أنا المساعد الذكي لـ ${data.nameAr}. اختار طريقة الرد (نص أو صوت) واسألني في المنهج!` : `Welcome! I'm ${data.nameEn}'s AI.` 
            }]);
        });
    }, [teacherId, lang]);

    // Scroll to bottom of chat
    useEffect(() => {
        if(chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, [messages, isTyping]);

    // ================= CHAT LOGIC =================
    const handleSendChat = () => {
        if(!chatInput.trim()) return;
        
        const newMsgId = messages.length + 2;
        setMessages(prev => [...prev, { id: newMsgId, sender: 'user', type: 'text', content: chatInput }]);
        setChatInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: newMsgId + 1, 
                sender: 'bot', 
                type: replyFormat as 'text'|'voice', 
                content: replyFormat === 'text' ? (lang === 'ar' ? "بالنسبة لسؤالك، أول خطوة هي تحديد الجمهور المستهدف بدقة." : "For your question, the first step is targeting the audience.") : "0:15" 
            }]);
        }, 1500);
    };

    const toggleMic = () => {
        setIsRecording(!isRecording);
        if(!isRecording) {
            setTimeout(() => { 
                setChatInput(lang === 'ar' ? "اشرحلي إزاي أعمل خطة تسويقية؟" : "Explain how to make a marketing plan?"); 
                setIsRecording(false); 
            }, 2000);
        }
    };

    // 💡 3. شاشة تحميل شيك لو الداتا لسه بتيجي
    if (!mounted || !teacher) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </main>
    );

    const filteredCourses = teacher.courses.filter((c:any) => c.grade === currentGrade);
    const coursesToShow = filteredCourses.slice(0, visibleCourses);
    const hasMore = visibleCourses < filteredCourses.length;

    return (
        // 💡 4. استخدام الكلاس السحري
        <main className="page-wrapper">

            {/* Profile Banner */}
            <section className="profile-banner">
                <div className="banner-card">
                    <img src={teacher.img} alt={teacher.nameEn} className="prof-img" />
                    <div className="prof-info">
                        <span className="prof-badge">{lang === 'ar' ? teacher.subjectAr : teacher.subjectEn}</span>
                        <h1>{lang === 'ar' ? teacher.nameAr : teacher.nameEn}</h1>
                        <p className="prof-bio">{lang === 'ar' ? teacher.bioAr : teacher.bioEn}</p>
                        <div className="prof-socials">
                            <a href={`tel:${teacher.phone}`} className="phone-btn"><FaPhoneAlt /> {teacher.phone}</a>
                            {teacher.socials.whatsapp && <a href={teacher.socials.whatsapp} target="_blank" rel="noreferrer"><FaWhatsapp /></a>}
                            {teacher.socials.facebook && <a href={teacher.socials.facebook} target="_blank" rel="noreferrer"><FaFacebookF /></a>}
                            {teacher.socials.instagram && <a href={teacher.socials.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a>}
                            {teacher.socials.tiktok && <a href={teacher.socials.tiktok} target="_blank" rel="noreferrer"><FaTiktok /></a>}
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="courses-section" style={{ marginTop: '40px' }}>
                <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '25px', borderRight: lang==='ar'?'5px solid var(--p-purple)':'none', borderLeft: lang==='en'?'5px solid var(--p-purple)':'none', paddingRight: lang==='ar'?'15px':'0', paddingLeft: lang==='en'?'15px':'0' }}>
                    {lang === 'ar' ? 'كورسات المدرس' : "Teacher's Courses"}
                </h2>
                
                <div className="grade-tabs">
                    {[1, 2, 3].map(grade => (
                        <button 
                            key={grade} 
                            className={`tab-btn ${currentGrade === grade ? 'active' : ''}`}
                            onClick={() => { setCurrentGrade(grade); setVisibleCourses(6); }}
                        >
                            {lang === 'ar' ? `الصف ${grade === 1 ? 'الأول' : grade === 2 ? 'الثاني' : 'الثالث'} الثانوي` : `Grade ${grade}`}
                        </button>
                    ))}
                </div>
                
                <div className="courses-grid" style={{ marginTop: '20px' }}>
                    {coursesToShow.length > 0 ? (
                        coursesToShow.map((c:any) => (
                            <div key={c.id} className="course-card">
                                <img src={c.img} alt={c.titleEn} />
                                <h3>{lang === 'ar' ? c.titleAr : c.titleEn}</h3>
                                <p style={{ flex: 1 }}>{lang === 'ar' ? c.descAr : c.descEn}</p>
                                <Link href={`/courses/${c.id}`} className="card-btn">
                                    {lang === 'ar' ? 'تفاصيل الكورس' : 'Course Details'}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                            <p>{lang === 'ar' ? 'لا توجد كورسات متاحة لهذه المرحلة حالياً.' : 'No courses available for this grade.'}</p>
                        </div>
                    )}
                </div>

                {hasMore && (
                    <button 
                        className="btn-outline" 
                        style={{ display: 'block', margin: '30px auto 0', padding: '10px 30px', borderRadius: '50px' }}
                        onClick={() => setVisibleCourses(prev => prev + 6)}
                    >
                        {lang === 'ar' ? 'عرض المزيد من الكورسات' : 'Load More Courses'}
                    </button>
                )}
            </section>

            {/* Ask Teacher (AI Chat) Section */}
            <section className="ask-section" style={{ marginTop: '50px' }}>
                <div className="ai-glass-card">
                    <div className="chat-header">
                        <img src={teacher.img} alt="Teacher" />
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', fontSize: '1.4rem' }}>
                                {lang === 'ar' ? `اسأل ${teacher.nameAr}` : `Ask ${teacher.nameEn}`} <span className="status-dot"></span>
                            </h3>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                {lang === 'ar' ? 'مساعد ذكي مدرب على المنهج' : 'AI Assistant trained on curriculum'}
                            </span>
                        </div>
                        <FaBolt style={{ color: '#00d2ff', fontSize: '1.5rem', marginRight: 'auto', marginLeft: lang === 'en' ? 'auto' : '0' }} />
                    </div>
                    
                    <div className="chat-box" ref={chatBoxRef}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`msg ${msg.sender}`}>
                                {msg.type === 'text' ? (
                                    <p>{msg.content}</p>
                                ) : (
                                    <div>
                                        <span style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>{lang === 'ar' ? 'إجابة سؤالك جاهزة في الريكورد ده:' : 'Your answer is ready in this record:'}</span>
                                        <div className="voice-note">
                                            <button className="play-btn"><FaPlay size={12} /></button>
                                            <div className="waveform">
                                                <div className="wave-line" style={{ height: '40%' }}></div><div className="wave-line" style={{ height: '80%' }}></div>
                                                <div className="wave-line" style={{ height: '60%' }}></div><div className="wave-line" style={{ height: '100%' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{msg.content}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="msg bot">
                                <p style={{ opacity: 0.7 }}>{lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</p>
                            </div>
                        )}
                    </div>

                    <div className="chat-bottom-wrapper">
                        {!isLoggedIn && (
                            <div className="chat-lock-overlay">
                                <FaLock size={30} style={{ color: 'var(--p-purple)' }} />
                                <p>{lang === 'ar' ? 'يجب تسجيل الدخول للتحدث مع المدرس' : 'You must log in to chat'}</p>
                                <button className="btn-primary" onClick={() => setIsLoggedIn(true)}>
                                    {lang === 'ar' ? 'تسجيل الدخول الآن' : 'Login Now'}
                                </button>
                            </div>
                        )}

                        <div className="chat-options">
                            <span>{lang === 'ar' ? 'طريقة الرد:' : 'Reply format:'}</span>
                            <label className="radio-label">
                                <input type="radio" name="replyFormat" value="voice" checked={replyFormat === 'voice'} onChange={(e) => setReplyFormat(e.target.value)} /> 
                                <FaMicrophone style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'رسالة صوتية' : 'Voice'}
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="replyFormat" value="text" checked={replyFormat === 'text'} onChange={(e) => setReplyFormat(e.target.value)} /> 
                                <FaCommentAlt style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'نص كتابي' : 'Text'}
                            </label>
                        </div>
                        
                        <div className="chat-controls">
                            <button className={`btn-voice ${isRecording ? 'recording' : ''}`} onClick={toggleMic}>
                                <FaMicrophone />
                            </button>
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                                placeholder={lang === 'ar' ? 'اكتب سؤالك هنا...' : 'Ask your question...'} 
                            />
                            <button className="btn-send" onClick={handleSendChat}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}