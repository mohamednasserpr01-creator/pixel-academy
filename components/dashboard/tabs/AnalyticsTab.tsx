"use client";
import React from 'react';
import { FaChartPie } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function AnalyticsTab() {
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaChartPie /> تحليل الأداء الأكاديمي</h2>
            <div className="analytics-grid">
                <div className="analytics-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نسبة الحضور والتفاعل</h3>
                    <div className="circle-chart"><span>{dashboardData.analytics.attendance}%</span></div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', fontWeight: 'bold' }}>{dashboardData.analytics.msg}</p>
                </div>
                <div className="analytics-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نقاط القوة والضعف</h3>
                    {dashboardData.analytics.skills.map((skill, i) => (
                        <div style={{ textAlign: 'right', marginBottom: '15px' }} key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                <span>{skill.name}</span><span style={{ color: skill.color }}>{skill.score}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${skill.score}%`, background: skill.color }}></div></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}