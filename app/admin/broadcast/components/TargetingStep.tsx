"use client";
import React, { useEffect } from 'react';
import { FaUsers, FaGraduationCap, FaLayerGroup, FaArrowRight, FaFilter } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';

// 🚀 مسار الاستيراد اتصلح هنا ورجعنا لورا لحد فولدر features الأساسي
import { useBroadcastStore } from '../../../../features/broadcast/store/useBroadcastStore';

const STAGES = [
    { id: 'all', name: 'جميع المراحل' },
    { id: 'sec1', name: 'الصف الأول الثانوي' },
    { id: 'sec2', name: 'الصف الثاني الثانوي' },
    { id: 'sec3', name: 'الصف الثالث الثانوي' }
];

const MAJORS = [
    { id: 'all', name: 'جميع الشعب' },
    { id: 'science', name: 'علمي علوم' },
    { id: 'math', name: 'علمي رياضة' },
    { id: 'literary', name: 'أدبي' }
];

export default function TargetingStep() {
    // 💡 بنسحب المتغيرات والدوال من المخزن مباشرة (بدون أي Props!)
    const { 
        targetStage, targetMajor, targetAudience, condition, targetCount, 
        updateField, setStep 
    } = useBroadcastStore();

    // 💡 محاكاة حساب عدد الطلاب بناءً على الفلاتر
    useEffect(() => {
        let base = targetStage === 'all' ? 1200 : 450;
        if (targetMajor !== 'all') base = Math.floor(base * 0.4);
        if (targetAudience === 'both') base = base * 2;
        
        // تقليل العدد لو استخدمنا فلتر ذكي (محاكاة للباك إند)
        if (condition === 'score_below_50') base = Math.floor(base * 0.15);
        if (condition === 'missed_exam') base = Math.floor(base * 0.10);
        if (condition === 'absent_3_days') base = Math.floor(base * 0.05);

        updateField('targetCount', base);
    }, [targetStage, targetMajor, targetAudience, condition, updateField]);

    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaUsers color="#3498db" /> الفلترة الذكية للجمهور
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* 1. المرحلة الدراسية */}
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaGraduationCap /> المرحلة الدراسية</label>
                    <select value={targetStage} onChange={e => updateField('targetStage', e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        {STAGES.map(s => <option key={s.id} value={s.id} style={{ background: '#1e1e2d' }}>{s.name}</option>)}
                    </select>
                </div>
                
                {/* 2. الشعبة */}
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaLayerGroup /> الشعبة الدراسية</label>
                    <select value={targetMajor} onChange={e => updateField('targetMajor', e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        {MAJORS.map(m => <option key={m.id} value={m.id} style={{ background: '#1e1e2d' }}>{m.name}</option>)}
                    </select>
                </div>
                
                {/* 3. فئة المتلقي */}
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaUsers /> فئة المتلقي</label>
                    <select value={targetAudience} onChange={e => updateField('targetAudience', e.target.value as any)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        <option value="students" style={{ background: '#1e1e2d' }}>أرقام الطلاب فقط</option>
                        <option value="parents" style={{ background: '#1e1e2d' }}>أرقام أولياء الأمور فقط</option>
                        <option value="both" style={{ background: '#1e1e2d' }}>الطلاب وأولياء الأمور معاً</option>
                    </select>
                </div>

                {/* 💣 4. الاستهداف الذكي (الجديد بناءً على طلب التيم) */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaFilter color="var(--warning)" /> شرط الاستهداف الذكي (Smart Targeting)</label>
                    <select value={condition} onChange={e => updateField('condition', e.target.value as any)} style={{ width: '100%', padding: '15px', background: 'rgba(241, 196, 15, 0.05)', border: '1px solid rgba(241, 196, 15, 0.3)', color: 'var(--warning)', borderRadius: '10px', outline: 'none', fontWeight: 'bold' }}>
                        <option value="all" style={{ background: '#1e1e2d', color: 'white' }}>إرسال للجميع (بدون شرط)</option>
                        <option value="missed_exam" style={{ background: '#1e1e2d', color: 'white' }}>الطلاب المتأخرين عن تسليم الواجب/الامتحان</option>
                        <option value="score_below_50" style={{ background: '#1e1e2d', color: 'white' }}>الطلاب الراسبين في التقييم (أقل من 50%)</option>
                        <option value="absent_3_days" style={{ background: '#1e1e2d', color: 'white' }}>الطلاب غير النشطين (لم يسجل دخول منذ 3 أيام)</option>
                    </select>
                </div>
            </div>

            <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '25px', borderRadius: '15px', border: '1px dashed rgba(52, 152, 219, 0.3)', textAlign: 'center' }}>
                <div style={{ color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '1.1rem' }}>العدد التقريبي للجمهور المستهدف</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3498db', textShadow: '0 0 10px rgba(52, 152, 219, 0.5)' }}>
                    {targetCount.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--txt-mut)' }}>طالب</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <Button variant="primary" onClick={() => setStep(2)} disabled={targetCount === 0} style={{ background: '#e67e22', border: 'none', padding: '15px 40px', fontSize: '1.1rem' }}>
                    متابعة صياغة الرسالة <FaArrowRight style={{ transform: 'rotate(180deg)', marginLeft: '10px' }} />
                </Button>
            </div>
        </div>
    );
}