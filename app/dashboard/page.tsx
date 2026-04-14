"use client";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic'; 
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { useTheme } from '../../context/ThemeContext'; // 💡 استخدام النظام الجديد
import { FaTimes } from 'react-icons/fa';
import './dashboard.css'; 

// 💡 1. تعريف التابات كـ Constants ثابتة
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

// 💡 2. استخراج النوع بدقة (TypeScript Strict Typing)
type TabValue = typeof TABS[keyof typeof TABS];

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

// 💡 3. استخدام Record مع التايب الجديد (Component Registry Pattern)
const TAB_COMPONENTS: Record<TabValue, React.ComponentType> = {
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
    const { theme, toggleTheme } = useTheme(); // 💡 الثيم أصبح عالمياً وبسيطاً
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

    const ActiveComponent = TAB_COMPONENTS[activeTab];

    return (
        <div className="dashboard-root">
            <Header 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                theme={theme} 
                toggleTheme={toggleTheme} 
                walletBalance={walletBalance} 
            />

            <div className="dash-container">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isMobileOpen={isSidebarOpen} 
                    closeMobileSidebar={() => setIsSidebarOpen(false)}
                    currentAvatar={currentAvatar} 
                    openAvatarModal={() => setIsAvatarModalOpen(true)}
                />

                <main className="dash-content">
                    <ActiveComponent />
                </main>
            </div>

            <ChatBox />

            <div className={`modal-overlay ${isAvatarModalOpen ? 'active' : ''}`} onClick={() => setIsAvatarModalOpen(false)}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <button className="close-modal-btn" onClick={() => setIsAvatarModalOpen(false)}><FaTimes /></button>
                    <h2 style={{color:'var(--p-purple)', marginBottom:'10px'}}>اختر هويتك الافتراضية 🎭</h2>
                    <h4 style={{textAlign:'right', color:'var(--success)', marginTop:'20px'}}>قسم الأولاد 👨‍🎓</h4>
                    <div className="avatar-grid">
                        {boysAvatars.map((url, i) => (<img key={`boy-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="boy avatar" />))}
                    </div>
                    <h4 style={{textAlign:'right', color:'var(--danger)', marginTop:'20px'}}>قسم البنات 👩‍🎓</h4>
                    <div className="avatar-grid">
                        {girlsAvatars.map((url, i) => (<img key={`girl-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="girl avatar" />))}
                    </div>
                    <button className="btn-resume" style={{width:'100%', justifyContent:'center', marginTop:'20px', fontSize:'1.1rem'}} onClick={saveNewAvatar}>حفظ الصورة الجديدة</button>
                </div>
            </div>
        </div>
    );
}