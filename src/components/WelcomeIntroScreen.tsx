import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Bot, Users, Heart, Sparkles, ArrowRight } from "lucide-react";

interface WelcomeIntroScreenProps {
  onComplete: () => void;
}

const services = [
  {
    icon: Camera,
    title: "AI-Powered Breed Detection",
    description: "Snap a photo and instantly discover your dog's breed with 95% accuracy!",
    dogImage: "🐕‍🦺",
    color: "#F4A261"
  },
  {
    icon: Bot,
    title: "Pawbot - Your AI Companion",
    description: "Get personalized care tips, health advice, and fun facts about your furry friend!",
    dogImage: "🤖🐕",
    color: "#E76F51"
  },
  {
    icon: Users,
    title: "Vibrant Community",
    description: "Connect with fellow dog lovers, share stories, and make new friends!",
    dogImage: "🐕‍🦺🐕🐩",
    color: "#2A9D8F"
  },
  {
    icon: Heart,
    title: "Complete Care Guide",
    description: "From nutrition to training - everything you need for a happy, healthy pup!",
    dogImage: "❤️🐕",
    color: "#E9C46A"
  }
];

export function WelcomeIntroScreen({ onComplete }: WelcomeIntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalScreen, setShowFinalScreen] = useState(false);

  useEffect(() => {
    if (currentStep < services.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowFinalScreen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleGetStarted = () => {
    onComplete();
  };

  if (showFinalScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFF8F3 0%, #FFE5D9 100%)" }}
      >
        {/* Floating paw prints */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              🐾
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center z-10 px-8 max-w-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main mascot */}
          <motion.div
            className="text-8xl mb-8"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🐕‍🦺
          </motion.div>

          <motion.h1
            className="mb-6"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to Pawdentify!
          </motion.h1>

          <motion.p
            className="text-xl mb-12 leading-relaxed"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#7F8C8D",
              fontWeight: 500,
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your ultimate companion for everything dog-related! 🎉<br />
            Discover, connect, and care for your furry best friend like never before.
          </motion.p>

          <motion.button
            onClick={handleGetStarted}
            className="group relative px-12 py-6 rounded-3xl text-white font-bold text-xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 8px 32px rgba(244, 162, 97, 0.4)",
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 12px 40px rgba(244, 162, 97, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="relative flex items-center gap-3">
              Are you ready to get Pawdentified? 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          {/* Cute floating elements */}
          <div className="absolute -top-10 -left-10">
            <motion.div
              className="text-6xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              ⭐
            </motion.div>
          </div>
          <div className="absolute -bottom-10 -right-10">
            <motion.div
              className="text-5xl"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💫
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFF8F3 0%, #FFE5D9 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            🐾
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-8 text-center z-10">
        <AnimatePresence mode="wait">
          {currentStep < services.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              {/* Service Icon & Dog */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <motion.div
                  className="p-6 rounded-3xl"
                  style={{ 
                    background: `${services[currentStep].color}20`,
                    border: `3px solid ${services[currentStep].color}40`
                  }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [-2, 2, -2] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {(() => {
                    const IconComponent = services[currentStep].icon;
                    return <IconComponent 
                      className="w-16 h-16" 
                      style={{ color: services[currentStep].color }}
                    />;
                  })()}
                </motion.div>

                <motion.div
                  className="text-8xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {services[currentStep].dogImage}
                </motion.div>
              </div>

              {/* Service Title */}
              <motion.h2
                className="mb-6"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "42px",
                  fontWeight: 700,
                  color: services[currentStep].color,
                  lineHeight: 1.2,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {services[currentStep].title}
              </motion.h2>

              {/* Service Description */}
              <motion.p
                className="text-2xl leading-relaxed max-w-2xl mx-auto"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#7F8C8D",
                  fontWeight: 500,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {services[currentStep].description}
              </motion.p>

              {/* Progress indicators */}
              <div className="flex justify-center gap-3 mt-12">
                {services.map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: index <= currentStep ? services[currentStep].color : "#E0E0E0"
                    }}
                    animate={{
                      scale: index === currentStep ? [1, 1.3, 1] : 1
                    }}
                    transition={{ duration: 0.5, repeat: index === currentStep ? Infinity : 0 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button */}
        <motion.button
          onClick={handleGetStarted}
          className="absolute top-8 right-8 px-6 py-3 rounded-2xl text-gray-600 hover:text-gray-800 transition-colors"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip Intro →
        </motion.button>
      </div>
    </div>
  );
}