// ==========================================
// 💡 أنواع المحتوى وشروط الفتح
// ==========================================
export type ContentType = 'lesson' | 'homework' | 'homework_lesson' | 'exam';

export type PrerequisiteType = 'none' | 'prev' | 'specific_exam' | 'specific_hw';

// ==========================================
// 💡 واجهة إعدادات شرط الفتح
// ==========================================
export interface Prerequisite {
    type: PrerequisiteType;
    targetId?: string; // ID الامتحان أو الواجب المطلوب (لو النوع specific)
}

// ==========================================
// 💡 واجهة عنصر المحتوى (الحصة/الامتحان)
// ==========================================
export interface LectureItem {
    id: string;
    type: ContentType;
    title: string;
    
    // إعدادات العرض (مرفقات)
    hasPdf?: boolean;
    hasRef?: boolean;
    
    // إعدادات البزنس لوجيك
    prerequisite?: Prerequisite;
    viewsLimit?: number;       // للفيديوهات
    passScore?: number;        // للامتحانات
    altExamId?: string;        // الامتحان البديل للرسوب
    issueCertificate?: boolean;// شهادة النجاح
}

// ==========================================
// 💡 واجهة المحاضرة
// ==========================================
export interface Lecture {
    id: string;
    title: string;
    items: LectureItem[];
}

// ==========================================
// 💡 واجهة الأفعال (Actions) للـ Reducer
// ==========================================
export type CurriculumAction =
    | { type: 'ADD_LECTURE'; payload: { title: string } }
    | { type: 'UPDATE_LECTURE_TITLE'; payload: { lectureId: string; title: string } }
    | { type: 'REMOVE_LECTURE'; payload: { lectureId: string } }
    | { type: 'ADD_ITEM'; payload: { lectureId: string; item: LectureItem } }
    | { type: 'UPDATE_ITEM'; payload: { lectureId: string; itemId: string; updates: Partial<LectureItem> } }
    | { type: 'REMOVE_ITEM'; payload: { lectureId: string; itemId: string } }
    // 🚀 للـ Drag & Drop جوه نفس المحاضرة
    | { type: 'REORDER_ITEMS'; payload: { lectureId: string; oldIndex: number; newIndex: number } }
    // 🚀 للـ Drag & Drop بين المحاضرات المختلفة
    | { type: 'MOVE_ITEM_BETWEEN_LECTURES'; payload: { sourceLectureId: string; targetLectureId: string; itemId: string; newIndex: number } }
    | { type: 'SET_CURRICULUM'; payload: Lecture[] };