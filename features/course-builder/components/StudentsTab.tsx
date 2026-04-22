// FILE: features/course-builder/components/StudentsTab.tsx
"use client";
import React, { useState } from 'react';
import { FaUserGraduate, FaSearch, FaBan, FaCheckCircle, FaWallet, FaBarcode, FaGift, FaLock, FaUnlock } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';
import { useCourseStudents } from '../hooks/useCourseStudents';

interface Props {
    courseId: string;
    curriculum: Lecture[]; // محتاجين المنهج عشان نعرض المحاضرات للطالب
}

export const StudentsTab: React.FC<Props> = ({ courseId, curriculum }) => {
    const {
        students, isLoading, searchQuery, setSearchQuery,
        handleToggleBlock, handleToggleLectureAccess
    } = useCourseStudents(courseId);

    // حالة لفتح/قفل نافذة إدارة الحصص لكل طالب
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    const getPaymentIcon = (method: string) => {
        if (method === 'wallet') return <><FaWallet color="#3498db" /> محفظة</>;
        if (method === 'custom_code') return <><FaBarcode color="var(--p-purple)" /> كود</>;
        return <><FaGift color="#2ecc71" /> مجاني</>;
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>جاري تحميل بيانات الطلاب... ⏳</div>;
    }

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* شريط البحث */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaUserGraduate color="#3498db" /> المشتركين في الكورس ({students.length})
                </h3>
                <div style={{ position: 'relative', width: '300px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                    <input 
                        type="text" 
                        placeholder="ابحث بالاسم، الرقم، أو الكود..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 40px 10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* جدول الطلاب */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                {students.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا يوجد طلاب متطابقين مع البحث.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'right' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '15px' }}>الطالب</th>
                                <th style={{ padding: '15px' }}>طريقة الدفع</th>
                                <th style={{ padding: '15px' }}>تاريخ الانضمام</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>الوصول للحصص</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>حالة الكورس</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <React.Fragment key={student.id}>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: student.isBlocked ? 'rgba(231, 76, 60, 0.05)' : 'transparent' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{student.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{student.phone}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                {getPaymentIcon(student.paymentMethod)}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', marginTop: '4px' }}>{student.paymentDetails}</div>
                                        </td>
                                        <td style={{ padding: '15px', fontSize: '0.9rem', color: 'var(--txt-mut)' }}>{student.enrolledAt}</td>
                                        
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                                                style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid #3498db', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}
                                            >
                                                إدارة الحصص ({student.accessibleLectures.length}/{curriculum.length})
                                            </button>
                                        </td>

                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            {/* زرار الحظر والفتح */}
                                            <button 
                                                onClick={() => handleToggleBlock(student.id, student.isBlocked)}
                                                style={{ 
                                                    background: student.isBlocked ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', 
                                                    color: student.isBlocked ? '#2ecc71' : '#e74c3c', 
                                                    border: `1px solid ${student.isBlocked ? '#2ecc71' : '#e74c3c'}`, 
                                                    padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto'
                                                }}
                                            >
                                                {student.isBlocked ? <><FaCheckCircle /> فك الحظر</> : <><FaBan /> حظر من الكورس</>}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* لوحة إدارة الحصص (بتفتح لما تدوس على الزرار) */}
                                    {expandedStudent === student.id && (
                                        <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                                            <td colSpan={5} style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h4 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '0.95rem' }}>صلاحيات الحصص للطالب: {student.name}</h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                                                    {curriculum.length === 0 ? (
                                                        <span style={{ color: 'var(--txt-mut)' }}>لا توجد حصص في المنهج.</span>
                                                    ) : (
                                                        curriculum.map(lec => {
                                                            const hasAccess = student.accessibleLectures.includes(lec.id);
                                                            return (
                                                                <div key={lec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '10px 15px', borderRadius: '8px', border: `1px solid ${hasAccess ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                                                                    <span style={{ fontSize: '0.9rem', color: hasAccess ? 'white' : 'var(--txt-mut)' }}>{lec.title}</span>
                                                                    
                                                                    {/* زرار غلق وفتح الحصة للطالب */}
                                                                    <button 
                                                                        onClick={() => handleToggleLectureAccess(student.id, lec.id)}
                                                                        style={{ background: 'none', border: 'none', color: hasAccess ? '#2ecc71' : 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.1rem' }}
                                                                        title={hasAccess ? 'إغلاق الحصة' : 'فتح الحصة'}
                                                                    >
                                                                        {hasAccess ? <FaUnlock /> : <FaLock />}
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};