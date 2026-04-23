"use client";
import React, { useState } from 'react';
import { FaUserGraduate, FaSearch, FaFileExcel, FaUserPlus, FaChevronRight, FaChevronLeft, FaListOl, FaWallet, FaBarcode } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';
import { useCourseStudents } from '../hooks/useCourseStudents';
import { AddStudentModal } from './AddStudentModal';
import { StudentProfileModal } from './StudentProfileModal';
import { EnrolledStudent } from '../types/course-students.types';

interface Props { courseId: string; curriculum: Lecture[]; }

export const StudentsTab: React.FC<Props> = ({ courseId, curriculum }) => {
    const {
        students, totalStudents, currentPage, setCurrentPage, totalPages,
        isLoading, searchQuery, setSearchQuery, 
        courseStats, // 🚀 الإحصائيات السريعة
        handleExportCourseEnrolled, handleExportAllExams, handleExportCourseAbsentees, handleExportMasterExcel,
        isAddStudentModalOpen, setIsAddStudentModalOpen
    } = useCourseStudents(courseId, curriculum);

    const [selectedProfile, setSelectedProfile] = useState<EnrolledStudent | null>(null);

    const getSubscriptionLabel = (type: string) => {
        const labels: Record<string, string> = {
            'manual_teacher': 'إضافة يدوية', 'wallet': 'رصيد محفظة',
            'offer_code': 'كود عرض', 'course_code': 'كود كورس', 'lecture_code': 'كود حصة'
        };
        return labels[type] || type;
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>جاري التحميل... ⏳</div>;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 🚀 كروت الإحصائيات السريعة (Dashboard Widgets) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '5px' }}>
                <div style={{ background: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.3)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaUserGraduate size={24} color="#3498db" /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>المسجلين بالكورس</div><div style={{ color: 'white', fontSize: '1.6rem', fontWeight: 'bold' }}>{courseStats.total}</div></div>
                </div>
                <div style={{ background: 'rgba(155, 89, 182, 0.1)', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(155, 89, 182, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaUserPlus size={24} color="#9b59b6" /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إضافة يدوية</div><div style={{ color: 'white', fontSize: '1.6rem', fontWeight: 'bold' }}>{courseStats.manual}</div></div>
                </div>
                <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaWallet size={24} color="#2ecc71" /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>رصيد محفظة</div><div style={{ color: 'white', fontSize: '1.6rem', fontWeight: 'bold' }}>{courseStats.wallet}</div></div>
                </div>
                <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '1px solid rgba(241, 196, 15, 0.3)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(241, 196, 15, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaBarcode size={24} color="#f1c40f" /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>عن طريق أكواد</div><div style={{ color: 'white', fontSize: '1.6rem', fontWeight: 'bold' }}>{courseStats.codes}</div></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ position: 'relative', width: '350px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث بالاسم أو الرقم أو التسلسل..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ width: '100%', padding: '10px 40px 10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={handleExportMasterExcel} style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db', border: '1px solid #3498db', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaFileExcel /> التقرير الشامل
                    </button>
                    <button onClick={handleExportAllExams} style={{ background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f', border: '1px solid #f1c40f', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaListOl /> درجات الامتحانات
                    </button>
                    <button onClick={handleExportCourseEnrolled} style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #27ae60', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaFileExcel /> المسجلين بالكورس
                    </button>
                    <button onClick={handleExportCourseAbsentees} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid #e74c3c', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaFileExcel /> متخلفين إطلاقاً
                    </button>
                    <button onClick={() => setIsAddStudentModalOpen(true)} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaUserPlus /> إضافة يدوية
                    </button>
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', color: 'white', textAlign: 'right' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px' }}>م</th>
                            <th style={{ padding: '15px' }}>تسلسل</th>
                            <th style={{ padding: '15px' }}>اسم الطالب</th>
                            <th style={{ padding: '15px' }}>هاتف الطالب</th>
                            <th style={{ padding: '15px' }}>نوع الاشتراك</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>الإنجاز</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{(currentPage - 1) * 50 + index + 1}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--p-purple)' }}>{student.serialNumber}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{student.name}</td>
                                <td style={{ padding: '15px' }}>{student.phone}</td>
                                <td style={{ padding: '15px', color: '#f39c12', fontSize: '0.9rem' }}>{getSubscriptionLabel(student.paymentMethod)}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{student.progress}%</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => setSelectedProfile(student)} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid #3498db', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        بروفايل الطالب
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--txt-mut)' }}>صفحة {currentPage} من {totalPages}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}><FaChevronRight /> السابق</button>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>التالي <FaChevronLeft /></button>
                        </div>
                    </div>
                )}
            </div>

            <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} curriculum={curriculum} onAdd={(phone) => alert(`تم الإرسال: ${phone}`)} />
            <StudentProfileModal isOpen={!!selectedProfile} onClose={() => setSelectedProfile(null)} student={selectedProfile} />
        </div>
    );
};