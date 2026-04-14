"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');

    // 💡 عند التحميل: قراءة الثيم المحفوظ وتطبيقه فوراً
    useEffect(() => {
        const savedTheme = (localStorage.getItem('pixel_theme') as Theme) || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('light-mode', savedTheme === 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        // 💡 إجبار الـ DOM يتبع الـ State بالمللي (نصيحة التيم)
        document.documentElement.classList.toggle('light-mode', newTheme === 'light');
        localStorage.setItem('pixel_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};