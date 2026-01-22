import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Briefcase, User, CheckCircle, Award, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface VetOnboardingScreenProps {
  onComplete: (data: VetData) => void;
}

export interface VetData {
  name: string;
  experience: string;
  clinicLocation: string;
  contact: string;
  agreedToTerms: boolean;
}

const vetQuestions = [
  {
    id: 1,
    title: "Professional Details",
    fields: [
      { name: "name", label: "Full Name", icon: User, placeholder: "Dr. John Smith" },
      { name: "experience", label: "Years of Experience", icon: Briefcase, placeholder: "e.g., 5 years" },
    ],
  },
  {
    id: 2,
    title: "Contact Information",
    fields: [
      { name: "clinicLocation", label: "Clinic Location", icon: MapPin, placeholder: "City, State" },
      { name: "contact", label: "Contact Number", icon: Phone, placeholder: "+1 (555) 123-4567" },
    ],
  },
];

export function VetOnboardingScreen({ onComplete }: VetOnboardingScreenProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<VetData>({
    name: "",
    experience: "",
    clinicLocation: "",
    contact: "",
    agreedToTerms: false,
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (formData.agreedToTerms) {
      onComplete(formData);
    }
  };

  const canProceed = () => {
    if (step === 0) return formData.name && formData.experience;
    if (step === 1) return formData.clinicLocation && formData.contact;
    if (step === 2) return formData.agreedToTerms;
    return false;
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
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
            Become a Paw Protocol Expert
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Join our network of trusted veterinarians
          </p>
        </div>

        <div className={isMobile ? "px-6 py-6" : "px-8 py-8 max-w-3xl mx-auto"}>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#7F8C8D",
                }}
              >
                Step {step + 1} of 3
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#F4A261",
                }}
              >
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "#E5E7EB" }}
            >
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg, #F4A261 0%, #E76F51 100%)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step < 2 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="p-8 mb-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: isMobile ? "20px" : "24px",
                      fontWeight: 700,
                      color: "#2C3E50",
                      marginBottom: "24px",
                      textAlign: "center",
                    }}
                  >
                    {vetQuestions[step].title}
                  </h3>

                  <div className="space-y-5">
                    {vetQuestions[step].fields.map((field) => {
                      const Icon = field.icon;
                      return (
                        <div key={field.name}>
                          <label
                            className="block mb-2"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#2C3E50",
                            }}
                          >
                            {field.label}
                          </label>
                          <div className="relative">
                            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              placeholder={field.placeholder}
                              value={formData[field.name as keyof VetData] as string}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.name]: e.target.value })
                              }
                              className="pl-12 h-12"
                              style={{
                                borderRadius: "12px",
                                border: "2px solid #ECEFF1",
                                background: "#F7F9FA",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  {step > 0 && (
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 h-12"
                      style={{
                        borderRadius: "16px",
                        border: "2px solid #ECEFF1",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1 h-12"
                    style={{
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      borderRadius: "16px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      border: "none",
                    }}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="terms"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="p-8 mb-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: isMobile ? "20px" : "24px",
                      fontWeight: 700,
                      color: "#2C3E50",
                      marginBottom: "24px",
                      textAlign: "center",
                    }}
                  >
                    Paw Protocol Agreement
                  </h3>

                  <div
                    className="p-6 mb-6"
                    style={{
                      background: "linear-gradient(135deg, #F4A26110 0%, #E76F5110 100%)",
                      borderRadius: "16px",
                      border: "2px solid #F4A26120",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-orange-600" />
                      <h4
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#2C3E50",
                        }}
                      >
                        As a Paw Protocol Expert, I agree to:
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Provide compassionate care to all pets",
                        "Maintain fair and reasonable pricing",
                        "Treat all cases without discrimination",
                        "Be available for emergency consultations",
                        "Share my contact details with pet owners",
                      ].map((term, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              color: "#2C3E50",
                              lineHeight: "1.6",
                            }}
                          >
                            {term}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-4"
                    style={{
                      background: "#F7F9FA",
                      borderRadius: "12px",
                      border: "2px solid #ECEFF1",
                    }}
                  >
                    <Checkbox
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreedToTerms: checked as boolean })
                      }
                      className="mt-1"
                    />
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#2C3E50",
                        lineHeight: "1.6",
                      }}
                    >
                      I agree to the Paw Protocol terms and conditions. I commit to providing quality
                      care at fair prices and treating all pets with compassion and professionalism.
                    </label>
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 h-12"
                    style={{
                      borderRadius: "16px",
                      border: "2px solid #ECEFF1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={!canProceed()}
                    className="flex-1 h-12"
                    style={{
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      borderRadius: "16px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      border: "none",
                    }}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Registration
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
