// FILE: types/Lecture.ts

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

export interface LectureData {
    id: string;
    courseId: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    studentName: string;
    playlist: PlaylistItem[];
}