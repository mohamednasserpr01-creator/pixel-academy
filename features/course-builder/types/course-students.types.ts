export type TrackingStatus = 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed' | 'submitted' | 'not_submitted';
export type ItemType = 'lesson' | 'exam' | 'homework' | 'makeup_exam';

export interface ItemTrackingRecord {
    itemId: string;
    type: ItemType;
    status: TrackingStatus;
    score?: number;
    maxScore?: number;
    watchPercentage?: number;
    viewsCount?: number;
    lastAccessedAt?: string;
}

// 🚀 أنواع الاشتراك الدقيقة
export type SubscriptionType = 'manual_teacher' | 'wallet' | 'offer_code' | 'course_code' | 'lecture_code';

export interface EnrolledStudent {
    id: string;
    serialNumber: string;
    name: string;
    phone: string;
    parentPhone: string;
    governorate: string;
    address: string;
    enrolledAt: string;
    
    paymentMethod: SubscriptionType; // 🚀 اتحدثت
    paymentDetails: string;
    
    isBlocked: boolean;
    progress: number;
    accessibleLectures: string[]; 
    trackingDetails: ItemTrackingRecord[];
}