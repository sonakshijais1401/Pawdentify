import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Zap, TrendingUp } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";
import { useState, useEffect } from "react";
import { getScanHistory, ScanHistoryEntry } from "../services/scanHistoryService";
import { useAuth } from "../contexts/AuthContext";

interface HistoryScreenProps {
  onViewResult: (entry: ScanHistoryEntry) => void;
}

// Helper function to get confidence level color
const getConfidenceStyle = (confidence: number | null) => {
  if (confidence === null) return { 
    bg: "bg-gray-100", 
    text: "text-gray-700",
    border: "border-gray-200",
    progressBg: "bg-gray-500"
  };
  if (confidence >= 85) return { 
    bg: "bg-emerald-100", 
    text: "text-emerald-700",
    border: "border-emerald-200",
    progressBg: "bg-emerald-500"
  };
  if (confidence >= 70) return { 
    bg: "bg-blue-100", 
    text: "text-blue-700",
    border: "border-blue-200",
    progressBg: "bg-blue-500"
  };
  if (confidence >= 50) return { 
    bg: "bg-amber-100", 
    text: "text-amber-700",
    border: "border-amber-200",
    progressBg: "bg-amber-500"
  };
  return { 
    bg: "bg-red-100", 
    text: "text-red-700",
    border: "border-red-200",
    progressBg: "bg-red-500"
  };
};

export function HistoryScreen({ onViewResult }: HistoryScreenProps) {
  const { viewMode } = useLayout();
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    // Load history on mount and when page becomes visible
    const loadHistory = () => {
      if (user) {
        setHistoryItems(getScanHistory(user.uid));
      }
    };

    loadHistory();

    // Refresh when window/tab gains focus
    const onFocus = () => loadHistory();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) onFocus();
    });

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', () => {});
    };
  }, [user]);

  // Format items for display
  const formattedItems = historyItems.map((item) => {
    const breed = item.predictedBreed || 'Unknown';
    const image = item.image || '';
    const confidence = item.confidence ?? null;
    let date = '—';
    try {
      if (item.timestamp) {
        date = new Date(item.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
    } catch (e) {
      date = '—';
    }
    return { id: item.id, breed, image, confidence, date };
  });

  // Desktop view
  if (viewMode === "desktop") {
    return (
      <div className="px-12 py-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontWeight: 900,
              background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            Identification History
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: "#7F8C8D",
            }}
          >
            Your complete dog breed identification records
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-3 gap-6 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {(() => {
            const total = historyItems.length;
            const confidences = historyItems
              .map((h) => h.confidence)
              .filter((c) => typeof c === 'number') as number[];
            const avg = confidences.length > 0 
              ? Math.round(confidences.reduce((s, v) => s + v, 0) / confidences.length) + '%' 
              : '—';
            const last = historyItems[0]?.timestamp 
              ? new Date(historyItems[0].timestamp).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                }) 
              : '—';

            const stats = [
              { icon: TrendingUp, label: 'Total Scans', value: total, color: '#F4A261' },
              { icon: Zap, label: 'Avg Confidence', value: avg, color: '#5DADE2' },
              { icon: Calendar, label: 'Last Scan', value: last, color: '#58D68D' },
            ];

            return stats.map((stat, idx) => {
              const Icon = stat.icon as any;
              return (
                <motion.div
                  key={idx}
                  className="p-6 rounded-2xl"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #F0E6E1',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)' }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: `${stat.color}20` }}>
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#7F8C8D', fontWeight: 600 }}>{stat.label}</p>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            });
          })()}
        </motion.div>

        {/* History Grid */}
        <motion.div
          className="grid grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formattedItems.map((item, index) => {
            const style = getConfidenceStyle(item.confidence);
            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onViewResult(historyItems[index])}
                className="cursor-pointer group"
              >
                  <motion.div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #F0E6E1",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 12px 32px rgba(244, 162, 97, 0.15)",
                  }}
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden h-56">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.breed}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%)",
                      }}
                    />
                    {/* Confidence Badge */}
                    <motion.div
                      className="absolute top-4 right-4 px-4 py-2 rounded-full"
                      style={{
                        background: `${style.bg}E6`,
                        border: `2px solid ${style.text}`,
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2 + index * 0.1,
                        type: "spring",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: style.text,
                        }}
                      >
                        {item.confidence ?? "—"}%
                      </span>
                    </motion.div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#2C3E50",
                        marginBottom: "8px",
                      }}
                    >
                      {item.breed}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        color: "#7F8C8D",
                        marginBottom: "12px",
                      }}
                    >
                      {item.date}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`${style.progressBg} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.confidence ?? 0}%` }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                            duration: 0.6,
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: style.text,
                            fontWeight: 600,
                          }}
                        >
                          Confidence
                        </span>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="group-hover:text-orange-500 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {historyItems.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#7F8C8D",
                marginBottom: "8px",
              }}
            >
              No history yet
            </div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#A0AEC0",
              }}
            >
              Start identifying dog breeds to build your history
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  // Mobile view
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 pt-8 pb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-white text-xl">Identification History</h2>
        <p className="text-white/80 text-sm mt-1">View your past identifications</p>
      </motion.div>

      <div className="px-6 mt-6">
        <div className="space-y-4">
          {formattedItems.map((item, index) => {
            const style = getConfidenceStyle(item.confidence);
            
            return (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
                  onClick={() => onViewResult(historyItems[index])}
                >
                  <motion.div 
                    className="flex gap-4 p-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.breed}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      {/* Confidence indicator overlay */}
                      <motion.div
                        className={`absolute -top-1 -right-1 w-6 h-6 ${style.bg} rounded-full border-2 border-white flex items-center justify-center`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      >
                        <span className={`text-xs ${style.text}`}>✓</span>
                      </motion.div>
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {item.breed}
                          </h3>
                          <p className="text-gray-500 text-sm">{item.date}</p>
                        </div>
                        <Badge className={`${style.bg} ${style.text} ${style.border}`}>
                          {item.confidence ?? "—"}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`${style.progressBg} h-1.5 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence ?? 0}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                          />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {historyItems.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-gray-400 mb-2">No history yet</div>
            <p className="text-gray-500 text-sm">
              Start identifying dog breeds to build your history
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
