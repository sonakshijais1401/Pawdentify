import { motion } from "framer-motion";

export function SketchfabViewer() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <iframe
        title="Cartoon Dog"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src="https://sketchfab.com/models/0ea325ab7a6e48f1abb0083158be843d/embed?autostart=1&ui_theme=dark&dnt=1"
        className="w-full h-full rounded-3xl"
        style={{
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      />
    </motion.div>
  );
}
