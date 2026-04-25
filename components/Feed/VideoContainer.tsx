'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoContainerProps {
  id: number;
  userName: string;
  description: string;
  videoUrl: string;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({ userName, description, videoUrl }) => {
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Interaction states
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isPaused) {
            videoRef.current?.play().catch(e => {
              console.log("Auto-play blocked");
              setIsMuted(true);
              if (videoRef.current) videoRef.current.muted = true;
            });
          }
        } else {
          videoRef.current?.pause();
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPaused]);

  const handleTap = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected: Clear the single tap timer
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      
      // Execute Like
      setLiked(true);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
      lastTapRef.current = 0; // Reset to avoid triple tap issues
    } else {
      // First tap or single tap
      lastTapRef.current = now;
      
      // Start a timer for single tap action
      clickTimer.current = setTimeout(() => {
        // Execute Pause/Play
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPaused(false);
          } else {
            videoRef.current.pause();
            setIsPaused(true);
          }
        }
        clickTimer.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black snap-section overflow-hidden cursor-pointer"
      onClick={handleTap}
    >
      {/* Video Content */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
      />

      {/* Heart Animation Overlay (Double Tap) */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <Heart fill="#D4AF37" color="#D4AF37" size={120} className="drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Icon Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="bg-black/20 backdrop-blur-md p-8 rounded-full text-white/80">
              <Play size={64} fill="currentColor" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Overlay for UI visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Interactions Overlay */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all duration-300 ${liked ? 'text-gold scale-110' : 'text-white group-hover:text-gold'}`}>
            <Heart fill={liked ? "currentColor" : "none"} size={28} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md text-white">1.2k</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md transition-all duration-300 text-white group-hover:text-gold">
            <MessageCircle size={28} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md text-white">48</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md transition-all duration-300 text-white group-hover:text-gold">
            <Share2 size={28} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md text-white">Share</span>
        </button>
        
        <button onClick={toggleMute} className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md transition-all duration-300 text-white group-hover:text-gold">
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </div>
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute left-0 right-16 bottom-24 p-6 z-10 pointer-events-none">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2 drop-shadow-lg text-white">
          @{userName}
          <span className="px-2 py-0.5 bg-gold/20 text-gold text-[10px] rounded border border-gold/30 backdrop-blur-sm">GUEST</span>
        </h3>
        <p className="text-sm text-white drop-shadow-lg line-clamp-2 mb-4 leading-relaxed font-sans">
          {description}
        </p>
        <div className="flex items-center gap-2 text-white/80 drop-shadow-md">
          <Music size={14} className="animate-pulse" />
          <span className="text-xs italic truncate font-sans">Original Sound - Romantic Wedding Mix</span>
        </div>
      </div>
    </div>
  );
};
