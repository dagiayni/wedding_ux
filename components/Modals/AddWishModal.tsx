'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Send, CheckCircle2, RefreshCw, Info } from 'lucide-react';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWish: (wish: { userName: string, description: string, videoUrl: string }) => void;
}

export const AddWishModal: React.FC<AddWishModalProps> = ({ isOpen, onClose, onAddWish }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setIsFullscreenPreview(false);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !description) return;

    onAddWish({
      userName: userName.toLowerCase().replace(/\s+/g, '_'),
      description: description,
      videoUrl: previewUrl || '/video/video_2026-04-25_21-07-26.mp4'
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setUserName('');
      setDescription('');
      setPreviewUrl(null);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="add-wish-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/95 backdrop-blur-sm px-0 pb-0"
        >
          <motion.div
            key="add-wish-modal-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-lg bg-charcoal rounded-t-[40px] border-t border-white/10 shadow-2xl relative overflow-hidden max-h-[95dvh] flex flex-col"
          >
            {isSubmitted ? (
              <div className="h-full py-20 flex flex-col items-center justify-center text-center gap-6 px-8 font-sans">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gold">
                  <CheckCircle2 size={100} strokeWidth={1} />
                </motion.div>
                <h2 className="text-3xl font-serif text-gold">Wish Received</h2>
                <p className="text-white/40 italic">Your message has been added to the celebration.</p>
              </div>
            ) : (
              <div className="h-full flex flex-col p-6 pt-10 overflow-y-auto hide-scrollbar">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-50">
                  <X size={28} />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="text-center mb-1">
                    <h2 className="text-2xl font-serif text-gold mb-1">Share Your Joy</h2>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans">Eternal Moments</p>
                  </div>

                  {/* Guidance Note */}
                  <div className="bg-gold/10 border border-gold/20 rounded-2xl p-4 flex gap-3 items-start">
                    <Info className="text-gold shrink-0 mt-0.5" size={18} />
                    <p className="text-white/70 text-[11px] leading-relaxed font-sans">
                      <span className="text-gold font-bold block mb-0.5">Make it personal!</span>
                      Capture a video of yourself sharing your warmest wishes. Your message will be part of the couple&apos;s eternal memory wall.
                    </p>
                  </div>

                  {/* Always Visible Inputs */}
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 font-sans text-base outline-none transition-all"
                    />
                    <textarea 
                      placeholder="Your Message..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 resize-none h-24 font-sans text-base outline-none transition-all"
                    />
                  </div>

                  {/* Upload Section or Preview */}
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative w-[70%] aspect-[9/16] bg-black rounded-[30px] overflow-hidden border-2 border-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.2)] mx-auto group">
                        <video 
                          src={previewUrl} 
                          className="w-full h-full object-cover" 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <button 
                          type="button"
                          onClick={() => setPreviewUrl(null)}
                          className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full text-white border border-white/20 active:scale-90 transition-all z-20"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <input 
                          type="file" 
                          accept="video/*" 
                          ref={galleryInputRef} 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                        <button 
                          type="button" 
                          onClick={() => galleryInputRef.current?.click()} 
                          className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-[25px] bg-white/5 border-2 border-dashed border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group"
                        >
                          <div className="p-3 rounded-full bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <span className="block text-xs font-bold uppercase tracking-widest text-white/80">Select Your Video</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest">From Camera or Gallery</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gold text-charcoal font-bold py-4 rounded-[20px] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.4)] active:scale-95 transition-all text-base mt-2"
                  >
                    <Send size={18} />
                    <span className="uppercase tracking-widest">SEND WISH</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
