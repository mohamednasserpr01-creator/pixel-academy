"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FaTimes, FaChartBar, FaFileExcel, FaSearch, FaEye, FaGraduationCap, FaCheck, FaTimesCircle } from 'react-icons/fa';
import { LectureItem } from '../types/curriculum.types';

interface Props { isOpen: boolean; onClose: () => void; item: LectureItem | null; }

export const ItemReportsModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen || !item) return null;

    // 💡 اعتبار حصة الواجب كفيديو
    const isVideoItem = ['lesson', 'homework_lesson'].includes(item.type);

    const mockReports = [
        { id: '1', serialNumber: '1001', name: 'أحمد محمود', phone: '01012345678', parentPhone: '01123456789', governorate: 'القاهرة', address: 'المعادي', subType: 'كود محفظة', score: 18, maxScore: 20, views: 2, watchPercentage: 100, status: 'passed', date: '2023-10-25 10:00' },
        { id: '2', serialNumber: '1002', name: 'سارة علي', phone: '01198765432', parentPhone: '01298765432', governorate: 'الإسكندرية', address: 'سموحة', subType: 'إضافة مدرس', score: 9, maxScore: 20, views: 1, watchPercentage: 30, status: 'failed', date: '2023-10-26 12:30' },
        { id: '3', serialNumber: '1003', name: 'كريم حسن', phone: '01234567890', parentPhone: '01034567890', governorate: 'الجيزة', address: 'الدقي', subType: 'كود كورس', score: 0, maxScore: 20, views: 0, watchPercentage: 0, status: 'not_started', date: '-' },
    ];

    const filteredReports = mockReports.filter(r => r.name.includes(searchQuery) || r.phone.includes(searchQuery) || r.serialNumber.includes(searchQuery));

    const handleExportItemEnrolled = () => {
        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الطالب', 'رقم ولي الأمر', 'المحافظة', 'العنوان', 'نوع الاشتراك'];
        const data = filteredReports.map(r => ({
            'الرقم التسلسلي': r.serialNumber, 'اسم الطالب': r.name, 'رقم الطالب': r.phone, 'رقم ولي الأمر': r.parentPhone, 
            'المحافظة': r.governorate, 'العنوان': r.address, 'نوع الاشتراك': r.subType
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "المسجلين بالحصة");
        XLSX.writeFile(workbook, `Enrolled_${item.title}.xlsx`);
    };

    const handleExportItemAbsentees = () => {
        const absentees = filteredReports.filter(r => r.status === 'not_started');
        if (absentees.length === 0) return alert("لا يوجد طلاب متخلفين.");

        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الطالب', 'رقم ولي الأمر', 'المحافظة', 'العنوان', 'ملاحظة'];
        const data = absentees.map(r => ({
            'الرقم التسلسلي': r.serialNumber, 'اسم الطالب': r.name, 'رقم الطالب': r.phone, 'رقم ولي الأمر': r.parentPhone, 
            'المحافظة': r.governorate, 'العنوان': r.address, 'ملاحظة': isVideoItem ? 'لم يشاهد' : 'لم يمتحن'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "المتخلفين");
        XLSX.writeFile(workbook, `Absentees_${item.title}.xlsx`);
    };

    const typeLabel = item.type === 'lesson' ? 'حصة شرح' : item.type === 'homework_lesson' ? 'حصة حل واجب' : item.type === 'makeup_exam' ? 'امتحان تعويضي' : item.type === 'exam' ? 'امتحان' : 'واجب';

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', width: '900px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div><h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaChartBar color="#f1c40f" /> إحصائيات ({typeLabel}): {item.title}</h3></div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                        <input type="text" placeholder="ابحث برقم الطالب أو اسمه..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 40px 10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleExportItemEnrolled} style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #27ae60', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <FaFileExcel /> المسجلين
                        </button>
                        <button onClick={handleExportItemAbsentees} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid #e74c3c', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <FaFileExcel /> المتخلفين
                        </button>
                    </div>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'right' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#1a1a2e', zIndex: 1 }}>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '15px' }}>تسلسل</th>
                                <th style={{ padding: '15px' }}>الطالب</th>
                                {isVideoItem ? (
                                    <><th style={{ padding: '15px', textAlign: 'center' }}><FaEye /> المشاهدات</th><th style={{ padding: '15px', textAlign: 'center' }}>النسبة</th></>
                                ) : (
                                    <><th style={{ padding: '15px', textAlign: 'center' }}><FaGraduationCap /> الدرجة</th><th style={{ padding: '15px', textAlign: 'center' }}>الحالة</th></>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--p-purple)' }}>{report.serialNumber}</td>
                                    <td style={{ padding: '15px' }}><div style={{ fontWeight: 'bold' }}>{report.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{report.phone}</div></td>
                                    {isVideoItem ? (
                                        <><td style={{ padding: '15px', textAlign: 'center' }}>{report.views}</td><td style={{ padding: '15px', textAlign: 'center' }}>{report.watchPercentage}%</td></>
                                    ) : (
                                        <><td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>{report.status === 'not_started' ? '-' : `${report.score} / ${report.maxScore}`}</td><td style={{ padding: '15px', textAlign: 'center' }}>{report.status === 'not_started' ? 'لم يمتحن' : report.status === 'passed' ? 'ناجح' : 'راسب'}</td></>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};