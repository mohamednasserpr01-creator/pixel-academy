"use client";
import React, { useState, useEffect, useRef, use } from 'react';

// 💡 1. مسحنا استدعاء الناف بار والفوتر من هنا
import { useSettings } from '../../../../../context/SettingsContext'; // تأكد من مسار المركز السري بتاعنا

import { 
    FaPlay, FaPause, FaBackward, FaForward, FaTachometerAlt, FaCog, FaExpand, FaVolumeUp,
    FaCheck, FaLock, FaFilePdf, FaPencilAlt, FaClipboardCheck, FaComments, FaEllipsisV,
    FaRobot, FaUserTie, FaPaperPlane, FaDownload, FaArrowRight
} from 'react-icons/fa';

// =========================================================================
// 💡 MOCK LECTURE DATA
// =========================================================================
const fetchLectureData = async (courseId: string, lectureId: string) => {
    return {
        id: lectureId, courseId: courseId,
        titleAr: "المحاضرة الأولى: التأسيس الذهني والمنهجي", titleEn: "Lecture 1: Foundation",
        descAr: "في هذه المحاضرة سنناقش أساسيات المنهج وكيفية وضع خطة للمذاكرة الذكية لضمان الدرجة النهائية.",
        descEn: "In this lecture, we discuss the basics of the curriculum and smart study plans.",
        studentName: "Mahmoud_2026", 
        playlist: [
            { id: 'item1', type: 'exam', titleAr: "امتحان شامل على الباب السابق", titleEn: "Previous Chapter Exam", status: 'completed', isReq: true, questions: 20, timeLimit: 30 },
            { id: 'item2', type: 'video', titleAr: "الجزء الأول: المفاهيم الأساسية", titleEn: "Part 1: Basic Concepts", status: 'active', time: "15:20", videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "https://images.unsplash.com/photo-1434031211128-095490e7e73b?w=1200" },
            { id: 'item3', type: 'video', titleAr: "الجزء الثاني: التطبيق العملي", titleEn: "Part 2: Practical Application", status: 'available', time: "22:10", videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200" },
            { id: 'item4', type: 'pdf', titleAr: "ملزمة الشرح الأساسية (PDF)", titleEn: "Main Explanation PDF", status: 'available', link: "#" },
            { id: 'item5', type: 'pdf', titleAr: "ملخص القوانين (PDF)", titleEn: "Formulas Summary PDF", status: 'available', link: "#" },
            { id: 'item6', type: 'homework', titleAr: "واجب المحاضرة الأولى", titleEn: "Lecture 1 Homework", status: 'locked', isReq: true, questions: 15 },
            { id: 'item7', type: 'video', titleAr: "فيديو حل الواجب (يفتح بعد التسليم)", titleEn: "Homework Solution Video", status: 'locked', time: "30:00", videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "" },
            { id: 'item8', type: 'exam', titleAr: "كويز سريع نهاية الحصة", titleEn: "Quick End-of-class Quiz", status: 'locked', isReq: true, questions: 5, timeLimit: 10 }
        ]
    };
};

export default function LectureRoom({ params }: { params: Promise<{ id: string, lectureId: string }> }) {
    const resolvedParams = use(params);
    const courseId = resolvedParams.id;
    const lectureId = resolvedParams.lectureId;

    const [mounted, setMounted] = useState(false);
    const [lecture, setLecture] = useState<any>(null);
    const [activeItem, setActiveItem] = useState<any>(null);

    // 💡 2. سحب اللغة من المركز مباشرة
    const { lang } = useSettings();

    // Video Player States
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
    const [durationStr, setDurationStr] = useState("00:00");
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [wmPos, setWmPos] = useState({ top: '50%', left: '50%' });

    // Chatbot State
    const [chatMsgs, setChatMsgs] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [showInitialOpts, setShowInitialOpts] = useState(true);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        fetchLectureData(courseId, lectureId).then(data => {
            setLecture(data);
            const firstActive = data.playlist.find((i:any) => i.status === 'active' || i.status === 'available' || i.status === 'completed');
            setActiveItem(firstActive || data.playlist[0]);
            
            setChatMsgs([{ id: generateId(), sender: 'bot', text: lang === 'ar' ? 'أهلاً بك يا بطل! كيف تفضل المساعدة اليوم؟' : 'Hello! How can I help you today?' }]);
        });

        const wmInterval = setInterval(() => {
            setWmPos({ top: `${Math.floor(Math.random() * 80)}%`, left: `${Math.floor(Math.random() * 80)}%` });
        }, 4000);

        return () => clearInterval(wmInterval);
    }, [courseId, lectureId, lang]); // ضفنا الـ lang هنا عشان الشات يتحدث لو اللغة اتغيرت

    useEffect(() => {
        if (activeItem && activeItem.type === 'video' && videoRef.current) {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTimeStr("00:00");
            videoRef.current.load();
        }
    }, [activeItem]);

    useEffect(() => {
        const handleClickOutside = () => { setShowSpeedMenu(false); setShowQualityMenu(false); };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => { if(chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; }, [chatMsgs]);

    // ================= VIDEO PLAYER LOGIC =================
    const formatTime = (sec: number) => { let m=Math.floor(sec/60), s=Math.floor(sec%60); return `${m}:${s<10?'0'+s:s}`; };
    const togglePlay = () => { if(videoRef.current) { if(videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); } else { videoRef.current.pause(); setIsPlaying(false); } } };
    const handleTimeUpdate = () => { if(videoRef.current && videoRef.current.duration) { setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100); setCurrentTimeStr(formatTime(videoRef.current.currentTime)); } };
    const handleLoadedMeta = () => { if(videoRef.current) setDurationStr(formatTime(videoRef.current.duration)); };
    const skipTime = (amount: number) => { if(videoRef.current) videoRef.current.currentTime += amount; };
    const setSpeed = (speed: number) => { if(videoRef.current) videoRef.current.playbackRate = speed; setShowSpeedMenu(false); };
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => { const area = e.currentTarget; const clickX = e.nativeEvent.offsetX; if(videoRef.current) videoRef.current.currentTime = (clickX / area.offsetWidth) * videoRef.current.duration; };
    const toggleFullScreen = () => { if(!playerContainerRef.current) return; if (!document.fullscreenElement) { if (playerContainerRef.current.requestFullscreen) playerContainerRef.current.requestFullscreen(); } else { if (document.exitFullscreen) document.exitFullscreen(); } };
    const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

    // ================= CHATBOT LOGIC =================
    const generateId = () => Date.now() + Math.random();

    const handleChatOption = (type: 'ai'|'human') => {
        setShowInitialOpts(false);
        setChatMsgs(prev => [...prev, { id: generateId(), sender: 'user', text: type === 'ai' ? (lang === 'ar' ? 'أريد التحدث مع المساعد الذكي' : 'I want AI Assistant') : (lang === 'ar' ? 'أريد التحدث مع مدرس حقيقي' : 'I want human teacher') }]);
        setTimeout(() => {
            setChatMsgs(prev => [...prev, { id: generateId(), sender: 'bot', text: type === 'human' ? (lang === 'ar' ? 'تواصل مع الدعم عبر الواتساب.' : 'Contact support via WhatsApp.') : (lang === 'ar' ? 'أنا بيكسل AI! تفضل بسؤالك.' : 'I am Pixel AI! Ask your question.') }]);
        }, 600);
    };

    const sendChat = () => {
        if(!chatInput.trim()) return;
        setShowInitialOpts(false);
        setChatMsgs(prev => [...prev, { id: generateId(), sender: 'user', text: chatInput }]);
        setChatInput("");
        
        const botMsgId = generateId();
        
        setTimeout(() => { 
            setChatMsgs(prev => [...prev, { id: botMsgId, sender: 'bot', text: lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...' }]); 
            
            setTimeout(() => {
                setChatMsgs(prev => prev.map(msg => 
                    msg.id === botMsgId 
                        ? { ...msg, text: lang === 'ar' ? 'إجابة سؤالك موجودة في الدقيقة 12:00 من الفيديو، هل تحتاج شرح مبسط لها؟' : 'The answer is at 12:00 in the video. Need a simpler explanation?' } 
                        : msg
                ));
            }, 1500);
        }, 600);
    };

    if (!mounted || !lecture || !activeItem) return null;

    const getIcon = (type: string) => { switch(type) { case 'exam': return <FaClipboardCheck />; case 'video': return <FaPlay />; case 'homework': return <FaPencilAlt />; case 'pdf': return <FaFilePdf />; default: return <FaPlay />; } };

    const renderMainContent = () => {
        if (activeItem.status === 'locked') {
            return (
                <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center', padding: '20px' }}>
                    <FaLock style={{ fontSize: '4rem', color: '#7f8c8d', marginBottom: '20px' }} />
                    <h2 style={{ marginBottom: '10px' }}>{lang === 'ar' ? 'هذا المحتوى مغلق' : 'Content Locked'}</h2>
                    <p style={{ opacity: 0.8 }}>{lang === 'ar' ? 'يجب إنهاء المهام السابقة أولاً لفتح هذا الجزء.' : 'You must complete previous tasks to unlock this.'}</p>
                </div>
            );
        }

        switch (activeItem.type) {
            case 'video':
                return (
                    <div className={`pixel-player ${!isPlaying ? 'paused' : ''}`} ref={playerContainerRef} onContextMenu={handleContextMenu}>
                        <div className="watermark" style={{ top: wmPos.top, left: wmPos.left }}>{lecture.studentName}</div>
                        <div className="video-cage" onClick={togglePlay}></div>
                        
                        <video ref={videoRef} src={activeItem.videoSrc} poster={activeItem.poster} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMeta} playsInline></video>
                        
                        <div className="player-controls">
                            <div className="progress-area" onClick={handleProgressClick}><div className="progress-filled" style={{ width: `${progress}%` }}></div></div>
                            <div className="controls-row">
                                <div className="controls-left">
                                    <button className="ctrl-btn" onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                                    <button className="ctrl-btn" onClick={() => skipTime(document.documentElement.dir==='rtl' ? 10 : -10)}><FaBackward /></button>
                                    <button className="ctrl-btn" onClick={() => skipTime(document.documentElement.dir==='rtl' ? -10 : 10)}><FaForward /></button>
                                    <div className="time-display">{currentTimeStr} / {durationStr}</div>
                                </div>
                                <div className="controls-right">
                                    <div className="speed-menu">
                                        <button className="ctrl-btn" onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }}><FaTachometerAlt /></button>
                                        <div className={`menu-popup ${showSpeedMenu ? 'show' : ''}`}>
                                            <button onClick={() => setSpeed(2)}>2x</button><button onClick={() => setSpeed(1.5)}>1.5x</button><button onClick={() => setSpeed(1)}>1x</button>
                                        </div>
                                    </div>
                                    <button className="ctrl-btn"><FaVolumeUp /></button>
                                    <button className="ctrl-btn" onClick={toggleFullScreen}><FaExpand /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'exam':
            case 'homework':
                return (
                    <div style={{ padding: '50px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center' }}>
                        {activeItem.type === 'exam' ? <FaClipboardCheck style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '20px' }} /> : <FaPencilAlt style={{ fontSize: '4rem', color: '#f1c40f', marginBottom: '20px' }} />}
                        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>{lang === 'ar' ? activeItem.titleAr : activeItem.titleEn}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', opacity: 0.8, fontWeight: 'bold' }}>
                            <span>📋 {activeItem.questions} {lang === 'ar' ? 'سؤال' : 'Questions'}</span>
                            {activeItem.timeLimit && <span>⏱️ {activeItem.timeLimit} {lang === 'ar' ? 'دقيقة' : 'Mins'}</span>}
                        </div>
                        <button className="glow-btn" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                            {lang === 'ar' ? 'ابدأ الحل الآن' : 'Start Now'} <FaArrowRight style={{ margin: '0 8px', transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                        </button>
                    </div>
                );

            case 'pdf':
                return (
                    <div style={{ padding: '50px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center' }}>
                        <FaFilePdf style={{ fontSize: '5rem', color: '#e74c3c', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{lang === 'ar' ? activeItem.titleAr : activeItem.titleEn}</h2>
                        <p style={{ opacity: 0.8, marginBottom: '30px' }}>{lang === 'ar' ? 'يمكنك تصفح الملزمة أو تحميلها على جهازك.' : 'You can view or download the file.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button className="btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaDownload /> {lang === 'ar' ? 'تحميل (PDF)' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        // 💡 3. الكلاس السحري لحماية التصميم بدل الستايلات القديمة
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            
            <div className="room-container">
                <main className="main-content">
                    
                    {renderMainContent()}

                    <div className="lecture-details">
                        <h1>{lang === 'ar' ? activeItem.titleAr : activeItem.titleEn}</h1>
                        <p style={{ opacity: 0.8, lineHeight: 1.8, fontWeight: 700 }}>
                            {lang === 'ar' ? lecture.descAr : lecture.descEn}
                        </p>
                    </div>

                    <div className="chat-section">
                        <div className="chat-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaComments /> {lang === 'ar' ? 'مركز المساعدة الذكي' : 'Smart Help Center'}</div>
                            <FaEllipsisV style={{ cursor: 'pointer' }} />
                        </div>
                        <div id="chat-msgs" ref={chatBoxRef}>
                            {chatMsgs.map((msg) => (
                                <div key={msg.id} className={`msg ${msg.sender}`}>
                                    {msg.text}
                                    {msg.id === chatMsgs[0]?.id && showInitialOpts && (
                                        <div className="chat-options">
                                            <button className="chat-opt-btn" onClick={() => handleChatOption('ai')}><FaRobot /> {lang==='ar'?'مساعد ذكي (AI)':'AI Assistant'}</button>
                                            <button className="chat-opt-btn" onClick={() => handleChatOption('human')}><FaUserTie /> {lang==='ar'?'مدرس حقيقي':'Human Teacher'}</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                                placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'} 
                            />
                            <button onClick={sendChat}><FaPaperPlane /></button>
                        </div>
                    </div>
                </main>

                <aside className="playlist-sidebar">
                    <div className="playlist-header">
                        <h3>{lang === 'ar' ? 'محتويات المحاضرة' : 'Lecture Content'}</h3>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.8 }}>{lang === 'ar' ? 'نسبة الإنجاز:' : 'Progress:'} 12%</div>
                        <div className="progress-container"><div className="progress-bar" style={{ width: '12%' }}></div></div>
                    </div>
                    <div className="playlist-items">
                        {lecture.playlist.map((item: any) => (
                            <div 
                                key={item.id} 
                                className={`pl-item ${item.status} ${activeItem.id === item.id ? 'active' : ''}`}
                                onClick={() => { if(item.status !== 'locked') setActiveItem(item); }}
                            >
                                <div className="pl-icon">
                                    {item.status === 'locked' ? <FaLock /> : (item.status === 'completed' ? <FaCheck /> : getIcon(item.type))}
                                </div>
                                <div className="pl-info">
                                    <h4>{lang === 'ar' ? item.titleAr : item.titleEn} {item.isReq && <span className="req-badge">{lang === 'ar' ? 'إجباري' : 'Req'}</span>}</h4>
                                    <span className="pl-meta">
                                        {item.status === 'locked' ? (lang === 'ar' ? 'مغلق' : 'Locked') : 
                                        (item.status === 'completed' ? (lang === 'ar' ? 'تم الاجتياز' : 'Completed') : 
                                        (item.time ? `${item.time} ${lang === 'ar' ? 'دقيقة' : 'Mins'}` : (lang === 'ar' ? 'متاح الآن' : 'Available')))}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    );
}