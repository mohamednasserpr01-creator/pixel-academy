"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { CampaignState } from '../NotificationsTab';

export interface Log {
    id: string;
    name: string;
    phone: string;
    status: 'success' | 'fail';
    reason?: string;
}

interface Props {
    data: CampaignState;
    logs: Log[];
    setLogs: React.Dispatch<React.SetStateAction<Log[]>>;
    onFinish: () => void;
    onPrev: () => void;
}

export default function EngineStep({ data, logs, setLogs, onFinish, onPrev }: Props) {
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(logs.length); 

    // 🚀 استخدام useRef عشان نمسك العداد جوه الـ Interval بأمان من غير ما نكسر الـ React Render
    const progressRef = useRef(progress);
    useEffect(() => { progressRef.current = progress; }, [progress]);

    useEffect(() => {
        if (logs.length === 0) setProgress(0);
    }, [logs.length]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSending) {
            const speedMs = data.channel === 'whatsapp' ? data.delaySeconds * 1000 : 200;

            interval = setInterval(() => {
                // 1. لو خلصنا، نوقف العداد وننقل للخطوة الأخيرة بأمان
                if (progressRef.current >= data.targetCount) {
                    setIsSending(false);
                    clearInterval(interval);
                    setTimeout(() => onFinish(), 500);
                    return;
                }

                // 2. تحديث السجل والتقدم جنباً إلى جنب (عشان نمنع خطأ الـ State جوه State)
                setProgress(p => p + 1);
                
                setLogs(oldLogs => {
                    let isSuccess = true;
                    let reason = '';

                    if (data.channel === 'whatsapp') {
                        isSuccess = Math.random() > 0.15; 
                        reason = 'الرقم غير مسجل بالواتساب أو مغلق.';
                    } else {
                        isSuccess = Math.random() > 0.02; 
                        reason = 'حساب الطالب محظور من النظام.';
                    }

                    const newLog: Log = { 
                        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
                        name: `طالب مستهدف ${progressRef.current + 1}`,
                        phone: `01${Math.floor(Math.random() * 900000000)}`, 
                        status: isSuccess ? 'success' : 'fail', 
                        reason: isSuccess ? undefined : reason 
                    };
                    return [newLog, ...oldLogs];
                });

            }, speedMs);
        }

        return () => clearInterval(interval);
    }, [isSending, data.targetCount, data.channel, data.delaySeconds, setLogs, onFinish]);

    const percentage = data.targetCount > 0 ? Math.round((progress / data.targetCount) * 100) : 0;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--txt)' }}>العدد المستهدف: <span style={{ color: '#3498db' }}>{data.targetCount}</span></h3>
                    <p style={{ margin: 0, color: 'var(--txt-mut)' }}>{data.channel === 'whatsapp' ? `السرعة: رسالة كل ${data.delaySeconds} ثانية.` : 'جاهز للإرسال السريع.'}</p>
                </div>
                
                {!isSending && progress === 0 && (
                    <button onClick={() => setIsSending(true)} style={{ ...s.btnPrimary, background: '#2ecc71' }}><FaPlay /> بدء الإرسال</button>
                )}
                {isSending && progress < data.targetCount && (
                    <button onClick={() => setIsSending(false)} style={{ ...s.btnPrimary, background: '#e74c3c' }}><FaPause /> إيقاف مؤقت</button>
                )}
                {!isSending && progress > 0 && progress < data.targetCount && (
                    <button onClick={() => setIsSending(true)} style={{ ...s.btnPrimary, background: '#f1c40f', color: '#1a1a2e' }}><FaPlay /> استكمال الإرسال</button>
                )}
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt)', marginBottom: '8px', fontWeight: 'bold' }}>
                    <span>تقدم الإرسال:</span>
                    <span>{percentage}% ({progress} من {data.targetCount})</span>
                </div>
                <div style={{ width: '100%', height: '18px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--p-purple), #2ecc71)', transition: '0.2s ease-out' }}></div>
                </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', height: '350px' }}>
                <div style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold' }}>
                    سجل العمليات المباشر (آخر 50)
                </div>
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {logs.length === 0 ? (
                        <div style={{ color: 'var(--txt-mut)', textAlign: 'center', marginTop: '80px' }}>في انتظار التشغيل...</div>
                    ) : (
                        logs.slice(0, 50).map(log => (
                            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `4px solid ${log.status === 'success' ? '#2ecc71' : '#e74c3c'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                                    {log.status === 'success' ? <FaCheckCircle color="#2ecc71" /> : <FaTimesCircle color="#e74c3c" />}
                                    <span style={{ fontWeight: 'bold' }}>{log.phone}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: log.status === 'success' ? '#2ecc71' : '#e74c3c' }}>{log.status === 'success' ? 'تم الإرسال بنجاح' : log.reason}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                <button onClick={() => { setIsSending(false); onPrev(); }} style={s.btnOutline}>➡️ إيقاف والرجوع للتعديل</button>
            </div>
        </div>
    );
}

const s = {
    card: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    btnPrimary: { border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', transition: '0.2s' },
    btnOutline: { background: 'transparent', color: 'var(--txt)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }
};