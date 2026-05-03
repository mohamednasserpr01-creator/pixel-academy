"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppNotification, PermissionStatus } from '../types/notification.types';

interface NotificationContextProps {
    notifications: AppNotification[];
    unreadCount: number;
    permissionStatus: PermissionStatus;
    requestPermission: () => Promise<void>;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void; // 👈 جديدة
    clearAll: () => void; // 👈 جديدة
    addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

const mockNotifications: AppNotification[] = [
    { id: '1', title: '🔥 محاضرة جديدة', body: 'تم رفع الدرس الأول في الكيمياء، ادخل شوفه دلوقتي.', createdAt: 'منذ 5 دقائق', isRead: false, type: 'info' },
    { id: '2', title: '🎉 عاش يا بطل!', body: 'أنت من أوائل امتحان الفيزياء الأسبوعي.', createdAt: 'منذ ساعتين', isRead: false, type: 'success' }
];

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');

    // 💡 1. استرجاع الإشعارات من الـ Local Storage أول ما الصفحة تفتح
    useEffect(() => {
        const savedNotifications = localStorage.getItem('pixel_notifications');
        const savedPermission = localStorage.getItem('pixel_notif_permission') as PermissionStatus;
        
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }
        if (savedPermission) {
            setPermissionStatus(savedPermission);
        } else if (typeof window !== 'undefined' && 'Notification' in window) {
            // تحديث الحالة بناءً على حالة المتصفح الحقيقية
            if (Notification.permission === 'granted') setPermissionStatus('granted');
            else if (Notification.permission === 'denied') setPermissionStatus('denied');
        }
    }, []);

    // 💡 2. حفظ الإشعارات في الـ Local Storage مع كل تغيير
    useEffect(() => {
        localStorage.setItem('pixel_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // 💡 3. طلب إذن الإشعارات الحقيقي من المتصفح
    const requestPermission = async () => {
        setPermissionStatus('loading');
        if (!('Notification' in window)) {
            alert('متصفحك لا يدعم الإشعارات');
            setPermissionStatus('denied');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            const status = permission === 'granted' ? 'granted' : 'denied';
            setPermissionStatus(status);
            localStorage.setItem('pixel_notif_permission', status);
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            setPermissionStatus('idle');
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    // 💡 4. دوال الحذف الجديدة
    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotif: AppNotification = {
            ...notif,
            id: Date.now().toString(),
            createdAt: 'الآن',
            isRead: false
        };
        setNotifications(prev => [newNotif, ...prev]);

        // 💡 إضافة: لو الطالب مفعل الإشعارات، نبعتله إشعار حقيقي على جهازه!
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notif.title, {
                body: notif.body,
                icon: '/logo.png' // مسار اللوجو بتاعك
            });
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications, unreadCount, permissionStatus, requestPermission, 
            markAsRead, markAllAsRead, deleteNotification, clearAll, addNotification 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
    return context;
};