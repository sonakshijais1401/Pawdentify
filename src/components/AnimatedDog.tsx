import { motion } from "framer-motion";

interface AnimatedDogProps {
  size?: "sm" | "md" | "lg";
  mood?: "happy" | "excited" | "sleepy";
}

export function AnimatedDog({ size = "md", mood = "happy" }: AnimatedDogProps) {
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 180,
  };
  
  const dimension = sizeMap[size];

  return (
    <motion.div
      className="relative"
      style={{ width: dimension, height: dimension }}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Dog Head - Idle Bob */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Head */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 to-amber-800" 
             style={{
               boxShadow: "0 8px 20px rgba(180, 83, 9, 0.3)"
             }}>
          
          {/* Ears */}
          <motion.div
            className="absolute -left-3 top-6 w-12 h-16 bg-amber-700 rounded-full"
            style={{
              transform: "rotate(-20deg)",
            }}
            animate={{
              rotate: mood === "excited" ? [-20, -10, -20] : [-20],
            }}
            transition={{
              duration: 0.5,
              repeat: mood === "excited" ? Infinity : 0,
            }}
          />
          <motion.div
            className="absolute -right-3 top-6 w-12 h-16 bg-amber-700 rounded-full"
            style={{
              transform: "rotate(20deg)",
            }}
            animate={{
              rotate: mood === "excited" ? [20, 10, 20] : [20],
            }}
            transition={{
              duration: 0.5,
              repeat: mood === "excited" ? Infinity : 0,
              delay: 0.1,
            }}
          />
          
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-gray-900 rounded-full">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"
              animate={{
                scale: mood === "sleepy" ? [1, 0.1, 1] : [1],
              }}
              transition={{
                duration: 3,
                repeat: mood === "sleepy" ? Infinity : 0,
              }}
            />
          </div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-900 rounded-full">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5"
              animate={{
                scale: mood === "sleepy" ? [1, 0.1, 1] : [1],
              }}
              transition={{
                duration: 3,
                repeat: mood === "sleepy" ? Infinity : 0,
              }}
            />
          </div>
          
          {/* Snout */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-12 bg-amber-500 rounded-full" />
          
          {/* Nose */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-900 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          
          {/* Tongue (happy/excited) */}
          {(mood === "happy" || mood === "excited") && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-4 bg-pink-500 rounded-b-full"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
              }}
            />
          )}
          
          {/* Collar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-600"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Floating Hearts (excited) */}
      {mood === "excited" && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 left-1/2"
              initial={{ y: 0, opacity: 0, scale: 0 }}
              animate={{
                y: -80,
                opacity: [0, 1, 0],
                scale: [0, 1, 0.8],
                x: [0, (i - 1) * 20, (i - 1) * 30],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              <div className="text-red-500 text-xl">❤️</div>
            </motion.div>
          ))}
        </>
      )}
      
      {/* Zzz (sleepy) */}
      {mood === "sleepy" && (
        <>
          {["Z", "z", "z"].map((z, i) => (
            <motion.div
              key={i}
              className="absolute top-0 right-0 text-gray-600"
              style={{
                fontSize: 20 - i * 4,
              }}
              initial={{ y: 0, opacity: 0, x: 0 }}
              animate={{
                y: [-10 * (i + 1), -30 * (i + 1)],
                opacity: [0, 1, 0],
                x: [0, 10 * (i + 1)],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {z}
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
}
