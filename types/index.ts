// تعريف شكل بيانات الكورس
export interface Course {
    id: number;
    img: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
}

// تعريف شكل بيانات العروض
export interface Offer {
    id: number;
    img: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
}

// تعريف شكل بيانات الخدمات
export interface Service {
    icon: string;
    titleAr: string;
    titleEn: string;
}

// تعريف شكل رسائل الشات
export interface ChatMessage {
    id: number;
    sender: 'bot' | 'user';
    text: string;
}