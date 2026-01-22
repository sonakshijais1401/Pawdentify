import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DogMascotProps {
  message?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  animation?: "wave" | "jump" | "nod" | "excited" | "thinking";
  showMessage?: boolean;
  onClose?: () => void;
  autoHide?: number; // Auto hide after milliseconds
}

export function DogMascot({
  message = "Woof! Let me help you!",
  position = "bottom-right",
  animation = "wave",
  showMessage = true,
  onClose,
  autoHide,
}: DogMascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [messageVisible, setMessageVisible] = useState(showMessage);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onClose]);

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return { top: "80px", left: "20px" };
      case "top-right":
        return { top: "80px", right: "20px" };
      case "bottom-left":
        return { bottom: "100px", left: "20px" };
      case "bottom-right":
        return { bottom: "100px", right: "20px" };
      case "center":
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      default:
        return { bottom: "100px", right: "20px" };
    }
  };

  const getAnimationVariants = () => {
    switch (animation) {
      case "wave":
        return {
          rotate: [0, 15, -15, 15, 0],
          transition: { duration: 1, repeat: Infinity, repeatDelay: 2 },
        };
      case "jump":
        return {
          y: [0, -20, 0],
          transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 },
        };
      case "nod":
        return {
          rotateX: [0, 15, 0],
          transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 },
        };
      case "excited":
        return {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.5, repeat: Infinity },
        };
      case "thinking":
        return {
          rotateZ: [0, -5, 5, 0],
          transition: { duration: 2, repeat: Infinity },
        };
      default:
        return {};
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          ...getPositionStyles(),
        }}
      >
        {/* Speech Bubble */}
        {messageVisible && message && (
          <motion.div
            className="mb-3 mr-2 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div
              className="relative px-5 py-3 max-w-xs"
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#2C3E50",
                  lineHeight: "1.5",
                }}
              >
                {message}
              </p>
              {onClose && (
                <button
                  onClick={() => {
                    setMessageVisible(false);
                    setIsVisible(false);
                    onClose();
                  }}
                  className="absolute -top-2 -right-2 rounded-full flex items-center justify-center pointer-events-auto"
                  style={{
                    width: "24px",
                    height: "24px",
                    background: "#F4A261",
                    border: "2px solid #FFFFFF",
                  }}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
              {/* Speech bubble tail */}
              <div
                className="absolute"
                style={{
                  bottom: "-8px",
                  right: "30px",
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "10px solid #FFFFFF",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* 3D Dog Mascot */}
        <motion.div
          className="relative pointer-events-auto cursor-pointer"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0, ...getAnimationVariants() }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMessageVisible(!messageVisible)}
          style={{
            width: "100px",
            height: "100px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Dog Face - 3D styled */}
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              boxShadow: "0 10px 30px rgba(244, 162, 97, 0.4), inset 0 -5px 15px rgba(0, 0, 0, 0.1)",
              transform: "translateZ(20px)",
            }}
          >
            {/* Snout */}
            <div
              className="absolute"
              style={{
                width: "45px",
                height: "35px",
                background: "#FFFFFF",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                bottom: "15px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Nose */}
              <div
                className="absolute"
                style={{
                  width: "12px",
                  height: "10px",
                  background: "#2C3E50",
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  top: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            {/* Eyes */}
            <div className="absolute top-6 left-0 right-0 flex justify-center gap-4">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="relative"
                  animate={{
                    scaleY: [1, 0.1, 1],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: i * 0.1,
                  }}
                >
                  {/* Eye white */}
                  <div
                    className="relative rounded-full"
                    style={{
                      width: "16px",
                      height: "16px",
                      background: "#FFFFFF",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Pupil */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "#2C3E50",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Shine */}
                      <div
                        className="absolute rounded-full"
                        style={{
                          width: "3px",
                          height: "3px",
                          background: "#FFFFFF",
                          top: "2px",
                          left: "2px",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ears */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: "30px",
                height: "50px",
                background: "#E76F51",
                top: "-10px",
                left: "5px",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                transform: "rotate(-30deg)",
                transformOrigin: "top center",
                boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              animate={{
                rotate: [-30, -20, -30],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: "30px",
                height: "50px",
                background: "#E76F51",
                top: "-10px",
                right: "5px",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                transform: "rotate(30deg)",
                transformOrigin: "top center",
                boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              animate={{
                rotate: [30, 20, 30],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 0.2,
              }}
            />

            {/* Tongue (appears on excited animation) */}
            {animation === "excited" && (
              <motion.div
                className="absolute"
                style={{
                  width: "20px",
                  height: "15px",
                  background: "#FF6B9D",
                  borderRadius: "0 0 50% 50%",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>

          {/* 3D Shadow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: "80px",
              height: "15px",
              background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.2), transparent)",
              borderRadius: "50%",
              transform: "translateZ(-20px) translateY(10px)",
              filter: "blur(5px)",
            }}
          />
        </motion.div>

        {/* Interaction indicator */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              color: "#7F8C8D",
              whiteSpace: "nowrap",
            }}
          >
            Click me!
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
