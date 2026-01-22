import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Cake, PartyPopper, Music, Heart, Sparkles, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BirthdayCelebrationProps {
  dogName: string;
  onClose: () => void;
}

export function BirthdayCelebration({ dogName, onClose }: BirthdayCelebrationProps) {
  const [step, setStep] = useState<"announcement" | "upload" | "celebration">("announcement");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Sample images for demo
  const demoImages = [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
  ];

  useEffect(() => {
    if (step === "celebration" && isPlayingMusic) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % uploadedImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [step, isPlayingMusic, uploadedImages.length]);

  const handleUploadImages = () => {
    // Simulate image upload
    setUploadedImages(demoImages);
    setStep("celebration");
    setIsPlayingMusic(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 overflow-hidden">
      {/* Confetti Animation */}
      {step === "announcement" && (
        <>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ["#FF6B9D", "#C44569", "#FFA07A", "#FFD700", "#87CEEB"][i % 5],
                left: `${Math.random() * 100}%`,
                top: "-5%",
              }}
              animate={{
                y: ["0vh", "110vh"],
                rotate: [0, 360],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Birthday Announcement */}
        {step === "announcement" && (
          <motion.div
            key="announcement"
            className="flex items-center justify-center min-h-screen p-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <Cake className="w-32 h-32 text-white mx-auto" />
              </motion.div>

              <motion.h1
                className="text-white text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎉 HAPPY BIRTHDAY! 🎉
              </motion.h1>

              <motion.h2
                className="text-white text-4xl mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                It's {dogName}'s Special Day!
              </motion.h2>

              <motion.p
                className="text-white/90 text-xl mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Let's celebrate with a pawsome slideshow! 🐾
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={() => setStep("upload")}
                  className="bg-white text-purple-600 hover:bg-white/90 text-xl px-12 py-8 rounded-full shadow-2xl"
                >
                  <PartyPopper className="w-6 h-6 mr-3" />
                  Let's Celebrate! 🎊
                </Button>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[Gift, Heart, Sparkles].map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Icon className="w-12 h-12 text-white/70" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Upload Images */}
        {step === "upload" && (
          <motion.div
            key="upload"
            className="flex items-center justify-center min-h-screen p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <motion.div
                className="text-center mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="w-20 h-20 text-purple-600 mx-auto" />
              </motion.div>

              <h3 className="text-3xl text-gray-900 mb-4 text-center">
                Upload Birthday Photos! 📸
              </h3>
              
              <p className="text-gray-600 text-center mb-8">
                Share your favorite moments with {dogName} to create a magical birthday slideshow!
              </p>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleUploadImages}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 py-6 rounded-2xl text-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Photos 🎨
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleUploadImages}
                    variant="outline"
                    className="w-full py-6 rounded-2xl text-lg border-2"
                  >
                    Use Sample Photos ✨
                  </Button>
                </motion.div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm text-gray-600">
                <div>
                  <div className="text-2xl mb-1">🎵</div>
                  <p>With Music</p>
                </div>
                <div>
                  <div className="text-2xl mb-1">🎨</div>
                  <p>Slideshow</p>
                </div>
                <div>
                  <div className="text-2xl mb-1">💝</div>
                  <p>Memories</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Birthday Celebration Slideshow */}
        {step === "celebration" && (
          <motion.div
            key="celebration"
            className="relative w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Background Image Slideshow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 1 }}
              >
                <ImageWithFallback
                  src={uploadedImages[currentImageIndex]}
                  alt={`Birthday photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
              </motion.div>
            </AnimatePresence>

            {/* Floating Hearts */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: "-10%",
                }}
                animate={{
                  y: [0, -window.innerHeight - 100],
                  x: [0, Math.random() * 50 - 25],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              >
                <Heart className="w-8 h-8 text-pink-400 fill-current" />
              </motion.div>
            ))}

            {/* Birthday Message Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8"
              >
                <Cake className="w-24 h-24 text-white mx-auto drop-shadow-2xl" />
              </motion.div>

              <motion.h1
                className="text-white text-5xl md:text-7xl mb-4 drop-shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎂 Happy Birthday {dogName}! 🎂
              </motion.h1>

              <motion.p
                className="text-white/90 text-2xl mb-8 drop-shadow-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Another year of paws, love, and tail wags! 🐾
              </motion.p>

              {/* Music Indicator */}
              {isPlayingMusic && (
                <motion.div
                  className="flex items-center gap-2 text-white mb-8"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Music className="w-6 h-6" />
                  <span className="text-lg">♫ Happy Birthday Song Playing ♫</span>
                </motion.div>
              )}

              {/* Image Counter */}
              <div className="flex gap-2 mb-8">
                {uploadedImages.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/40"
                    }`}
                    animate={index === currentImageIndex ? { scale: [1, 1.5, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white px-8 py-6 rounded-full text-lg"
                >
                  Continue to App 🎉
                </Button>
              </motion.div>
            </div>

            {/* Sparkles Animation */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
