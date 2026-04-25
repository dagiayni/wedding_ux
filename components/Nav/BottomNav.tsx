'use client';

import React from 'react';
import { Home, Grid, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeView: 'feed' | 'gallery';
  setActiveView: (view: 'feed' | 'gallery') => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass h-20 flex items-center justify-around px-6 pb-4 border-t border-white/5">
      <button
        onClick={() => setActiveView('feed')}
        className={cn(
          "flex flex-col items-center gap-1 transition-all duration-300 active:scale-90",
          activeView === 'feed' ? "text-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]" : "text-white/40 hover:text-white"
        )}
      >
        <Home size={24} />
        <span className="text-[10px] uppercase tracking-widest font-semibold">Feed</span>
      </button>

      <div className="relative -mt-10">
        <button
          onClick={onAddClick}
          className="w-16 h-16 bg-gold text-charcoal rounded-full flex items-center justify-center gold-glow transition-transform active:scale-95 shadow-xl"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      </div>

      <button
        onClick={() => setActiveView('gallery')}
        className={cn(
          "flex flex-col items-center gap-1 transition-all duration-300 active:scale-90",
          activeView === 'gallery' ? "text-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]" : "text-white/40 hover:text-white"
        )}
      >
        <Grid size={24} />
        <span className="text-[10px] uppercase tracking-widest font-semibold">Gallery</span>
      </button>
    </nav>
  );
};
