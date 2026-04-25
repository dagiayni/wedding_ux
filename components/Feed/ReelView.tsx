'use client';

import React from 'react';
import { VideoContainer } from './VideoContainer';

const DEFAULT_VIDEOS = [
  { 
    id: 1, 
    userName: 'sarah_wed', 
    description: 'The most beautiful first dance! ✨ #TheSmithsWedding', 
    videoUrl: '/video/video_2026-04-25_21-07-26.mp4' 
  },
  { 
    id: 2, 
    userName: 'bestman_mike', 
    description: 'BTS of the wedding prep. It was chaotic but fun! 😂', 
    videoUrl: '/video/video_2026-04-25_21-07-26 (2).mp4' 
  },
  { 
    id: 3, 
    userName: 'love_stories', 
    description: 'Wishing you both a lifetime of happiness! ❤️ #Anniversary', 
    videoUrl: '/video/video_2026-04-25_21-07-26 (3).mp4' 
  },
  { 
    id: 4, 
    userName: 'travel_couple', 
    description: 'Our journey together has just begun. ✈️🌍', 
    videoUrl: '/video/video_2026-04-25_21-07-26 (4).mp4' 
  },
];

interface ReelViewProps {
  extraVideos?: any[];
  isGlobalPaused?: boolean;
}

export const ReelView: React.FC<ReelViewProps> = ({ extraVideos = [], isGlobalPaused = false }) => {
  // Combine default videos with user-submitted ones
  const allVideos = [...extraVideos, ...DEFAULT_VIDEOS];

  return (
    <div className="w-full h-full snap-container hide-scrollbar bg-black">
      {allVideos.map((video, index) => (
        <VideoContainer 
          key={`video-${video.id}-${index}`} 
          {...video} 
          index={index}
          isGlobalPaused={isGlobalPaused} 
        />
      ))}
    </div>
  );
};
