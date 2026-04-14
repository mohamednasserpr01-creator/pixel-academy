// أنواع المستخدمين
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    avatar?: string;
    token?: string;
}

// أنواع الكورسات
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

// أنواع المحاضرات
export interface Lecture {
    id: string;
    courseId: string | number;
    titleAr: string;
    titleEn: string;
    videoUrl: string;
    duration: string;
    isLocked: boolean;
    attachments?: { id: string; name: string; url: string }[];
}

// أنواع العروض
export interface Offer {
    id: string | number;
    img: string;
    titleAr: string;
    titleEn: string;
    discountPercentage: number;
}