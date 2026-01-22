import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, TrendingUp, Users, Award, Search, Bookmark, X, Upload } from "lucide-react";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface Post {
  id: number;
  user: string;
  userAvatar: string;
  dogName: string;
  breed: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
}

export function CommunityScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [activeTab, setActiveTab] = useState<"trending" | "following" | "nearby">("trending");
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: "Sarah M.",
      userAvatar: "SM",
      dogName: "Max",
      breed: "Golden Retriever",
      image: "https://images.unsplash.com/photo-1683212144530-7a3a0edc69b9?w=600",
      likes: 234,
      comments: 45,
      caption: "Max enjoying his favorite spot at the park!",
      timestamp: "2h ago",
    },
    {
      id: 2,
      user: "John D.",
      userAvatar: "JD",
      dogName: "Luna",
      breed: "Husky",
      image: "https://images.unsplash.com/photo-1529776180807-ea0ee08c8315?w=600",
      likes: 512,
      comments: 89,
      caption: "Those blue eyes never get old!",
      timestamp: "5h ago",
    },
    {
      id: 3,
      user: "Emma K.",
      userAvatar: "EK",
      dogName: "Charlie",
      breed: "Beagle",
      image: "https://images.unsplash.com/photo-1606833694770-40a04762ac16?w=600",
      likes: 187,
      comments: 32,
      caption: "Playtime is the best time!",
      timestamp: "1d ago",
    },
  ]);

  const stats = [
    { icon: Users, label: "Members", value: "500K+", color: "#F4A261" },
    { icon: TrendingUp, label: "Posts Today", value: "12.5K", color: "#5DADE2" },
    { icon: Award, label: "Top Breeds", value: "350+", color: "#58D68D" },
  ];

  // Form state for modal
  const [formData, setFormData] = useState({
    dogName: "",
    breed: "Golden Retriever",
    article: "",
    image: "" as string, // Base64 data URL
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as Data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setFormData({ ...formData, image: imageDataUrl });
    };
    reader.readAsDataURL(file);
  };

  const breeds = [
    "Golden Retriever",
    "Labrador Retriever",
    "Husky",
    "Beagle",
    "French Bulldog",
    "German Shepherd",
    "Poodle",
    "Bulldog",
    "Dachshund",
    "Shiba Inu",
    "Other",
  ];

  const handleSubmit = () => {
    if (!formData.dogName.trim() || !formData.article.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    // Create new post
    const newPost: Post = {
      id: Math.max(...posts.map((p) => p.id), 0) + 1,
      user: "You",
      userAvatar: formData.dogName.charAt(0).toUpperCase(),
      dogName: formData.dogName,
      breed: formData.breed,
      image: formData.image || "https://images.unsplash.com/photo-1612536315200-335674dd53aa?w=600",
      likes: 0,
      comments: 0,
      caption: formData.article,
      timestamp: "just now",
    };

    // Add new post to top of feed
    setPosts([newPost, ...posts]);

    // Reset form and close modal
    setFormData({ dogName: "", breed: "Golden Retriever", article: "", image: "" });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        {isMobile ? (
          // Mobile Layout
          <>
            {/* Header with Search */}
            <div
              className="px-6 pt-12 pb-6"
              style={{
                background: "#FFFFFF",
                borderBottom: "1px solid #ECEFF1",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#2C3E50",
                  }}
                >
                  Community
                </h2>
                <motion.button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    color: "#FFFFFF",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share Story
                </motion.button>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ width: "20px", height: "20px", color: "#BDC3C7" }}
                />
                <Input
                  placeholder="Search dogs, breeds, users..."
                  className="pl-12 h-11"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #ECEFF1",
                    background: "#F7F9FA",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div
              className="px-6 py-4 flex gap-2 overflow-x-auto hide-scrollbar"
              style={{
                background: "#FFFFFF",
                borderBottom: "1px solid #ECEFF1",
              }}
            >
              {[
                { id: "trending", label: "Trending" },
                { id: "following", label: "Following" },
                { id: "nearby", label: "Nearby" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="px-4 py-2 rounded-full whitespace-nowrap transition-all"
                  style={{
                    background: activeTab === tab.id ? "#F4A261" : "#F7F9FA",
                    color: activeTab === tab.id ? "#FFFFFF" : "#7F8C8D",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: activeTab === tab.id ? "2px solid #000000" : "2px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="px-6 pt-6 pb-4">
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="p-4 text-center"
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "16px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      border: "2px solid #000000",
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)" }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className="inline-flex items-center justify-center rounded-full mb-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: `${stat.color}20`,
                      }}
                    >
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#2C3E50",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        color: "#7F8C8D",
                      }}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="px-6 space-y-4">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  className="overflow-hidden"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    border: "2px solid #000000",
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                          border: "2px solid #000000",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#FFFFFF",
                        }}
                      >
                        {post.userAvatar}
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {post.user}
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: "#7F8C8D",
                          }}
                        >
                          {post.dogName} • {post.breed}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        color: "#BDC3C7",
                      }}
                    >
                      {post.timestamp}
                    </span>
                  </div>

                  {/* Post Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.dogName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Post Actions */}
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <motion.button
                        className="flex items-center gap-2"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Heart className="w-6 h-6" style={{ color: "#F4A261" }} />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {post.likes}
                        </span>
                      </motion.button>
                      <motion.button className="flex items-center gap-2" whileHover={{ scale: 1.1 }}>
                        <MessageCircle className="w-6 h-6" style={{ color: "#7F8C8D" }} />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {post.comments}
                        </span>
                      </motion.button>
                      <motion.button className="ml-auto" whileHover={{ scale: 1.1 }}>
                        <Share2 className="w-6 h-6" style={{ color: "#7F8C8D" }} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }}>
                        <Bookmark className="w-6 h-6" style={{ color: "#7F8C8D" }} />
                      </motion.button>
                    </div>

                    {/* Caption */}
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#2C3E50",
                        lineHeight: "1.5",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{post.user}</span> {post.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          // Desktop Layout - Enhanced Premium Design
          <div className="px-12 py-12 max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div
              className="mb-12"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "48px",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #2C3E50 0%, #F4A261 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "8px",
                    }}
                  >
                    Dog Community
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      color: "#7F8C8D",
                      fontWeight: 500,
                    }}
                  >
                    Connect with dog lovers and share amazing moments
                  </p>
                </div>

                {/* Filter Tabs and Share Button */}
                <div className="flex gap-3 items-center">
                  <motion.button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #58D68D 0%, #2EC786 100%)",
                      color: "#FFFFFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(88, 214, 141, 0.3)",
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✏️ Share Your Dog's Story
                  </motion.button>

                  {[
                    { id: "trending", label: "🔥 Trending" },
                    { id: "following", label: "💙 Following" },
                    { id: "nearby", label: "📍 Nearby" },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="px-6 py-3 rounded-xl transition-all"
                      style={{
                        background: activeTab === tab.id
                          ? "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)"
                          : "#F0E6E1",
                        color: activeTab === tab.id ? "#FFFFFF" : "#7F8C8D",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: activeTab === tab.id
                          ? "0 8px 24px rgba(244, 162, 97, 0.3)"
                          : "none",
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="p-5 rounded-2xl"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #F0E6E1",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          background: `${stat.color}20`,
                        }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "22px",
                            fontWeight: 800,
                            color: stat.color,
                          }}
                        >
                          {stat.value}
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: "#7F8C8D",
                            fontWeight: 600,
                          }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Posts Grid - 2 Column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  className="overflow-hidden group"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "28px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #F0E6E1",
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{
                    boxShadow: "0 16px 48px rgba(244, 162, 97, 0.2)",
                    y: -8,
                  }}
                >
                  {/* Post Image */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.dogName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
                      }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-7">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            width: "52px",
                            height: "52px",
                            background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                          }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {post.userAvatar}
                        </motion.div>
                        <div className="flex-1">
                          <p
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#2C3E50",
                            }}
                          >
                            {post.user}
                          </p>
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              color: "#7F8C8D",
                              fontWeight: 600,
                            }}
                          >
                            {post.dogName} • {post.breed}
                          </p>
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          color: "#BDC3C7",
                          fontWeight: 500,
                        }}
                      >
                        {post.timestamp}
                      </span>
                    </div>

                    {/* Caption */}
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        color: "#2C3E50",
                        lineHeight: "1.6",
                        marginBottom: "12px",
                      }}
                    >
                      {post.caption}
                    </p>

                    {/* Engagement */}
                    <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: "#F0E6E1" }}>
                      <motion.button
                        className="flex items-center gap-2 group/btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className="w-5 h-5 group-hover/btn:scale-125 transition-transform" style={{ color: "#F4A261" }} />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {post.likes}
                        </span>
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 group/btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="w-5 h-5 group-hover/btn:scale-125 transition-transform" style={{ color: "#5DADE2" }} />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {post.comments}
                        </span>
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 group/btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="w-5 h-5 group-hover/btn:scale-125 transition-transform" style={{ color: "#58D68D" }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </ResponsiveContainer>

      {/* Share Story Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#2C3E50",
                  }}
                >
                  Share Your Dog's Story
                </h3>
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" style={{ color: "#7F8C8D" }} />
                </motion.button>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Dog Name Input */}
                <div>
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C3E50",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Dog's Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Max, Bella, Luna"
                    value={formData.dogName}
                    onChange={(e) =>
                      setFormData({ ...formData, dogName: e.target.value })
                    }
                    className="w-full h-12 px-4"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ECEFF1",
                      background: "#F7F9FA",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                    }}
                  />
                </div>

                {/* Breed Dropdown */}
                <div>
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C3E50",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Breed
                  </label>
                  <select
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                    className="w-full h-12 px-4"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ECEFF1",
                      background: "#F7F9FA",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      color: "#2C3E50",
                    }}
                  >
                    {breeds.map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Article Textarea */}
                <div>
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C3E50",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Your Story
                  </label>
                  <textarea
                    placeholder="Share an amazing moment or story about your dog..."
                    value={formData.article}
                    onChange={(e) =>
                      setFormData({ ...formData, article: e.target.value })
                    }
                    rows={4}
                    className="w-full p-4"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ECEFF1",
                      background: "#F7F9FA",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      color: "#2C3E50",
                      resize: "none",
                    }}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C3E50",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Upload Dog Photo
                  </label>
                  <motion.div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                    style={{
                      borderColor: formData.image ? "#58D68D" : "#ECEFF1",
                      background: formData.image ? "#E8F5E920" : "#F7F9FA",
                    }}
                    whileHover={{ borderColor: "#F4A261", background: "#FFF3E020" }}
                  >
                    {formData.image ? (
                      <div className="space-y-3">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            color: "#58D68D",
                            fontWeight: 600,
                          }}
                        >
                          Image selected ✓
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: "#7F8C8D",
                          }}
                        >
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload
                          className="w-8 h-8 mx-auto"
                          style={{ color: "#F4A261" }}
                        />
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          Click to upload a photo
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: "#7F8C8D",
                          }}
                        >
                          JPG, PNG or GIF (max 5MB)
                        </p>
                      </div>
                    )}
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl"
                  style={{
                    background: "#F0E6E1",
                    color: "#7F8C8D",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    color: "#FFFFFF",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(244, 162, 97, 0.3)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Share Story
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
