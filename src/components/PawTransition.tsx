import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

interface PawTransitionProps {
  isVisible: boolean;
}

export function PawTransition({ isVisible }: PawTransitionProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Paw Prints Trail */}
      <div className="relative">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i % 4) * 60 - 90}px`,
              top: `${Math.floor(i / 4) * 80 - 40}px`,
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              rotate: [0, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              times: [0, 0.5, 1],
            }}
          >
            <PawPrint className="w-16 h-16 text-white" />
          </motion.div>
        ))}
        
        {/* Center Paw */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          <PawPrint className="w-24 h-24 text-white" />
        </motion.div>
      </div>

      {/* Woof Sound Effect Text */}
      <motion.div
        className="absolute bottom-20 text-white text-3xl"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: [0, 1.2, 1], y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        Woof! 🐕
      </motion.div>
    </motion.div>
  );
}
