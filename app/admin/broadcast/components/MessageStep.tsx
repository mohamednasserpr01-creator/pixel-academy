// FILE: app/admin/broadcast/components/MessageStep.tsx
"use client";
import React from 'react';
import { FaMagic, FaWhatsapp, FaBell, FaCheck, FaLink, FaSpinner, FaClock, FaArrowRight } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';

// 💡 نستورد الـ Types من الصفحة الرئيسية (أو ملف منفصل للـ Types يفضل)
import { MsgType, TemplateType } from '../page'; 

interface MessageStepProps {
    msgType: MsgType; setMsgType: (val: MsgType) => void;
    templateType: TemplateType; setTemplateType: (val: TemplateType) => void;
    selectedTeacher: string; setSelectedTeacher: (val: string) => void;
    selectedCourse: string; setSelectedCourse: (val: string) => void;
    selectedLecture: string; setSelectedLecture: (val: string) => void;
    finalMessage: string; setFinalMessage: (val: string) => void;
    delaySeconds: number; setDelaySeconds: (val: number) => void;
    senderPhone: string; setSenderPhone: (val: string) => void;
    isWaChecking: boolean; isWaConnected: boolean;
    onCheckWhatsapp: () => void;
    onGenerateTemplate: () => void;
    onPrev: () => void;
    onNext: () => void;
    isStepValid: boolean;
    teachers: any[]; courses: any[]; lectures: any[];
}

export default function MessageStep({
    msgType, setMsgType, templateType, setTemplateType,
    selectedTeacher, setSelectedTeacher, selectedCourse, setSelectedCourse,
    selectedLecture, setSelectedLecture, finalMessage, setFinalMessage,
    delaySeconds, setDelaySeconds, senderPhone, setSenderPhone,
    isWaChecking, isWaConnected, onCheckWhatsapp, onGenerateTemplate,
    onPrev, onNext, isStepValid, teachers, courses, lectures
}: MessageStepProps) {

    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaMagic color="#9b59b6" /> المولد الذكي للرسائل</h2>

            {/* قناة الإرسال */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                    <label style={{ display: 'block', color: 'white', marginBottom: '15px', fontWeight: 'bold' }}>قناة الإرسال:</label>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => setMsgType('whatsapp')} style={{ flex: 1, padding: '15px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', border: `2px solid ${msgType === 'whatsapp' ? '#2ecc71' : 'rgba(255,255,255,0.1)'}`, background: msgType === 'whatsapp' ? 'rgba(46, 204, 113, 0.1)' : 'transparent', color: msgType === 'whatsapp' ? '#2ecc71' : 'var(--txt)' }}>
                            <FaWhatsapp size={24} /> رسالة واتساب
                        </button>
                        <button onClick={() => setMsgType('in_app')} style={{ flex: 1, padding: '15px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', border: `2px solid ${msgType === 'in_app' ? '#3498db' : 'rgba(255,255,255,0.1)'}`, background: msgType === 'in_app' ? 'rgba(52, 152, 219, 0.1)' : 'transparent', color: msgType === 'in_app' ? '#3498db' : 'var(--txt)' }}>
                            <FaBell size={24} /> إشعار منبثق للمنصة
                        </button>
                    </div>
                </div>

                {msgType === 'whatsapp' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(46, 204, 113, 0.05)', padding: '20px', borderRadius: '10px', border: '1px dashed rgba(46, 204, 113, 0.3)' }}>
                        <div>
                            <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>رقم هاتف الإرسال الخاص بك</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="tel" placeholder="مثال: 01012345678" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${isWaConnected ? '#2ecc71' : 'rgba(255,255,255,0.2)'}`, background: 'rgba(0,0,0,0.4)', color: 'white', outline: 'none', direction: 'ltr', textAlign: 'right' }} maxLength={11} />
                                <button onClick={onCheckWhatsapp} disabled={isWaChecking || isWaConnected || senderPhone.length < 11} style={{ background: isWaConnected ? 'rgba(46, 204, 113, 0.2)' : '#2ecc71', color: isWaConnected ? '#2ecc71' : 'white', border: isWaConnected ? '1px solid #2ecc71' : 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: (isWaChecking || isWaConnected) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}>
                                    {isWaChecking ? <FaSpinner className="spin" /> : (isWaConnected ? <FaCheck /> : <FaLink />)}
                                    {isWaChecking ? 'جاري التحقق...' : (isWaConnected ? 'تم الربط' : 'تحقق من الاتصال')}
                                </button>
                            </div>
                            {!isWaConnected && <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '5px' }}>* يجب التحقق من اتصال الرقم بخوادم واتساب قبل الاستمرار.</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', borderTop: '1px solid rgba(46, 204, 113, 0.2)', paddingTop: '15px' }}>
                            <FaClock style={{ color: '#2ecc71', fontSize: '1.5rem' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>الفاصل الزمني بين كل رسالة والأخرى</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>مهم جداً لتجنب حظر الرقم من شركة الواتساب. (نوصي بـ 5 لـ 10 ثواني).</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="number" min="1" max="60" value={delaySeconds} onChange={(e) => setDelaySeconds(Number(e.target.value))} style={{ width: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #2ecc71', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }} />
                                <span style={{ color: 'var(--txt-mut)' }}>ثانية</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* القالب والتوليد */}
            <div>
                <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}>سبب الإرسال (القالب)</label>
                <select value={templateType} onChange={e => { setTemplateType(e.target.value as TemplateType); setFinalMessage(''); }} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', marginBottom: '20px' }}>
                    <option value="custom" style={{ background: '#1e1e2d' }}>رسالة مخصصة (كتابة يدوية)</option>
                    <option value="new_course" style={{ background: '#1e1e2d' }}>نزول كورس جديد 🆕</option>
                    <option value="new_lecture" style={{ background: '#1e1e2d' }}>نزول محاضرة جديدة</option>
                    <option value="new_exam" style={{ background: '#1e1e2d' }}>نزول امتحان جديد</option>
                    <option value="update" style={{ background: '#1e1e2d' }}>تحديث محتوى سابق</option>
                </select>
            </div>

            {templateType !== 'custom' && (
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '20px', background: 'rgba(155, 89, 182, 0.05)', borderRadius: '15px', border: '1px solid rgba(155, 89, 182, 0.2)', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '0.85rem' }}>اختر المدرس</label>
                        <select value={selectedTeacher} onChange={e => { setSelectedTeacher(e.target.value); setSelectedCourse(''); setSelectedLecture(''); }} style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="">-- اختر --</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '0.85rem' }}>اختر الكورس</label>
                        <select value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setSelectedLecture(''); }} disabled={!selectedTeacher} style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="">-- اختر --</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {templateType !== 'new_course' && (
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '0.85rem' }}>اختر المحاضرة</label>
                            <select value={selectedLecture} onChange={e => setSelectedLecture(e.target.value)} disabled={!selectedCourse} style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="">-- اختر --</option>
                                {lectures.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-end', flex: '1 1 100%' }}>
                        <Button variant="primary" onClick={onGenerateTemplate} disabled={templateType === 'new_course' ? !selectedCourse : !selectedLecture} style={{ background: '#9b59b6', border: 'none', padding: '10px 20px', width: '100%' }}>توليد النص 🪄</Button>
                    </div>
                </div>
            )}

            {/* محرر الرسالة والمعاينة */}
            <div>
                <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}>الرسالة النهائية (ومعاينة الحقول الديناميكية)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--txt-mut)', display: 'flex', alignItems: 'center', marginLeft: '10px' }}>المتغيرات الذكية:</span>
                    {['[اسم_الطالب]', '[المرحلة_الدراسية]', '[الشعبة]'].map(v => (
                        <button key={v} onClick={() => setFinalMessage(finalMessage + ` ${v} `)} style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>{v}</button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <textarea 
                        value={finalMessage} 
                        onChange={e => setFinalMessage(e.target.value)} 
                        placeholder="اكتب رسالتك هنا..." 
                        style={{ flex: 1, minWidth: '300px', height: '200px', padding: '20px', background: 'rgba(0,0,0,0.3)', border: `2px solid ${msgType === 'whatsapp' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(52, 152, 219, 0.3)'}`, color: 'white', borderRadius: '12px', outline: 'none', resize: 'vertical', fontSize: '1.1rem', lineHeight: '1.8', fontFamily: 'inherit' }} 
                    />
                    
                    {/* Preview Box */}
                    <div style={{ flex: '0 0 350px', background: msgType === 'whatsapp' ? '#efeae2' : '#0f172a', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '15px', background: msgType === 'whatsapp' ? '#075e54' : '#1e293b', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                            {msgType === 'whatsapp' ? <FaWhatsapp size={20} /> : <FaBell size={20} />}
                            {msgType === 'whatsapp' ? 'معاينة في الواتساب' : 'معاينة في التطبيق'}
                        </div>
                        <div style={{ padding: '20px', flex: 1, background: msgType === 'whatsapp' ? 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' : 'transparent', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {finalMessage ? (
                                msgType === 'whatsapp' ? (
                                    <div style={{ background: '#dcf8c6', padding: '10px 15px', borderRadius: '10px 0 10px 10px', color: '#303030', alignSelf: 'flex-start', maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        {finalMessage}
                                        <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#999', marginTop: '5px' }}>10:45 AM</div>
                                    </div>
                                ) : (
                                    <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'white', display: 'flex', gap: '15px', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FaBell color="#3498db" /></div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '1rem' }}>إشعار جديد</div>
                                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{finalMessage}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>الآن</div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div style={{ textAlign: 'center', color: msgType === 'whatsapp' ? '#888' : 'var(--txt-mut)', marginTop: '50px', background: msgType === 'whatsapp' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '20px', fontSize: '0.85rem' }}>اكتب الرسالة لتظهر المعاينة هنا</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <Button variant="outline" onClick={onPrev}>السابق</Button>
                <Button variant="primary" onClick={onNext} disabled={!isStepValid} style={{ background: '#e67e22', border: 'none', padding: '12px 30px', opacity: !isStepValid ? 0.5 : 1 }}>
                    التالي: غرفة الإرسال <FaArrowRight style={{ transform: 'rotate(180deg)', marginLeft: '10px' }} />
                </Button>
            </div>
        </div>
    );
}