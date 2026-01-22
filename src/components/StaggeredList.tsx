import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredListProps {
  children: ReactNode[];
  stagger?: number;
  delay?: number;
}

export function StaggeredList({ children, stagger = 60, delay = 0 }: StaggeredListProps) {
  return (
    <>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.32,
            delay: delay + (index * stagger) / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
