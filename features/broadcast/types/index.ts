export type AudienceType = 'students' | 'parents' | 'both';
export type MsgType = 'whatsapp' | 'in_app';
export type SmartCondition = 'all' | 'missed_exam' | 'score_below_50' | 'absent_3_days';

export interface CampaignState {
    // 1. Wizard Step
    step: 1 | 2 | 3 | 4;
    
    // 2. Smart Targeting (الاستهداف الذكي)
    targetStage: string;
    targetMajor: string;
    targetAudience: AudienceType;
    condition: SmartCondition;
    targetCount: number;

    // 3. Message Details
    msgType: MsgType;
    messageBody: string;
    senderPhone: string;
    delaySeconds: number;
    
    // 4. Scheduling (الجدولة)
    isScheduled: boolean;
    scheduleDate: string;

    // 5. Engine Logs (سجل الإرسال اللي هيربط المحرك بالتقرير) 🚀
    logs: any[];
}