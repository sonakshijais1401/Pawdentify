import { motion } from "framer-motion";
import { Smartphone, Monitor } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";

export function LayoutSwitcher() {
  const { viewMode, setViewMode } = useLayout();

  return (
    <motion.div
      className="fixed top-4 right-4 z-[10000] flex gap-2 p-2 rounded-full"
      style={{
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        border: "2px solid #F4A261",
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.button
        onClick={() => setViewMode("mobile")}
        className="p-3 rounded-full transition-all flex items-center gap-2"
        style={{
          background: viewMode === "mobile" ? "#F4A261" : "transparent",
          color: viewMode === "mobile" ? "#FFFFFF" : "#7F8C8D",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Smartphone className="w-5 h-5" />
        {viewMode === "mobile" && <span>Mobile</span>}
      </motion.button>
      <motion.button
        onClick={() => setViewMode("desktop")}
        className="p-3 rounded-full transition-all flex items-center gap-2"
        style={{
          background: viewMode === "desktop" ? "#F4A261" : "transparent",
          color: viewMode === "desktop" ? "#FFFFFF" : "#7F8C8D",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Monitor className="w-5 h-5" />
        {viewMode === "desktop" && <span>Desktop</span>}
      </motion.button>
    </motion.div>
  );
}
