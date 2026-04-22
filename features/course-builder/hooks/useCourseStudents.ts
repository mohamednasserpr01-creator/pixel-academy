// FILE: features/course-builder/hooks/useCourseStudents.ts
import { useState, useEffect } from 'react';
import { EnrolledStudent } from '../types/course-students.types';
import { CourseStudentsService } from '../services/course-students.service';

export const useCourseStudents = (courseId: string) => {
    const [students, setStudents] = useState<EnrolledStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // جلب الطلاب أول ما الشاشة تفتح
    useEffect(() => {
        const loadStudents = async () => {
            setIsLoading(true);
            try {
                const data = await CourseStudentsService.fetchEnrolledStudents(courseId);
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStudents();
    }, [courseId]);

    // حظر أو فك حظر الطالب
    const handleToggleBlock = async (studentId: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        // تحديث الـ UI فوراً (Optimistic Update)
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isBlocked: newStatus } : s));
        
        try {
            await CourseStudentsService.toggleStudentBlock(studentId, newStatus);
        } catch (error) {
            // لو السيرفر ضرب نرجعها زي ما كانت
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isBlocked: currentStatus } : s));
            alert("حدث خطأ أثناء تعديل حالة الطالب");
        }
    };

    // فتح أو غلق حصة معينة لطالب
    const handleToggleLectureAccess = async (studentId: string, lectureId: string) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const hasAccess = student.accessibleLectures.includes(lectureId);
        const updatedLectures = hasAccess 
            ? student.accessibleLectures.filter(id => id !== lectureId) 
            : [...student.accessibleLectures, lectureId];

        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, accessibleLectures: updatedLectures } : s));

        try {
            await CourseStudentsService.updateStudentLectures(studentId, updatedLectures);
        } catch (error) {
            alert("حدث خطأ أثناء تعديل صلاحيات الحصص");
        }
    };

    // فلترة الطلاب بالبحث
    const filteredStudents = students.filter(s => 
        s.name.includes(searchQuery) || s.phone.includes(searchQuery) || s.paymentDetails.includes(searchQuery)
    );

    return {
        students: filteredStudents,
        isLoading,
        searchQuery,
        setSearchQuery,
        handleToggleBlock,
        handleToggleLectureAccess
    };
};