// FILE: features/course-builder/services/course-students.service.ts
import { EnrolledStudent } from '../types/course-students.types';

// بيانات وهمية للتجربة (Mock Data)
const MOCK_STUDENTS: EnrolledStudent[] = [
    { id: 'S1', name: 'أحمد محمود', phone: '01012345678', enrolledAt: '2023-10-01 10:00 AM', paymentMethod: 'wallet', paymentDetails: 'خصم 500 ج.م', isBlocked: false, accessibleLectures: ['L1', 'L2'], progress: 45 },
    { id: 'S2', name: 'سارة علي', phone: '01198765432', enrolledAt: '2023-10-02 12:30 PM', paymentMethod: 'custom_code', paymentDetails: 'الكود: A1B2C3D4', isBlocked: true, accessibleLectures: [], progress: 0 },
    { id: 'S3', name: 'كريم حسن', phone: '01234567890', enrolledAt: '2023-10-03 09:15 AM', paymentMethod: 'free', paymentDetails: 'منحة', isBlocked: false, accessibleLectures: ['L1'], progress: 10 },
];

export const CourseStudentsService = {
    // جلب الطلاب
    fetchEnrolledStudents: async (courseId: string): Promise<EnrolledStudent[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_STUDENTS]), 1000));
    },
    // تغيير حالة الحظر
    toggleStudentBlock: async (studentId: string, isBlocked: boolean) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    },
    // تعديل صلاحيات المحاضرات لطالب
    updateStudentLectures: async (studentId: string, lectureIds: string[]) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    }
};