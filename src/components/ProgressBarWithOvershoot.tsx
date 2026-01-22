import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressBarWithOvershootProps {
  value: number; // 0-100
  color?: string;
  delay?: number;
}

export function ProgressBarWithOvershoot({ 
  value, 
  color = "#FF9A82",
  delay = 0 
}: ProgressBarWithOvershootProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return (
    <div className="w-full h-[6px] bg-[#E8ECEE] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={{
          width: [
            "0%",
            `${Math.min(animatedValue + 6, 100)}%`, // Overshoot
            `${animatedValue}%`, // Settle
          ],
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.7, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
}
