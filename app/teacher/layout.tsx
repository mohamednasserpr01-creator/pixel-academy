// FILE: app/teacher/layout.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    FaChalkboardTeacher, FaBookOpen, FaPlayCircle, 
    FaClipboardList, FaQrcode, FaUsers, FaChartLine, 
    FaBars, FaTimes, FaWallet, FaFolderOpen, FaUserShield
} from 'react-icons/fa';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { title: 'الرئيسية (الداشبورد)', path: '/teacher/dashboard', icon: <FaChartLine /> },
        { title: 'الكورسات', path: '/teacher/courses', icon: <FaBookOpen /> },
        { title: 'الحصص ومحتواها', path: '/teacher/lessons', icon: <FaPlayCircle /> },
        { title: 'الواجبات', path: '/teacher/homework', icon: <FaBookOpen /> }, // 💡 تم إضافة الواجبات كقسم منفصل
        { title: 'الامتحانات', path: '/teacher/exams', icon: <FaClipboardList /> },
        { title: 'بنوك الأسئلة', path: '/teacher/question-banks', icon: <FaChalkboardTeacher /> },
        { title: 'أكواد الشحن', path: '/teacher/codes', icon: <FaQrcode /> },
        { title: 'طلاب الكورسات', path: '/teacher/students', icon: <FaUsers /> },
        { title: 'المكتبة الخاصة', path: '/teacher/library', icon: <FaFolderOpen /> },
        { title: 'المساعدين', path: '/teacher/assistants', icon: <FaUserShield /> },
        { title: 'الميزانية والأرباح', path: '/teacher/finance', icon: <FaWallet /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)' }}>
            
            {/* 💡 الـ Sidebar الجانبي */}
            <aside style={{ 
                width: isSidebarOpen ? '280px' : '0px', 
                background: 'var(--card)', 
                borderLeft: '1px solid rgba(255,255,255,0.05)', 
                transition: '0.3s ease',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000
            }}>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '75px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--p-purple)', fontWeight: 900, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                        <FaChalkboardTeacher size={24} /> منصة المدرس
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', display: 'block' }}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {menuItems.map((item, idx) => {
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link key={idx} href={item.path} style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', 
                                    borderRadius: '12px', transition: '0.2s', whiteSpace: 'nowrap',
                                    background: isActive ? 'linear-gradient(45deg, var(--p-purple), #ff007f)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--txt-mut)',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                    <span>{item.title}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* 💡 المحتوى الرئيسي (Main Content) */}
            <main style={{ 
                flex: 1, 
                transition: '0.3s ease', 
                marginRight: isSidebarOpen ? '280px' : '0px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                {/* Navbar العلوية (تم تحويلها لـ div لفك الاشتباك مع الستايل العام) */}
                <div style={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    padding: '15px 30px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    minHeight: '75px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'var(--p-purple)', border: 'none', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaBars />
                            </button>
                        )}
                        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--txt)' }}>لوحة تحكم المدرس</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'left', direction: 'ltr' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--txt)' }}>أ. محمد ناصر</div>
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>مدرس لغة عربية</div>
                        </div>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#34495e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white', border: '2px solid var(--p-purple)' }}>
                            MN
                        </div>
                    </div>
                </div>

                {/* هنا بيتم حقن الصفحات (Children) */}
                <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}