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
    targetId?: string; // ID الامتحان أو الواجب المطلوب
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
    
    // إعدادات البزنس لوجيك المشتركة
    prerequisite?: Prerequisite;
    viewsLimit?: number;       // للفيديوهات
    
    // 🚀 إعدادات الامتحانات
    passScore?: number;           // درجة النجاح
    issueCertificate?: boolean;   // هل يصدر شهادة؟
    certificateMinScore?: number; // الدرجة المطلوبة لإصدار الشهادة
    requireRetake?: boolean;      // تفعيل امتحان الإعادة؟
    retakeThreshold?: number;     // النسبة التي تسمح بإعادة الامتحان
    altExamId?: string;           // ID الامتحان البديل (امتحان الإعادة)
    showAnswers?: boolean;        // السماح برؤية الإجابات للطالب
    isRetakeOnly?: boolean;       // 🚀 (الجديد) تخصيص كـ "امتحان إعادة فقط" (يُخفى عن الطالب افتراضياً)
}

// ==========================================
// 💡 واجهة المحاضرة
// ==========================================
export interface Lecture {
    id: string;
    title: string;
    items: LectureItem[];
    requirePrevious?: boolean;    // إجبار الطالب على اجتياز المحاضرة السابقة
}

// ==========================================
// 💡 واجهة الأفعال (Actions) للـ Reducer
// ==========================================
export type CurriculumAction =
    | { type: 'ADD_LECTURE'; payload: { title: string } }
    | { type: 'UPDATE_LECTURE'; payload: { lectureId: string; updates: Partial<Lecture> } }
    | { type: 'REMOVE_LECTURE'; payload: { lectureId: string } }
    | { type: 'ADD_ITEM'; payload: { lectureId: string; item: LectureItem } }
    | { type: 'UPDATE_ITEM'; payload: { lectureId: string; itemId: string; updates: Partial<LectureItem> } }
    | { type: 'REMOVE_ITEM'; payload: { lectureId: string; itemId: string } }
    | { type: 'REORDER_ITEMS'; payload: { lectureId: string; oldIndex: number; newIndex: number } }
    | { type: 'MOVE_ITEM_BETWEEN_LECTURES'; payload: { sourceLectureId: string; targetLectureId: string; itemId: string; newIndex: number } }
    | { type: 'SET_CURRICULUM'; payload: Lecture[] };