import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Heart, Filter, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

const products = [
  { id: 1, name: "Premium Dog Collar", price: 24.99, rating: 4.8, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400", category: "Accessories" },
  { id: 2, name: "Interactive Toy Ball", price: 15.99, rating: 4.9, image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400", category: "Toys" },
  { id: 3, name: "Orthopedic Dog Bed", price: 89.99, rating: 4.7, image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", category: "Comfort" },
  { id: 4, name: "Stainless Steel Bowl Set", price: 19.99, rating: 4.6, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400", category: "Feeding" },
  { id: 5, name: "Grooming Kit Pro", price: 45.99, rating: 4.8, image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400", category: "Grooming" },
  { id: 6, name: "Travel Water Bottle", price: 12.99, rating: 4.5, image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400", category: "Travel" },
];

const categories = ["All", "Accessories", "Toys", "Comfort", "Feeding", "Grooming", "Travel"];

export function ShopScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        {/* Header */}
        <div
          className="px-6 pt-12 pb-6"
          style={{
            background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "8px",
            }}
          >
            Pet Accessories
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Premium products for your furry friend
          </p>
        </div>

        <div className={isMobile ? "px-6" : "px-8 py-8 max-w-7xl mx-auto"}>
          {/* Search & Filter */}
          <div className="mb-6 -mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-12 h-12"
                style={{
                  borderRadius: "16px",
                  border: "1px solid #ECEFF1",
                  background: "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-full whitespace-nowrap transition-all"
                style={{
                  background: selectedCategory === cat ? "#F4A261" : "#FFFFFF",
                  color: selectedCategory === cat ? "#FFFFFF" : "#7F8C8D",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: selectedCategory === cat ? "none" : "1px solid #ECEFF1",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-4`}>
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  overflow: "hidden",
                }}
              >
                {/* Product Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C3E50",
                      marginBottom: "4px",
                    }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        color: "#7F8C8D",
                      }}
                    >
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#F4A261",
                      }}
                    >
                      ${product.price}
                    </span>
                    <Button
                      className="h-8 px-3"
                      style={{
                        background: "#F4A261",
                        borderRadius: "12px",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                      }}
                    >
                      <ShoppingBag className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
