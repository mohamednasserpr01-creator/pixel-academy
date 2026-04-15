// FILE: types/index.ts

// ==========================================
// 1. أنواع المستخدمين (User Types)
// ==========================================
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string; // 💡 تم إضافة رقم الهاتف هنا لحل مشكلة الداشبورد
    role: 'student' | 'teacher' | 'admin';
    avatar?: string;
    token?: string;
}

// ==========================================
// 2. أنواع الكورسات (Course Types)
// ==========================================
export interface Course {
    id: string | number;
    img: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    price: number;
    instructorId?: string;
    level?: string;
}

// ==========================================
// 3. أنواع المحاضرات ومحتوياتها (Lecture Types)
// ==========================================
export type PlaylistItemType = 'video' | 'pdf' | 'exam' | 'homework';
export type ItemStatus = 'locked' | 'available' | 'active' | 'completed';

export interface PlaylistItem {
    id: string;
    type: PlaylistItemType;
    titleAr: string;
    titleEn: string;
    status: ItemStatus;
    isReq?: boolean;       // هل هو إجباري؟
    time?: string;         // مدة الفيديو
    videoSrc?: string;     // رابط الفيديو
    poster?: string;       // صورة غلاف الفيديو
    link?: string;         // رابط الـ PDF
    questions?: number;    // عدد الأسئلة في الامتحان/الواجب
    timeLimit?: number;    // الوقت المسموح للامتحان بالدقائق
}

// هذا النوع يحل محل الـ Lecture القديم ليدعم النظام الجديد
export interface LectureData {
    id: string;
    courseId: string | number;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    studentName: string;
    playlist: PlaylistItem[];
}

// ==========================================
// 4. أنواع العروض (Offer Types)
// ==========================================
export interface Offer {
    id: string | number;
    img: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string; // تمت إضافتها لتطابق الداتا عندك
    discountPercentage?: number;
}

// ==========================================
// 5. أنواع الامتحانات (Exam Types)
// ==========================================
export type QuestionType = 'mcq' | 'essay';

export interface Question {
    id: number;
    type: QuestionType;
    textAr: string;
    textEn: string;
    optionsAr?: string[];
    optionsEn?: string[];
    correctAns: number | string;
    explanationAr: string;
    explanationEn: string;
}

export interface Exam {
    id: string;
    titleAr: string;
    titleEn: string;
    lectureAr: string;
    lectureEn: string;
    timeLimit: number; // بالدقائق
    questions: Question[];
}

// ==========================================
// 6. أنواع الواجبات (Homework Types)
// ==========================================
export type HwQuestionType = 'mcq' | 'tf' | 'essay';

export interface HwQuestion {
    id: string;
    type: HwQuestionType;
    score: number;
    textAr: string;
    textEn: string;
    optionsAr?: string[];
    optionsEn?: string[];
    correctAns: string | number;
    reviewAr: string;
    reviewEn: string;
}

export interface Homework {
    id: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    isMandatory: boolean;
    totalScore: number;
    questions: HwQuestion[];
}