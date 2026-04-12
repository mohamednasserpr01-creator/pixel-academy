"use client";
import React from 'react';
import { 
    FaHome, FaPlayCircle, FaFileAlt, FaMoneyCheckAlt, 
    FaBoxOpen, FaChartPie, FaHistory, FaCog, 
    FaTimes, FaTrophy, FaLock, FaPencilAlt 
} from 'react-icons/fa';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobileOpen: boolean;
    closeMobileSidebar: () => void;
    currentAvatar: string;
    openAvatarModal: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, closeMobileSidebar, currentAvatar, openAvatarModal }: SidebarProps) {
    const navItems = [
        { id: 'overview', icon: <FaHome />, label: 'نظرة عامة' },
        { id: 'courses', icon: <FaPlayCircle />, label: 'مسيرتي التعليمية' },
        { id: 'exams', icon: <FaFileAlt />, label: 'الامتحانات والواجبات' },
        { id: 'financials', icon: <FaMoneyCheckAlt />, label: 'المحفظة والأكواد' },
        { id: 'orders', icon: <FaBoxOpen />, label: 'طلبات المتجر' },
        { id: 'analytics', icon: <FaChartPie />, label: 'تحليل الأداء' },
        { id: 'activity', icon: <FaHistory />, label: 'سجل العمليات الكامل' },
        { id: 'settings', icon: <FaCog />, label: 'إعدادات الحساب والأمان' }
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={closeMobileSidebar}></div>

            <aside className={`dash-sidebar ${isMobileOpen ? 'active' : ''}`}>
                <button className="mobile-close-sidebar" onClick={closeMobileSidebar}><FaTimes /></button>
                
                <div className="student-id-card">
                    <div className="avatar-container">
                        <img src={currentAvatar} alt="Student" />
                        <button className="edit-avatar-btn" onClick={openAvatarModal} title="تغيير الأفاتار"><FaPencilAlt size={12} /></button>
                    </div>
                    <h3>أحمد محمود</h3>
                    <p>@Ahmed_Pixel_99</p>
                    
                    <div className="rank-box">
                        <div className="rank-val"><FaTrophy /> المركز: 15 على المنصة</div>
                        <div className="score-val">نقاط العبقرية: 8,450 نقطة</div>
                    </div>
                    
                    <div className="secret-code-box" title="مرر الماوس لرؤية الكود">
                        <span><FaLock /> كود ولي الأمر السري:</span>
                        <div className="secret-code">PX-7845-XY</div>
                    </div>
                </div>

                <nav className="dash-nav">
                    {navItems.map((item) => (
                        <button 
                            key={item.id} 
                            className={activeTab === item.id ? 'active' : ''} 
                            onClick={() => {
                                setActiveTab(item.id);
                                closeMobileSidebar(); 
                            }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}