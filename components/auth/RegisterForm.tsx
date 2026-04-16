// FILE: components/auth/RegisterForm.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEye, FaEyeSlash, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaSchool, FaLock } from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // 💡 استدعاء الإشعارات
import { Input } from '../ui/Input'; // 💡 استدعاء مكون الإدخال الذكي
import { Button } from '../ui/Button'; // 💡 استدعاء مكون الزر الذكي

interface Props {
    onSwitchView: () => void;
    onSuccess: () => void;
    onShowTerms: () => void;
    termsAccepted: boolean;
    lang: string; 
}

export default function RegisterForm({ onSwitchView, onSuccess, onShowTerms, termsAccepted, lang }: Props) {
    const isAr = lang === 'ar';
    const { login } = useAuth();
    const { showToast } = useToast();
    
    const [regData, setRegData] = useState({ name: '', phone: '', parent: '', gov: '', address: '', school: '', pass: '' });
    const [regErrors, setRegErrors] = useState({ name: '', phone: '', parent: '', school: '', pass: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 💡 حالة التحميل للزرار

    // 💡 دوال التحقق نظيفة ومنفصلة
    const validateReg = (field: string, value: string) => {
        let errors = { ...regErrors };
        let isValid = true;

        if (field === 'name') {
            isValid = /^[\u0600-\u06FF\s]+$/.test(value) && value.trim().length >= 15;
            errors.name = !isValid && value ? (isAr ? 'الاسم بالعربي ولا يقل عن 15 حرفاً' : 'Arabic name, min 15 chars') : '';
        }
        if (field === 'phone') {
            isValid = /^01[0125][0-9]{8}$/.test(value);
            errors.phone = !isValid && value ? (isAr ? 'رقم غير صحيح' : 'Invalid number') : '';
        }
        if (field === 'parent') {
            isValid = /^01[0125][0-9]{8}$/.test(value);
            errors.parent = (!isValid && value) ? (isAr ? 'رقم غير صحيح' : 'Invalid number') 
                        : (isValid && value === regData.phone) ? (isAr ? 'لا يمكن أن يكون نفس رقم الطالب' : 'Cannot match student phone') : '';
        }
        if (field === 'pass') {
            isValid = value.length >= 6;
            errors.pass = !isValid && value ? (isAr ? '6 أحرف/أرقام على الأقل' : 'Min 6 chars') : '';
        }
        setRegErrors(errors);
    };

    const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegData(prev => ({ ...prev, [name]: value }));
        validateReg(name, value);
    };

    const isRegValid = () => {
        return (
            regData.name.length >= 15 && !regErrors.name &&
            regData.phone.length === 11 && !regErrors.phone &&
            regData.parent.length === 11 && !regErrors.parent &&
            regData.pass.length >= 6 && !regErrors.pass &&
            regData.gov !== '' && regData.address !== '' && termsAccepted
        );
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            // محاكاة تأخير الشبكة عشان الـ Loader يشتغل بشكل احترافي
            await new Promise(resolve => setTimeout(resolve, 800));
            
            login(regData.phone, regData.pass);
            showToast(isAr ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!', 'success');
            onSuccess();
        } catch (error) {
            showToast(isAr ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error creating account', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 ترتيب العناصر باستخدام Flexbox نظيف جداً
    const rowStyle = { display: 'flex', gap: '15px', flexWrap: 'wrap' as const };
    const colStyle = { flex: '1 1 calc(50% - 10px)' };

    return (
        <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} dir={isAr ? 'rtl' : 'ltr'}>
            <h2 style={{ marginBottom: '25px', fontWeight: 900, color: 'var(--txt)', textAlign: 'center' }}>
                {isAr ? 'طالب جديد' : 'New Student'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* الاسم */}
                <Input 
                    type="text" name="name" 
                    placeholder={isAr ? 'الاسم الرباعي (بالعربي)' : 'Full Name (Arabic)'} 
                    value={regData.name} onChange={handleRegChange} 
                    status={regErrors.name ? 'error' : 'default'} message={regErrors.name}
                    icon={<FaUser />} inputSize="lg"
                />

                {/* أرقام الهواتف (صف واحد) */}
                <div style={rowStyle}>
                    <div style={colStyle}>
                        <Input 
                            type="tel" name="phone" 
                            placeholder={isAr ? 'رقم الطالب' : 'Student Phone'} 
                            value={regData.phone} onChange={handleRegChange} 
                            status={regErrors.phone ? 'error' : 'default'} message={regErrors.phone}
                            icon={<FaPhoneAlt />} inputSize="lg"
                        />
                    </div>
                    <div style={colStyle}>
                        <Input 
                            type="tel" name="parent" 
                            placeholder={isAr ? 'رقم ولي الأمر' : 'Parent Phone'} 
                            value={regData.parent} onChange={handleRegChange} 
                            status={regErrors.parent ? 'error' : 'default'} message={regErrors.parent}
                            icon={<FaPhoneAlt />} inputSize="lg"
                        />
                    </div>
                </div>

                {/* المحافظة والمدرسة (صف واحد) */}
                <div style={rowStyle}>
                    <div style={colStyle} className="pixel-input-wrapper">
                        {/* 💡 استخدام الـ CSS المخصص للـ Select عشان يبقى متطابق مع الـ Input */}
                        <select name="gov" value={regData.gov} onChange={handleRegChange} className="pixel-input pixel-input-lg" style={{ cursor: 'pointer', color: regData.gov ? 'var(--txt)' : 'var(--txt-mut)' }}>
                            <option value="" disabled>{isAr ? 'اختر المحافظة' : 'Select Governorate'}</option>
                            <option value="Cairo">{isAr ? 'القاهرة' : 'Cairo'}</option>
                            <option value="Giza">{isAr ? 'الجيزة' : 'Giza'}</option>
                            <option value="Alex">{isAr ? 'الإسكندرية' : 'Alexandria'}</option>
                        </select>
                    </div>
                    <div style={colStyle}>
                        <Input 
                            type="text" name="school" 
                            placeholder={isAr ? 'المدرسة' : 'School'} 
                            value={regData.school} onChange={handleRegChange} 
                            icon={<FaSchool />} inputSize="lg"
                        />
                    </div>
                </div>

                {/* العنوان */}
                <Input 
                    type="text" name="address" 
                    placeholder={isAr ? 'العنوان بالتفصيل' : 'Detailed Address'} 
                    value={regData.address} onChange={handleRegChange} 
                    icon={<FaMapMarkerAlt />} inputSize="lg"
                />

                {/* الرقم السري */}
                <Input 
                    type={showPassword ? "text" : "password"} name="pass" 
                    placeholder={isAr ? 'الرقم السري (6 أرقام/حروف على الأقل)' : 'Password (Min 6 chars)'} 
                    value={regData.pass} 
                    onChange={e => { e.target.value = e.target.value.replace(/\s/g, ''); handleRegChange(e); }} 
                    status={regErrors.pass ? 'error' : 'default'} message={regErrors.pass}
                    inputSize="lg"
                    icon={
                        <div onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', display: 'flex', color: 'var(--p-purple)' }}>
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </div>
                    }
                />
            </div>
            
            {/* الشروط والأحكام */}
            <div style={{ margin: '20px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--txt)' }}>
                <input type="checkbox" readOnly checked={termsAccepted} onClick={onShowTerms} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--p-purple)' }} /> 
                <span>
                    {isAr ? 'أوافق على ' : 'I agree to '} 
                    <span onClick={onShowTerms} style={{ color: 'var(--p-purple)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </span>
                </span>
            </div>
            
            {/* الزرار الذكي */}
            <Button 
                fullWidth size="lg" 
                onClick={handleRegister} 
                disabled={!isRegValid()} 
                isLoading={isLoading}
                icon={!isLoading && <FaUserPlus />}
            >
                {isAr ? 'إنشاء حساب' : 'Create Account'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                {isAr ? 'لديك حساب؟ ' : 'Have an account? '} 
                <span onClick={onSwitchView} style={{ color: 'var(--p-purple)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>
                    {isAr ? 'دخول' : 'Login'}
                </span>
            </div>
        </motion.div>
    );
}