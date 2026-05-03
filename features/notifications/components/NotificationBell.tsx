"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckDouble, FaRegBell } from 'react-icons/fa';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    // 💡 وظيفة لقفل القائمة لو الطالب داس في أي مكان بره
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* أيقونة الجرس */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--txt)', 
                    width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', 
                    fontSize: '1.2rem', position: 'relative', transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(108,92,231,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
                {unreadCount > 0 ? <FaBell color="var(--warning)" /> : <FaRegBell />}
                
                {/* 🔴 نقطة الإشعارات الحمراء */}
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '0', right: '0', background: '#e74c3c', 
                        color: 'white', fontSize: '10px', fontWeight: 'bold', 
                        width: '20px', height: '20px', borderRadius: '50%', 
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        border: '2px solid var(--bg)'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* القائمة المنسدلة للإشعارات */}
            {isOpen && (
                <div style={{
                    position: 'absolute', top: '120%', left: '-10px', width: '320px', 
                    background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                    zIndex: 1000, overflow: 'hidden', direction: 'rtl'
                }}>
                    {/* هيدر القائمة */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <strong style={{ color: 'white', fontSize: '1rem' }}>الإشعارات ({unreadCount})</strong>
                        <button 
                            onClick={markAllAsRead} 
                            style={{ background: 'none', border: 'none', color: 'var(--p-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}
                        >
                            <FaCheckDouble /> تحديد كـ مقروء
                        </button>
                    </div>
                    
                    {/* جسم القائمة */}
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                لا توجد إشعارات حالياً 📭
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => markAsRead(notif.id)}
                                    style={{ 
                                        padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.02)', 
                                        background: notif.isRead ? 'transparent' : 'rgba(108,92,231,0.05)',
                                        cursor: 'pointer', display: 'flex', gap: '15px', transition: '0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(108,92,231,0.05)'}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: notif.isRead ? 'var(--txt)' : 'white' }}>{notif.title}</h4>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--txt-mut)', lineHeight: '1.4' }}>{notif.body}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--p-purple)' }}>{notif.createdAt}</span>
                                    </div>
                                    {/* 🔵 نقطة زرقاء للإشعار غير المقروء */}
                                    {!notif.isRead && <div style={{ width: '10px', height: '10px', background: 'var(--p-purple)', borderRadius: '50%', marginTop: '5px', flexShrink: 0 }}></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};