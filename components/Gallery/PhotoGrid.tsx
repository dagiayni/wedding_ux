'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';

const MOCK_PHOTOS = [
  { id: 1, src: '/image/photo_1_2026-04-25_21-07-26.jpg', height: 'h-64' },
  { id: 2, src: '/image/photo_2_2026-04-25_21-07-26.jpg', height: 'h-48' },
  { id: 3, src: '/image/photo_3_2026-04-25_21-07-26.jpg', height: 'h-72' },
  { id: 4, src: '/image/photo_4_2026-04-25_21-07-26.jpg', height: 'h-56' },
  { id: 5, src: '/image/photo_5_2026-04-25_21-07-26.jpg', height: 'h-64' },
  { id: 6, src: '/image/photo_6_2026-04-25_21-07-26.jpg', height: 'h-80' },
  { id: 7, src: '/image/photo_7_2026-04-25_21-07-26.jpg', height: 'h-48' },
  { id: 8, src: '/image/photo_8_2026-04-25_21-07-26.jpg', height: 'h-64' },
  { id: 9, src: '/image/photo_9_2026-04-25_21-07-26.jpg', height: 'h-56' },
  { id: 10, src: '/image/photo_10_2026-04-25_21-07-26.jpg', height: 'h-72' },
];

export const PhotoGrid: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-32 px-4 overflow-y-auto h-full hide-scrollbar bg-charcoal">
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-4xl font-serif text-gold">Memories</h2>
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-sans">Captured Moments</p>
      </div>
      
      <div className="columns-2 gap-4">
        {MOCK_PHOTOS.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            onClick={() => setSelectedPhoto(photo.src)}
            className={`mb-4 w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer ${photo.height}`}
          >
            <Image
              src={photo.src}
              alt={`Wedding Memory ${photo.id}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="text-gold" size={32} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-10 right-6 z-[210] p-3 rounded-full bg-white/10 text-white"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={28} />
            </motion.button>

            <motion.div
              layoutId={selectedPhoto}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto}
                alt="Selected Memory"
                width={1200}
                height={1600}
                className="w-full h-full object-contain"
                priority
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-gold font-serif text-xl">A Beautiful Moment</p>
                <p className="text-white/60 text-sm italic font-sans">Captured at the grand celebration</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
