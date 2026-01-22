import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Calendar, Gift, ChevronRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DogMascot } from "./DogMascot";
import { PawHoverEffect } from "./PawHoverEffect";
import { audioManager } from "../utils/audioManager";
import { saveDogProfile } from "../services/dogProfileStorage";
import { useAuth } from "../contexts/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

interface OnboardingScreenProps {
  onComplete: (dogData: {
    name: string;
    age: string;
    birthday: string;
    hasAudio: boolean;
  }) => void;
  onQuizRedirect?: () => void;
  setScreen?: (screen: string) => void;
}

export function OnboardingScreen({ onComplete, onQuizRedirect, setScreen }: OnboardingScreenProps) {
  const { isMobile } = useResponsive();
  const { setDogProfile } = useAuth();
  const [step, setStep] = useState(0); // Start with step 0 for pet ownership check
  const [hasPet, setHasPet] = useState<boolean | null>(null);
  const [dogName, setDogName] = useState("");
  const [dogAge, setDogAge] = useState("");
  const [dogBirthday, setDogBirthday] = useState("");
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("Welcome! Let's start by knowing if you already have a furry friend or looking to find one!");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleRecordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioManager.setDogAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        setHasRecordedAudio(true);
        setIsRecording(false);
        setMascotMessage("Perfect! That bark will make our app even more fun!");
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording after 2 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 2000);
    } catch (error) {
      console.error('Error recording audio:', error);
      setIsRecording(false);
      // Continue without audio
      setMascotMessage("No worries! We can continue without audio.");
    }
  };

  const handlePetOwnership = (owns: boolean) => {
    setHasPet(owns);
    if (owns) {
      setStep(1);
      setMascotMessage("Awesome! Let's set up your furry friend's profile. What's their name?");
    } else {
      setMascotMessage("No worries! Let's find your perfect furry companion through our tailored quiz!");
      setTimeout(() => {
        if (onQuizRedirect) {
          onQuizRedirect();
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      // Update mascot message based on step
      if (step === 1) {
        setMascotMessage("Great name! Now, let's record your dog's bark for fun effects!");
      } else if (step === 2) {
        setMascotMessage("How old is your furry friend?");
      } else if (step === 3) {
        setMascotMessage("When's the birthday party? We'll help you celebrate!");
      }
    } else {
      setMascotMessage("All set! Let's start discovering amazing breeds together!");
      setTimeout(() => {
        // Persist dog profile to localStorage and update global auth context
        try {
          saveDogProfile({
            name: dogName,
            age: dogAge,
            birthday: dogBirthday,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          // ignore
        }
        // update auth context
        try {
          setDogProfile({
            name: dogName,
            age: dogAge,
            birthday: dogBirthday,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {}

        onComplete({
          name: dogName,
          age: dogAge,
          birthday: dogBirthday,
          hasAudio: hasRecordedAudio,
        });
        setScreen?.("petDoctors");
      }, 1000);
    }
  };

  const canProceed = () => {
    if (step === 0) return hasPet !== null;
    if (step === 1) return dogName.trim() !== "";
    if (step === 2) return true; // Audio is optional
    if (step === 3) return dogAge.trim() !== "";
    if (step === 4) return dogBirthday.trim() !== "";
    return false;
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <div style={{ maxWidth: isMobile ? "480px" : "800px", margin: "0 auto" }}>
        {/* Header with Progress */}
        <div
          className="px-6 pt-12 pb-6"
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #ECEFF1",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            {[0, 1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <motion.div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: step >= num ? "#F4A261" : "#ECEFF1",
                    color: step >= num ? "#FFFFFF" : "#BDC3C7",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: num * 0.1 }}
                >
                  {step > num ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {num === 0 ? "?" : num}
                    </span>
                  )}
                </motion.div>
                {num < 4 && (
                  <div
                    className="w-4 h-[2px] mx-1"
                    style={{
                      background: step > num ? "#F4A261" : "#ECEFF1",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#7F8C8D",
              textAlign: "center",
            }}
          >
            {step === 0 ? "Pet Ownership" : `Step ${step} of 4`}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pt-8">
          <AnimatePresence mode="wait">
            {/* Step 0: Pet Ownership */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center rounded-full mb-4"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                    }}
                  >
                    <span style={{ fontSize: "60px" }}>🐕❓</span>
                  </div>
                  <h2
                    className="mb-4"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 600,
                      color: "#2C3E50",
                      lineHeight: 1.3,
                    }}
                  >
                    Do you currently have a dog?
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      color: "#7F8C8D",
                      lineHeight: 1.5,
                    }}
                  >
                    Let us know so we can personalize your experience!
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Yes, I have a dog */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handlePetOwnership(true)}
                      className="w-full p-6 rounded-3xl text-left transition-all"
                      style={{
                        background: hasPet === true ? "linear-gradient(135deg, #F4A26120 0%, #E76F5115 100%)" : "#FFFFFF",
                        border: hasPet === true ? "3px solid #F4A261" : "2px solid #ECEFF1",
                        boxShadow: hasPet === true ? "0 8px 32px rgba(244, 162, 97, 0.2)" : "0 4px 16px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex-shrink-0 rounded-2xl flex items-center justify-center"
                          style={{
                            width: "60px",
                            height: "60px",
                            background: hasPet === true ? "#F4A261" : "#F0F0F0",
                          }}
                        >
                          <span style={{ fontSize: "30px" }}>🐕‍🦺</span>
                        </div>
                        <div className="flex-1">
                          <h3
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "20px",
                              fontWeight: 600,
                              color: hasPet === true ? "#F4A261" : "#2C3E50",
                              marginBottom: "4px",
                            }}
                          >
                            Yes, I have a dog! 🎉
                          </h3>
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              color: "#7F8C8D",
                              lineHeight: 1.4,
                            }}
                          >
                            Let's set up your furry friend's profile
                          </p>
                        </div>
                        {hasPet === true && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <Check className="w-6 h-6" style={{ color: "#F4A261" }} />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  </motion.div>

                  {/* No, looking for a dog */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handlePetOwnership(false)}
                      className="w-full p-6 rounded-3xl text-left transition-all"
                      style={{
                        background: hasPet === false ? "linear-gradient(135deg, #E76F5120 0%, #F4A26115 100%)" : "#FFFFFF",
                        border: hasPet === false ? "3px solid #E76F51" : "2px solid #ECEFF1",
                        boxShadow: hasPet === false ? "0 8px 32px rgba(231, 111, 81, 0.2)" : "0 4px 16px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex-shrink-0 rounded-2xl flex items-center justify-center"
                          style={{
                            width: "60px",
                            height: "60px",
                            background: hasPet === false ? "#E76F51" : "#F0F0F0",
                          }}
                        >
                          <span style={{ fontSize: "30px" }}>🔍</span>
                        </div>
                        <div className="flex-1">
                          <h3
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "20px",
                              fontWeight: 600,
                              color: hasPet === false ? "#E76F51" : "#2C3E50",
                              marginBottom: "4px",
                            }}
                          >
                            No, but I'm looking! 🌟
                          </h3>
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              color: "#7F8C8D",
                              lineHeight: 1.4,
                            }}
                          >
                            Take our tailored quiz to find your perfect fluffy companion
                          </p>
                        </div>
                        {hasPet === false && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <Check className="w-6 h-6" style={{ color: "#E76F51" }} />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  </motion.div>
                </div>

                {/* Show quiz redirect message */}
                {hasPet === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-2xl text-center"
                    style={{
                      background: "linear-gradient(135deg, #E76F5110 0%, #F4A26110 100%)",
                      border: "1px solid #E76F5130",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#E76F51",
                        fontWeight: 500,
                      }}
                    >
                      🎯 Redirecting you to our Dog Breed Quiz to find your perfect match...
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center rounded-full mb-4"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                    }}
                  >
                    <span style={{ fontSize: "50px" }}>🐕</span>
                  </div>
                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#2C3E50",
                    }}
                  >
                    What's your dog's name?
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#7F8C8D",
                    }}
                  >
                    Let's get to know your furry friend!
                  </p>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <label
                    htmlFor="dogName"
                    className="block mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#2C3E50",
                    }}
                  >
                    Dog's Name
                  </label>
                  <Input
                    id="dogName"
                    type="text"
                    placeholder="e.g., Max, Bella, Charlie"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    className="h-12"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ECEFF1",
                      background: "#F7F9FA",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                    }}
                  />
                  {dogName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-center"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#F4A261",
                      }}
                    >
                      What a pawsome name! 🌟
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Audio */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center rounded-full mb-4"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                    }}
                  >
                    <Mic className="w-12 h-12" style={{ color: "#F4A261" }} />
                  </div>
                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#2C3E50",
                    }}
                  >
                    Record a bark sound
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#7F8C8D",
                    }}
                  >
                    Optional: Record your dog's bark for fun!
                  </p>
                </div>

                <div
                  className="p-6 text-center"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {!hasRecordedAudio ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={handleRecordAudio}
                        disabled={isRecording}
                        className="rounded-full mx-auto mb-4"
                        style={{
                          width: "120px",
                          height: "120px",
                          background: isRecording
                            ? "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)"
                            : "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                          border: "none",
                          boxShadow: "0 8px 24px rgba(244, 162, 97, 0.3)",
                        }}
                      >
                        <Mic className="w-12 h-12 text-white mx-auto" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4"
                    >
                      <div
                        className="rounded-full mx-auto flex items-center justify-center"
                        style={{
                          width: "120px",
                          height: "120px",
                          background: "#58D68D",
                        }}
                      >
                        <Check className="w-16 h-16 text-white" />
                      </div>
                    </motion.div>
                  )}

                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: isRecording ? "#F4A261" : hasRecordedAudio ? "#58D68D" : "#7F8C8D",
                      fontWeight: 500,
                    }}
                  >
                    {isRecording ? "Recording... 🎤" : hasRecordedAudio ? "Recorded! 🎉" : "Tap to record"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Age */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center rounded-full mb-4"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                    }}
                  >
                    <span style={{ fontSize: "50px" }}>🎂</span>
                  </div>
                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#2C3E50",
                    }}
                  >
                    How old is {dogName || "your dog"}?
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#7F8C8D",
                    }}
                  >
                    Enter their age in years
                  </p>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <label
                    htmlFor="dogAge"
                    className="block mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#2C3E50",
                    }}
                  >
                    Age (years)
                  </label>
                  <Input
                    id="dogAge"
                    type="number"
                    placeholder="e.g., 3"
                    value={dogAge}
                    onChange={(e) => setDogAge(e.target.value)}
                    className="h-12"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ECEFF1",
                      background: "#F7F9FA",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Birthday */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center rounded-full mb-4"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "linear-gradient(135deg, #FFE5D9 0%, #F8B882 100%)",
                    }}
                  >
                    <Gift className="w-12 h-12" style={{ color: "#F4A261" }} />
                  </div>
                  <h2
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#2C3E50",
                    }}
                  >
                    When's {dogName || "your dog"}'s birthday?
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#7F8C8D",
                    }}
                  >
                    We'll send you birthday reminders! 🎉
                  </p>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <label
                    htmlFor="dogBirthday"
                    className="block mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#2C3E50",
                    }}
                  >
                    Birthday
                  </label>
                  <Input
                    id="dogBirthday"
                    type="date"
                    value={dogBirthday}
                    onChange={(e) => setDogBirthday(e.target.value)}
                    className="h-12"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #ECEFF1",
                      background: "#F7F9FA",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          <PawHoverEffect className="mt-8">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                borderRadius: "16px",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#FFFFFF",
                border: "none",
              }}
            >
              {step === 4 ? "Get Started" : "Continue"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </PawHoverEffect>

          {step === 2 && (
            <motion.div className="mt-4" whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleNext}
                variant="ghost"
                className="w-full h-12"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#7F8C8D",
                }}
              >
                Skip for now
              </Button>
            </motion.div>
          )}
        </div>

        {/* Dog Mascot Guide */}
        <DogMascot
          message={mascotMessage}
          position={isMobile ? "bottom-right" : "bottom-left"}
          animation={step === 2 ? "excited" : step === 4 ? "jump" : "wave"}
        />
      </div>
    </div>
  );
}
