// FILE: lib/api/endpoints/broadcast.ts
import { fetchAPI } from '../client'; 

export interface CampaignPayload {
  title?: string;
  message: string;
  target: { stage?: string; major?: string; condition?: string; };
  type: "whatsapp" | "in_app";
}

export const broadcastApi = {
    sendCampaign: async (data: CampaignPayload) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 🚀 السحر هنا: محاكاة الباك إند لما يبعت إشعار حقيقي للطلاب!
                if (data.type === 'in_app') {
                    const saved = localStorage.getItem('pixel_notifications');
                    const notifications = saved ? JSON.parse(saved) : [];
                    
                    const newNotification = {
                        id: Date.now().toString(),
                        title: data.title || 'إشعار إداري جديد 📢',
                        body: data.message,
                        createdAt: 'الآن',
                        isRead: false,
                        type: 'info'
                    };
                    
                    // حفظ الإشعار في قاعدة بيانات الطالب
                    localStorage.setItem('pixel_notifications', JSON.stringify([newNotification, ...notifications]));
                    
                    // إطلاق إشارة (Event) عشان جرس الطالب يحس بيها فوراً (محاكاة للـ WebSockets)
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('pixel_new_notification'));
                    }
                }

                resolve({ campaignId: `CAMP-${Date.now()}`, status: "queued" });
            }, 1000);
        });
    },

    getCampaignStatus: async (id: string, currentProgress: number, targetCount: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProgress = Math.min(currentProgress + Math.floor(Math.random() * 5) + 1, targetCount);
                const isSuccess = Math.random() > 0.1;
                resolve({
                    progress: newProgress,
                    sent: isSuccess ? 1 : 0,
                    failed: isSuccess ? 0 : 1,
                    logs: [{
                        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
                        phone: `01${Math.floor(Math.random() * 900000000)}`,
                        status: isSuccess ? 'success' : 'fail' as 'success'|'fail',
                        reason: isSuccess ? undefined : 'حساب الطالب غير مفعل'
                    }]
                });
            }, 800);
        });
    }
};