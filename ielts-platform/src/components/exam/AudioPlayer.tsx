"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  allowPause?: boolean;
  allowSeek?: boolean;
  allowReplay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export function AudioPlayer({
  src,
  autoPlay = false,
  allowPause = false,
  allowSeek = false,
  allowReplay = false,
  onEnded,
  onTimeUpdate,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      onEnded?.();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, onTimeUpdate]);

  useEffect(() => {
    if (autoPlay && isLoaded && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [autoPlay, isLoaded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasEnded && !allowReplay) return;

    if (isPlaying) {
      if (!allowPause) return;
      audio.pause();
    } else {
      if (hasEnded && allowReplay) {
        audio.currentTime = 0;
        setHasEnded(false);
      }
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowSeek) return;
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("bg-brand-navy-50 rounded-lg p-3 flex items-center gap-3", className)}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        disabled={(!allowPause && isPlaying) || (hasEnded && !allowReplay)}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full transition-colors",
          isPlaying
            ? "bg-brand-navy-900 text-white"
            : "bg-brand-red-500 text-white hover:bg-brand-red-600",
          (!allowPause && isPlaying) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Progress Bar */}
      <div className="flex-1">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-brand-navy-900 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          {allowSeek && (
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{formatTime(Math.floor(currentTime))}</span>
          <span className="text-xs text-gray-500">{formatTime(Math.floor(duration))}</span>
        </div>
      </div>

      {/* Volume */}
      <button
        onClick={() => {
          setIsMuted(!isMuted);
          if (audioRef.current) audioRef.current.muted = !isMuted;
        }}
        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-gray-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Status */}
      {isPlaying && (
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-red-600">LIVE</span>
        </div>
      )}
    </div>
  );
}
