// FILE: features/course-builder/types/course-students.types.ts

export interface EnrolledStudent {
    id: string;
    name: string;
    phone: string;
    enrolledAt: string;
    paymentMethod: 'wallet' | 'custom_code' | 'free';
    paymentDetails: string; // مثال: الكود المستخدم أو المبلغ
    isBlocked: boolean; // حالة حظر الطالب من الكورس
    accessibleLectures: string[]; // الـ IDs بتاعت المحاضرات اللي مسموحله يشوفها
    progress: number; // نسبة الإنجاز
}