"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    FaBars, FaHome, FaEnvelope, FaBell, 
    FaWallet, FaMoon, FaSun, FaSignOutAlt, 
    FaCheckDouble, FaCheckCircle, FaBoxOpen, FaRobot 
} from 'react-icons/fa';

interface HeaderProps {
    toggleSidebar: () => void;
    theme: string;
    toggleTheme: () => void;
    walletBalance: number;
}

export default function Header({ toggleSidebar, theme, toggleTheme, walletBalance }: HeaderProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // إغلاق القوائم عند الضغط في أي مكان فارغ
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDrop = (dropName: string) => {
        setActiveDropdown(activeDropdown === dropName ? null : dropName);
    };

    return (
        <header className="dash-header">
            <div className="logo">
                <button className="mobile-toggle" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <img src="https://via.placeholder.com/150x40/6c5ce7/ffffff?text=Pixel+Academy" alt="Logo" />
            </div>

            <div className="toolbar" ref={dropdownRef}>
                <Link href="/" className="icon-btn" title="الرئيسية"><FaHome /></Link>
                
                {/* --- قائمة الرسائل --- */}
                <div className="icon-wrapper">
                    <button className="icon-btn" onClick={() => toggleDrop('msgs')}>
                        <FaEnvelope />
                        <span className="badge-dot" style={{ background: 'var(--warning)' }}></span>
                    </button>
                    <div className={`dropdown-menu ${activeDropdown === 'msgs' ? 'active' : ''}`}>
                        <div className="drop-header">
                            <span>الرسائل (2)</span>
                            <span style={{ color: 'var(--p-purple)', fontSize: '0.8rem', cursor: 'pointer' }}>فتح المنتدى</span>
                        </div>
                        <div className="drop-body">
                            <div className="drop-item unread">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" className="drop-avatar" alt="User" />
                                <div className="drop-content">
                                    <h4>Physics_Lover</h4>
                                    <p>يا صاحبي حليت مسألة كيرشوف الصعبة ولا لسه؟</p>
                                    <span className="drop-time">منذ 10 دقائق</span>
                                </div>
                            </div>
                            <div className="drop-item">
                                <div className="drop-icon"><FaRobot /></div>
                                <div className="drop-content">
                                    <h4>Pixel Bot</h4>
                                    <p>مرحباً بك في مجتمع بيكسل!</p>
                                    <span className="drop-time">منذ يومين</span>
                                </div>
                            </div>
                        </div>
                        <div className="drop-footer">عرض كل الرسائل</div>
                    </div>
                </div>

                {/* --- قائمة الإشعارات --- */}
                <div className="icon-wrapper">
                    <button className="icon-btn" onClick={() => toggleDrop('notif')}>
                        <FaBell />
                        <span className="badge-dot"></span>
                    </button>
                    <div className={`dropdown-menu ${activeDropdown === 'notif' ? 'active' : ''}`}>
                        <div className="drop-header">
                            <span>الإشعارات (3)</span>
                            <FaCheckDouble />
                        </div>
                        <div className="drop-body">
                            <div className="drop-item unread">
                                <div className="drop-icon" style={{ color: 'var(--success)', background: 'rgba(46,204,113,0.1)' }}><FaCheckCircle /></div>
                                <div className="drop-content">
                                    <h4>تم تصحيح الواجب</h4>
                                    <p>حصلت على 9/10 في واجب الكيمياء الأخير.</p>
                                    <span className="drop-time">الآن</span>
                                </div>
                            </div>
                            <div className="drop-item unread">
                                <div className="drop-icon" style={{ color: 'var(--warning)', background: 'rgba(241,196,15,0.1)' }}><FaBoxOpen /></div>
                                <div className="drop-content">
                                    <h4>تحديث حالة طلبك</h4>
                                    <p>طلبك من المتجر الآن "جاري التوصيل".</p>
                                    <span className="drop-time">منذ ساعتين</span>
                                </div>
                            </div>
                        </div>
                        <div className="drop-footer">عرض كل الإشعارات</div>
                    </div>
                </div>
                
                <div className="wallet-badge">
                    <FaWallet /> <span>{walletBalance.toLocaleString('en-US')}</span> ج.م
                </div>

                <button className="icon-btn" onClick={toggleTheme}>
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>

                <button className="btn-logout" title="تسجيل خروج"><FaSignOutAlt /></button>
            </div>
        </header>
    );
}