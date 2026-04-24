"use client";
import React from 'react';
import { FaTimes, FaUserGraduate, FaHistory, FaCheckCircle, FaTimesCircle, FaPlayCircle, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { EnrolledStudent } from '../types/course-students.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    student: EnrolledStudent | null;
}

export const StudentProfileModal: React.FC<Props> = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    // 🚀 دالة لترجمة نوع الاشتراك لعربي
    const getSubscriptionLabel = (type: string) => {
        const labels: Record<string, string> = {
            'manual_teacher': 'إضافة يدوية من المدرس',
            'wallet': 'رصيد محفظة',
            'offer_code': 'كود عرض',
            'course_code': 'كود كورس',
            'lecture_code': 'كود حصة'
        };
        return labels[type] || type;
    };

    const progressValue = student.progress || 0; // 🚀 تأمين القيمة عشان الـ TypeScript

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', width: '850px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
                
                {/* الهيدر (بيانات الطالب الشخصية) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--p-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white' }}>
                            <FaUserGraduate />
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 8px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {student.name} <span style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '5px', color: 'var(--txt-mut)' }}>تسلسل: {student.serialNumber}</span>
                            </h2>
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaPhoneAlt size={12} /> طالب: {student.phone}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaPhoneAlt size={12} color="#f39c12" /> ولي أمر: {student.parentPhone}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaMapMarkerAlt size={12} /> {student.governorate} ({student.address})</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                {/* تفاصيل الكورس */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: 'var(--txt-mut)', margin: '0 0 10px 0' }}>حالة التسجيل</h4>
                        <div style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.8' }}>
                            <div><strong>التاريخ:</strong> {student.enrolledAt}</div>
                            <div><strong>الدفع:</strong> <span style={{ color: '#f39c12' }}>{getSubscriptionLabel(student.paymentMethod)}</span> ({student.paymentDetails})</div>
                            <div><strong>حالة الحساب:</strong> <span style={{ color: student.isBlocked ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>{student.isBlocked ? 'محظور من الكورس' : 'نشط'}</span></div>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ color: 'var(--txt-mut)', margin: '0 0 10px 0' }}>نسبة إنجاز المنهج</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', height: '100%', paddingBottom: '10px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ width: `${progressValue}%`, background: progressValue > 80 ? '#2ecc71' : progressValue > 40 ? '#f1c40f' : '#e74c3c', height: '100%' }}></div>
                            </div>
                            <strong style={{ color: 'white', fontSize: '1.4rem' }}>{progressValue}%</strong>
                        </div>
                    </div>
                </div>

                {/* الـ Timeline (التتبع الشامل لكل حصة وامتحان) */}
                <h3 style={{ margin: '0 0 15px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaHistory color="#3498db" /> سجل نشاط الطالب
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {student.trackingDetails.length === 0 ? (
                        <div style={{ color: 'var(--txt-mut)', textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>لم يقم الطالب بأي نشاط حتى الآن.</div>
                    ) : (
                        student.trackingDetails.map((track, idx) => {
                            const isLesson = track.type === 'lesson';
                            const title = isLesson ? 'مشاهدة حصة' : track.type === 'makeup_exam' ? 'امتحان تعويضي' : track.type === 'exam' ? 'امتحان رئيسي' : 'تسليم واجب';
                            
                            return (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        {isLesson ? <FaPlayCircle size={24} color="#3498db" /> : <FaCheckCircle size={24} color={track.status === 'passed' ? '#2ecc71' : track.status === 'failed' ? '#e74c3c' : '#f1c40f'} />}
                                        <div>
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.05rem' }}>{title}</div>
                                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginTop: '2px' }}>عنصر (ID: {track.itemId})</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        {isLesson ? (
                                            <span style={{ color: '#3498db', fontWeight: 'bold', fontSize: '1.1rem' }}>شاهد {track.watchPercentage}%</span>
                                        ) : (
                                            <span style={{ color: track.status === 'passed' ? '#2ecc71' : track.status === 'failed' ? '#e74c3c' : '#f1c40f', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                                                {track.status === 'passed' ? 'ناجح' : track.status === 'failed' ? 'راسب' : 'تم التسليم'}
                                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '5px', color: 'white' }}>{track.score} / {track.maxScore}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};