import { Camera, Users, BookOpen, Trophy, TrendingUp, Sparkles, Zap, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SketchfabViewer } from "./SketchfabViewer";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface HomeScreenProps {
  onTakePhoto: () => void;
  dogName?: string;
}

export function HomeScreen({ onTakePhoto, dogName }: HomeScreenProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";

  const dogBreeds = [
    { name: "Golden Retriever", img: "https://images.unsplash.com/photo-1683212144530-7a3a0edc69b9?w=400", color: "#F4A261" },
    { name: "Husky", img: "https://images.unsplash.com/photo-1529776180807-ea0ee08c8315?w=400", color: "#5DADE2" },
    { name: "Beagle", img: "https://images.unsplash.com/photo-1606833694770-40a04762ac16?w=400", color: "#58D68D" },
    { name: "Corgi", img: "https://images.unsplash.com/photo-1648316464836-afd11657c14a?w=400", color: "#AB47BC" },
  ];

  const stats = [
    { icon: Camera, label: "Scans", value: "1.2M+", color: "#F4A261" },
    { icon: Users, label: "Users", value: "500K+", color: "#5DADE2" },
    { icon: Trophy, label: "Breeds", value: "350+", color: "#58D68D" },
    { icon: TrendingUp, label: "Accuracy", value: "95%", color: "#AB47BC" },
  ];

  return (
    <div className="min-h-screen relative" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        {isMobile ? (
          // Mobile Layout
          <>
            {/* Hero Section with 3D Dog */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                borderRadius: "0 0 32px 32px",
                minHeight: "400px",
              }}
            >
              {/* Floating Orbs */}
              <motion.div
                className="absolute w-32 h-32 rounded-full blur-3xl"
                style={{ background: "rgba(255, 255, 255, 0.2)", top: "20%", left: "10%" }}
                animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-40 h-40 rounded-full blur-3xl"
                style={{ background: "rgba(255, 255, 255, 0.15)", bottom: "10%", right: "5%" }}
                animate={{ y: [0, -20, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />

              <div className="px-6 pt-16 pb-8 relative z-10">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  {dogName && (
                    <motion.p
                      className="mb-2"
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255, 255, 255, 0.9)" }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      👋 Hey {dogName}!
                    </motion.p>
                  )}
                  <h1
                    className="mb-3"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "36px",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      lineHeight: "1.2",
                    }}
                  >
                    Discover Your<br />Dog's Story
                  </h1>
                </motion.div>

                {/* 3D Dog Character */}
                <motion.div
                  className="relative mt-8"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <motion.div
                    className="relative"
                    animate={{
                      y: [0, -15, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div
                      className="rounded-3xl overflow-hidden mx-auto"
                      style={{
                        width: "280px",
                        height: "280px",
                        background: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                        transform: "perspective(1000px) rotateY(-5deg)",
                      }}
                    >
                      <SketchfabViewer />
                    </div>
                    {/* Floating hearts */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{ left: `${20 + i * 30}%`, bottom: "10%" }}
                        animate={{
                          y: [-20, -80],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                      >
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Wave */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
                  <path d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z" fill="#FAFAFA" />
                </svg>
              </div>
            </div>

            {/* CTA Button */}
            <div className="px-6 -mt-6 relative z-20">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                animate={{ boxShadow: ["0 8px 24px rgba(244, 162, 97, 0.3)", "0 12px 32px rgba(244, 162, 97, 0.4)", "0 8px 24px rgba(244, 162, 97, 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  onClick={onTakePhoto}
                  className="w-full h-16"
                  style={{
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 24px rgba(244, 162, 97, 0.4)",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  <Camera className="w-6 h-6 mr-3" />
                  Start Scanning Now
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Popular Breeds Carousel */}
            <div className="px-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 700, color: "#2C3E50" }}>
                  Popular Breeds
                </h3>
                <button style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#F4A261" }}>
                  See All →
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {dogBreeds.map((breed, idx) => (
                  <motion.div
                    key={breed.name}
                    className="flex-shrink-0"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        width: "140px",
                        height: "180px",
                        borderRadius: "20px",
                        background: "#FFFFFF",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <ImageWithFallback src={breed.img} alt={breed.name} className="w-full h-full object-cover" />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(180deg, transparent 0%, ${breed.color}33 100%)`,
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600, color: "#2C3E50" }}>
                          {breed.name}
                        </p>
                        <div className="flex items-center mt-1 gap-1">
                          <Zap className="w-3 h-3" style={{ color: breed.color }} />
                          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#7F8C8D" }}>
                            Learn More
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="px-6 mt-8">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="p-5 text-center"
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "20px",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1, type: "spring" }}
                  >
                    <div
                      className="inline-flex items-center justify-center rounded-full mb-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: `${stat.color}20`,
                      }}
                    >
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: 700, color: "#2C3E50" }}>
                      {stat.value}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#7F8C8D" }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Desktop/Web Layout - Enhanced with Unique Alignment
          <div className="px-12 py-12 max-w-7xl mx-auto">
            {/* Hero Section - Improved Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full mb-6"
                  style={{
                    background: "linear-gradient(135deg, #FFE5D9 0%, #FFF0E8 100%)",
                    border: "1px solid #F4A261",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span style={{ fontSize: "18px" }}>✨</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#F4A261" }}>
                    AI-Powered Recognition
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  className="mb-6"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "64px",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #2C3E50 0%, #E76F51 50%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: "1.05",
                    letterSpacing: "-1px",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  Discover Your<br />Dog's Story
                </motion.h1>

                {/* Description */}
                <motion.p
                  className="mb-10 max-w-lg"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "18px",
                    color: "#555",
                    lineHeight: "1.8",
                    fontWeight: 500,
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Instantly identify any dog breed with our advanced AI technology. Join millions of dog lovers discovering breeds worldwide!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex gap-4 mb-12"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={onTakePhoto}
                      className="h-16 px-10"
                      style={{
                        background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                        borderRadius: "20px",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        border: "none",
                        boxShadow: "0 8px 24px rgba(244, 162, 97, 0.4)",
                      }}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Scanning
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="h-16 px-10"
                      style={{
                        borderRadius: "20px",
                        border: "2px solid #E76F51",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#E76F51",
                        background: "transparent",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Enhanced Stats Row */}
                <motion.div
                  className="flex gap-12"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {stats.slice(0, 3).map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "36px",
                          fontWeight: 800,
                          background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {stat.value}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#7F8C8D", fontWeight: 600, marginTop: "4px" }}>
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* 3D Dog Image - Enhanced */}
              <motion.div
                initial={{ x: 50, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -30, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* Glow Background */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                    style={{
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      zIndex: -1,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  {/* 3D Viewer Container */}
                  <div
                    className="rounded-3xl overflow-hidden relative"
                    style={{
                      background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)",
                      boxShadow: "0 24px 48px rgba(244, 162, 97, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(244, 162, 97, 0.2)",
                      height: "550px",
                      transform: "perspective(1200px) rotateX(2deg) rotateY(-8deg)",
                    }}
                  >
                    <SketchfabViewer />
                  </div>

                  {/* Floating Cards - Unique Positioning */}
                  {[
                    { emoji: "🐕", label: "Pure Breeds", top: "5%", side: "left", offset: "-60px" },
                    { emoji: "🦴", label: "Dog Care", top: "35%", side: "right", offset: "-50px" },
                    { emoji: "🎾", label: "Fun Facts", top: "65%", side: "left", offset: "-55px" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="absolute flex flex-col items-center"
                      style={{
                        [item.side]: item.offset,
                        top: item.top,
                      }}
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6 }}
                    >
                      <motion.div
                        className="rounded-2xl p-4 text-center"
                        style={{
                          background: "#FFFFFF",
                          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                          border: "1px solid rgba(244, 162, 97, 0.1)",
                          minWidth: "100px",
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span style={{ fontSize: "32px", display: "block", marginBottom: "4px" }}>{item.emoji}</span>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#7F8C8D" }}>
                          {item.label}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Spacer */}
            <div style={{ height: "40px" }} />

            {/* Popular Breeds Section - Enhanced Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="mb-8">
                <motion.h3
                  className="mb-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "40px",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #2C3E50 0%, #E76F51 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Popular Dog Breeds
                </motion.h3>
                <motion.p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    color: "#7F8C8D",
                    fontWeight: 500,
                  }}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  Explore the world's most loved dog breeds
                </motion.p>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dogBreeds.map((breed, idx) => (
                  <motion.div
                    key={breed.name}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + idx * 0.08, duration: 0.5 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                  >
                    <div
                      className="h-full overflow-hidden group"
                      style={{
                        borderRadius: "28px",
                        background: "#FFFFFF",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(244, 162, 97, 0.1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Image Section */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageWithFallback src={breed.img} alt={breed.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(180deg, transparent 0%, ${breed.color}50 100%)`,
                          }}
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <h4
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#2C3E50",
                            marginBottom: "8px",
                          }}
                        >
                          {breed.name}
                        </h4>
                        <motion.button
                          className="inline-flex items-center gap-2 group/btn"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: breed.color,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                          whileHover={{ x: 4 }}
                        >
                          Learn More
                          <Zap className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}
