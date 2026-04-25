'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Send, CheckCircle2 } from 'lucide-react';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWish: (wish: { userName: string, description: string, videoUrl: string }) => void;
}

export const AddWishModal: React.FC<AddWishModalProps> = ({ isOpen, onClose, onAddWish }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !description) return;

    // Simulate adding a wish (using a placeholder video for now)
    onAddWish({
      userName: userName.toLowerCase().replace(/\s+/g, '_'),
      description: description,
      videoUrl: '/video/video_2026-04-25_21-07-26.mp4' // Placeholder for real upload
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setUserName('');
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-sm px-4 pb-10"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-charcoal rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden"
          >
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-gold"
                >
                  <CheckCircle2 size={80} strokeWidth={1} />
                </motion.div>
                <h2 className="text-2xl font-serif text-gold">Wish Sent!</h2>
                <p className="text-white/40 italic">Your message will appear in the live feed shortly.</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-serif text-gold mb-1 text-center">Share Your Joy</h2>
                    <p className="text-white/30 text-xs italic text-center uppercase tracking-[0.2em]">Add to the Eternal Story</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors font-sans"
                    />
                    
                    <textarea 
                      placeholder="Your Message for the Couple..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors resize-none h-24 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="file" 
                      accept="video/*,image/*" 
                      capture="environment" 
                      ref={cameraInputRef}
                      className="hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group"
                    >
                      <Camera className="text-gold group-hover:scale-110 transition-transform" size={28} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Camera</span>
                    </button>

                    <input 
                      type="file" 
                      accept="video/*,image/*" 
                      ref={galleryInputRef}
                      className="hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group"
                    >
                      <Upload className="text-gold group-hover:scale-110 transition-transform" size={28} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Upload</span>
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-charcoal font-bold py-4 rounded-xl flex items-center justify-center gap-2 gold-glow active:scale-95 transition-all mt-2"
                  >
                    <Send size={18} />
                    <span className="uppercase tracking-widest text-sm">SEND WISH</span>
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
