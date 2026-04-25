'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Send, CheckCircle2, Circle, StopCircle, RefreshCw, Loader2, Maximize2 } from 'lucide-react';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWish: (wish: { userName: string, description: string, videoUrl: string }) => void;
}

export const AddWishModal: React.FC<AddWishModalProps> = ({ isOpen, onClose, onAddWish }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [showPreview, setShowPreview] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPreview && stream && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = stream;
      videoPreviewRef.current.play().catch(err => console.error("Video play error:", err));
    }
  }, [showPreview, stream]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setIsCameraLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        }, 
        audio: true 
      });
      setStream(mediaStream);
      setShowPreview(true);
      setIsCameraLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraLoading(false);
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
    setIsCameraLoading(false);
  };

  const startRecording = () => {
    if (!stream) return;
    
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
      ? 'video/webm;codecs=vp9,opus' 
      : 'video/webm;codecs=vp8,opus';

    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
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
            className="w-full max-w-lg bg-charcoal rounded-t-[40px] border-t border-white/10 shadow-2xl relative overflow-hidden h-[90dvh]"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 px-8 font-sans">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gold">
                  <CheckCircle2 size={100} strokeWidth={1} />
                </motion.div>
                <h2 className="text-3xl font-serif text-gold">Wish Received</h2>
                <p className="text-white/40 italic">Your message has been added to the celebration.</p>
              </div>
            ) : showPreview ? (
              <div className="relative h-full w-full bg-black">
                <video 
                  ref={videoPreviewRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]" 
                />
                <div className="absolute inset-0 flex flex-col justify-between p-8 pb-12 bg-gradient-to-b from-black/40 via-transparent to-black/60">
                  <div className="flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">
                        {isRecording ? 'Recording' : 'Ready'}
                      </span>
                    </div>
                    <button onClick={stopCamera} className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center">
                      {!isRecording ? (
                        <button onClick={startRecording} className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center group active:scale-90 transition-all">
                          <div className="w-20 h-20 rounded-full bg-red-500 group-hover:scale-95 transition-transform" />
                        </button>
                      ) : (
                        <button onClick={stopRecording} className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-all">
                          <div className="w-10 h-10 bg-red-500 rounded-md" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col p-8 pt-12 overflow-y-auto hide-scrollbar">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
                  <X size={28} />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8 h-full">
                  <div className="text-center">
                    <h2 className="text-3xl font-serif text-gold mb-2">Share Your Joy</h2>
                    <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-sans">Eternal Moments</p>
                  </div>

                  {previewUrl && (
                    <div 
                      onClick={() => setIsFullscreenPreview(true)}
                      className="relative w-[70%] aspect-[9/16] bg-black rounded-[30px] overflow-hidden border-2 border-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.2)] mx-auto mb-4 group cursor-pointer"
                    >
                      <video src={previewUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Maximize2 className="text-white/0 group-hover:text-white/60 transition-all scale-50 group-hover:scale-100" size={40} />
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-full text-white border border-white/20 active:scale-90 transition-all z-20"
                      >
                        <RefreshCw size={18} />
                      </button>
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="bg-gold/80 text-charcoal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
                          Tap to View Full Screen
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <input 
                      type="text"
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-gold/50 font-sans text-lg outline-none"
                    />
                    <textarea 
                      placeholder="Your Message..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-gold/50 resize-none h-32 font-sans text-lg outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button type="button" disabled={isCameraLoading} onClick={startCamera} className="flex flex-col items-center justify-center gap-3 p-6 rounded-[30px] bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group disabled:opacity-50">
                      {isCameraLoading ? <Loader2 className="text-gold animate-spin" size={32} /> : <Camera className="text-gold group-hover:scale-110 transition-transform" size={32} />}
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">Live Record</span>
                    </button>
                    <input type="file" accept="video/*,image/*" ref={galleryInputRef} className="hidden" />
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 p-6 rounded-[30px] bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all group">
                      <Upload className="text-gold group-hover:scale-110 transition-transform" size={32} />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">Gallery</span>
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-gold text-charcoal font-bold py-5 rounded-[25px] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.4)] active:scale-95 transition-all text-lg mb-8">
                    <Send size={22} />
                    <span className="uppercase tracking-widest">SEND WISH</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreenPreview && previewUrl && (
          <motion.div
            key="fullscreen-video-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setIsFullscreenPreview(false)}
              className="absolute top-12 right-6 z-[210] p-4 rounded-full bg-white/10 text-white backdrop-blur-md"
            >
              <X size={32} />
            </button>
            <video 
              src={previewUrl} 
              className="w-full h-full object-cover" 
              autoPlay 
              loop 
              controls // Show controls in full view so user can hear audio
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
