import { motion } from "framer-motion";
import { useMemo } from "react";

interface Confetti {
  id: number;
  left: string;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  swingAmount: number;
}

// Rich, vibrant colors for party popper dots
const CONFETTI_COLORS = [
  "#FF006E", // Hot Pink
  "#FB5607", // Bright Orange
  "#FFBE0B", // Golden Yellow
  "#8338EC", // Purple
  "#3A86FF", // Bright Blue
  "#06FFA5", // Neon Green
  "#FF10F0", // Magenta
  "#00F5FF", // Cyan
  "#FFD60A", // Lemon Yellow
  "#FF4D94", // Pink
  "#00D9FF", // Sky Blue
  "#39FF14", // Neon Green Lime
  "#FF0080", // Deep Pink
  "#00FFFF", // Aqua
  "#FF6B35", // Orange Red
  "#A2FF86", // Light Green
  "#FF006E", // Crimson
  "#6A4C93", // Purple Shade
];

export function ConfettiBackground() {
  // Generate confetti particles - thick colored dots
  const confetti: Confetti[] = useMemo(() => {
    const items: Confetti[] = [];
    const particleCount = 60; // More particles for fuller effect

    for (let i = 0; i < particleCount; i++) {
      items.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2.5,
        duration: 8 + Math.random() * 7, // 8-15 seconds fall time
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 16, // 8-24px thick dots
        rotation: Math.random() * 360,
        swingAmount: 50 + Math.random() * 80, // Horizontal swing
      });
    }

    return items;
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
        height: "100vh",
        width: "100%",
      }}
    >
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            top: "-30px",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 8px ${particle.color}80, inset 0 1px 2px rgba(255,255,255,0.3)`,
            opacity: 0.25, // Very low opacity - barely visible but present
          }}
          initial={{
            y: -30,
            opacity: 0.25,
            rotate: particle.rotation,
            x: 0,
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0.25, 0.25, 0.15],
            rotate: particle.rotation + 720,
            x: [
              0,
              Math.sin(particle.id * 0.5) * particle.swingAmount * 0.5,
              Math.cos(particle.id * 0.3) * particle.swingAmount,
              -Math.sin(particle.id * 0.4) * particle.swingAmount * 0.3,
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: 1.5 + Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
