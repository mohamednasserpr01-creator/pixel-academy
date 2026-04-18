// FILE: components/lecture/VideoPlayer/VideoPlayer.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaPlay, FaPause, FaBackward, FaForward, FaTachometerAlt, FaVolumeUp, FaExpand, FaEye, FaExclamationTriangle, FaLock, FaHeadset } from 'react-icons/fa';

import { useToast } from '../../../context/ToastContext'; 
import { useSettings } from '../../../context/SettingsContext'; 
import { trackingService } from '../../../services/trackingService';
import { PlaylistItem } from '../../../types';
import { Button } from '../../ui/Button'; // استدعاء زر المنصة الأساسي

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

    const currentUserId = studentName || "UNKNOWN_USER";

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
    const [durationStr, setDurationStr] = useState("00:00");
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [wmPos, setWmPos] = useState({ top: '50%', left: '50%' });

    // 💡 بيانات وهمية للمشاهدات (بعدين هتجيلك من الباك إند)
    const maxViews = 3; 
    const remainingViews = 0; // 👈 خليناها 0 هنا عشان تشوف شكل شاشة القفل! (غيرها لـ 2 عشان تشوف الفيديو)

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
        if (videoRef.current && remainingViews > 0) {
            setIsPlaying(false); 
            setProgress(0); 
            setCurrentTimeStr("00:00");
            setShowSpeedMenu(false);
            videoRef.current.load();
        }
    }, [activeItem, remainingViews]);

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

    const togglePlay = () => { 
        if (videoRef.current) { 
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
                trackingService.track({
                    userId: currentUserId,
                    lectureId: activeItem.id,
                    eventType: 'video_play',
                    eventData: { currentTime: videoRef.current.currentTime }
                });
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
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

    // 💡 الضربة القاضية: لو المشاهدات خلصت، اعرض شاشة القفل ومتعرضش الفيديو خالص!
    if (remainingViews <= 0) {
        return (
            <div style={{ 
                height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                background: 'var(--card)', borderRadius: '20px', border: '2px solid var(--danger)', 
                textAlign: 'center', padding: '30px', marginBottom: '20px' 
            }}>
                <FaLock style={{ fontSize: '4.5rem', color: 'var(--danger)', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '15px', color: 'var(--txt)', fontSize: '1.8rem' }}>
                    {isAr ? 'انتهت مشاهداتك لهذا الفيديو' : 'Views Exhausted'}
                </h2>
                <p style={{ opacity: 0.8, color: 'var(--txt-mut)', marginBottom: '25px', fontSize: '1.1rem', maxWidth: '500px' }}>
                    {isAr 
                        ? 'لقد استنفدت الحد الأقصى لعدد مرات مشاهدة هذه الحصة. لزيادة عدد المشاهدات وإعادة فتح الفيديو، يرجى التواصل مع الدعم الفني الخاص بالمنصة.' 
                        : 'You have reached the maximum number of views for this lecture. To increase views and unlock the video, please contact the platform\'s technical support.'}
                </p>
                <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <Button icon={<FaHeadset />} style={{ backgroundColor: 'var(--danger)', color: 'white' }}>
                        {isAr ? 'تواصل مع الدعم الفني الآن' : 'Contact Support Now'}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {/* 🎬 مشغل الفيديو */}
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

            {/* 💡 شريط عدد المشاهدات تحت الفيديو */}
            <div style={{
                background: remainingViews <= 1 ? 'rgba(231, 76, 60, 0.1)' : 'var(--card)',
                border: `1px solid ${remainingViews <= 1 ? 'var(--danger)' : 'rgba(108, 92, 231, 0.2)'}`,
                padding: '15px 20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEye style={{ color: remainingViews <= 1 ? 'var(--danger)' : 'var(--p-purple)', fontSize: '1.2rem' }} />
                    <span style={{ fontWeight: 900, color: 'var(--txt)', fontSize: '1rem' }}>
                        {isAr ? 'عدد المشاهدات المتبقية:' : 'Remaining Views:'}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {remainingViews <= 1 && (
                        <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaExclamationTriangle />
                            {isAr ? 'تنبيه: هذه المشاهدة الأخيرة!' : 'Warning: Last view!'}
                        </span>
                    )}
                    <div style={{ 
                        background: 'var(--bg)', 
                        padding: '5px 15px', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontWeight: 900,
                        color: remainingViews <= 1 ? 'var(--danger)' : 'var(--success)',
                        fontSize: '1.1rem'
                    }}>
                        {remainingViews} / {maxViews}
                    </div>
                </div>
            </div>
        </div>
    );
}