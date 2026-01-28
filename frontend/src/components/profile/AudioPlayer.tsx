'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
    src: string;
    title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => setCurrentTime(audio.currentTime);

        // Events
        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !audioRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pos * duration;
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full bg-black/40 rounded-2xl border border-white/5 p-6 backdrop-blur-md group shadow-2xl">
            <audio ref={audioRef} src={src} preload="metadata" />

            <div className="flex items-center gap-6">
                {/* Control Button */}
                <button
                    onClick={togglePlay}
                    className="size-16 rounded-full bg-[#ff8c00] flex items-center justify-center text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,140,0,0.3)] group-hover:shadow-[0_0_30px_rgba(255,140,0,0.5)]"
                >
                    {isPlaying ? <Pause className="size-7 fill-black" /> : <Play className="size-7 fill-black ml-1" />}
                </button>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#ff8c00] mb-0.5">Now Playing</p>
                            <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{title}</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-white/80">{formatTime(currentTime)}</span>
                            <span className="text-xs font-mono text-white/30 mx-1">/</span>
                            <span className="text-xs font-mono text-white/40">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                        ref={progressRef}
                        onClick={handleProgressChange}
                        className="h-2 w-full bg-white/5 rounded-full cursor-pointer relative group/progress overflow-hidden"
                    >
                        <div
                            className="h-full bg-gradient-to-r from-[#ff8c00] to-orange-400 rounded-full relative z-10"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Secondary Controls */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 text-[#bcad9a] hover:text-white transition-colors"
                    >
                        {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                    </button>
                    <button className="p-2 text-[#bcad9a] hover:text-white transition-colors">
                        <Download className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
