'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'live', label: 'Live' },
  { id: 'bts', label: 'Behind The Scenes' },
  { id: 'wishes', label: 'Wishes' },
];

export const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-top h-16 flex items-center justify-center px-4">
      <div className="flex gap-8 relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative py-2 text-sm font-medium transition-colors duration-300 outline-none",
              activeTab === tab.id ? "text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" : "text-white/60 hover:text-white drop-shadow-md"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold shadow-[0_0_10px_#D4AF37]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
