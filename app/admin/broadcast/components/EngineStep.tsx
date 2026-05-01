// FILE: app/admin/broadcast/components/EngineStep.tsx
"use client";
import React from 'react';
import { FaPaperPlane, FaPlay, FaPause, FaCheckCircle, FaExclamationTriangle, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { MsgType, SendLog } from '../page';

interface EngineStepProps {
    isSending: boolean;
    setIsSending: (val: boolean) => void;
    progress: number;
    targetCount: number;
    msgType: MsgType;
    delaySeconds: number;
    sentLogs: SendLog[];
    onReset: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function EngineStep({
    isSending, setIsSending, progress, targetCount,
    msgType, delaySeconds, sentLogs, onReset, onPrev, onNext
}: EngineStepProps) {
    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaPaperPlane color="#2ecc71" /> غرفة الإرسال والمراقبة
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.02)', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '1.1rem' }}>حالة الإرسال الجماعي</div>
                    <div style={{ color: isSending ? '#f1c40f' : (progress >= targetCount ? '#2ecc71' : 'white'), fontWeight: '900', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isSending ? <FaPlay /> : (progress >= targetCount ? <FaCheckCircle /> : <FaPause />)}
                        {isSending ? 'جاري ضخ الرسائل...' : (progress >= targetCount ? 'اكتمل الإرسال بنجاح' : 'متوقف ومستعد للإرسال')}
                    </div>
                    {msgType === 'whatsapp' && (
                        <div style={{ fontSize: '0.85rem', color: '#2ecc71', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaWhatsapp /> سرعة الإرسال המبرمجة: رسالة كل {delaySeconds} ثانية.
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '1.1rem' }}>إجمالي المستهدف</div>
                    <div style={{ color: '#3498db', fontWeight: '900', fontSize: '2rem' }}>{targetCount.toLocaleString()}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <span>تقدم الإرسال:</span>
                    <span style={{ color: '#2ecc71' }}>{progress.toLocaleString()} / {targetCount.toLocaleString()} ( {targetCount > 0 ? Math.round((progress / targetCount) * 100) : 0}% )</span>
                </div>
                <div style={{ width: '100%', height: '25px', background: 'rgba(0,0,0,0.4)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                    <div style={{ width: `${targetCount > 0 ? (progress / targetCount) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--p-purple), #2ecc71)', transition: 'width 0.5s ease', position: 'relative', overflow: 'hidden' }}>
                        {isSending && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'skeleton-loading 1.5s infinite linear' }}></div>}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                {!isSending && progress < targetCount && (
                    <button onClick={() => setIsSending(true)} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(46, 204, 113, 0.4)' }}>
                        <FaPlay /> {progress === 0 ? 'بدء الإرسال فوراً' : 'استكمال الإرسال'}
                    </button>
                )}
                {isSending && (
                    <button onClick={() => setIsSending(false)} style={{ background: '#f1c40f', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(241, 196, 15, 0.4)' }}>
                        <FaPause /> إيقاف الإرسال مؤقتاً
                    </button>
                )}
                {progress < targetCount && (
                    <button onClick={onReset} style={{ background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaTimes /> إلغاء وتصفير
                    </button>
                )}
            </div>

            {/* Live Logs */}
            <div style={{ background: '#111', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', height: '250px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.9rem' }}>سجل العمليات المباشر (Live Logs)</h4>
                    <span style={{ fontSize: '0.8rem', color: '#3498db' }}>يتم تحديثه باستمرار...</span>
                </div>

                {sentLogs.length === 0 ? (
                    <div style={{ color: 'var(--txt-mut)', textAlign: 'center', opacity: 0.5, marginTop: '60px' }}>في انتظار بدء الإرسال...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sentLogs.map(log => (
                            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 15px', borderRadius: '8px', borderLeft: `3px solid ${log.status === 'success' ? '#2ecc71' : '#e74c3c'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                                    {log.status === 'success' ? <FaCheckCircle color="#2ecc71" /> : <FaExclamationTriangle color="#e74c3c" />}
                                    <span>إرسال إلى <strong>{log.studentName}</strong> <span style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', fontFamily: 'monospace' }}>({log.phone})</span></span>
                                </div>
                                <div style={{ color: log.status === 'success' ? '#2ecc71' : '#e74c3c', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    {log.status === 'success' ? 'نجاح' : `فشل: ${log.reason}`}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <Button variant="outline" onClick={() => { setIsSending(false); onPrev(); }}>السابق: تعديل الرسالة</Button>
                {progress >= targetCount && (
                    <Button variant="primary" onClick={onNext} style={{ background: 'var(--p-purple)', border: 'none' }}>الذهاب للتقرير النهائي 📊</Button>
                )}
            </div>
            <style jsx>{`@keyframes skeleton-loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
        </div>
    );
}