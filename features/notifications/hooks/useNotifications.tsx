// FILE: features/notifications/hooks/useNotifications.tsx
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
    deleteNotification: (id: string) => void;
    clearAll: () => void;
    addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');

    // 💡 1. دالة لجلب الإشعارات من الـ Storage
    const fetchNotifications = useCallback(() => {
        const savedNotifications = localStorage.getItem('pixel_notifications');
        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }
    }, []);

    // 💡 2. استرجاع الداتا أول مرة
    useEffect(() => {
        fetchNotifications();
        const savedPermission = localStorage.getItem('pixel_notif_permission') as PermissionStatus;
        if (savedPermission) {
            setPermissionStatus(savedPermission);
        } else if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') setPermissionStatus('granted');
            else if (Notification.permission === 'denied') setPermissionStatus('denied');
        }
    }, [fetchNotifications]);

    // 💡 3. حفظ الداتا مع كل تغيير
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem('pixel_notifications', JSON.stringify(notifications));
        }
    }, [notifications]);

    // 🚀 4. السحر: الاستماع للـ Real-time Events (من نفس التاب أو من تاب تانية)
    useEffect(() => {
        // الاستماع للإيفنت اللي عملناه في الـ Broadcast API
        const handleCustomEvent = () => fetchNotifications();
        
        // الاستماع لتغييرات الـ localStorage (لو المدرس فاتح من تاب تانية)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'pixel_notifications') fetchNotifications();
        };

        window.addEventListener('pixel_new_notification', handleCustomEvent);
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('pixel_new_notification', handleCustomEvent);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

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
            setPermissionStatus('idle');
        }
    };

    const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
    const clearAll = () => { setNotifications([]); localStorage.removeItem('pixel_notifications'); };

    const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotif: AppNotification = { ...notif, id: Date.now().toString(), createdAt: 'الآن', isRead: false };
        setNotifications(prev => {
            const updated = [newNotif, ...prev];
            localStorage.setItem('pixel_notifications', JSON.stringify(updated));
            return updated;
        });

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notif.title, { body: notif.body, icon: '/logo.png' });
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