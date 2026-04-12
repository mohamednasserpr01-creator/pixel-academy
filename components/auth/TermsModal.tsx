"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// التعديل الأول: استخدام مسار @ المباشر
import { termsData } from '../../data/terms';
interface Props {
    onAccept: () => void;
    onClose: () => void; 
    lang: 'ar' | 'en';
}

export default function TermsModal({ onAccept, onClose, lang }: Props) {
    const isAr = lang === 'ar';
    const content = termsData[lang];
    const [hasRead, setHasRead] = useState(false); 

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.8, opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    dir={isAr ? "rtl" : "ltr"}
                    className="modal-box"
                >
                    <h3 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>
                        {content.title}
                    </h3>
                    
                    <div style={{ lineHeight: 1.9, marginBottom: '20px', maxHeight: '40vh', overflowY: 'auto' }}>
                        {/* التعديل الثاني: تعريف rule كـ any لمنع تحذير التايب سكريبت */}
                        {content.rules.map((rule: any) => (
                            <p key={rule.id} style={{ fontWeight: 'bold', color: rule.isDanger ? 'var(--danger)' : 'inherit' }}>
                                {rule.id}. {rule.text}
                            </p>
                        ))}
                    </div>

                    <div style={{ margin: '15px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                            type="checkbox" 
                            id="explicit-consent" 
                            checked={hasRead} 
                            onChange={(e) => setHasRead(e.target.checked)} 
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="explicit-consent" style={{ cursor: 'pointer' }}>
                            {content.consentText}
                        </label>
                    </div>

                    <button 
                        className="btn-submit" 
                        onClick={onAccept}
                        disabled={!hasRead} 
                        style={{ opacity: hasRead ? 1 : 0.5, cursor: hasRead ? 'pointer' : 'not-allowed' }}
                    >
                        {content.btnText}
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}