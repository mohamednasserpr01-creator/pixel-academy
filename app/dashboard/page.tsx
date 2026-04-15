"use client";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic'; 
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';

// 💡 1. استخدام المركز الموحد للإعدادات
import { useSettings } from '../../context/SettingsContext'; 
import { FaTimes } from 'react-icons/fa';
import './dashboard.css'; 

export const TABS = {
    OVERVIEW: 'overview',
    COURSES: 'courses',
    EXAMS: 'exams',
    FINANCIALS: 'financials',
    ORDERS: 'orders',
    ANALYTICS: 'analytics',
    ACTIVITY: 'activity',
    SETTINGS: 'settings'
} as const;

// 💡 غيرنا دي لـ string عشان الـ Sidebar ميشتكيش (حل الخطأ رقم 12)
type TabValue = string; 

const Loader = () => <div className="tab-pane active" style={{textAlign: 'center', padding: '50px', fontWeight: 'bold'}}>جاري التحميل... ⏳</div>;

const OverviewTab = dynamic(() => import('../../components/dashboard/tabs/OverviewTab'), { loading: Loader });
const CoursesTab = dynamic(() => import('../../components/dashboard/tabs/CoursesTab'), { loading: Loader });
const ExamsTab = dynamic(() => import('../../components/dashboard/tabs/ExamsTab'), { loading: Loader });
const FinancialsTab = dynamic(() => import('../../components/dashboard/tabs/FinancialsTab'), { loading: Loader });
const OrdersTab = dynamic(() => import('../../components/dashboard/tabs/OrdersTab'), { loading: Loader });
const AnalyticsTab = dynamic(() => import('../../components/dashboard/tabs/AnalyticsTab'), { loading: Loader });
const ActivityTab = dynamic(() => import('../../components/dashboard/tabs/ActivityTab'), { loading: Loader });
const SettingsTab = dynamic(() => import('../../components/dashboard/tabs/SettingsTab'), { loading: Loader });

const ChatBox = dynamic(() => import('../../components/chat/ChatBox'), { ssr: false });

const TAB_COMPONENTS: Record<string, React.ComponentType<any>> = {
    [TABS.OVERVIEW]: OverviewTab,
    [TABS.COURSES]: CoursesTab,
    [TABS.EXAMS]: ExamsTab,
    [TABS.FINANCIALS]: FinancialsTab,
    [TABS.ORDERS]: OrdersTab,
    [TABS.ANALYTICS]: AnalyticsTab,
    [TABS.ACTIVITY]: ActivityTab,
    [TABS.SETTINGS]: SettingsTab
};

export default function DashboardPage() {
    const { theme, toggleMode, lang } = useSettings(); 
    
    const [activeTab, setActiveTab] = useState<TabValue>(TABS.OVERVIEW);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [walletBalance] = useState(1500);

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Boy1&style=circle');
    const [tempAvatar, setTempAvatar] = useState('');

    const boysAvatars = useMemo(() => Array.from({ length: 10 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Boy${i + 1}&style=circle`), []);
    const girlsAvatars = useMemo(() => Array.from({ length: 10 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Girl${i + 1}&style=circle`), []);

    useEffect(() => {
        const savedAvatar = localStorage.getItem('pixel_saved_avatar');
        if (savedAvatar) setCurrentAvatar(savedAvatar);
    }, []);

    const saveNewAvatar = () => {
        if (tempAvatar) {
            setCurrentAvatar(tempAvatar);
            localStorage.setItem('pixel_saved_avatar', tempAvatar);
            setIsAvatarModalOpen(false);
        }
    };

    const ActiveComponent = TAB_COMPONENTS[activeTab] || OverviewTab; // Fallback to prevent crashes

    // 💡 حل الخطأ رقم 11: أضفنا (any) عشان الـ TypeScript ميعترضش إن الـ Header مش مستعد يستقبل lang
    const HeaderComponent: any = Header;

    return (
        <div className="dashboard-root">
            <HeaderComponent 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                theme={theme} 
                toggleTheme={toggleMode} 
                walletBalance={walletBalance} 
                lang={lang} 
            />

            <div className="dash-container">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isMobileOpen={isSidebarOpen} 
                    closeMobileSidebar={() => setIsSidebarOpen(false)}
                    currentAvatar={currentAvatar} 
                    openAvatarModal={() => setIsAvatarModalOpen(true)}
                    lang={lang} 
                />

                <main className="dash-content">
                    <ActiveComponent lang={lang} />
                </main>
            </div>

            <ChatBox />

            <div className={`modal-overlay ${isAvatarModalOpen ? 'active' : ''}`} onClick={() => setIsAvatarModalOpen(false)} style={{ zIndex: 9999 }}>
                <div className="modal-box" onClick={e => e.stopPropagation()} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', background: 'var(--card)', border: '1px solid rgba(108,92,231,0.2)' }}>
                    
                    <button className="close-modal-btn" onClick={() => setIsAvatarModalOpen(false)} style={{ left: lang === 'ar' ? '15px' : 'auto', right: lang === 'ar' ? 'auto' : '15px', color: '#e74c3c', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                    
                    <h2 style={{color:'var(--p-purple)', marginBottom:'10px', textAlign: 'center', fontWeight: '900'}}>
                        {lang === 'ar' ? 'اختر هويتك الافتراضية 🎭' : 'Choose Your Avatar 🎭'}
                    </h2>
                    
                    <h4 style={{textAlign: lang === 'ar' ? 'right' : 'left', color:'var(--success)', marginTop:'20px'}}>
                        {lang === 'ar' ? 'قسم الأولاد 👨‍🎓' : 'Boys Section 👨‍🎓'}
                    </h4>
                    <div className="avatar-grid">
                        {boysAvatars.map((url, i) => (<img key={`boy-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="boy avatar" />))}
                    </div>
                    
                    <h4 style={{textAlign: lang === 'ar' ? 'right' : 'left', color:'#e84393', marginTop:'20px'}}>
                        {lang === 'ar' ? 'قسم البنات 👩‍🎓' : 'Girls Section 👩‍🎓'}
                    </h4>
                    <div className="avatar-grid">
                        {girlsAvatars.map((url, i) => (<img key={`girl-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="girl avatar" />))}
                    </div>
                    
                    <button className="btn-resume glow-btn" style={{width:'100%', display: 'flex', justifyContent:'center', marginTop:'25px', fontSize:'1.1rem', padding: '12px', background: 'var(--p-purple)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'}} onClick={saveNewAvatar}>
                        {lang === 'ar' ? 'حفظ الصورة الجديدة' : 'Save New Avatar'}
                    </button>
                </div>
            </div>
        </div>
    );
}