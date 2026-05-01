// FILE: app/admin/broadcast/components/ReportStep.tsx
"use client";
import React from 'react';
import { FaChartPie, FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { SendLog } from '../page';

interface ReportStepProps {
    targetCount: number;
    successfulLogs: SendLog[];
    failedLogs: SendLog[];
    onRetryFailed: () => void;
    onNewCampaign: () => void;
}

export default function ReportStep({ targetCount, successfulLogs, failedLogs, onRetryFailed, onNewCampaign }: ReportStepProps) {
    return (
        <div style={{ background: 'var(--card)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.5s ease', textAlign: 'center' }}>
            <FaChartPie style={{ fontSize: '4rem', color: 'var(--p-purple)', marginBottom: '20px' }} />
            <h2 style={{ color: 'white', marginBottom: '10px' }}>اكتملت حملة الإرسال</h2>
            <p style={{ color: 'var(--txt-mut)', marginBottom: '40px', fontSize: '1.1rem' }}>إليك التقرير النهائي لما تم إنجازه في هذه الحملة.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}>إجمالي المستهدف</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{targetCount.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                    <div style={{ color: '#2ecc71', marginBottom: '10px', fontWeight: 'bold' }}>تم بنجاح</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2ecc71' }}>{successfulLogs.length.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                    <div style={{ color: '#e74c3c', marginBottom: '10px', fontWeight: 'bold' }}>فشل الإرسال</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#e74c3c' }}>{failedLogs.length.toLocaleString()}</div>
                </div>
            </div>

            {failedLogs.length > 0 ? (
                <div style={{ background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid rgba(231, 76, 60, 0.3)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '10px' }}><FaExclamationTriangle /> تقرير بالأرقام الفاشلة</h3>
                        <button onClick={onRetryFailed} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaRedo /> إعادة إرسال للفاشل فقط
                        </button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {failedLogs.map(log => (
                            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                                <div>
                                    <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '10px' }}>{log.studentName}</span>
                                    <span style={{ color: 'var(--txt-mut)', fontFamily: 'monospace' }}>{log.phone}</span>
                                </div>
                                <div style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{log.reason}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '20px', borderRadius: '15px', border: '1px dashed #2ecc71', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    🎉 رائـــع! تم وصول جميع الرسائل بنجاح بدون أي فشل.
                </div>
            )}

            <div style={{ marginTop: '40px' }}>
                <Button variant="outline" onClick={onNewCampaign}>إنشاء حملة جديدة</Button>
            </div>
        </div>
    );
}