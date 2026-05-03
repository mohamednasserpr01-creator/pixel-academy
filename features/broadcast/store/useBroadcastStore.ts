import { create } from 'zustand';
import { CampaignState, AudienceType, MsgType, SmartCondition } from '../types';

interface BroadcastStore extends CampaignState {
    setStep: (step: 1 | 2 | 3 | 4) => void;
    updateField: <K extends keyof CampaignState>(field: K, value: CampaignState[K]) => void;
    resetCampaign: () => void;
}

const initialState: CampaignState = {
    step: 1,
    targetStage: 'all',
    targetMajor: 'all',
    targetAudience: 'students',
    condition: 'all',
    targetCount: 0,
    msgType: 'whatsapp',
    messageBody: '',
    senderPhone: '',
    delaySeconds: 5,
    isScheduled: false,
    scheduleDate: '',
    logs: [], // 🚀 تم إضافة مصفوفة السجل هنا
};

export const useBroadcastStore = create<BroadcastStore>((set) => ({
    ...initialState,
    
    // لتغيير الخطوة الحالية في المعالج (Wizard)
    setStep: (step) => set({ step }),
    
    // دالة سحرية لتحديث أي حقل في الحملة بكلمة واحدة
    updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
    
    // تصفير الحملة للبدء من جديد
    resetCampaign: () => set(initialState),
}));