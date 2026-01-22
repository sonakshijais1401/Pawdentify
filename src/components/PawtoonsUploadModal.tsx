import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Music, Type } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PawtoonsUploadModalProps {
  onClose: () => void;
  onUpload: (pawtoons: Array<{ image: string; text: string }>, music?: string) => void;
}

export function PawtoonsUploadModal({ onClose, onUpload }: PawtoonsUploadModalProps) {
  const [images, setImages] = useState<Array<{ file: File; preview: string; text: string }>>([]);
  const [music, setMusic] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          { file, preview: event.target?.result as string, text: "" },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMusicSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setMusic(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTextChange = (index: number, text: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, text } : img))
    );
  };

  const handleUpload = () => {
    const pawtoons = images.map((img) => ({
      image: img.preview,
      text: img.text,
    }));
    onUpload(pawtoons, music || undefined);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-2xl mx-4"
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "2px solid #000000",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div
          className="p-6 flex items-center justify-between"
          style={{
            borderBottom: "2px solid #ECEFF1",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "#2C3E50",
            }}
          >
            Create Pawtoon
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <motion.div
                  className="inline-flex flex-col items-center justify-center p-12 rounded-3xl"
                  style={{
                    background: "#F7F9FA",
                    border: "3px dashed #BDC3C7",
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Upload className="w-16 h-16 mb-4" style={{ color: "#F4A261" }} />
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#2C3E50",
                    }}
                  >
                    Upload Images
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#7F8C8D",
                      marginTop: "8px",
                    }}
                  >
                    Click to select multiple images
                  </p>
                </motion.div>
              </label>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className="flex-shrink-0 relative"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        border: currentImageIndex === idx ? "3px solid #F4A261" : "2px solid #ECEFF1",
                        overflow: "hidden",
                      }}
                    >
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <label className="flex-shrink-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "12px",
                        border: "2px dashed #BDC3C7",
                        background: "#F7F9FA",
                      }}
                    >
                      <Upload className="w-6 h-6" style={{ color: "#7F8C8D" }} />
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div
                  className="relative rounded-2xl overflow-hidden mb-4"
                  style={{
                    aspectRatio: "9/16",
                    maxHeight: "400px",
                    border: "2px solid #000000",
                  }}
                >
                  <img
                    src={images[currentImageIndex].preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {images[currentImageIndex].text && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: "rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "24px",
                          fontWeight: 700,
                          color: "#FFFFFF",
                          textAlign: "center",
                          textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                          padding: "0 20px",
                        }}
                      >
                        {images[currentImageIndex].text}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Add text to this image..."
                    value={images[currentImageIndex].text}
                    onChange={(e) => handleTextChange(currentImageIndex, e.target.value)}
                    className="pl-12 h-12"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #000000",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicSelect}
                    className="hidden"
                  />
                  <div
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{
                      background: music ? "#F4A26120" : "#F7F9FA",
                      border: "2px solid #000000",
                    }}
                  >
                    <Music className="w-6 h-6" style={{ color: "#F4A261" }} />
                    <div className="flex-1">
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#2C3E50",
                        }}
                      >
                        {music ? "Music Added" : "Add Background Music (Optional)"}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          color: "#7F8C8D",
                        }}
                      >
                        {music ? "Click to change" : "Click to upload audio"}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        {images.length > 0 && (
          <div
            className="p-6 flex gap-3"
            style={{
              borderTop: "2px solid #ECEFF1",
            }}
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12"
              style={{
                borderRadius: "12px",
                border: "2px solid #000000",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1 h-12"
              style={{
                background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                borderRadius: "12px",
                border: "2px solid #000000",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Create Pawtoon
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
