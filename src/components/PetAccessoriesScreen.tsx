import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface ProductVariety {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  amazonLink: string;
  benefit: string;
  image?: string;
}

interface DogFact {
  id: number;
  fact: string;
  emoji: string;
}

const productVarieties: ProductVariety[] = [
  {
    id: 1,
    name: "Dog Leash / Collar / Harness",
    description: "Premium leashes, collars & harnesses for walks and control",
    icon: "🔗",
    color: "#F4A261",
    bgColor: "#FFF3E0",
    amazonLink: "https://www.amazon.in/s?k=dog+leash+collar+harness",
    benefit: "Perfect for safe daily walks",
    image: "https://cdn11.bigcommerce.com/s-nq6l4syi/images/stencil/1280x1280/products/25293/2010513/80076-1024__95035.1721362942.jpg?c=2",
  },
  {
    id: 2,
    name: "Dog Bed / Sleeping Mat",
    description: "Comfortable orthopedic beds for restful sleep",
    icon: "🛏️",
    color: "#5DADE2",
    bgColor: "#E3F2FD",
    amazonLink: "https://www.amazon.in/s?k=dog+bed+sleeping+mat",
    benefit: "Ensures quality rest & comfort",
    image: "https://www.shutterstock.com/image-photo/sweet-dreams-sleeping-dog-face-600nw-2424474525.jpg",
  },
  {
    id: 3,
    name: "Dog Grooming Kit",
    description: "Professional grooming tools & products",
    icon: "✨",
    color: "#58D68D",
    bgColor: "#E8F5E9",
    amazonLink: "https://www.amazon.in/s?k=dog+grooming+kit",
    benefit: "Keeps coat healthy & shiny",
    image: "https://i.ytimg.com/vi/Ac3wBNOvE_0/maxresdefault.jpg",
  },
  {
    id: 4,
    name: "Dog Raincoat",
    description: "Waterproof protection for rainy days",
    icon: "🧥",
    color: "#AB47BC",
    bgColor: "#F3E5F5",
    amazonLink: "https://www.amazon.in/s?k=dog+raincoat",
    benefit: "Protects in wet weather",
    image: "https://pyxis.nymag.com/v1/imgs/cfc/047/0bdab5f0906a444d2a93a5e7bfae0e4978-dog-raincoats-lede.2x.h473.w710.jpg",
  },
  {
    id: 5,
    name: "Dog Dental Chews",
    description: "Healthy chews for dental care & freshness",
    icon: "🦷",
    color: "#FF6B9D",
    bgColor: "#FCE4EC",
    amazonLink: "https://www.amazon.in/s?k=dog+dental+chews",
    benefit: "Maintains oral hygiene",
    image: "https://cdn.shopify.com/s/files/1/1653/5157/files/james-lacy-xe_MtM-ixlw-unsplash_1_1024x1024.jpg?v=1620676285",
  },
  {
    id: 6,
    name: "Dog Feeding Bowl",
    description: "Durable & stylish bowls for food & water",
    icon: "🍽️",
    color: "#FFD54F",
    bgColor: "#FFFDE7",
    amazonLink: "https://www.amazon.in/s?k=dog+feeding+bowl",
    benefit: "Mealtime made safe & easy",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Dog Foods",
    description: "Safe & comfortable carriers for travel",
    icon: "✈️",
    color: "#4DD0E1",
    bgColor: "#E0F7FA",
    amazonLink: "https://www.amazon.in/s?k=dog+foods+section&rh=n%3A4771586031&ref=nb_sb_noss",
    benefit: "Safe adventures together",
    image: "https://as1.ftcdn.net/jpg/01/69/30/94/1000_F_169309403_i14eZdDqguyjHhSy6f79VdCXy1Uwob7N.jpg",
  },
];

const dogFacts: DogFact[] = [
  { id: 1, fact: "Dogs can hear frequencies up to 65,000 Hz, 4x higher than humans!", emoji: "👂" },
  { id: 2, fact: "A dog's nose print is unique, just like human fingerprints!", emoji: "👃" },
  { id: 3, fact: "Dogs can understand up to 250 different words and gestures!", emoji: "🧠" },
  { id: 4, fact: "Puppies are born blind and deaf, opening eyes after 2-3 weeks.", emoji: "👶" },
  { id: 5, fact: "Dogs have a third eyelid called the nictitating membrane.", emoji: "👁️" },
  { id: 6, fact: "A dog's sense of smell is 10,000 to 100,000 times better than humans!", emoji: "🐽" },
  { id: 7, fact: "Dogs dream just like humans, often about their owners!", emoji: "💭" },
  { id: 8, fact: "A wagging tail doesn't always mean happiness - context matters!", emoji: "🐕" },
];

export function PetAccessoriesScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % dogFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        paddingBottom: isMobile ? "80px" : "0",
      }}
    >
      {/* Full Background 3D Model */}
      {!isMobile && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1 }}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <iframe
              title="Puppy accessories 3D Model Background"
              frameBorder="0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src="https://sketchfab.com/models/fcc50656b01c49969b22eee16af20e3b/embed?autostart=0"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </motion.div>
          {/* Gradient overlay for content readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,250,0.75) 0%, rgba(250,250,250,0.70) 20%, rgba(255,249,240,0.60) 50%, rgba(255,249,240,0.70) 80%, rgba(250,250,250,0.75) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* Mobile fallback background */}
      {isMobile && (
        <div
          style={{
            background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #fff9f0 100%)",
          }}
        />
      )}

      <ResponsiveContainer>
        {/* Premium Hero Banner */}
        <motion.div
          className="relative overflow-hidden px-6 pt-12 pb-8"
          style={{
            background: "linear-gradient(135deg, #F4A261 0%, #E76F51 50%, #D62828 100%)",
          }}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
            style={{ background: "#FFFFFF" }}
            animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
            style={{ background: "#FFE66D" }}
            animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className={isMobile ? "space-y-4" : "space-y-6 max-w-7xl mx-auto px-6"}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={28} color="#FFFFFF" />
                </motion.div>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Premium Collection
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: isMobile ? "36px" : "64px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                  letterSpacing: "-2px",
                  lineHeight: "1.1",
                  textShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                Pet Essentials
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: isMobile ? "14px" : "18px",
                  color: "rgba(255, 255, 255, 0.9)",
                  maxWidth: isMobile ? "100%" : "600px",
                  lineHeight: "1.6",
                  fontWeight: 500,
                }}
              >
                Curated accessories for your beloved companion
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Dog Facts Carousel - Premium Design */}
        <div className={isMobile ? "px-6 my-8" : "px-12 my-12 max-w-7xl mx-auto"}>
          <motion.div
            className="rounded-3xl overflow-hidden backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, ${productVarieties[currentFactIndex].color}15, ${productVarieties[currentFactIndex].color}25)`,
              border: `2.5px solid ${productVarieties[currentFactIndex].color}40`,
              boxShadow: `0 20px 60px ${productVarieties[currentFactIndex].color}20`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="p-10 md:p-12">
              <div className="flex items-center gap-6 justify-center text-center">
                <motion.div
                  className="text-6xl md:text-7xl flex-shrink-0"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 15, -15, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {dogFacts[currentFactIndex].emoji}
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFactIndex}
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: isMobile ? "16px" : "22px",
                        fontWeight: 700,
                        color: productVarieties[currentFactIndex].color,
                        margin: 0,
                        lineHeight: "1.6",
                        maxWidth: "600px",
                      }}
                    >
                      {dogFacts[currentFactIndex].fact}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Premium Dot Indicators */}
              <div className="flex justify-center gap-3 mt-8">
                {dogFacts.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentFactIndex(idx)}
                    className="rounded-full transition-all"
                    style={{
                      width: idx === currentFactIndex ? "28px" : "10px",
                      height: "10px",
                      background:
                        idx === currentFactIndex
                          ? productVarieties[currentFactIndex].color
                          : `${productVarieties[currentFactIndex].color}40`,
                      cursor: "pointer",
                      border: `2px solid ${productVarieties[currentFactIndex].color}60`,
                    }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content: Grid + 3D Model */}
        <div className={isMobile ? "px-6 mb-8" : "px-12 mb-16 max-w-7xl mx-auto"}>
          <div className={`grid ${isMobile ? "grid-cols-1 gap-6" : "grid-cols-1 gap-8"}`}>
            {/* Product Varieties Grid - Full Width */}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: isMobile ? "28px" : "40px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #F4A261, #E76F51)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "32px",
                }}
              >
                Shop by Category
              </motion.h2>

              <motion.div
                className={`grid ${isMobile ? "grid-cols-1 gap-5" : "grid-cols-3 gap-7"}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {productVarieties.map((variety) => (
                  <motion.div
                    key={variety.id}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredId(variety.id)}
                    onHoverEnd={() => setHoveredId(null)}
                  >
                    <motion.a
                      href={variety.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer no-underline group h-full"
                      whileHover={{ y: -12 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <motion.div
                        className="rounded-3xl h-full overflow-hidden relative backdrop-blur-md"
                        style={{
                          background: `linear-gradient(135deg, ${variety.bgColor}, ${variety.color}08)`,
                          border: `3px solid ${variety.color}`,
                          boxShadow:
                            hoveredId === variety.id
                              ? `0 30px 60px ${variety.color}35, inset 0 1px 0 ${variety.color}30`
                              : `0 8px 20px ${variety.color}15, inset 0 1px 0 ${variety.color}20`,
                        }}
                        animate={{
                          boxShadow:
                            hoveredId === variety.id
                              ? `0 30px 60px ${variety.color}35, inset 0 1px 0 ${variety.color}30`
                              : `0 8px 20px ${variety.color}15, inset 0 1px 0 ${variety.color}20`,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Gradient overlay on hover */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(45deg, transparent, ${variety.color}20, transparent)`,
                          }}
                          animate={{
                            x: hoveredId === variety.id ? ["−100%", "100%"] : "−100%",
                          }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />

                        {/* Image Section - FULL HEIGHT */}
                        {variety.image && (
                          <div
                            style={{
                              width: "100%",
                              height: "240px",
                              overflow: "hidden",
                              background: `linear-gradient(135deg, ${variety.color}10, ${variety.color}05)`,
                              borderBottom: `2px solid ${variety.color}20`,
                              position: "relative",
                            }}
                          >
                            <motion.img
                              src={variety.image}
                              alt={variety.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                              animate={{
                                scale: hoveredId === variety.id ? 1.15 : 1,
                              }}
                              transition={{ duration: 0.4 }}
                            />
                            <motion.div
                              className="absolute inset-0"
                              style={{
                                background: `radial-gradient(circle at 50% 50%, transparent 0%, ${variety.color}20 100%)`,
                              }}
                              animate={{
                                opacity: hoveredId === variety.id ? 1 : 0,
                              }}
                            />
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                          <div className="text-center space-y-4">
                            <motion.h3
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: isMobile ? "18px" : "19px",
                                fontWeight: 800,
                                color: variety.color,
                                margin: 0,
                                lineHeight: "1.3",
                              }}
                              animate={{
                                scale: hoveredId === variety.id ? 1.05 : 1,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {variety.name}
                            </motion.h3>

                            <p
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: isMobile ? "13px" : "14px",
                                color: "#666",
                                margin: "8px 0",
                                lineHeight: "1.5",
                              }}
                            >
                              {variety.description}
                            </p>

                            {/* Benefit Badge with animation */}
                            <motion.div
                              className="inline-block rounded-full px-4 py-2 mt-2 group"
                              style={{
                                background: `${variety.color}15`,
                                border: `2px solid ${variety.color}40`,
                              }}
                              animate={{
                                scale: hoveredId === variety.id ? 1.1 : 1,
                              }}
                              whileHover={{ y: -3 }}
                            >
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  color: variety.color,
                                }}
                              >
                                {variety.benefit}
                              </span>
                            </motion.div>
                          </div>

                          {/* Bottom CTA with premium styling */}
                          <motion.div
                            className="flex items-center justify-center gap-2 pt-6 mt-4 border-t"
                            style={{ borderColor: `${variety.color}30` }}
                          >
                            <motion.span
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "14px",
                                fontWeight: 800,
                                color: variety.color,
                              }}
                              animate={{
                                opacity: hoveredId === variety.id ? 1 : 0.7,
                              }}
                            >
                              Shop Now
                            </motion.span>
                            <motion.div
                              animate={{
                                x: hoveredId === variety.id ? [0, 6, 0] : 0,
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: hoveredId === variety.id ? Infinity : 0,
                              }}
                            >
                              <ExternalLink size={18} style={{ color: variety.color }} />
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.a>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
