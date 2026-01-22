import { useState, useEffect, useRef } from "react";
import { X, ImageIcon, Zap, Info, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";
import { useAuth } from "../contexts/AuthContext";
import { saveHistoryItem } from "../services/historyService";
import { savePredictionData } from "../services/predictionService";
import { saveScanHistory } from "../services/scanHistoryService";

interface CameraScreenProps {
  onBack: () => void;
  onPhotoTaken?: (imageData: string, predictions: any) => void;
}

const dogFacts = [
  "Dogs have three eyelids",
  "A dog's sense of smell is 10,000x stronger",
  "Dogs can dream just like we do",
  "Puppies have 28 teeth, adults have 42",
  "Each dog's nose print is unique",
  "Dogs can see in color",
  "Dogs have a sense of time",
  "A dog's heart beats 60-140 times per minute",
];

export function CameraScreen({ onBack }: CameraScreenProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const { user } = useAuth();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [predictionData, setPredictionData] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (processing) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % dogFacts.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [processing]);

  // Send file to FastAPI prediction endpoint
  const classifyDog = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
        headers: {
          // Let the server know we expect JSON back
          Accept: "application/json",
        },
      });

      // Helpful debug logging for network issues
      if (!response.ok) {
        const text = await response.text().catch(() => "<no-response-body>");
        console.error("Prediction API returned non-OK status", response.status, text);
        throw new Error(`Prediction API failed: ${response.status}`);
      }

      const json = await response.json();
      console.log("Prediction API response:", json);
      return json;
    } catch (error) {
      console.error("Prediction Error:", error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);

      setProcessing(true);
      try {
        // Only call the FastAPI prediction
        const prediction = await classifyDog(file);

        // If backend returned an image data URL, prefer showing it (server-encoded)
        if (prediction && prediction.image) {
          setSelectedImage(prediction.image);
        }

        if (prediction) {
          setPredictionData(prediction);
        } else {
          // Show a friendly fallback in UI if prediction failed
          setPredictionData({ predicted_breed: "Not Available", confidence: null });
        }

        // Save to both Firestore and Realtime Database (non-blocking)
        if (user && prediction) {
          const predictedBreed = prediction.predicted_breed || prediction.predictedBreed || prediction.top3?.[0]?.breed || "";
          const confidence = prediction.confidence || prediction.probability || null;
          
          // Save history to old collection (for backward compatibility)
          saveHistoryItem(user.uid, imageData, predictedBreed).catch((err) =>
            console.error("saveHistoryItem failed", err)
          );

          // Save prediction data to both Firestore and RTDB
          savePredictionData(user.uid, imageData, prediction).catch((err) =>
            console.error("savePredictionData failed", err)
          );

          // Save to localStorage for persistent local history (user-specific)
          try {
            saveScanHistory({
              image: imageData,
              predictedBreed,
              confidence: typeof confidence === 'number' ? Math.round(confidence) : null,
            }, user.uid);
          } catch (err) {
            console.error("saveScanHistory failed", err);
          }
        }
      } catch (err) {
        console.error("Error fetching prediction:", err);
      } finally {
        setProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        {/* Header */}
        <div
          className="px-6 pt-12 pb-6"
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #ECEFF1",
          }}
        >
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
              <X className="w-6 h-6" style={{ color: "#2C3E50" }} />
            </button>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "18px", fontWeight: 600, color: "#2C3E50" }}>
              Identify Breed
            </h2>
            <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition">
              <Info className="w-6 h-6" style={{ color: "#7F8C8D" }} />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder - Responsive Grid Layout */}
        <div className={isMobile ? "px-6 pt-6" : "px-8 pt-8 max-w-7xl mx-auto"}>
          <div className={isMobile ? "space-y-6" : "grid grid-cols-2 gap-8 items-start"}>
            {/* Left Side - Camera */}
            <motion.div
              className="relative overflow-hidden"
              style={{
                background: "#FFFFFF",
                borderRadius: "24px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                aspectRatio: isMobile ? "3/4" : "1/1",
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
            {/* Image Preview or Placeholder */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: selectedImage 
                  ? `url(${selectedImage})` 
                  : "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!selectedImage && !processing && (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div
                    className="inline-flex items-center justify-center rounded-full mb-4"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Upload className="w-16 h-16" style={{ color: "#F4A261" }} />
                  </div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#2C3E50",
                    }}
                  >
                    Upload a dog photo
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#7F8C8D",
                      marginTop: "8px",
                    }}
                  >
                    Get instant breed identification
                  </p>
                </motion.div>
              )}

              {processing && (
                <motion.div className="text-center px-6 bg-black/50 absolute inset-0 flex items-center justify-center">
                  <div>
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity },
                      }}
                      className="inline-flex items-center justify-center rounded-full mb-4"
                      style={{
                        width: "100px",
                        height: "100px",
                        background: "rgba(255, 255, 255, 0.95)",
                      }}
                    >
                      <Zap className="w-12 h-12" style={{ color: "#F4A261" }} />
                    </motion.div>
                    <motion.p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        marginBottom: "8px",
                      }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Analyzing...
                    </motion.p>
                    <motion.p
                      key={currentFactIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#FFFFFF",
                      }}
                    >
                      {dogFacts[currentFactIndex]}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Scanning Animation Overlay */}
            {processing && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute w-full h-1"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, #F4A261 50%, transparent 100%)",
                    boxShadow: "0 0 20px rgba(244, 162, 97, 0.6)",
                  }}
                  animate={{
                    top: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}

            {/* Corner Frame */}
            {!processing && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-6 left-6 w-12 h-12 border-l-3 border-t-3" style={{ borderColor: "#F4A261", borderWidth: "3px" }} />
                <div className="absolute top-6 right-6 w-12 h-12 border-r-3 border-t-3" style={{ borderColor: "#F4A261", borderWidth: "3px" }} />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-l-3 border-b-3" style={{ borderColor: "#F4A261", borderWidth: "3px" }} />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-r-3 border-b-3" style={{ borderColor: "#F4A261", borderWidth: "3px" }} />
              </div>
            )}
          </motion.div>

            {/* Prediction Result (only place where model output is shown) */}
            {predictionData && (
              <div className="mt-4 p-4 rounded-xl border bg-white shadow">
                <h3 className="font-bold text-lg">Prediction Result</h3>
                <p>
                  <strong>Breed:</strong> {predictionData.predicted_breed || predictionData.predictedBreed || predictionData.top3?.[0]?.breed || 'Not available'}
                </p>
                <p>
                  <strong>Confidence:</strong> {predictionData.confidence ?? predictionData.probability ?? 'Not available'}%
                </p>

                <div className="mt-2">
                  <h4 className="font-semibold">Nature:</h4>
                  <p>{predictionData.info?.nature || 'Not available'}</p>

                  <h4 className="font-semibold mt-2">Diet:</h4>
                  <p>{predictionData.info?.diet || 'Not available'}</p>

                  <h4 className="font-semibold mt-2">Healthcare Tips:</h4>
                  <p>{predictionData.info?.healthcare_tips || 'Not available'}</p>
                </div>
              </div>
            )}

            {/* Right Side - Desktop Only Info & Actions */}
            {!isMobile && (
              <motion.div 
                className="space-y-6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Header Section */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "8px",
                    }}
                  >
                    Identify Your Dog
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      color: "#7F8C8D",
                      fontWeight: 500,
                    }}
                  >
                    Upload a photo to discover the breed
                  </p>
                </motion.div>

                {/* Tips Card */}
                {!processing && (
                  <motion.div
                    className="p-6 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #FFF3E0 0%, #FFEAE3 100%)",
                      border: "1px solid #FFE5D9",
                      boxShadow: "0 4px 12px rgba(244, 162, 97, 0.1)",
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(244, 162, 97, 0.15)" }}
                  >
                    <div className="flex gap-4">
                      <div
                        className="rounded-full p-3 flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                          boxShadow: "0 4px 12px rgba(244, 162, 97, 0.3)",
                        }}
                      >
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#2C3E50",
                            marginBottom: "8px",
                          }}
                        >
                          Tips for Best Results
                        </p>
                        <ul
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            color: "#7F8C8D",
                            lineHeight: "1.8",
                          }}
                        >
                          <li>✓ Ensure good lighting conditions</li>
                          <li>✓ Center the dog clearly in frame</li>
                          <li>✓ Avoid shadows or obstructions</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stats Grid */}
                <motion.div
                  className="grid grid-cols-3 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { label: "Accuracy", value: "95%", icon: "✓", color: "#58D68D" },
                    { label: "Speed", value: "2 sec", icon: "⚡", color: "#F4A261" },
                    { label: "Breeds", value: "300+", icon: "🐕", color: "#5DADE2" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="p-4 rounded-2xl text-center cursor-pointer"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #F0E6E1",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{
                        scale: 1.08,
                        boxShadow: `0 8px 24px ${stat.color}30`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "24px",
                          marginBottom: "6px",
                        }}
                      >
                        {stat.icon}
                      </p>
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "18px",
                          fontWeight: 800,
                          color: stat.color,
                          marginBottom: "2px",
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
                    </motion.div>
                  ))}
                </motion.div>

                {/* Processing Info */}
                {processing && (
                  <motion.div
                    className="p-6 rounded-2xl"
                    style={{
                      background: "#E8F5E9",
                      border: "1px solid #C8E6C9",
                      boxShadow: "0 4px 12px rgba(88, 214, 141, 0.1)",
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center justify-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#58D68D",
                          borderRadius: "50%",
                          color: "#FFFFFF",
                        }}
                      >
                        ⚡
                      </motion.div>
                      <div className="flex-1">
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#2C3E50",
                          }}
                        >
                          Processing Image
                        </p>
                        <motion.p
                          key={currentFactIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: "#58D68D",
                            marginTop: "4px",
                          }}
                        >
                          💡 {dogFacts[currentFactIndex]}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Upload Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={handleUploadClick}
                    disabled={processing}
                    className="w-full h-14 disabled:opacity-50 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      boxShadow: "0 8px 24px rgba(244, 162, 97, 0.3)",
                      color: "#FFFFFF",
                      border: "none",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <Upload className="w-5 h-5" />
                    {processing ? "Analyzing..." : "Upload Photo"}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Hidden File Input */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

          {/* Mobile Layout - Instructions Below Camera */}
          {isMobile && (
            <>
              {/* Instructions Card */}
              {!processing && (
                <motion.div
                  className="mt-4 p-4 flex items-start gap-3 rounded-2xl"
                  style={{
                    background: "#FFF3E0",
                    border: "1px solid #FFE5D9",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className="rounded-full p-2"
                    style={{
                      background: "#F4A261",
                      flexShrink: 0,
                    }}
                  >
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#2C3E50",
                        marginBottom: "4px",
                      }}
                    >
                      Tips for best results:
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        color: "#7F8C8D",
                        lineHeight: "1.6",
                      }}
                    >
                      • Ensure good lighting
                      <br />
                      • Center the dog in frame
                      <br />• Clear, unobstructed view
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleUploadClick}
                  disabled={processing}
                  className="w-full h-14 disabled:opacity-50 hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    borderRadius: "16px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Upload Photo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3 pb-6">
                {[
                  { label: "Accurate", value: "95%" },
                  { label: "Fast", value: "2s" },
                  { label: "Breeds", value: "300+" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 rounded-2xl"
                    style={{
                      background: "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#2C3E50",
                        marginBottom: "2px",
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
            </>
          )}

          {/* Previous scans removed to avoid showing stored model results in this component */}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
