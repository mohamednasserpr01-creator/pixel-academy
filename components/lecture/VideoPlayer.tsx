import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
    return (
        <div className="video-container" style={{ width: '100%', background: '#000', borderRadius: '15px', overflow: 'hidden', aspectRatio: '16/9' }}>
            {/* هنا هتحط مشغل الفيديو بتاعك (زي video tag العادي أو مكتبة زي ReactPlayer) */}
            <video 
                controls 
                controlsList="nodownload" // عشان نمنع التحميل المباشر
                style={{ width: '100%', height: '100%' }}
                src={videoUrl}
            >
                متصفحك لا يدعم تشغيل الفيديو.
            </video>
        </div>
    );
}