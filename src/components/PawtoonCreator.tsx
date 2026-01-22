import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Upload, Music, Type, Play, Check, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PawtoonImage {
  id: number;
  url: string;
  file?: File;
  text?: string;
  textPosition?: "top" | "center" | "bottom";
  textColor?: string;
}

interface PawtoonCreatorProps {
  onClose: () => void;
  onPublish: (pawtoon: { images: PawtoonImage[]; music?: string }) => void;
}

export function PawtoonCreator({ onClose, onPublish }: PawtoonCreatorProps) {
  const [step, setStep] = useState<"upload" | "edit" | "preview">("upload");
  const [images, setImages] = useState<PawtoonImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [musicFile, setMusicFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, idx) => ({
      id: Date.now() + idx,
      url: URL.createObjectURL(file),
      file,
      text: "",
      textPosition: "bottom" as const,
      textColor: "#FFFFFF",
    }));
    setImages([...images, ...newImages]);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMusicFile(URL.createObjectURL(file));
    }
  };

  const updateImageText = (id: number, text: string) => {
    setImages(images.map((img) => (img.id === id ? { ...img, text } : img)));
  };

  const updateTextPosition = (id: number, position: "top" | "center" | "bottom") => {
    setImages(images.map((img) => (img.id === id ? { ...img, textPosition: position } : img)));
  };

  const removeImage = (id: number) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handlePublish = () => {
    onPublish({ images, music: musicFile || undefined });
  };

  const playPreview = () => {
    setIsPlaying(true);
    setCurrentPlayIndex(0);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= images.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentPlayIndex(0);
      } else {
        setCurrentPlayIndex(index);
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50" style={{ background: "#FAFAFA" }}>
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #ECEFF1",
        }}
      >
        <button onClick={onClose} className="p-2 -ml-2">
          <X className="w-6 h-6" style={{ color: "#2C3E50" }} />
        </button>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "18px", fontWeight: 600, color: "#2C3E50" }}>
          Create Pawtoon
        </h2>
        {images.length > 0 && step !== "preview" && (
          <Button
            onClick={() => setStep("preview")}
            size="sm"
            style={{
              background: "#F4A261",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              border: "none",
            }}
          >
            Next
          </Button>
        )}
        {step === "preview" && (
          <Button
            onClick={handlePublish}
            size="sm"
            style={{
              background: "#58D68D",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              border: "none",
            }}
          >
            Publish
          </Button>
        )}
      </div>

      {/* Steps Indicator */}
      <div className="px-6 py-4" style={{ background: "#FFFFFF", borderBottom: "1px solid #ECEFF1" }}>
        <div className="flex items-center gap-2">
          {["Upload", "Edit", "Preview"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background: step === s.toLowerCase() || (idx === 0 && step === "edit") || (idx <= 1 && step === "preview") ? "#F4A261" : "#ECEFF1",
                  color: step === s.toLowerCase() || (idx === 0 && step === "edit") || (idx <= 1 && step === "preview") ? "#FFFFFF" : "#BDC3C7",
                }}
              >
                {idx + 1}
              </div>
              <span
                className="ml-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: step === s.toLowerCase() ? "#2C3E50" : "#BDC3C7",
                }}
              >
                {s}
              </span>
              {idx < 2 && <div className="w-8 h-[2px] mx-2" style={{ background: "#ECEFF1" }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
        {/* Upload Step */}
        {step === "upload" && (
          <div className="px-6 py-8">
            <motion.div
              className="text-center p-12 mb-6"
              style={{
                background: "#FFFFFF",
                borderRadius: "24px",
                border: "2px dashed #ECEFF1",
              }}
              whileHover={{ borderColor: "#F4A261" }}
              onClick={() => imageInputRef.current?.click()}
            >
              <div
                className="inline-flex items-center justify-center rounded-full mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                }}
              >
                <Upload className="w-10 h-10" style={{ color: "#F4A261" }} />
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#2C3E50",
                }}
              >
                Upload Images
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#7F8C8D" }}>
                Click to select up to 10 images for your Pawtoon
              </p>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.div>

            {/* Upload Music */}
            <motion.div
              className="p-6 mb-6"
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: musicFile ? "#58D68D20" : "#FFE5D9",
                    }}
                  >
                    <Music className="w-6 h-6" style={{ color: musicFile ? "#58D68D" : "#F4A261" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, color: "#2C3E50" }}>
                      {musicFile ? "Music Added" : "Add Background Music"}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#7F8C8D" }}>
                      Optional audio for your Pawtoon
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => musicInputRef.current?.click()}
                  size="sm"
                  variant="outline"
                  style={{
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {musicFile ? "Change" : "Upload"}
                </Button>
              </div>
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                className="hidden"
              />
            </motion.div>

            {/* Uploaded Images Grid */}
            {images.length > 0 && (
              <div>
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2C3E50",
                  }}
                >
                  Uploaded Images ({images.length}/10)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <motion.div
                      key={img.id}
                      className="relative aspect-square rounded-2xl overflow-hidden"
                      style={{
                        background: "#FFFFFF",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ImageWithFallback src={img.url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                      <div
                        className="absolute top-2 left-2 rounded-full flex items-center justify-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          background: "#F4A261",
                          color: "#FFFFFF",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          background: "rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </motion.div>
                  ))}
                  {images.length < 10 && (
                    <motion.button
                      onClick={() => imageInputRef.current?.click()}
                      className="aspect-square rounded-2xl flex items-center justify-center"
                      style={{
                        background: "#FFFFFF",
                        border: "2px dashed #ECEFF1",
                      }}
                      whileHover={{ borderColor: "#F4A261" }}
                    >
                      <Plus className="w-8 h-8" style={{ color: "#BDC3C7" }} />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Step */}
        {step === "edit" && (
          <div className="px-6 py-8">
            {/* Image Preview */}
            <div
              className="relative rounded-3xl overflow-hidden mb-6"
              style={{
                background: "#000000",
                aspectRatio: "9/16",
                maxHeight: "500px",
              }}
            >
              <ImageWithFallback
                src={images[currentImageIndex]?.url}
                alt="Edit"
                className="w-full h-full object-contain"
              />
              {images[currentImageIndex]?.text && (
                <div
                  className="absolute inset-0 flex items-center justify-center px-8"
                  style={{
                    alignItems:
                      images[currentImageIndex].textPosition === "top"
                        ? "flex-start"
                        : images[currentImageIndex].textPosition === "bottom"
                        ? "flex-end"
                        : "center",
                    paddingTop: images[currentImageIndex].textPosition === "top" ? "40px" : "0",
                    paddingBottom: images[currentImageIndex].textPosition === "bottom" ? "40px" : "0",
                  }}
                >
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: images[currentImageIndex].textColor,
                      textAlign: "center",
                      textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {images[currentImageIndex].text}
                  </motion.p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                disabled={currentImageIndex === 0}
                variant="outline"
                size="sm"
                style={{ borderRadius: "12px" }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#2C3E50" }}>
                {currentImageIndex + 1} / {images.length}
              </span>
              <Button
                onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                disabled={currentImageIndex === images.length - 1}
                variant="outline"
                size="sm"
                style={{ borderRadius: "12px" }}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Text Editor */}
            <div
              className="p-6 mb-4"
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#FFE5D9",
                  }}
                >
                  <Type className="w-5 h-5" style={{ color: "#F4A261" }} />
                </div>
                <h4 style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "#2C3E50" }}>
                  Add Text Overlay
                </h4>
              </div>
              <Input
                type="text"
                placeholder="Enter text for this image..."
                value={images[currentImageIndex]?.text || ""}
                onChange={(e) => updateImageText(images[currentImageIndex].id, e.target.value)}
                className="mb-3 h-12"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #ECEFF1",
                  background: "#F7F9FA",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              />

              {/* Position Selector */}
              <div>
                <p className="mb-2" style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#7F8C8D" }}>
                  Text Position
                </p>
                <div className="flex gap-2">
                  {[
                    { value: "top", label: "Top" },
                    { value: "center", label: "Center" },
                    { value: "bottom", label: "Bottom" },
                  ].map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => updateTextPosition(images[currentImageIndex].id, pos.value as any)}
                      className="flex-1 py-2 rounded-xl"
                      style={{
                        background: images[currentImageIndex]?.textPosition === pos.value ? "#F4A261" : "#F7F9FA",
                        color: images[currentImageIndex]?.textPosition === pos.value ? "#FFFFFF" : "#7F8C8D",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        border: "none",
                      }}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === "preview" && (
          <div className="px-6 py-8">
            <div
              className="relative rounded-3xl overflow-hidden mb-6"
              style={{
                background: "#000000",
                aspectRatio: "9/16",
                maxHeight: "500px",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? currentPlayIndex : "static"}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={images[isPlaying ? currentPlayIndex : 0]?.url}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  {images[isPlaying ? currentPlayIndex : 0]?.text && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center px-8"
                      style={{
                        alignItems:
                          images[isPlaying ? currentPlayIndex : 0].textPosition === "top"
                            ? "flex-start"
                            : images[isPlaying ? currentPlayIndex : 0].textPosition === "bottom"
                            ? "flex-end"
                            : "center",
                        paddingTop: images[isPlaying ? currentPlayIndex : 0].textPosition === "top" ? "40px" : "0",
                        paddingBottom: images[isPlaying ? currentPlayIndex : 0].textPosition === "bottom" ? "40px" : "0",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "24px",
                          fontWeight: 700,
                          color: images[isPlaying ? currentPlayIndex : 0].textColor,
                          textAlign: "center",
                          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        {images[isPlaying ? currentPlayIndex : 0].text}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    onClick={playPreview}
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(244, 162, 97, 0.95)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div
                className="p-5 flex items-center gap-4"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                }}
              >
                <Check className="w-6 h-6" style={{ color: "#58D68D" }} />
                <div className="flex-1">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, color: "#2C3E50" }}>
                    {images.length} Images Added
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#7F8C8D" }}>
                    3 seconds per image
                  </p>
                </div>
              </div>

              {musicFile && (
                <div
                  className="p-5 flex items-center gap-4"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "20px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Check className="w-6 h-6" style={{ color: "#58D68D" }} />
                  <div className="flex-1">
                    <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px", fontWeight: 600, color: "#2C3E50" }}>
                      Background Music Added
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#7F8C8D" }}>
                      Music will play during slideshow
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
