// FILE: app/admin/broadcast/components/TargetingStep.tsx
"use client";
import React from 'react';
import { FaUsers, FaGraduationCap, FaLayerGroup, FaArrowRight } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';

// 💡 نستورد الـ Types من الصفحة الرئيسية (أو ملف منفصل للـ Types يفضل)
import { AudienceType } from '../page'; // هنفترض إننا صدرنا الـ Types من page.tsx

interface TargetingStepProps {
    targetStage: string;
    setTargetStage: (val: string) => void;
    targetMajor: string;
    setTargetMajor: (val: string) => void;
    targetAudience: AudienceType;
    setTargetAudience: (val: AudienceType) => void;
    targetCount: number;
    onNext: () => void;
    stages: { id: string; name: string }[];
    majors: { id: string; name: string }[];
}

export default function TargetingStep({
    targetStage, setTargetStage,
    targetMajor, setTargetMajor,
    targetAudience, setTargetAudience,
    targetCount, onNext, stages, majors
}: TargetingStepProps) {
    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaUsers color="#3498db" /> الفلترة الذكية للجمهور
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaGraduationCap /> المرحلة الدراسية</label>
                    <select value={targetStage} onChange={e => setTargetStage(e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        {stages.map(s => <option key={s.id} value={s.id} style={{ background: '#1e1e2d' }}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaLayerGroup /> الشعبة الدراسية</label>
                    <select value={targetMajor} onChange={e => setTargetMajor(e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        {majors.map(m => <option key={m.id} value={m.id} style={{ background: '#1e1e2d' }}>{m.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaUsers /> فئة المتلقي</label>
                    <select value={targetAudience} onChange={e => setTargetAudience(e.target.value as AudienceType)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        <option value="students" style={{ background: '#1e1e2d' }}>أرقام الطلاب فقط</option>
                        <option value="parents" style={{ background: '#1e1e2d' }}>أرقام أولياء الأمور فقط</option>
                        <option value="both" style={{ background: '#1e1e2d' }}>الطلاب وأولياء الأمور معاً</option>
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
                <Button variant="primary" onClick={onNext} disabled={targetCount === 0} style={{ background: '#e67e22', border: 'none', padding: '15px 40px', fontSize: '1.1rem' }}>
                    متابعة صياغة الرسالة <FaArrowRight style={{ transform: 'rotate(180deg)', marginLeft: '10px' }} />
                </Button>
            </div>
        </div>
    );
}