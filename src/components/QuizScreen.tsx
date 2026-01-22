import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

const quizQuestions = [
  {
    id: 1,
    question: "How active is your daily lifestyle?",
    options: [
      { text: "Calm indoor activities", value: "A", icon: "🛋️" },
      { text: "Outdoor activities / exercise", value: "B", icon: "🏃" },
    ],
  },
  {
    id: 2,
    question: "How much time can you spend on grooming?",
    options: [
      { text: "Minimal", value: "A", icon: "⏱️" },
      { text: "Don't mind maintenance", value: "B", icon: "✨" },
    ],
  },
  {
    id: 3,
    question: "How social are you?",
    options: [
      { text: "Quiet pet", value: "A", icon: "🤫" },
      { text: "Social, people-friendly", value: "B", icon: "👥" },
    ],
  },
  {
    id: 4,
    question: "How patient are you with training?",
    options: [
      { text: "Want easy-to-train", value: "A", icon: "⚡" },
      { text: "Don't mind stubborn pets", value: "B", icon: "💪" },
    ],
  },
  {
    id: 5,
    question: "Do you live in an apartment or house?",
    options: [
      { text: "Small space", value: "A", icon: "🏢" },
      { text: "House with open area", value: "B", icon: "🏡" },
    ],
  },
  {
    id: 6,
    question: "How much alone time should your pet handle?",
    options: [
      { text: "Must be okay alone", value: "A", icon: "🚪" },
      { text: "Prefer clingy, affectionate", value: "B", icon: "❤️" },
    ],
  },
  {
    id: 7,
    question: "How sensitive are you to noise?",
    options: [
      { text: "Prefer quiet pets", value: "A", icon: "🔇" },
      { text: "Noise is okay", value: "B", icon: "🔊" },
    ],
  },
  {
    id: 8,
    question: "Do you want a protective dog?",
    options: [
      { text: "No", value: "A", icon: "🤗" },
      { text: "Yes", value: "B", icon: "🛡️" },
    ],
  },
  {
    id: 9,
    question: "Are you okay with shedding?",
    options: [
      { text: "Low-shedding", value: "A", icon: "✂️" },
      { text: "Shedding is okay", value: "B", icon: "🐕" },
    ],
  },
  {
    id: 10,
    question: "What size dog do you prefer?",
    options: [
      { text: "Small–Medium", value: "A", icon: "🐕" },
      { text: "Medium–Large", value: "B", icon: "🐕‍🦺" },
    ],
  },
];

const breedCategories = {
  lowEnergy: ["Shih Tzu", "Pug", "Basset Hound", "Cavalier King Charles Spaniel"],
  mediumEnergy: ["Beagle", "Cocker Spaniel", "Bulldog", "Labrador"],
  highEnergy: ["German Shepherd", "Border Collie", "Golden Retriever", "Siberian Husky"],
  lowGrooming: ["Doberman", "Boxer", "Beagle", "Dalmatian"],
  highGrooming: ["Shih Tzu", "Pomeranian", "Golden Retriever", "Rough Collie"],
  highlyTrainable: ["Border Collie", "Poodle", "Labrador"],
  independent: ["Shiba Inu", "Chow Chow", "Husky"],
};

export function QuizScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      const newAnswers = [...answers, quizQuestions[currentQuestion].options[optionIndex].value];
      setAnswers(newAnswers);
      
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const getRecommendations = () => {
    const countA = answers.filter(a => a === "A").length;
    const countB = answers.filter(a => a === "B").length;

    let recommendations: { name: string; match: number; traits: string[] }[] = [];

    if (countA > 6) {
      recommendations = [
        { name: "Shih Tzu", match: 95, traits: ["Low Energy", "High Grooming", "Small Size"] },
        { name: "Pug", match: 90, traits: ["Low Energy", "Minimal Grooming", "Quiet"] },
        { name: "Cavalier King Charles Spaniel", match: 88, traits: ["Low Energy", "Affectionate", "Small Size"] },
      ];
    } else if (countB > 6) {
      recommendations = [
        { name: "German Shepherd", match: 95, traits: ["High Energy", "Protective", "Trainable"] },
        { name: "Golden Retriever", match: 92, traits: ["High Energy", "Social", "Family-Friendly"] },
        { name: "Border Collie", match: 90, traits: ["High Energy", "Highly Trainable", "Active"] },
      ];
    } else {
      recommendations = [
        { name: "Labrador", match: 93, traits: ["Medium Energy", "Trainable", "Friendly"] },
        { name: "Beagle", match: 88, traits: ["Medium Energy", "Social", "Low Grooming"] },
        { name: "Cocker Spaniel", match: 85, traits: ["Medium Energy", "Affectionate", "Adaptable"] },
      ];
    }

    return recommendations;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedOption(null);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

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
            Find Your Perfect Match
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Answer 10 questions to discover your ideal breed
          </p>
        </div>

        <div className={isMobile ? "px-6 py-6" : "px-8 py-8 max-w-3xl mx-auto"}>
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#7F8C8D",
                      }}
                    >
                      Question {currentQuestion + 1} of {quizQuestions.length}
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
                    {quizQuestions[currentQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full p-4 rounded-2xl transition-all flex items-center gap-4"
                        style={{
                          background: selectedOption === idx ? "#F4A261" : "#F7F9FA",
                          border: selectedOption === idx ? "2px solid #F4A261" : "2px solid #ECEFF1",
                          color: selectedOption === idx ? "#FFFFFF" : "#2C3E50",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span style={{ fontSize: "32px" }}>{option.icon}</span>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            flex: 1,
                            textAlign: "left",
                          }}
                        >
                          {option.text}
                        </span>
                        {selectedOption === idx && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-orange-600" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="p-8 mb-6 text-center"
                  style={{
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    borderRadius: "24px",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    style={{ fontSize: "64px", marginBottom: "16px" }}
                  >
                    🎉
                  </motion.div>
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      marginBottom: "8px",
                    }}
                  >
                    Perfect Matches Found!
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    Based on your answers, here are your top breed recommendations
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {getRecommendations().map((breed, idx) => (
                    <motion.div
                      key={breed.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="p-6"
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "20px",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {breed.name}
                        </h4>
                        <div
                          className="px-3 py-1 rounded-full"
                          style={{
                            background: "#F4A26120",
                            color: "#F4A261",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          {breed.match}% Match
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {breed.traits.map((trait) => (
                          <span
                            key={trait}
                            className="px-3 py-1 rounded-full"
                            style={{
                              background: "#F7F9FA",
                              color: "#7F8C8D",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={resetQuiz}
                  className="w-full h-14"
                  style={{
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    borderRadius: "16px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    border: "none",
                  }}
                >
                  Take Quiz Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
