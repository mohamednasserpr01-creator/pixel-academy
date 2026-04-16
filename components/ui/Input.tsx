// FILE: components/ui/Input.tsx
import React, { forwardRef, InputHTMLAttributes } from 'react';
import './ui.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    status?: 'success' | 'warning' | 'error' | 'default';
    message?: string;
    icon?: React.ReactNode; 
    inputSize?: 'sm' | 'md' | 'lg'; // 💡 سميناها inputSize عشان متعارضش مع size الأصلية في الـ HTML
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
    label, 
    status = 'default', 
    message, 
    icon, 
    className = '', 
    id, 
    disabled,
    inputSize = 'md',
    ...props 
}, ref) => {
    
    // تحديد الكلاسات بناءً على الخصائص
    const statusClass = status !== 'default' ? `pixel-input-${status}` : '';
    const msgClass = status === 'error' || status === 'success' ? status : '';
    const sizeClass = inputSize !== 'md' ? `pixel-input-${inputSize}` : '';
    const iconClass = icon ? 'has-icon' : '';

    // 💡 تأمين ID عشوائي لربط الـ message بالـ input للـ Accessibility
    const inputId = id || `pixel-input-${Math.random().toString(36).substr(2, 9)}`;
    const msgId = `${inputId}-msg`;

    return (
        <div className={`pixel-input-wrapper ${className}`}>
            {label && <label htmlFor={inputId} className="pixel-input-label">{label}</label>}
            
            <div className="pixel-input-inner">
                <input 
                    ref={ref} /* 💡 تفعيل الـ forwardRef بامتياز */
                    id={inputId}
                    disabled={disabled}
                    className={`pixel-input ${statusClass} ${sizeClass} ${iconClass}`}
                    aria-invalid={status === 'error'} /* 💡 Accessibility */
                    aria-describedby={message ? msgId : undefined} /* 💡 Accessibility */
                    {...props}
                />
                {icon && (
                    <div className="pixel-input-icon">
                        {icon}
                    </div>
                )}
            </div>
            
            {message && <span id={msgId} className={`pixel-msg ${msgClass}`}>{message}</span>}
        </div>
    );
});

// إجبار React إنه يتعرف على اسم المكون عشان الـ DevTools
Input.displayName = 'Input';