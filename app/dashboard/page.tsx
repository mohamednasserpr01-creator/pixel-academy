"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
// ضفنا كل الأيقونات اللي هنحتاجها لباقي التابات
import { 
    FaBookOpen, FaCheckCircle, FaClock, FaUserMd, FaVideo, FaBolt, FaPlay, 
    FaWhatsapp, FaRobot, FaTimes, FaPaperPlane, FaPlayCircle, FaUserTie, 
    FaFileAlt, FaWallet, FaBoxOpen, FaChartPie, FaHistory, FaCog, FaSave, 
    FaKey, FaShieldAlt, FaMobileAlt, FaDesktop 
} from 'react-icons/fa';
import './dashboard.css'; 

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [walletBalance, setWalletBalance] = useState(1500);

    const [isChatOpen, setIsChatOpen] = useState(false);
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
    }, []);

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
                    {/* 1. تاب: نظرة عامة */}
                    {activeTab === 'overview' && (
                        <div className="tab-pane active">
                            <h2 className="section-title">🚀 أهلاً بك يا بطل!</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)' }}><FaBookOpen /></div>
                                    <div className="stat-info"><h4>الكورسات النشطة</h4><h2>3 كورسات</h2></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--success), #27ae60)' }}><FaCheckCircle /></div>
                                    <div className="stat-info"><h4>نسبة الإنجاز العام</h4><h2>78%</h2></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(45deg, var(--warning), #d35400)' }}><FaClock /></div>
                                    <div className="stat-info"><h4>واجبات متأخرة</h4><h2>1 واجب</h2></div>
                                </div>
                            </div>

                            <div className="course-card" style={{ borderColor: 'var(--success)', background: 'rgba(46, 204, 113, 0.05)' }}>
                                <div className="course-info">
                                    <h3><FaUserMd style={{ color: 'var(--success)', marginLeft: '8px' }} /> جلسة الدعم النفسي القادمة</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.95rem' }}>مع د. أحمد سمير - الأربعاء 18 مارس، الساعة 08:00 مساءً</p>
                                </div>
                                <button className="btn-resume" style={{ background: 'var(--success)', color: '#000' }}>تفاصيل الجلسة <FaVideo style={{ marginRight: '8px' }} /></button>
                            </div>

                            <div className="course-card" style={{ borderColor: 'var(--p-purple)' }}>
                                <div className="course-info">
                                    <h3><FaBolt style={{ color: 'var(--warning)', marginLeft: '8px' }} /> استكمل من حيث توقفت</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.9rem' }}>الفيزياء (الباب الأول) - محاضرة 4</p>
                                </div>
                                <button className="btn-resume">استكمال الآن <FaPlay style={{ marginRight: '8px' }} /></button>
                            </div>
                        </div>
                    )}

                    {/* 2. تاب: مسيرتي التعليمية */}
                    {activeTab === 'courses' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaPlayCircle /> الكورسات المشترك بها</h2>
                            <div className="course-card">
                                <div className="course-info">
                                    <h3>الفيزياء - الباب الأول</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.85rem' }}><FaUserTie /> أ. محمد ناصر</p>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-text"><span>نسبة الإنجاز</span><span>80%</span></div>
                                    <div className="progress-bar"><div className="progress-fill" style={{ width: '80%' }}></div></div>
                                </div>
                                <button className="btn-resume">دخول الكورس</button>
                            </div>
                            <div className="course-card">
                                <div className="course-info">
                                    <h3>الكيمياء العضوية - التأسيس</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.85rem' }}><FaUserTie /> أ. محمود سعيد</p>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-text"><span>نسبة الإنجاز</span><span>45%</span></div>
                                    <div className="progress-bar"><div className="progress-fill" style={{ width: '45%', background: 'linear-gradient(90deg, var(--warning), #e67e22)' }}></div></div>
                                </div>
                                <button className="btn-resume">دخول الكورس</button>
                            </div>
                        </div>
                    )}

                    {/* 3. تاب: الامتحانات والواجبات */}
                    {activeTab === 'exams' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaFileAlt /> سجل الدرجات (الامتحانات والواجبات)</h2>
                            <div className="table-responsive scrollable-table">
                                <table>
                                    <thead>
                                        <tr><th>النوع</th><th>الاختبار / الواجب</th><th>المادة</th><th>الدرجة</th><th>التاريخ</th><th>الحالة</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span className="badge purple">امتحان حصة</span></td>
                                            <td>امتحان قانون أوم</td><td>الفيزياء</td>
                                            <td style={{ color: 'var(--success)', fontWeight: 900 }}>18 / 20</td><td>15 مارس</td>
                                            <td><span className="badge success">ممتاز</span></td>
                                        </tr>
                                        <tr>
                                            <td><span className="badge warning">واجب</span></td>
                                            <td>واجب المحاضرة الثالثة</td><td>الكيمياء</td>
                                            <td style={{ color: 'var(--warning)', fontWeight: 900 }}>6 / 10</td><td>12 مارس</td>
                                            <td><span className="badge warning">يحتاج مراجعة</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 4. تاب: المحفظة والأكواد */}
                    {activeTab === 'financials' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaWallet /> المحفظة والأكواد</h2>
                            <div className="recharge-box">
                                <input type="text" placeholder="أدخل كود الشحن المكون من 16 رقم" maxLength={19} />
                                <button className="btn-recharge">شحن الرصيد</button>
                            </div>
                            <h3 style={{ marginBottom: '15px', fontWeight: 900, color: 'var(--txt)' }}>سجل الأكواد المشحونة</h3>
                            <div className="table-responsive scrollable-table">
                                <table>
                                    <thead><tr><th>رقم الكود</th><th>المدرس المصدر</th><th>القيمة</th><th>التاريخ</th></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>8492-XXXX-XXXX-1934</td>
                                            <td>أ. محمد ناصر (الفيزياء)</td>
                                            <td style={{ color: 'var(--success)' }}>+ 500 ج.م</td>
                                            <td>10 مارس 2026</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 5. تاب: طلبات المتجر */}
                    {activeTab === 'orders' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaBoxOpen /> تتبع طلبات المتجر</h2>
                            <div className="table-responsive scrollable-table">
                                <table>
                                    <thead><tr><th>رقم التتبع (PIN)</th><th>المنتجات المطلوبة</th><th>تاريخ الطلب</th><th>الحالة</th></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 900, color: 'var(--p-purple)' }}>#PXL-9824-XV</td>
                                            <td>مذكرة العضوية + كتاب الفيزياء</td><td>16 مارس 2026</td>
                                            <td><span className="badge warning">جاري التوصيل</span></td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 900, color: 'var(--p-purple)' }}>#PXL-1120-MQ</td>
                                            <td>ملخص قوانين الفيزياء</td><td>01 مارس 2026</td>
                                            <td><span className="badge success">تم التسليم</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 6. تاب: تحليل الأداء */}
                    {activeTab === 'analytics' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaChartPie /> تحليل الأداء الأكاديمي</h2>
                            <div className="analytics-grid">
                                <div className="analytics-card">
                                    <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نسبة الحضور والتفاعل</h3>
                                    <div className="circle-chart"><span>92%</span></div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', fontWeight: 'bold' }}>أنت ملتزم جداً بمواعيد المحاضرات وحل الواجبات.</p>
                                </div>
                                <div className="analytics-card">
                                    <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نقاط القوة والضعف</h3>
                                    <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            <span>الفيزياء (نقطة قوة)</span><span style={{ color: 'var(--success)' }}>85%</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: '85%', background: 'var(--success)' }}></div></div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            <span>الكيمياء (يحتاج تحسين)</span><span style={{ color: 'var(--danger)' }}>55%</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: '55%', background: 'var(--danger)' }}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 7. تاب: سجل العمليات */}
                    {activeTab === 'activity' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaHistory /> السجل الشامل لحركة الطالب</h2>
                            <div className="table-responsive scrollable-table">
                                <table>
                                    <thead><tr><th>الوقت والتاريخ</th><th>العملية</th><th>التفاصيل</th><th>الجهاز (IP)</th></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ direction: 'ltr', textAlign: 'right' }}>17 Mar, 02:15 PM</td>
                                            <td><span className="badge success">دخول المنصة</span></td>
                                            <td>تسجيل الدخول بنجاح</td><td>iPhone 13</td>
                                        </tr>
                                        <tr>
                                            <td style={{ direction: 'ltr', textAlign: 'right' }}>16 Mar, 11:00 AM</td>
                                            <td><span className="badge warning">شراء متجر</span></td>
                                            <td>طلب مذكرات برقم تتبع #PXL-9824-XV</td><td>Windows PC</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 8. تاب: الإعدادات */}
                    {activeTab === 'settings' && (
                        <div className="tab-pane active">
                            <h2 className="section-title"><FaCog /> إعدادات الحساب والأمان</h2>
                            
                            <div className="settings-card">
                                <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>البيانات الشخصية</h3>
                                <div className="form-grid">
                                    <div className="input-group"><label>الاسم الرباعي</label><input type="text" defaultValue="أحمد محمود السيد" /></div>
                                    <div className="input-group"><label>رقم الهاتف (الواتساب)</label><input type="text" defaultValue="01012345678" /></div>
                                    <div className="input-group"><label>رقم هاتف ولي الأمر</label><input type="text" defaultValue="01098765432" /></div>
                                    <div className="input-group"><label>البريد الإلكتروني</label><input type="email" defaultValue="ahmed@example.com" /></div>
                                </div>
                                <button className="btn-save"><FaSave /> حفظ البيانات</button>
                            </div>

                            <div className="settings-card">
                                <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>تغيير كلمة المرور</h3>
                                <div className="form-grid">
                                    <div className="input-group"><label>كلمة المرور الحالية</label><input type="password" placeholder="***" /></div>
                                    <div className="input-group"><label>كلمة المرور الجديدة</label><input type="password" placeholder="***" /></div>
                                </div>
                                <button className="btn-save" style={{ background: 'var(--danger)' }}><FaKey /> تحديث كلمة المرور</button>
                            </div>

                            <div className="settings-card" style={{ borderColor: 'var(--danger)' }}>
                                <h3 style={{ marginBottom: '20px', color: 'var(--danger)' }}><FaShieldAlt /> الأجهزة المتصلة بحسابك</h3>
                                <div className="table-responsive">
                                    <table>
                                        <thead><tr><th>الجهاز</th><th>الموقع / IP</th><th>آخر نشاط</th><th>إجراء</th></tr></thead>
                                        <tbody>
                                            <tr>
                                                <td><FaMobileAlt /> iPhone 13 (الجهاز الحالي)</td>
                                                <td>الإسكندرية, مصر</td><td style={{ color: 'var(--success)' }}>نشط الآن</td>
                                                <td><span className="badge success">مسموح</span></td>
                                            </tr>
                                            <tr>
                                                <td><FaDesktop /> Windows PC - Chrome</td>
                                                <td>القاهرة, مصر</td><td>منذ يومين</td>
                                                <td><button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>تسجيل خروج</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* الأزرار الطافية والشات والأفاتار */}
            <div className="fab-container">
                <a href="https://wa.me/201000000000" target="_blank" className="fab-btn fab-wa"><FaWhatsapp /></a>
                <button className="fab-btn fab-ai" onClick={() => setIsChatOpen(!isChatOpen)}><FaRobot /></button>
            </div>

            <div className={`ai-chat-window ${isChatOpen ? 'active' : ''}`}>
                <div className="ai-chat-header">
                    <span><FaRobot /> بيكسل AI</span>
                    <button onClick={() => setIsChatOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><FaTimes /></button>
                </div>
                <div className="ai-chat-body">
                    <div className="ai-msg bot">أهلاً بك يا بطل! أنا بيكسل AI، مساعدك الشخصي. اقدر اساعدك في إيه؟</div>
                </div>
                <div className="ai-chat-input">
                    <input type="text" placeholder="اكتب سؤالك هنا..." />
                    <button style={{background:'var(--p-purple)', border:'none', color:'white', borderRadius:'8px', padding:'0 10px'}}><FaPaperPlane /></button>
                </div>
            </div>

            <div className={`modal-overlay ${isAvatarModalOpen ? 'active' : ''}`} onClick={() => setIsAvatarModalOpen(false)}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <button className="close-modal-btn" onClick={() => setIsAvatarModalOpen(false)}><FaTimes /></button>
                    <h2 style={{color:'var(--p-purple)', marginBottom:'10px'}}>اختر هويتك الافتراضية 🎭</h2>
                    
                    <h4 style={{textAlign:'right', color:'var(--success)', marginTop:'20px'}}>قسم الأولاد 👨‍🎓</h4>
                    <div className="avatar-grid">
                        {boysAvatars.map((url, i) => (
                            <img key={`boy-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} />
                        ))}
                    </div>

                    <h4 style={{textAlign:'right', color:'var(--danger)', marginTop:'20px'}}>قسم البنات 👩‍🎓</h4>
                    <div className="avatar-grid">
                        {girlsAvatars.map((url, i) => (
                            <img key={`girl-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} />
                        ))}
                    </div>

                    <button className="btn-resume" style={{width:'100%', justifyContent:'center', marginTop:'20px', fontSize:'1.1rem'}} onClick={saveNewAvatar}>حفظ الصورة الجديدة</button>
                </div>
            </div>
        </div>
    );
}