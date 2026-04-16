// FILE: app/dashboard/page.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic'; 

import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';

import { useSettings } from '../../context/SettingsContext'; 
import { useToast } from '../../context/ToastContext'; 

// 💡 استدعاء الـ UI System الخارق بتاعنا
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

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

type TabValue = string; 

// 💡 وداعاً لكلمة "جاري التحميل"، أهلاً بالـ Skeleton الاحترافي!
const Loader = () => (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Skeleton variant="text" width="30%" height="30px" />
        <Skeleton variant="rectangular" width="100%" height="200px" />
        <Skeleton variant="rectangular" width="100%" height="150px" />
    </div>
);

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
    const { showToast } = useToast(); 
    
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
            showToast(lang === 'ar' ? 'تم تحديث صورتك الشخصية بنجاح! 🎭' : 'Avatar updated successfully! 🎭', 'success');
        } else {
            // 💡 تم حل المشكلة وضبط التنسيق هنا
            showToast(lang === 'ar' ? 'يرجى اختيار صورة أولاً' : 'Please select an avatar first', 'error');
        }
    };

    const ActiveComponent = TAB_COMPONENTS[activeTab] || OverviewTab; 

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

            <Modal 
                isOpen={isAvatarModalOpen} 
                onClose={() => setIsAvatarModalOpen(false)}
                title={lang === 'ar' ? 'اختر هويتك الافتراضية 🎭' : 'Choose Your Avatar 🎭'}
                maxWidth="650px"
            >
                <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '15px' }}>
                        {lang === 'ar' ? 'قسم الأولاد 👨‍🎓' : 'Boys Section 👨‍🎓'}
                    </h4>
                    <div className="avatar-grid">
                        {boysAvatars.map((url, i) => (
                            <img key={`boy-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="boy avatar" />
                        ))}
                    </div>
                    
                    <h4 style={{ color: '#e84393', marginTop: '25px', marginBottom: '15px' }}>
                        {lang === 'ar' ? 'قسم البنات 👩‍🎓' : 'Girls Section 👩‍🎓'}
                    </h4>
                    <div className="avatar-grid">
                        {girlsAvatars.map((url, i) => (
                            <img key={`girl-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="girl avatar" />
                        ))}
                    </div>
                    
                    <div style={{ marginTop: '30px' }}>
                        <Button fullWidth size="lg" onClick={saveNewAvatar}>
                            {lang === 'ar' ? 'حفظ الصورة الجديدة' : 'Save New Avatar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}