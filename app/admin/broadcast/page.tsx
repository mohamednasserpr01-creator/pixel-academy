"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaBullhorn, FaHistory, FaPaperPlane, FaSearch, FaWhatsapp, FaBell, FaChartPie, FaEye, FaUsers, FaMagic, FaCheckCircle
} from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

// Components
import TargetingStep from './components/TargetingStep';
import MessageStep from './components/MessageStep';
import EngineStep from './components/EngineStep';
import ReportStep from './components/ReportStep';

// =========================================
// 💡 Types & Mock Data (Strict Typing)
// =========================================
export type LogStatus = 'success' | 'error';
export type MsgType = 'whatsapp' | 'in_app';
export type TemplateType = 'custom' | 'new_course' | 'new_lecture' | 'new_exam' | 'update';
export type AudienceType = 'students' | 'parents' | 'both';

export interface SendLog {
    id: string;
    studentName: string;
    phone: string;
    status: LogStatus;
    reason?: string;
}

interface CampaignHistory {
    id: string;
    date: string;
    type: MsgType;
    target: string;
    audience: AudienceType;
    total: number;
    success: number;
    fail: number;
    status: string;
}

const STAGES = [
    { id: 'all', name: 'جميع المراحل' }, { id: 'sec1', name: 'الصف الأول الثانوي' },
    { id: 'sec2', name: 'الصف الثاني الثانوي' }, { id: 'sec3', name: 'الصف الثالث الثانوي' }
];

const MAJORS = [
    { id: 'all', name: 'جميع الشعب' }, { id: 'science', name: 'علمي علوم' },
    { id: 'math', name: 'علمي رياضة' }, { id: 'literary', name: 'أدبي' }
];

const TEACHERS = [{ id: 't1', name: 'أ. محمد ناصر (فيزياء)' }, { id: 't2', name: 'أ. محمود مجدي (كيمياء)' }];
const COURSES = [
    { id: 'c1', teacherId: 't1', name: 'كورس المراجعة النهائية' },
    { id: 'c2', teacherId: 't1', name: 'أساسيات الفيزياء' },
    { id: 'c3', teacherId: 't2', name: 'العضوية المتكاملة' }
];
const LECTURES = [
    { id: 'l1', courseId: 'c1', name: 'المحاضرة الأولى: التأسيس' },
    { id: 'l2', courseId: 'c1', name: 'المحاضرة الثانية: الكهربية' },
    { id: 'l3', courseId: 'c3', name: 'تفاعلات الأكسدة' }
];

const MOCK_HISTORY: CampaignHistory[] = [
    { id: 'CAMP-9021', date: '2026-04-25 10:00 ص', type: 'whatsapp', target: 'طلاب الصف الثالث الثانوي', audience: 'students', total: 125, success: 120, fail: 5, status: 'completed' },
    { id: 'CAMP-9020', date: '2026-04-20 05:30 م', type: 'in_app', target: 'جميع المراحل - إشعار عام', audience: 'both', total: 450, success: 450, fail: 0, status: 'completed' },
];

export default function BroadcastAdminPage() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState<'new' | 'history'>('new');

    const [historySearch, setHistorySearch] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignHistory | null>(null);

    // === Shared Wizard State ===
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    
    // Targeting State
    const [targetStage, setTargetStage] = useState('all');
    const [targetMajor, setTargetMajor] = useState('all');
    const [targetAudience, setTargetAudience] = useState<AudienceType>('students');
    const [targetCount, setTargetCount] = useState(0);

    // Message State
    const [msgType, setMsgType] = useState<MsgType>('whatsapp');
    const [templateType, setTemplateType] = useState<TemplateType>('custom');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedLecture, setSelectedLecture] = useState('');
    const [finalMessage, setFinalMessage] = useState('');
    const [delaySeconds, setDelaySeconds] = useState(5);
    const [senderPhone, setSenderPhone] = useState('');
    const [isWaChecking, setIsWaChecking] = useState(false);
    const [isWaConnected, setIsWaConnected] = useState(false);

    // Engine State
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [sentLogs, setSentLogs] = useState<SendLog[]>([]);

    const isSendingRef = useRef(isSending);
    const progressRef = useRef(progress);
    const sentLogsRef = useRef<SendLog[]>(sentLogs);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { isSendingRef.current = isSending; }, [isSending]);
    useEffect(() => { progressRef.current = progress; }, [progress]);
    useEffect(() => { sentLogsRef.current = sentLogs; }, [sentLogs]);

    // حساب العدد التقريبي للطلاب
    useEffect(() => {
        if (step === 1) {
            let base = targetStage === 'all' ? 120 : 45;
            if (targetMajor !== 'all') base = Math.floor(base * 0.4);
            if (targetAudience === 'both') base = base * 2;
            setTargetCount(base);
        }
    }, [targetStage, targetMajor, targetAudience, step]);

    // محرك الإرسال المضاد للرصاص
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSending) {
            const speedMs = msgType === 'whatsapp' ? delaySeconds * 1000 : 200;

            interval = setInterval(() => {
                if (!isSendingRef.current) {
                    clearInterval(interval);
                    return;
                }

                if (progressRef.current >= targetCount) {
                    clearInterval(interval);
                    setIsSending(false);
                    showToast('تم انتهاء الإرسال بنجاح! جاري إعداد التقرير...', 'success');
                    setTimeout(() => setStep(4), 1500);
                    return;
                }

                const nextIndex = progressRef.current + 1;
                const isSuccess = msgType === 'whatsapp' ? Math.random() > 0.15 : Math.random() > 0.02;
                let failReason = '';
                if (!isSuccess) failReason = msgType === 'whatsapp' ? 'الرقم غير مسجل بالواتساب' : 'حساب الطالب محظور';

                const newLog: SendLog = {
                    id: `log-${Date.now()}-${nextIndex}`,
                    studentName: `طالب مستهدف ${nextIndex}`,
                    phone: `01${Math.floor(Math.random() * 900000000)}`,
                    status: isSuccess ? 'success' : 'error',
                    reason: !isSuccess ? failReason : undefined
                };

                progressRef.current = nextIndex;
                sentLogsRef.current = [newLog, ...sentLogsRef.current];

                setProgress(progressRef.current);
                setSentLogs([...sentLogsRef.current]);

                if (progressRef.current >= targetCount) {
                    clearInterval(interval);
                    setIsSending(false);
                    showToast('تم انتهاء الإرسال بنجاح! جاري إعداد التقرير...', 'success');
                    setTimeout(() => setStep(4), 1500);
                }
            }, speedMs); 
        }
        return () => clearInterval(interval);
    }, [isSending, targetCount, msgType, delaySeconds, showToast]);

    const handleResetEngine = () => {
        setIsSending(false);
        setProgress(0);
        setSentLogs([]);
        progressRef.current = 0;
        sentLogsRef.current = [];
    };

    const handleRetryFailed = () => {
        const failedCount = sentLogs.filter(l => l.status === 'error').length;
        if (failedCount === 0) return;
        setTargetCount(failedCount);
        handleResetEngine();
        setStep(3); 
    };

    const handleGenerateTemplate = () => {
        if (templateType === 'custom') return;
        const teacherName = TEACHERS.find(t => t.id === selectedTeacher)?.name || '[اسم المدرس]';
        const courseName = COURSES.find(c => c.id === selectedCourse)?.name || '[اسم الكورس]';
        const lectureName = LECTURES.find(l => l.id === selectedLecture)?.name || '[اسم المحاضرة]';

        let text = '';
        if (templateType === 'new_course') text = `🎉 مفاجأة لطلابنا!\nتم رسمياً إطلاق (${courseName}) مع ${teacherName}.\nاحجز مقعدك الآن وابدأ رحلة التفوق! 🚀`;
        else if (templateType === 'new_lecture') text = `🔥 إشعار جديد لطلاب ${courseName}\nتم الآن إضافة (${lectureName}) مع ${teacherName}.\nادخل المنصة الآن وابدأ المذاكرة! 🚀`;
        else if (templateType === 'new_exam') text = `📝 تحدي جديد في ${courseName}!\nامتحان جديد أصبح متاحاً داخل (${lectureName}) مع ${teacherName}.\nاختبر مستواك الآن. 💪`;
        else if (templateType === 'update') text = `🔄 تحديث هام في ${courseName}\nتم تحديث محتوى (${lectureName}) مع ${teacherName}.\nيرجى مراجعة التحديثات. 📚`;
        
        setFinalMessage(text);
        showToast('تم توليد قالب الرسالة بنجاح!', 'success');
    };

    const checkWhatsappConnection = () => {
        if (!/^01[0125][0-9]{8}$/.test(senderPhone)) return showToast('يرجى إدخال رقم مصري صحيح', 'error');
        setIsWaChecking(true);
        setTimeout(() => {
            setIsWaChecking(false);
            setIsWaConnected(true);
            showToast('تم التحقق بنجاح! الرقم متصل بخوادم واتساب 🟢', 'success');
        }, 1500);
    };

    if (!mounted) return null;

    const filteredHistory = MOCK_HISTORY.filter(h => h.id.includes(historySearch) || h.target.includes(historySearch));
    const successfulLogs = sentLogs.filter(l => l.status === 'success');
    const failedLogs = sentLogs.filter(l => l.status === 'error');

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBullhorn color="#e67e22" /> مركز الإشعارات والحملات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>إدارة الإرسال الجماعي لرسائل الواتساب وإشعارات المنصة.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => { setActiveMainTab('new'); setStep(1); handleResetEngine(); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeMainTab === 'new' ? '#e67e22' : 'transparent', color: activeMainTab === 'new' ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaPaperPlane /> حملة جديدة
                    </button>
                    <button onClick={() => setActiveMainTab('history')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeMainTab === 'history' ? 'var(--p-purple)' : 'transparent', color: activeMainTab === 'history' ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaHistory /> سجل الحملات
                    </button>
                </div>
            </div>

            {activeMainTab === 'history' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                            <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                            <input type="text" placeholder="ابحث برقم أو اسم الحملة..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '15px' }}>الكود والتاريخ</th>
                                    <th style={{ padding: '15px' }}>الاستهداف والقناة</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>النجاح</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>الفشل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map(camp => (
                                    <tr key={camp.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'white' }}>{camp.id}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)', direction: 'ltr', textAlign: 'right' }}>{camp.date}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--txt)', marginBottom: '5px' }}>{camp.target}</div>
                                            <span style={{ fontSize: '0.8rem', background: camp.type === 'whatsapp' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)', color: camp.type === 'whatsapp' ? '#2ecc71' : '#3498db', padding: '4px 8px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                {camp.type === 'whatsapp' ? <FaWhatsapp /> : <FaBell />} {camp.type === 'whatsapp' ? 'واتساب' : 'إشعار داخلي'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center', color: '#2ecc71', fontWeight: 'bold' }}>{camp.success.toLocaleString()}</td>
                                        <td style={{ padding: '15px', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>{camp.fail.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeMainTab === 'new' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                        {[ { s: 1, label: 'الاستهداف', icon: <FaUsers/> }, { s: 2, label: 'الرسالة', icon: <FaMagic/> }, { s: 3, label: 'الإرسال', icon: <FaPaperPlane/> }, { s: 4, label: 'التقرير', icon: <FaChartPie/> } ].map(item => (
                            <div key={item.s} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ width: '45px', height: '45px', margin: '0 auto 10px', borderRadius: '50%', background: step === item.s ? '#e67e22' : (step > item.s ? '#2ecc71' : 'rgba(255,255,255,0.05)'), color: step >= item.s ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: `2px solid ${step === item.s ? '#e67e22' : (step > item.s ? '#2ecc71' : 'rgba(255,255,255,0.1)')}`, transition: '0.3s' }}>
                                    {step > item.s ? <FaCheckCircle /> : item.icon}
                                </div>
                                <div style={{ color: step >= item.s ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {step === 1 && <TargetingStep targetStage={targetStage} setTargetStage={setTargetStage} targetMajor={targetMajor} setTargetMajor={setTargetMajor} targetAudience={targetAudience} setTargetAudience={setTargetAudience} targetCount={targetCount} onNext={() => setStep(2)} stages={STAGES} majors={MAJORS} />}
                    {step === 2 && <MessageStep msgType={msgType} setMsgType={setMsgType} templateType={templateType} setTemplateType={setTemplateType} selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} selectedLecture={selectedLecture} setSelectedLecture={setSelectedLecture} finalMessage={finalMessage} setFinalMessage={setFinalMessage} delaySeconds={delaySeconds} setDelaySeconds={setDelaySeconds} senderPhone={senderPhone} setSenderPhone={setSenderPhone} isWaChecking={isWaChecking} isWaConnected={isWaConnected} onCheckWhatsapp={checkWhatsappConnection} onGenerateTemplate={handleGenerateTemplate} onPrev={() => setStep(1)} onNext={() => setStep(3)} isStepValid={finalMessage.trim().length > 5 && (msgType === 'in_app' || isWaConnected)} teachers={TEACHERS} courses={COURSES} lectures={LECTURES} />}
                    {step === 3 && <EngineStep isSending={isSending} setIsSending={setIsSending} progress={progress} targetCount={targetCount} msgType={msgType} delaySeconds={delaySeconds} sentLogs={sentLogs} onReset={handleResetEngine} onPrev={() => setStep(2)} onNext={() => setStep(4)} />}
                    {step === 4 && <ReportStep targetCount={targetCount} successfulLogs={successfulLogs} failedLogs={failedLogs} onRetryFailed={handleRetryFailed} onNewCampaign={() => { setStep(1); handleResetEngine(); setTargetCount(0); }} />}
                </div>
            )}
        </div>
    );
}