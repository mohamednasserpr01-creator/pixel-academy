"use client";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { 
    FaBookOpen, FaCheckCircle, FaClock, FaUserMd, FaVideo, FaBolt, FaPlay, 
    FaWhatsapp, FaRobot, FaTimes, FaPaperPlane, FaPlayCircle, FaUserTie, 
    FaFileAlt, FaWallet, FaBoxOpen, FaChartPie, FaHistory, FaCog, FaSave, 
    FaKey, FaShieldAlt, FaMobileAlt, FaDesktop 
} from 'react-icons/fa';
import './dashboard.css'; 

import { useAuth } from '../../context/AuthContext';
import { dashboardData } from '../../data/mock/dashboardData';

export default function DashboardPage() {
    const { user } = useAuth(); 
    
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [walletBalance, setWalletBalance] = useState(1500);

    // 💡 إعدادات الشات الجديدة
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<{text: string, sender: 'user'|'bot'}[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Boy1&style=circle');
    const [tempAvatar, setTempAvatar] = useState('');

    const boysAvatars = Array.from({ length: 10 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Boy${i + 1}&style=circle`);
    const girlsAvatars = Array.from({ length: 10 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Girl${i + 1}&style=circle`);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('pixel_theme', newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedAvatar = localStorage.getItem('pixel_saved_avatar');
        setTheme(savedTheme);
        if (savedTheme === 'light') document.documentElement.classList.add('light-mode');
        if (savedAvatar) setCurrentAvatar(savedAvatar);

        // 💡 استرجاع المحادثة من الذاكرة
        const savedChat = localStorage.getItem('pixel_chat_history');
        if (savedChat) {
            setMessages(JSON.parse(savedChat));
        } else {
            setMessages([{ text: `أهلاً بك يا ${user?.name || user?.phone || 'بطل'}! أنا بيكسل AI، مساعدك الشخصي. اقدر اساعدك في إيه؟`, sender: 'bot' }]);
        }
    }, [user]);

    // 💡 حفظ المحادثة كل ما تتغير
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('pixel_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    // 💡 النزول التلقائي لآخر رسالة
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isChatOpen]);

    // 💡 دالة إرسال الرسالة
    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        
        const newMsg = { text: chatInput, sender: 'user' as const };
        setMessages(prev => [...prev, newMsg]);
        setChatInput('');
        setIsTyping(true);

        // محاكاة رد الذكاء الاصطناعي
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: 'فهمت سؤالك! جاري البحث في بنك المعرفة...', sender: 'bot' }]);
        }, 1500);
    };

    const saveNewAvatar = () => {
        if (tempAvatar) {
            setCurrentAvatar(tempAvatar);
            localStorage.setItem('pixel_saved_avatar', tempAvatar);
            setIsAvatarModalOpen(false);
        }
    };

    return (
        <div className="dashboard-root">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} theme={theme} toggleTheme={toggleTheme} walletBalance={walletBalance} />

            <div className="dash-container">
                <Sidebar 
                    activeTab={activeTab} setActiveTab={setActiveTab} 
                    isMobileOpen={isSidebarOpen} closeMobileSidebar={() => setIsSidebarOpen(false)}
                    currentAvatar={currentAvatar} openAvatarModal={() => setIsAvatarModalOpen(true)}
                />

                <main className="dash-content">
                    {/* 1. نظرة عامة */}
                    {activeTab === 'overview' && (
                        <div className="tab-pane active">
                            <h2 className="section-title">🚀 أهلاً بك يا {user?.name || user?.phone || 'بطل'}!</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)' }}><FaBookOpen /></div>
                                    <div className="stat-info"><h4>الكورسات النشطة</h4><h2>{dashboardData.overview.activeCourses} كورسات</h2></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--success), #27ae60)' }}><FaCheckCircle /></div>
                                    <div className="stat-info"><h4>نسبة الإنجاز العام</h4><h2>{dashboardData.overview.completionRate}%</h2></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--warning), #d35400)' }}><FaClock /></div>
                                    <div className="stat-info"><h4>واجبات متأخرة</h4><h2>{dashboardData.overview.lateHomeworks} واجب</h2></div>
                                </div>
                            </div>

                            <div className="course-card" style={{ borderColor: 'var(--success)', background: 'rgba(46, 204, 113, 0.05)' }}>
                                <div className="course-info">
                                    <h3><FaUserMd style={{ color: 'var(--success)', marginLeft: '8px' }} /> جلسة الدعم النفسي القادمة</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.95rem' }}>مع {dashboardData.overview.nextSession.doctor} - {dashboardData.overview.nextSession.date}</p>
                                </div>
                                <button className="btn-resume" style={{ background: 'var(--success)', color: '#000' }}>تفاصيل الجلسة <FaVideo style={{ marginRight: '8px' }} /></button>
                            </div>

                            <div className="course-card" style={{ borderColor: 'var(--p-purple)' }}>
                                <div className="course-info">
                                    <h3><FaBolt style={{ color: 'var(--warning)', marginLeft: '8px' }} /> استكمل من حيث توقفت</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.9rem' }}>{dashboardData.overview.resume.title}</p>
                                </div>
                                <button className="btn-resume">استكمال الآن <FaPlay style={{ marginRight: '8px' }} /></button>
                            </div>
                        </div>
                    )}

                    {/* ... (باقي التابات كما هي بدون أي تغيير) ... */}
                    {activeTab === 'courses' && (<div className="tab-pane active"><h2 className="section-title"><FaPlayCircle /> الكورسات المشترك بها</h2>{dashboardData.courses.map(course => (<div className="course-card" key={course.id}><div className="course-info"><h3>{course.title}</h3><p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.85rem' }}><FaUserTie /> {course.teacher}</p></div><div className="progress-container"><div className="progress-text"><span>نسبة الإنجاز</span><span>{course.progress}%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }}></div></div></div><button className="btn-resume">دخول الكورس</button></div>))}</div>)}
                    {activeTab === 'exams' && (<div className="tab-pane active"><h2 className="section-title"><FaFileAlt /> سجل الدرجات</h2><div className="table-responsive scrollable-table"><table><thead><tr><th>النوع</th><th>الاختبار / الواجب</th><th>المادة</th><th>الدرجة</th><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>{dashboardData.exams.map(exam => (<tr key={exam.id}><td><span className={`badge ${exam.typeClass}`}>{exam.type}</span></td><td>{exam.title}</td><td>{exam.subject}</td><td style={{ color: `var(--${exam.statusClass})`, fontWeight: 900 }}>{exam.score}</td><td>{exam.date}</td><td><span className={`badge ${exam.statusClass}`}>{exam.status}</span></td></tr>))}</tbody></table></div></div>)}
                    {activeTab === 'financials' && (<div className="tab-pane active"><h2 className="section-title"><FaWallet /> المحفظة والأكواد</h2><div className="recharge-box"><input type="text" placeholder="أدخل كود الشحن المكون من 16 رقم" maxLength={19} /><button className="btn-recharge">شحن الرصيد</button></div><h3 style={{ marginBottom: '15px', fontWeight: 900, color: 'var(--txt)' }}>سجل الأكواد المشحونة</h3><div className="table-responsive scrollable-table"><table><thead><tr><th>رقم الكود</th><th>المدرس المصدر</th><th>القيمة</th><th>التاريخ</th></tr></thead><tbody>{dashboardData.financials.map(fin => (<tr key={fin.id}><td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{fin.code}</td><td>{fin.source}</td><td style={{ color: 'var(--success)' }}>{fin.amount}</td><td>{fin.date}</td></tr>))}</tbody></table></div></div>)}
                    {activeTab === 'orders' && (<div className="tab-pane active"><h2 className="section-title"><FaBoxOpen /> تتبع طلبات المتجر</h2><div className="table-responsive scrollable-table"><table><thead><tr><th>رقم التتبع (PIN)</th><th>المنتجات المطلوبة</th><th>تاريخ الطلب</th><th>الحالة</th></tr></thead><tbody>{dashboardData.orders.map((order, i) => (<tr key={i}><td style={{ fontWeight: 900, color: 'var(--p-purple)' }}>{order.pin}</td><td>{order.items}</td><td>{order.date}</td><td><span className={`badge ${order.statusClass}`}>{order.status}</span></td></tr>))}</tbody></table></div></div>)}
                    {activeTab === 'analytics' && (<div className="tab-pane active"><h2 className="section-title"><FaChartPie /> تحليل الأداء الأكاديمي</h2><div className="analytics-grid"><div className="analytics-card"><h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نسبة الحضور والتفاعل</h3><div className="circle-chart"><span>{dashboardData.analytics.attendance}%</span></div><p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', fontWeight: 'bold' }}>{dashboardData.analytics.msg}</p></div><div className="analytics-card"><h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نقاط القوة والضعف</h3>{dashboardData.analytics.skills.map((skill, i) => (<div style={{ textAlign: 'right', marginBottom: '15px' }} key={i}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}><span>{skill.name}</span><span style={{ color: skill.color }}>{skill.score}%</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${skill.score}%`, background: skill.color }}></div></div></div>))}</div></div></div>)}
                    {activeTab === 'activity' && (<div className="tab-pane active"><h2 className="section-title"><FaHistory /> السجل الشامل لحركة الطالب</h2><div className="table-responsive scrollable-table"><table><thead><tr><th>الوقت والتاريخ</th><th>العملية</th><th>التفاصيل</th><th>الجهاز (IP)</th></tr></thead><tbody>{dashboardData.activity.map(act => (<tr key={act.id}><td style={{ direction: 'ltr', textAlign: 'right' }}>{act.time}</td><td><span className={`badge ${act.class}`}>{act.action}</span></td><td>{act.details}</td><td>{act.device}</td></tr>))}</tbody></table></div></div>)}
                    {activeTab === 'settings' && (<div className="tab-pane active"><h2 className="section-title"><FaCog /> إعدادات الحساب والأمان</h2><div className="settings-card"><h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>البيانات الشخصية</h3><div className="form-grid"><div className="input-group"><label>الاسم الرباعي</label><input type="text" defaultValue={user?.name || ""} /></div><div className="input-group"><label>رقم الهاتف</label><input type="text" defaultValue={user?.phone || ""} readOnly /></div><div className="input-group"><label>البريد الإلكتروني</label><input type="email" placeholder="example@gmail.com" /></div></div><button className="btn-save"><FaSave /> حفظ البيانات</button></div><div className="settings-card" style={{ borderColor: 'var(--danger)' }}><h3 style={{ marginBottom: '20px', color: 'var(--danger)' }}><FaShieldAlt /> الأجهزة المتصلة بحسابك</h3><div className="table-responsive"><table><thead><tr><th>الجهاز</th><th>الموقع / IP</th><th>آخر نشاط</th><th>إجراء</th></tr></thead><tbody>{dashboardData.devices.map(dev => (<tr key={dev.id}><td>{dev.icon === 'mobile' ? <FaMobileAlt /> : <FaDesktop />} {dev.name}</td><td>{dev.location}</td><td style={{ color: dev.isCurrent ? 'var(--success)' : '' }}>{dev.activity}</td><td>{dev.isCurrent ? <span className="badge success">مسموح</span> : <button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>تسجيل خروج</button>}</td></tr>))}</tbody></table></div></div></div>)}
                </main>
            </div>

            {!isChatOpen && (
                <div className="fab-container">
                    <a href="https://wa.me/201000000000" target="_blank" className="fab-btn fab-wa"><FaWhatsapp /></a>
                    <button className="fab-btn fab-ai" onClick={() => setIsChatOpen(true)}><FaRobot /></button>
                </div>
            )}

            <div className={`ai-chat-window ${isChatOpen ? 'active' : ''}`} id="chat-win">
                <div className="ai-chat-header">
                    <span><FaRobot /> بيكسل AI</span>
                    <button onClick={() => setIsChatOpen(false)} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <FaTimes size={16} />
                    </button>
                </div>
                
                {/* 💡 جسم الشات الجديد بالرسائل والاسكرول التلقائي */}
                <div className="ai-chat-body" id="msgs">
                    {messages.map((msg, index) => (
                        <div key={index} className={`ai-msg ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    
                    {/* 💡 مؤشر الكتابة */}
                    {isTyping && (
                        <div className="ai-msg bot">
                            <div className="typing"><span></span><span></span><span></span></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="ai-chat-input">
                    <input 
                        type="text" 
                        placeholder="اكتب رسالتك..." 
                        style={{ zIndex: 10 }}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                    />
                    <button onClick={handleSendMessage} style={{background:'var(--p-purple)', border:'none', color:'white', borderRadius:'8px', padding:'0 15px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center'}}><FaPaperPlane /></button>
                </div>
            </div>

            <div className={`modal-overlay ${isAvatarModalOpen ? 'active' : ''}`} onClick={() => setIsAvatarModalOpen(false)}>
                {/* ... مودال الأفاتار كما هو ... */}
                <div className="modal-box" onClick={e => e.stopPropagation()}><button className="close-modal-btn" onClick={() => setIsAvatarModalOpen(false)}><FaTimes /></button><h2 style={{color:'var(--p-purple)', marginBottom:'10px'}}>اختر هويتك الافتراضية 🎭</h2><h4 style={{textAlign:'right', color:'var(--success)', marginTop:'20px'}}>قسم الأولاد 👨‍🎓</h4><div className="avatar-grid">{boysAvatars.map((url, i) => (<img key={`boy-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="boy avatar" />))}</div><h4 style={{textAlign:'right', color:'var(--danger)', marginTop:'20px'}}>قسم البنات 👩‍🎓</h4><div className="avatar-grid">{girlsAvatars.map((url, i) => (<img key={`girl-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="girl avatar" />))}</div><button className="btn-resume" style={{width:'100%', justifyContent:'center', marginTop:'20px', fontSize:'1.1rem'}} onClick={saveNewAvatar}>حفظ الصورة الجديدة</button></div>
            </div>
        </div>
    );
}