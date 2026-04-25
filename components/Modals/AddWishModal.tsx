'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Send, CheckCircle2, Circle, StopCircle, RefreshCw } from 'lucide-react';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWish: (wish: { userName: string, description: string, videoUrl: string }) => void;
}

export const AddWishModal: React.FC<AddWishModalProps> = ({ isOpen, onClose, onAddWish }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Camera states
  const [showPreview, setShowPreview] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
      setStream(mediaStream);
      setShowPreview(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowPreview(false);
    setIsRecording(false);
  };

  const startRecording = () => {
    if (!stream) return;
    
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      setRecordedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
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
      setRecordedBlob(null);
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
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gold">
                  <CheckCircle2 size={80} strokeWidth={1} />
                </motion.div>
                <h2 className="text-2xl font-serif text-gold">Wish Sent!</h2>
                <p className="text-white/40 italic">Your message will appear in the live feed shortly.</p>
              </div>
            ) : showPreview ? (
              <div className="flex flex-col gap-6">
                <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                  <video 
                    ref={videoPreviewRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]" 
                  />
                  
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                      <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                          {isRecording ? 'Recording' : 'Ready'}
                        </span>
                      </div>
                      <button onClick={stopCamera} className="p-2 rounded-full bg-black/40 text-white">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex justify-center">
                      {!isRecording ? (
                        <button 
                          onClick={startRecording}
                          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group transition-all"
                        >
                          <div className="w-16 h-16 rounded-full bg-red-500 group-hover:scale-90 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                        </button>
                      ) : (
                        <button 
                          onClick={stopRecording}
                          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
                        >
                          <StopCircle className="text-red-500" size={60} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-center text-white/40 text-xs italic">Record a short message for the couple</p>
              </div>
            ) : (
              <>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white">
                  <X size={24} />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-serif text-gold mb-1">Share Your Joy</h2>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Add to the Eternal Story</p>
                  </div>

                  {previewUrl && (
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gold/30">
                      <video src={previewUrl} className="w-full h-full object-cover" controls />
                      <button 
                        type="button"
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50"
                    />
                    <textarea 
                      placeholder="Your Message..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 resize-none h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={startCamera}
                      className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group"
                    >
                      <Camera className="text-gold group-hover:scale-110" size={28} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Live Record</span>
                    </button>

                    <input type="file" accept="video/*,image/*" ref={galleryInputRef} className="hidden" />
                    <button 
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group"
                    >
                      <Upload className="text-gold group-hover:scale-110" size={28} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">From Gallery</span>
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-charcoal font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all mt-2"
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
