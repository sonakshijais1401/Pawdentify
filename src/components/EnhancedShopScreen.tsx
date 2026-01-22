import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Heart, Filter, Search, Award, Truck, Shield, Sparkles, Gift, Crown, Zap, TrendingUp, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

const products = [
  { id: 1, name: "Premium Leather Collar", price: 34.99, originalPrice: 49.99, rating: 4.9, reviews: 1247, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400", category: "Accessories", badge: "Best Seller", discount: 30 },
  { id: 2, name: "Smart Interactive Ball", price: 25.99, originalPrice: 35.99, rating: 4.8, reviews: 892, image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400", category: "Toys", badge: "New", discount: 28 },
  { id: 3, name: "Luxury Orthopedic Bed", price: 129.99, originalPrice: 179.99, rating: 4.9, reviews: 2156, image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", category: "Comfort", badge: "Premium", discount: 28 },
  { id: 4, name: "Designer Bowl Set", price: 29.99, originalPrice: 39.99, rating: 4.7, reviews: 634, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400", category: "Feeding", badge: "Popular", discount: 25 },
  { id: 5, name: "Professional Grooming Kit", price: 65.99, originalPrice: 89.99, rating: 4.8, reviews: 1089, image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400", category: "Grooming", badge: "Pro Choice", discount: 27 },
  { id: 6, name: "Smart Travel Bottle", price: 18.99, originalPrice: 24.99, rating: 4.6, reviews: 445, image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400", category: "Travel", badge: "Eco-Friendly", discount: 24 },
  { id: 7, name: "GPS Tracking Collar", price: 89.99, originalPrice: 119.99, rating: 4.9, reviews: 756, image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400", category: "Tech", badge: "Smart", discount: 25 },
  { id: 8, name: "Heated Pet Blanket", price: 45.99, originalPrice: 59.99, rating: 4.7, reviews: 523, image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400", category: "Comfort", badge: "Winter Special", discount: 23 },
  { id: 9, name: "Puzzle Feeder Bowl", price: 22.99, originalPrice: 29.99, rating: 4.8, reviews: 789, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400", category: "Feeding", badge: "Brain Training", discount: 23 },
  { id: 10, name: "LED Safety Harness", price: 32.99, originalPrice: 42.99, rating: 4.6, reviews: 412, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", category: "Safety", badge: "Night Safe", discount: 23 },
  { id: 11, name: "Automatic Treat Dispenser", price: 79.99, originalPrice: 99.99, rating: 4.8, reviews: 634, image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400", category: "Tech", badge: "Smart Home", discount: 20 },
  { id: 12, name: "Waterproof Car Seat Cover", price: 39.99, originalPrice: 54.99, rating: 4.7, reviews: 892, image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400", category: "Travel", badge: "Car Essential", discount: 27 },
];

const categories = ["All", "Accessories", "Toys", "Comfort", "Feeding", "Grooming", "Travel", "Tech", "Safety"];

const featuredDeals = [
  { title: "Winter Sale", subtitle: "Up to 40% off cozy items", gradient: "from-blue-500 to-purple-600", icon: "❄️" },
  { title: "Smart Tech", subtitle: "Latest pet technology", gradient: "from-green-500 to-teal-600", icon: "🤖" },
  { title: "Premium Collection", subtitle: "Luxury accessories", gradient: "from-orange-500 to-red-600", icon: "👑" },
];

export function EnhancedShopScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getBadgeStyle = (badge: string) => {
    const styles: { [key: string]: string } = {
      "Best Seller": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      "New": "bg-gradient-to-r from-green-400 to-blue-500 text-white",
      "Premium": "bg-gradient-to-r from-purple-400 to-pink-500 text-white",
      "Popular": "bg-gradient-to-r from-red-400 to-pink-500 text-white",
      "Pro Choice": "bg-gradient-to-r from-indigo-400 to-purple-500 text-white",
      "Smart": "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",
      "Default": "bg-gray-100 text-gray-700"
    };
    return styles[badge] || styles["Default"];
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        {/* Grand Header */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
            paddingTop: "48px",
            paddingBottom: "80px",
          }}
        >
          {/* Animated Background Elements */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />

          <div className="px-6 relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                className="inline-flex items-center justify-center rounded-full mb-6"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: isMobile ? "32px" : "42px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                Premium Pet Accessories
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: isMobile ? "16px" : "18px",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginBottom: "24px",
                }}
              >
                Luxury products crafted for your beloved companion
              </p>

              {/* Stats Row */}
              <div className="flex justify-center gap-8 mb-6">
                {[
                  { icon: Package, label: "500+ Products", value: "500+" },
                  { icon: Award, label: "Premium Quality", value: "★★★★★" },
                  { icon: Truck, label: "Free Shipping", value: "$50+" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="text-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1, type: "spring" }}
                  >
                    <stat.icon className="w-6 h-6 text-white mx-auto mb-1" />
                    <div className="text-white text-sm font-semibold">{stat.value}</div>
                    <div className="text-white/80 text-xs">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className={isMobile ? "px-6 -mt-12" : "px-8 py-8 max-w-7xl mx-auto -mt-12"}>
          {/* Featured Deals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
            {featuredDeals.map((deal, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-2xl bg-gradient-to-r ${deal.gradient} text-white relative overflow-hidden cursor-pointer`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-0 right-0 text-6xl opacity-20"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {deal.icon}
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">{deal.title}</h3>
                  <p className="text-sm opacity-90">{deal.subtitle}</p>
                  <motion.div
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
                    whileHover={{ x: 5 }}
                  >
                    Shop Now <Sparkles className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter Section */}
          <motion.div
            className="bg-white rounded-2xl p-6 mb-6 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search premium products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-100 focus:border-orange-300"
                  style={{
                    borderRadius: "16px",
                    background: "#F8F9FA",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                  }}
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-12 px-6 border-2 border-gray-100 hover:border-orange-300"
                style={{ borderRadius: "16px" }}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
          </motion.div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-6 py-3 rounded-full whitespace-nowrap transition-all flex items-center gap-2"
                  style={{
                    background: selectedCategory === cat 
                      ? "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)" 
                      : "#FFFFFF",
                    color: selectedCategory === cat ? "#FFFFFF" : "#7F8C8D",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: selectedCategory === cat ? "none" : "2px solid #ECEFF1",
                    boxShadow: selectedCategory === cat ? "0 4px 12px rgba(244, 162, 97, 0.3)" : "none",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedCategory === cat && <TrendingUp className="w-4 h-4" />}
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-6`}>
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    overflow: "hidden",
                  }}
                  whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)" }}
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Discount Badge */}
                    {product.discount && (
                      <motion.div
                        className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        -{product.discount}%
                      </motion.div>
                    )}

                    {/* Category Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(product.badge)}`}>
                      {product.badge}
                    </div>

                    {/* Favorite Button */}
                    <motion.button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#2C3E50",
                        marginBottom: "8px",
                        lineHeight: "1.3",
                      }}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#F4A261",
                          }}
                        >
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-10"
                        style={{
                          background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                          borderRadius: "12px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          border: "none",
                        }}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 bg-white rounded-2xl p-8 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-center text-xl font-bold text-gray-900 mb-6">Why Choose Our Premium Collection?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Quality Guaranteed", desc: "Premium materials & craftsmanship" },
                { icon: Truck, title: "Fast & Free Shipping", desc: "Free delivery on orders over $50" },
                { icon: Award, title: "Expert Curated", desc: "Handpicked by pet care professionals" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}