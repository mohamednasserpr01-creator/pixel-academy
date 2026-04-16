// FILE: components/lecture/VideoPlayer/VideoPlayer.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaBackward, FaForward, FaTachometerAlt, FaVolumeUp, FaExpand } from 'react-icons/fa';

import { useToast } from '../../../context/ToastContext'; 
import { useSettings } from '../../../context/SettingsContext'; 

// 💡 1. استدعاء نظام التتبع وأنواع الداتا الصارمة
import { trackingService } from '../../../services/trackingService';
import { PlaylistItem } from '../../../types';

interface VideoPlayerProps {
    activeItem: PlaylistItem;
    studentName: string;
}

export default function VideoPlayer({ activeItem, studentName }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    
    const { showToast } = useToast();
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    // 💡 مؤقتاً هنستخدم اسم الطالب كـ ID لحد ما نربط الـ Auth
    const currentUserId = studentName || "UNKNOWN_USER";

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
    const [durationStr, setDurationStr] = useState("00:00");
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [wmPos, setWmPos] = useState({ top: '50%', left: '50%' });

    useEffect(() => {
        const wmInterval = setInterval(() => {
            setWmPos({ 
                top: `${Math.floor(Math.random() * 80)}%`, 
                left: `${Math.floor(Math.random() * 80)}%` 
            });
        }, 4000);
        return () => clearInterval(wmInterval);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            setIsPlaying(false); 
            setProgress(0); 
            setCurrentTimeStr("00:00");
            setShowSpeedMenu(false);
            videoRef.current.load();
        }
    }, [activeItem]);

    useEffect(() => {
        const handleClickOutside = () => setShowSpeedMenu(false);
        if (showSpeedMenu) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [showSpeedMenu]);

    const formatTime = (sec: number) => { 
        let m = Math.floor(sec / 60); 
        let s = Math.floor(sec % 60); 
        return `${m}:${s < 10 ? '0' + s : s}`; 
    };

    // 💡 2. تتبع تشغيل وإيقاف الفيديو
    const togglePlay = () => { 
        if (videoRef.current) { 
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
                // إرسال حدث التشغيل
                trackingService.track({
                    userId: currentUserId,
                    lectureId: activeItem.id,
                    eventType: 'video_play',
                    eventData: { currentTime: videoRef.current.currentTime }
                });
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                // إرسال حدث الإيقاف المؤقت
                trackingService.track({
                    userId: currentUserId,
                    lectureId: activeItem.id,
                    eventType: 'video_pause',
                    eventData: { currentTime: videoRef.current.currentTime }
                });
            }
        } 
    };

    const handleTimeUpdate = () => { 
        if (videoRef.current && videoRef.current.duration) { 
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100); 
            setCurrentTimeStr(formatTime(videoRef.current.currentTime)); 
        } 
    };

    const handleLoadedMetadata = () => { 
        if (videoRef.current) {
            setDurationStr(formatTime(videoRef.current.duration)); 
        }
    };

    // 💡 3. تتبع انتهاء الفيديو (أهم حدث للمدرس)
    const handleVideoEnded = () => {
        setIsPlaying(false);
        showToast(isAr ? 'تم إنجاز الفيديو بنجاح! 🎓' : 'Video completed successfully! 🎓', 'success');
        
        trackingService.track({
            userId: currentUserId,
            lectureId: activeItem.id,
            eventType: 'video_complete',
            eventData: { duration: videoRef.current?.duration }
        });
    };

    // 💡 4. تتبع تقديم وتأخير الفيديو (الـ Seek)
    const skipTime = (amount: number) => { 
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
            trackingService.track({
                userId: currentUserId,
                lectureId: activeItem.id,
                eventType: 'video_seek',
                eventData: { jumpBy: amount, newTime: videoRef.current.currentTime }
            });
        }
    };

    const setSpeed = (speed: number) => { 
        if (videoRef.current) {
            videoRef.current.playbackRate = speed; 
            setShowSpeedMenu(false); 
            showToast(isAr ? `تم تغيير السرعة إلى ${speed}x` : `Playback speed set to ${speed}x`, 'info');
        }
    };

    // 💡 5. تتبع القفز بالماوس على شريط التقدم
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => { 
        const area = e.currentTarget; 
        const clickX = e.nativeEvent.offsetX; 
        if (videoRef.current) {
            const newTime = (clickX / area.offsetWidth) * videoRef.current.duration;
            videoRef.current.currentTime = newTime; 
            
            trackingService.track({
                userId: currentUserId,
                lectureId: activeItem.id,
                eventType: 'video_seek',
                eventData: { clickedOnBar: true, newTime: newTime }
            });
        }
    };

    const toggleFullScreen = () => { 
        if (!playerContainerRef.current) return; 
        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(() => {
                showToast(isAr ? 'فشل الدخول لوضع ملء الشاشة' : 'Failed to enter fullscreen', 'error');
            });
        } else {
            document.exitFullscreen(); 
        }
    };

    return (
        <div className={`pixel-player ${!isPlaying ? 'paused' : ''}`} ref={playerContainerRef} onContextMenu={e => e.preventDefault()}>
            
            <div className="watermark" style={{ top: wmPos.top, left: wmPos.left }}>{studentName}</div>
            <div className="video-cage" onClick={togglePlay}></div>
            
            <video 
                ref={videoRef} 
                src={activeItem.videoSrc} 
                poster={activeItem.poster} 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata} 
                onEnded={handleVideoEnded} 
                playsInline
            ></video>
            
            <div className="player-controls" onClick={e => e.stopPropagation()}>
                <div className="progress-area" onClick={handleProgressClick}>
                    <div className="progress-filled" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className="controls-row">
                    <div className="controls-left">
                        <button className="ctrl-btn" aria-label="Play/Pause" onClick={togglePlay}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <button className="ctrl-btn" aria-label="Backward" onClick={() => skipTime(isAr ? 10 : -10)}>
                            <FaBackward />
                        </button>
                        <button className="ctrl-btn" aria-label="Forward" onClick={() => skipTime(isAr ? -10 : 10)}>
                            <FaForward />
                        </button>
                        <div className="time-display">{currentTimeStr} / {durationStr}</div>
                    </div>
                    
                    <div className="controls-right">
                        <div className="speed-menu">
                            <button className="ctrl-btn" aria-label="Speed" onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}>
                                <FaTachometerAlt />
                            </button>
                            <div className={`menu-popup ${showSpeedMenu ? 'show' : ''}`}>
                                <button onClick={() => setSpeed(2)}>2x</button>
                                <button onClick={() => setSpeed(1.5)}>1.5x</button>
                                <button onClick={() => setSpeed(1)}>1x</button>
                            </div>
                        </div>
                        <button className="ctrl-btn" aria-label="Volume">
                            <FaVolumeUp />
                        </button>
                        <button className="ctrl-btn" aria-label="Fullscreen" onClick={toggleFullScreen}>
                            <FaExpand />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}