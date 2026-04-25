'use client';

import React, { useState } from 'react';
import { TopNav } from '@/components/Nav/TopNav';
import { BottomNav } from '@/components/Nav/BottomNav';
import { ReelView } from '@/components/Feed/ReelView';
import { PhotoGrid } from '@/components/Gallery/PhotoGrid';
import { AddWishModal } from '@/components/Modals/AddWishModal';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState('live');
  const [activeView, setActiveView] = useState<'feed' | 'gallery'>('feed');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Track if any modal is active to pause background videos
  const isGlobalPaused = isAddModalOpen;
  
  // Track dynamically added wishes
  const [newWishes, setNewWishes] = useState<any[]>([]);

  const handleAddWish = (wish: any) => {
    // Add new wish to the top of the list
    setNewWishes([
      { id: Date.now(), ...wish },
      ...newWishes
    ]);
  };

  return (
    <main className="relative h-[100dvh] w-full bg-charcoal text-white overflow-hidden selection:bg-gold/30 selection:text-gold">
      {/* Top Navigation - Only visible in feed view */}
      <AnimatePresence mode="wait">
        {activeView === 'feed' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="h-full w-full">
        {activeView === 'feed' ? (
          <ReelView extraVideos={newWishes} isGlobalPaused={isGlobalPaused} />
        ) : (
          <PhotoGrid />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onAddClick={() => setIsAddModalOpen(true)} 
      />

      {/* Modals */}
      <AddWishModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddWish={handleAddWish}
      />
      
      {/* Global Background Accents */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />
    </main>
  );
}
