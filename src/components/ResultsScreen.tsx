import { useState } from "react";
import {
  Share2,
  Bookmark,
  Heart,
  Cloud,
  CheckCircle,
  TrendingUp,
  Thermometer,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as RechartsContainer,
} from "recharts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";
import { getScanHistory, ScanHistoryEntry } from "../services/scanHistoryService";
import { useAuth } from "../contexts/AuthContext";

interface ResultsScreenProps {
  onBack: () => void;
  result?: any;
  image?: string | null;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 85)
    return {
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      progressColor: "bg-emerald-500",
      label: "Excellent",
    };
  if (confidence >= 70)
    return {
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200",
      progressColor: "bg-blue-500",
      label: "Good",
    };
  if (confidence >= 50)
    return {
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
      progressColor: "bg-amber-500",
      label: "Moderate",
    };
  return {
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    progressColor: "bg-red-500",
    label: "Low",
  };
};

const getWeatherSeverity = (temp: number) => {
  if (temp >= 85)
    return {
      bg: "from-red-50 to-orange-50",
      border: "border-red-300",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-900",
      subColor: "text-red-800",
      level: "High Alert",
    };
  if (temp >= 75)
    return {
      bg: "from-orange-50 to-yellow-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-orange-900",
      subColor: "text-orange-800",
      level: "Caution",
    };
  return {
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    textColor: "text-green-900",
    subColor: "text-green-800",
    level: "Optimal",
  };
};

export function ResultsScreen({ onBack, result, image }: ResultsScreenProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const { user } = useAuth();
  const [scanHistory] = useState<ScanHistoryEntry[]>(user ? getScanHistory(user.uid) : []);

  // SAFE defaults (so no redirect, no fixed golden retriever)
  const breedName = result?.predictions?.[0]?.breed || "Unknown Breed";
  const breedConfidence = result?.predictions?.[0]?.confidence || 0;
  const breedDescription =
    result?.predictions?.[0]?.description ||
    "No description available for this breed.";

  const [isFavorited, setIsFavorited] = useState(false);

  const confidence = Math.round(breedConfidence);
  const temperature = 72;

  const confidenceStyle = getConfidenceColor(confidence);
  const weatherStyle = getWeatherSeverity(temperature);

  const breedData = [
    { name: breedName, value: confidence, color: "#10B981" },
    { name: "Other", value: 100 - confidence, color: "#E5E7EB" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : 0 }}
    >
      <ResponsiveContainer>
        <motion.div
          className="px-6 pt-12 pb-6"
          style={{
            background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4"
            style={{
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2
            style={{
              color: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Breed Identified
          </h2>
        </motion.div>

        <div
          className={isMobile ? "px-6 -mt-4" : "px-8 -mt-4 max-w-7xl mx-auto"}
        >
          <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-8"}>
            {/* LEFT SIDE */}
            <motion.div
              className="space-y-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* IMAGE */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Dog"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: isMobile ? "400px" : "300px" }}
                  />
                ) : (
                  <ImageWithFallback
                    src=""
                    alt="Dog"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: isMobile ? "400px" : "300px" }}
                  />
                )}

                {/* Confidence badge */}
                <motion.div
                  className={`absolute top-4 right-4 ${confidenceStyle.bg} ${confidenceStyle.border} border px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                >
                  <CheckCircle className={`w-4 h-4 ${confidenceStyle.color}`} />
                  <span className={`${confidenceStyle.color} text-sm`}>
                    {confidenceStyle.label}
                  </span>
                </motion.div>
              </motion.div>

              {/* Breed name */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {breedName}
                    </h1>
                    <Badge
                      className={`${confidenceStyle.bg} ${confidenceStyle.color}`}
                    >
                      Purebred
                    </Badge>
                  </div>

                  <motion.button
                    className={isFavorited ? "text-red-500" : "text-gray-300"}
                    onClick={() => setIsFavorited(!isFavorited)}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Heart
                      className={`w-6 h-6 ${isFavorited ? "fill-current" : ""}`}
                    />
                  </motion.button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Confidence Level
                    </span>
                    <span className={confidenceStyle.color}>{confidence}%</span>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={confidenceStyle.progressColor}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 1 }}
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
              </motion.div>

              <Card className="p-5">
                <h3 className="text-gray-900 mb-2 font-semibold">
                  Breed Information
                </h3>

                <p className="text-gray-700 text-sm mb-2">
                  <strong>Nature:</strong> Friendly, intelligent, and loyal
                  temperament common in most dog breeds.
                </p>

                <p className="text-gray-700 text-sm mb-2">
                  <strong>Diet:</strong> A balanced diet of high-quality protein
                  (chicken, fish, or lamb), whole grains, and essential fats.
                  Include vegetables like carrots, pumpkin, and peas in
                  moderation. Avoid chocolate, grapes, onions, and oily foods.
                </p>

                <p className="text-gray-700 text-sm">
                  <strong>Healthcare Tips:</strong> Ensure regular vet
                  check-ups, timely vaccinations, proper hydration, monthly
                  deworming, and daily physical activity. Maintain good grooming
                  and check ears, teeth, and paws regularly.
                </p>
              </Card>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              className="space-y-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {/* Weather Care */}
              <Card
                className={`bg-gradient-to-r ${weatherStyle.bg} ${weatherStyle.border} border p-4`}
              >
                <div className="flex gap-3">
                  <div className={`${weatherStyle.iconBg} rounded-full p-2`}>
                    <Thermometer
                      className={`w-5 h-5 ${weatherStyle.iconColor}`}
                    />
                  </div>

                  <div>
                    <h3 className={`${weatherStyle.textColor} font-semibold`}>
                      Weather Care Alert
                    </h3>
                    <p className={`${weatherStyle.subColor} text-sm`}>
                      Temperature {temperature}°F — ensure hydration.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Breed Composition */}
              <Card className="p-5 bg-gradient-to-br from-white to-blue-50/30">
                <h3 className="text-gray-900 mb-4 font-semibold">
                  Breed Composition
                </h3>

                <div className="w-28 h-28 mx-auto">
                  <RechartsContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breedData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {breedData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </RechartsContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* PREVIOUS SCANS SECTION */}
          {scanHistory.length > 1 && (
            <motion.div
              className={isMobile ? "mt-8 px-6" : "mt-12 max-w-7xl mx-auto"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: 700,
                  color: "#2C3E50",
                  marginBottom: "16px",
                }}
              >
                Previous Scans
              </h3>

              <div className={isMobile ? "space-y-3" : "grid grid-cols-4 gap-4"}>
                {scanHistory.slice(1, 5).map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      {/* Image */}
                      <div className="relative overflow-hidden bg-gray-200 h-32">
                        <img
                          src={entry.image}
                          alt={entry.predictedBreed}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
                          {entry.predictedBreed}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            className="bg-emerald-100 text-emerald-700"
                            style={{ fontSize: "11px" }}
                          >
                            {entry.confidence ?? "—"}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(entry.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
