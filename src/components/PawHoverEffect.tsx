import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { audioManager } from "../utils/audioManager";

interface PawHoverEffectProps {
  children: ReactNode;
  playSound?: boolean;
  scaleOnHover?: number;
  showPawPrints?: boolean;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

export function PawHoverEffect({
  children,
  playSound = true,
  scaleOnHover = 1.02,
  showPawPrints = true,
  glowColor = "#F4A261",
  className = "",
  style = {},
  onClick,
  disabled = false,
}: PawHoverEffectProps) {
  const [pawPrints, setPawPrints] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    // Play sound effect
    if (playSound) {
      if (audioManager.hasDogAudio()) {
        audioManager.playHoverSound(0.2);
      } else {
        audioManager.playPawSound();
      }
    }

    // Create paw print at cursor position
    if (showPawPrints) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newPaw = { id: Date.now(), x, y };
      
      setPawPrints(prev => [...prev, newPaw]);
      
      // Remove paw print after animation
      setTimeout(() => {
        setPawPrints(prev => prev.filter(p => p.id !== newPaw.id));
      }, 1000);
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      whileHover={
        disabled
          ? {}
          : {
              scale: scaleOnHover,
              boxShadow: `0 8px 24px ${glowColor}40`,
            }
      }
      whileTap={disabled ? {} : { scale: scaleOnHover - 0.02 }}
      onMouseEnter={handleMouseEnter}
      onClick={disabled ? undefined : onClick}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}

      {/* Paw Print Effects */}
      {showPawPrints && pawPrints.map((paw) => (
        <motion.div
          key={paw.id}
          className="absolute pointer-events-none"
          style={{
            left: paw.x,
            top: paw.y,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.2], rotate: 0 }}
          transition={{ duration: 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={glowColor}>
            {/* Main pad */}
            <ellipse cx="12" cy="16" rx="4" ry="5" />
            {/* Toes */}
            <circle cx="7" cy="10" r="2" />
            <circle cx="11" cy="8" r="2" />
            <circle cx="15" cy="8" r="2" />
            <circle cx="18" cy="11" r="2" />
          </svg>
        </motion.div>
      ))}

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: disabled ? 0 : 0.1 }}
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent)`,
          borderRadius: "inherit",
        }}
      />
    </motion.div>
  );
}
