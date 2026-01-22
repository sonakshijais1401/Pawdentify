import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

interface Pawtoon {
  id: string;
  image: string;
  text?: string;
  timestamp: Date;
}

interface PawtoonsViewerProps {
  pawtoons: Pawtoon[];
  music?: string;
  onClose: () => void;
}

export function PawtoonsViewer({ pawtoons, music, onClose }: PawtoonsViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (music && audioRef.current) {
      audioRef.current.play();
    }
  }, [music]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < pawtoons.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, pawtoons.length, onClose]);

  const handleNext = () => {
    if (currentIndex < pawtoons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.95)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-md h-full">
        {music && (
          <audio ref={audioRef} src={music} loop />
        )}

        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {pawtoons.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255, 255, 255, 0.3)" }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: "#FFFFFF",
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {music && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full"
              style={{ background: "rgba(0, 0, 0, 0.5)" }}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
          >
            <img
              src={pawtoons[currentIndex].image}
              alt="Pawtoon"
              className="w-full h-full object-contain"
            />
            {pawtoons[currentIndex].text && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="px-8 py-4 rounded-2xl"
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(10px)",
                    maxWidth: "80%",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      textAlign: "center",
                      textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                      lineHeight: "1.4",
                    }}
                  >
                    {pawtoons[currentIndex].text}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2"
          style={{ opacity: currentIndex > 0 ? 1 : 0 }}
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </motion.div>
  );
}
