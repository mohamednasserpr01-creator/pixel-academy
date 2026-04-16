// FILE: components/lecture/VideoPlayer/VideoPlayer.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaBackward, FaForward, FaTachometerAlt, FaVolumeUp, FaExpand } from 'react-icons/fa';

import { useToast } from '../../../context/ToastContext'; // 💡 استدعاء الإشعارات
import { useSettings } from '../../../context/SettingsContext'; // 💡 استدعاء الإعدادات للغة

export default function VideoPlayer({ activeItem, studentName }: { activeItem: any, studentName: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    
    const { showToast } = useToast();
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
    const [durationStr, setDurationStr] = useState("00:00");
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [wmPos, setWmPos] = useState({ top: '50%', left: '50%' });

    // 💡 تحريك العلامة المائية كل 4 ثواني لحماية الفيديو
    useEffect(() => {
        const wmInterval = setInterval(() => {
            setWmPos({ 
                top: `${Math.floor(Math.random() * 80)}%`, 
                left: `${Math.floor(Math.random() * 80)}%` 
            });
        }, 4000);
        return () => clearInterval(wmInterval);
    }, []);

    // 💡 إعادة ضبط المشغل لما الطالب يختار فيديو جديد
    useEffect(() => {
        if (videoRef.current) {
            setIsPlaying(false); 
            setProgress(0); 
            setCurrentTimeStr("00:00");
            setShowSpeedMenu(false);
            videoRef.current.load();
        }
    }, [activeItem]);

    // 💡 إغلاق قائمة السرعة لو الطالب داس في أي مكان بره
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
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); 
            setIsPlaying(!videoRef.current.paused); 
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

    // 💡 إشعار ذكي عند انتهاء الفيديو
    const handleVideoEnded = () => {
        setIsPlaying(false);
        showToast(isAr ? 'تم إنجاز الفيديو بنجاح! 🎓' : 'Video completed successfully! 🎓', 'success');
    };

    const skipTime = (amount: number) => { 
        if (videoRef.current) videoRef.current.currentTime += amount; 
    };

    // 💡 إشعار بتغيير السرعة
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
            videoRef.current.currentTime = (clickX / area.offsetWidth) * videoRef.current.duration; 
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
                onEnded={handleVideoEnded} /* 💡 تفعيل حدث الانتهاء */
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