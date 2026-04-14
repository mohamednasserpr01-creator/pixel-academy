"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. تعريف شكل البيانات
interface SettingsContextType {
    theme: string;
    lang: string;
    toggleMode: () => void;
    toggleLang: () => void;
}

// 2. إنشاء الـ Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 3. إنشاء المزود (Provider) اللي هيغلف الموقع
export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string>('dark');
    const [lang, setLang] = useState<string>('ar');
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        
        setTheme(savedTheme);
        setLang(savedLang);

        if (savedTheme === 'light') document.body.classList.add('light-mode');
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLang;
    }, []);

    const toggleMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('pixel_theme', newTheme);
        document.body.classList.toggle('light-mode');
    };

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('pixel_lang', newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    // منع مشاكل الريندر قبل تحميل العميل (Hydration Fix)
    if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

    return (
        <SettingsContext.Provider value={{ theme, lang, toggleMode, toggleLang }}>
            {children}
        </SettingsContext.Provider>
    );
}

// 4. Hook مخصص لاستدعاء الإعدادات في أي مكان بسهولة
export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within a SettingsProvider");
    return context;
}