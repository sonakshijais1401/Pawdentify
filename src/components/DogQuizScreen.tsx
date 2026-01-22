import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, RotateCcw } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; value: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 0,
    question: "Where are you residing / living?",
    options: [
      { text: "Urban apartment", value: "apartment" },
      { text: "Suburban house with yard", value: "house" },
      { text: "Rural/Farm area", value: "rural" },
      { text: "Condo/Townhouse", value: "condo" },
    ],
  },
  {
    id: 1,
    question: "Why do you want a dog?",
    options: [
      { text: "For companionship & emotional support", value: "companionship" },
      { text: "For an active lifestyle & outdoor fun", value: "active" },
      { text: "For family protection & security", value: "protection" },
      { text: "For a playful family pet", value: "family" },
    ],
  },
  {
    id: 2,
    question: "How do you handle loud or energetic behavior?",
    options: [
      { text: "I love it — brings fun energy!", value: "love" },
      { text: "I can manage it occasionally", value: "moderate" },
      { text: "I prefer a calm, quiet environment", value: "calm" },
    ],
  },
  {
    id: 3,
    question: "What kind of bond do you want with your dog?",
    options: [
      { text: "A best friend who sticks to me all the time", value: "velcro" },
      { text: "A dog that's independent but loving", value: "independent" },
      { text: "A buddy for playtime & interactions with family", value: "playful" },
    ],
  },
  {
    id: 4,
    question: "How patient are you with training?",
    options: [
      { text: "Very patient — I enjoy training", value: "patient" },
      { text: "I can be patient if needed", value: "moderate" },
      { text: "I prefer a naturally well-behaved dog", value: "easy" },
    ],
  },
  {
    id: 5,
    question: "What type of personality should your dog have?",
    options: [
      { text: "Outgoing and social", value: "social" },
      { text: "Calm and gentle", value: "gentle" },
      { text: "Protective and alert", value: "protective" },
      { text: "Goofy and playful", value: "goofy" },
    ],
  },
  {
    id: 6,
    question: "How do you feel about a dog that needs a lot of attention?",
    options: [
      { text: "I love giving attention all day", value: "high" },
      { text: "I can provide moderate attention", value: "moderate" },
      { text: "I need a dog who can entertain itself", value: "low" },
    ],
  },
  {
    id: 7,
    question: "What kind of challenge are you okay with?",
    options: [
      { text: "High energy & exercise needs", value: "energy" },
      { text: "Frequent training & socialization", value: "training" },
      { text: "Grooming & maintenance", value: "grooming" },
      { text: "Very few challenges", value: "minimal" },
    ],
  },
  {
    id: 8,
    question: "How would you describe your reaction to messiness?",
    options: [
      { text: "It's normal — pets are messy!", value: "tolerant" },
      { text: "A bit okay, but not too much", value: "moderate" },
      { text: "I want a clean, low-maintenance dog", value: "clean" },
    ],
  },
  {
    id: 9,
    question: "How important is emotional connection?",
    options: [
      { text: "Extremely — I want a velcro dog", value: "extreme" },
      { text: "Moderate — love but with space", value: "moderate" },
      { text: "Slight — okay with independent dogs", value: "slight" },
    ],
  },
  {
    id: 10,
    question: "Do you travel or stay away from home often?",
    options: [
      { text: "Yes, frequently", value: "frequent" },
      { text: "Sometimes", value: "sometimes" },
      { text: "Rarely — I'm mostly home", value: "rarely" },
    ],
  },
];

const breedDatabase: Record<string, { name: string; traits: string[]; description: string }> = {
  "golden-retriever": {
    name: "Golden Retriever",
    traits: ["Friendly", "Patient", "Family-oriented", "Active"],
    description: "Perfect for families seeking a loyal, gentle companion who loves outdoor activities.",
  },
  "labrador": {
    name: "Labrador Retriever",
    traits: ["Energetic", "Playful", "Social", "Easy to train"],
    description: "Ideal for active lifestyles with a love for fun and outdoor adventures.",
  },
  "german-shepherd": {
    name: "German Shepherd",
    traits: ["Protective", "Intelligent", "Loyal", "Alert"],
    description: "Best for those seeking security and a highly trainable, devoted companion.",
  },
  "french-bulldog": {
    name: "French Bulldog",
    traits: ["Adaptable", "Calm", "Low-maintenance", "Affectionate"],
    description: "Perfect for apartment living with minimal exercise needs and maximum charm.",
  },
  "beagle": {
    name: "Beagle",
    traits: ["Playful", "Curious", "Social", "Moderate energy"],
    description: "Great for families wanting a fun, friendly dog with moderate activity needs.",
  },
  "poodle": {
    name: "Poodle",
    traits: ["Intelligent", "Hypoallergenic", "Trainable", "Elegant"],
    description: "Ideal for those wanting a smart, clean dog that's easy to train.",
  },
  "cavalier": {
    name: "Cavalier King Charles Spaniel",
    traits: ["Gentle", "Affectionate", "Velcro dog", "Calm"],
    description: "Perfect for emotional support and constant companionship.",
  },
  "border-collie": {
    name: "Border Collie",
    traits: ["Highly intelligent", "Energetic", "Trainable", "Active"],
    description: "Best for experienced owners who love training and outdoor activities.",
  },
  "shih-tzu": {
    name: "Shih Tzu",
    traits: ["Low-maintenance", "Calm", "Affectionate", "Indoor-friendly"],
    description: "Great for those wanting a clean, quiet companion for apartment living.",
  },
  "australian-shepherd": {
    name: "Australian Shepherd",
    traits: ["Energetic", "Intelligent", "Loyal", "Active"],
    description: "Perfect for active owners with space for high-energy play and training.",
  },
};

function calculateBreedMatch(answers: string[]): { breed: string; match: number }[] {
  const scores: Record<string, number> = {};
  
  Object.keys(breedDatabase).forEach(breed => {
    scores[breed] = 0;
  });

  const [location, purpose, energy, bond, training, personality, attention, challenge, messiness, connection, travel] = answers;

  // Location scoring
  if (location === "apartment" || location === "condo") {
    scores["french-bulldog"] += 15;
    scores["shih-tzu"] += 15;
    scores["cavalier"] += 12;
    scores["poodle"] += 10;
  } else if (location === "house") {
    scores["golden-retriever"] += 15;
    scores["labrador"] += 15;
    scores["beagle"] += 12;
  } else if (location === "rural") {
    scores["border-collie"] += 15;
    scores["australian-shepherd"] += 15;
    scores["german-shepherd"] += 12;
  }

  // Purpose scoring
  if (purpose === "companionship") {
    scores["cavalier"] += 15;
    scores["golden-retriever"] += 12;
    scores["poodle"] += 10;
  } else if (purpose === "active") {
    scores["labrador"] += 15;
    scores["border-collie"] += 15;
    scores["australian-shepherd"] += 12;
  } else if (purpose === "protection") {
    scores["german-shepherd"] += 15;
  } else if (purpose === "family") {
    scores["golden-retriever"] += 15;
    scores["beagle"] += 12;
    scores["labrador"] += 12;
  }

  // Energy level
  if (energy === "love") {
    scores["labrador"] += 12;
    scores["beagle"] += 10;
    scores["border-collie"] += 12;
  } else if (energy === "calm") {
    scores["french-bulldog"] += 12;
    scores["shih-tzu"] += 12;
    scores["cavalier"] += 10;
  }

  // Bond type
  if (bond === "velcro") {
    scores["cavalier"] += 15;
    scores["golden-retriever"] += 10;
  } else if (bond === "independent") {
    scores["french-bulldog"] += 10;
    scores["shih-tzu"] += 10;
  }

  // Training patience
  if (training === "patient") {
    scores["border-collie"] += 12;
    scores["poodle"] += 12;
    scores["german-shepherd"] += 10;
  } else if (training === "easy") {
    scores["french-bulldog"] += 10;
    scores["cavalier"] += 10;
  }

  // Personality
  if (personality === "social") {
    scores["labrador"] += 12;
    scores["golden-retriever"] += 12;
    scores["beagle"] += 10;
  } else if (personality === "gentle") {
    scores["cavalier"] += 12;
    scores["golden-retriever"] += 10;
  } else if (personality === "protective") {
    scores["german-shepherd"] += 15;
  } else if (personality === "goofy") {
    scores["labrador"] += 12;
    scores["beagle"] += 10;
  }

  // Attention needs
  if (attention === "high") {
    scores["cavalier"] += 10;
    scores["border-collie"] += 10;
  } else if (attention === "low") {
    scores["french-bulldog"] += 10;
    scores["shih-tzu"] += 10;
  }

  // Challenge tolerance
  if (challenge === "energy") {
    scores["border-collie"] += 12;
    scores["australian-shepherd"] += 12;
    scores["labrador"] += 10;
  } else if (challenge === "minimal") {
    scores["french-bulldog"] += 12;
    scores["shih-tzu"] += 12;
  } else if (challenge === "grooming") {
    scores["poodle"] += 10;
  }

  // Messiness tolerance
  if (messiness === "clean") {
    scores["poodle"] += 12;
    scores["shih-tzu"] += 10;
  }

  // Emotional connection
  if (connection === "extreme") {
    scores["cavalier"] += 15;
    scores["golden-retriever"] += 10;
  }

  // Travel frequency
  if (travel === "rarely") {
    scores["cavalier"] += 10;
    scores["border-collie"] += 8;
  } else if (travel === "frequent") {
    scores["french-bulldog"] += 8;
  }

  const results = Object.entries(scores)
    .map(([breed, score]) => ({ breed, match: Math.min(Math.round((score / 150) * 100), 99) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  return results;
}

export function DogQuizScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [breedMatches, setBreedMatches] = useState<{ breed: string; match: number }[]>([]);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      const newAnswers = [...answers, question.options[optionIndex].value];
      setAnswers(newAnswers);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        const matches = calculateBreedMatch(newAnswers);
        setBreedMatches(matches);
        setShowResults(true);
      }
    }, 400);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResults(false);
    setBreedMatches([]);
  };

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", paddingBottom: isMobile ? "80px" : "0" }}>
        <ResponsiveContainer>
          <motion.div
            className="text-center px-6 py-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.div
              style={{ fontSize: "80px", marginBottom: "24px" }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎉
            </motion.div>

            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: isMobile ? "32px" : "48px",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "12px",
              }}
            >
              Your Perfect Matches!
            </h2>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: isMobile ? "14px" : "16px",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "32px",
              }}
            >
              Based on your lifestyle and preferences
            </p>

            <div className="space-y-4 mb-8 max-w-2xl mx-auto">
              {breedMatches.map((match, idx) => {
                const breedInfo = breedDatabase[match.breed];
                return (
                  <motion.div
                    key={match.breed}
                    className="p-6 rounded-3xl text-left"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: isMobile ? "20px" : "24px",
                          fontWeight: 700,
                          color: "#2C3E50",
                        }}
                      >
                        {idx === 0 && "🏆 "}
                        {breedInfo.name}
                      </h3>
                      <div
                        className="px-4 py-2 rounded-full"
                        style={{
                          background: idx === 0 ? "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)" : "#667eea20",
                          color: idx === 0 ? "#FFFFFF" : "#667eea",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        {match.match}% Match
                      </div>
                    </div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#7F8C8D",
                        marginBottom: "12px",
                        lineHeight: "1.6",
                      }}
                    >
                      {breedInfo.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {breedInfo.traits.map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1 rounded-full"
                          style={{
                            background: "#F7F9FA",
                            color: "#667eea",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              onClick={handleRestart}
              className="w-full max-w-md px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              style={{
                background: "#FFFFFF",
                color: "#667eea",
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5" />
              Take Quiz Again
            </motion.button>
          </motion.div>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        <motion.div
          className={isMobile ? "px-6 pt-8 pb-6" : "px-12 pt-12 pb-8 max-w-4xl mx-auto"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: isMobile ? "24px" : "44px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "6px",
                }}
              >
                Find Your Perfect Breed
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: isMobile ? "13px" : "15px",
                  color: "#7F8C8D",
                  fontWeight: 500,
                }}
              >
                Question {currentQuestion + 1} of {quizQuestions.length}
              </p>
            </div>
            {currentQuestion === 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-purple-500" />
              </motion.div>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-8">
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 0 10px rgba(102, 126, 234, 0.5)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div className={isMobile ? "px-6" : "px-12 max-w-4xl mx-auto"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              className="rounded-3xl overflow-hidden"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateX: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-8 text-center"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: isMobile ? "20px" : "28px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    lineHeight: "1.4",
                  }}
                >
                  {question.question}
                </h2>
              </motion.div>

              <div className="p-6 space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full p-5 rounded-2xl text-left transition-all relative overflow-hidden group"
                      style={{
                        background: isSelected ? "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)" : "#F8F9FA",
                        border: "2px solid",
                        borderColor: isSelected ? "#667eea" : "#E5E7EB",
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 8, borderColor: "#667eea" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: isSelected ? "#667eea" : "#2C3E50",
                          }}
                        >
                          {option.text}
                        </span>
                        <motion.div
                          animate={isSelected ? { x: [0, 8, 0] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight className={`w-5 h-5 ${isSelected ? "text-purple-600" : "text-gray-400"}`} />
                        </motion.div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
