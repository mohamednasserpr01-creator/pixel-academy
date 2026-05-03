"use client";
import React from 'react';
import { FaBell, FaCheckCircle, FaBoxOpen, FaCheckDouble, FaPlayCircle } from 'react-icons/fa';
import { Button } from '../../ui/Button';

export default function NotificationsTab({ lang }: { lang: string }) {
    const isAr = lang === 'ar';

    // 💡 بيانات وهمية للإشعارات
    const notifications = [
        { id: 1, type: 'success', icon: <FaCheckCircle />, title: 'تم تصحيح الواجب', desc: 'حصلت على 9/10 في واجب الكيمياء الأخير. استمر يا بطل!', time: 'الآن', unread: true },
        { id: 2, type: 'warning', icon: <FaBoxOpen />, title: 'تحديث حالة طلبك', desc: 'طلبك من متجر بيكسل الآن في حالة "جاري التوصيل".', time: 'منذ ساعتين', unread: true },
        { id: 3, type: 'info', icon: <FaPlayCircle />, title: 'حصة جديدة متاحة', desc: 'تم رفع الباب الثاني من الفيزياء، يمكنك البدء في المشاهدة الآن.', time: 'الأمس', unread: false },
    ];

    const getIconStyle = (type: string) => {
        if (type === 'success') return { color: 'var(--success)', bg: 'rgba(46,204,113,0.1)' };
        if (type === 'warning') return { color: 'var(--warning)', bg: 'rgba(241,196,15,0.1)' };
        return { color: 'var(--p-purple)', bg: 'rgba(108,92,231,0.1)' };
    };

    return (
        <div className="tab-pane active fade-in">
            {/* 💡 هيدر الإشعارات */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 className="section-title" style={{ margin: 0 }}><FaBell /> {isAr ? 'سجل الإشعارات' : 'Notifications'}</h2>
                <Button variant="outline" size="sm" icon={<FaCheckDouble />}>
                    {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                </Button>
            </div>

            {/* 💡 قائمة الإشعارات */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notifications.map(notif => {
                    const style = getIconStyle(notif.type);
                    return (
                        <div key={notif.id} style={{ display: 'flex', gap: '15px', padding: '20px', background: 'var(--card)', borderRadius: '15px', border: '1px solid', borderColor: notif.unread ? 'rgba(108,92,231,0.3)' : 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                            
                            {/* شريط جانبي صغير للإشعار غير المقروء */}
                            {notif.unread && <div style={{ position: 'absolute', right: isAr ? 0 : 'auto', left: isAr ? 'auto' : 0, top: 0, bottom: 0, width: '4px', background: 'var(--p-purple)' }}></div>}
                            
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: style.bg, color: style.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                {notif.icon}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--txt)' }}>{notif.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', fontWeight: 'bold' }}>{notif.time}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--txt-mut)', lineHeight: '1.6' }}>{notif.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}