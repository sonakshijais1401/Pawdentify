import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles, MessageCircle, Brain, Stethoscope } from "lucide-react";
import { PetDoctorsSection } from "./PetDoctorsSection";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLayout } from "../contexts/LayoutContext";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function PawbotScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [activeTab, setActiveTab] = useState<"chat" | "doctors">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm PawBot, your AI-powered dog care assistant. I can help with breed information, health tips, training advice, and more. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const dogResponses = [
  "Here’s what I found for you:",
  "Based on your query, this might help:",
  "Got it! Here’s my answer:",
  "Let me guide you with this:",
  "Here’s some useful information:",
  "I analyzed your question, and here’s what I suggest:",
];

const handleSendMessage = () => {
  if (!inputMessage.trim()) return;

  const newMessage: Message = {
    id: messages.length + 1,
    text: inputMessage,
    isBot: false,
    timestamp: new Date(),
  };

  setMessages([...messages, newMessage]);
  setInputMessage("");
  setIsTyping(true);

  setTimeout(() => {
    const userText = inputMessage.toLowerCase();
    let answer = "";

    // --- UPDATED SMART ANSWERS ---
    if (userText.includes("sick") || userText.includes("ill") || userText.includes("vomit")) {
      answer =
        "If your dog seems sick, monitor symptoms closely. Ensure proper hydration and avoid giving human medicines. If the condition worsens, please consult a vet immediately.";
    }
    else if (userText.includes("food") || userText.includes("diet") || userText.includes("eat")) {
      answer =
        "A balanced diet is essential. Puppies need protein-rich small meals, while adult dogs need controlled portions. Avoid chocolates, grapes, onions, and excess salt.";
    }
    else if (userText.includes("training") || userText.includes("train") || userText.includes("behaviour")) {
      answer =
        "Training works best with consistency. Use rewards, avoid punishment, and try short sessions daily. Start with sit, stay, recall, and leash training.";
    }
    else if (userText.includes("vaccination") || userText.includes("vaccine") || userText.includes("schedule")) {
      answer =
        "Core vaccines include DHPP and Rabies. Puppies need shots at 6–8 weeks, 10–12 weeks, and 14–16 weeks. Then boosters yearly based on vet guidance.";
    }
    else if (userText.includes("exercise") || userText.includes("walk") || userText.includes("play")) {
      answer =
        "Dogs need regular exercise for health and behavior balance. Short walks twice a day and 15–20 min play sessions help maintain fitness and reduce stress.";
    }
    else if (userText.includes("breed") || userText.includes("type") || userText.includes("kind")) {
      answer =
        "Each breed has different needs. If you tell me the breed, I can help with temperament, grooming, training level, and health needs!";
    }
    else {
      answer =
        "I’m here to help with anything related to dog health, food, training, or care! You can ask me about symptoms, diet, exercise, or grooming as well.";
    }

    const botResponse: Message = {
      id: messages.length + 2,
      text: `${dogResponses[Math.floor(Math.random() * dogResponses.length)]} ${answer}`,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  }, 2000);
};


  return (
    <div className="min-h-screen pb-20" style={{ background: "#FAFAFA" }}>
      <div style={{ maxWidth: isMobile ? "390px" : "1400px", margin: "0 auto" }}>
        {isMobile ? (
          <>
            <div
              className="px-6 pt-12 pb-6"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="w-7 h-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FFFFFF"
                  }}>PawBot AI</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ADE80" }} />
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: "rgba(255, 255, 255, 0.9)"
                    }}>Online & Ready</span>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex gap-2 bg-white rounded-2xl p-1" style={{ border: "2px solid #ECEFF1" }}>
                <motion.button
                  onClick={() => setActiveTab("chat")}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: activeTab === "chat" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                    color: activeTab === "chat" ? "#FFFFFF" : "#7F8C8D",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "none",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Bot className="w-4 h-4" />
                  AI Chat
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("doctors")}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: activeTab === "doctors" ? "linear-gradient(135deg, #58D68D 0%, #4ADE80 100%)" : "transparent",
                    color: activeTab === "doctors" ? "#FFFFFF" : "#7F8C8D",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "none",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Stethoscope className="w-4 h-4" />
                  Pet Doctors
                </motion.button>
              </div>
            </div>

            {activeTab === "chat" ? (
              <>
                <div className="px-6 pt-6">
                  <motion.div
                    className="p-6 text-center"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "24px",
                      border: "2px solid #000000",
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                    }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center rounded-full mb-4"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                      }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      marginBottom: "8px"
                    }}>AI-Powered Assistant</h3>
                    <p style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.9)"
                    }}>Ask me anything about dog care, breeds, health, and training!</p>
                  </motion.div>
                </div>

                <div className="px-6 pb-32 pt-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", damping: 20 }}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <motion.div
                        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                          message.isBot
                            ? "bg-white"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        }`}
                        style={{
                          border: "2px solid #000000",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {message.isBot && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-4 h-4" style={{ color: "#667eea" }} />
                            <span style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#667eea"
                            }}>PawBot</span>
                          </div>
                        )}
                        <p style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: message.isBot ? "#2C3E50" : "#FFFFFF",
                          lineHeight: "1.5"
                        }}>
                          {message.text}
                        </p>
                        <p style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          color: message.isBot ? "#7F8C8D" : "rgba(255, 255, 255, 0.7)",
                          marginTop: "4px"
                        }}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="bg-white rounded-2xl px-5 py-3"
                      style={{
                        border: "2px solid #000000",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" style={{ color: "#667eea" }} />
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ background: "#667eea" }}
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pb-4 pt-6 px-6 z-30">
              <div className="max-w-md mx-auto">
                <motion.div
                  className="bg-white rounded-2xl p-2 flex items-center gap-2"
                  style={{
                    border: "2px solid #000000",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  }}
                  whileHover={{ boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)" }}
                >
                  <Input
                    type="text"
                    placeholder="Ask PawBot anything..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-0 focus:ring-0"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                  />
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="rounded-full w-12 h-12 p-0 disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex gap-2 mt-3 overflow-x-auto pb-2 hide-scrollbar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    "Vaccination schedule",
                    "Best food for puppies",
                    "Exercise tips",
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setInputMessage(suggestion)}
                      className="px-4 py-2 rounded-full text-sm whitespace-nowrap"
                      style={{
                        background: "#F7F9FA",
                        border: "2px solid #000000",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2C3E50",
                      }}
                      whileHover={{ scale: 1.05, background: "#667eea", color: "#FFFFFF" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
              </>
            ) : (
            <div className="px-6 pt-2 pb-32">
              <PetDoctorsSection />
            </div>
            )}
          </>
        ) : (
          <div className="px-12 py-10 max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div
              className="mb-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-center gap-6">
                <motion.div
                  className="rounded-2xl flex items-center justify-center flex-shrink-0 p-4"
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="w-12 h-12 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "44px",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "8px",
                    }}
                  >
                    PawBot AI Assistant
                  </h2>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "17px",
                      color: "#7F8C8D",
                      fontWeight: 500,
                    }}
                  >
                    Your intelligent dog care companion powered by AI
                  </p>
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-10 h-10 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-3 mb-8">
              {[
                { id: "chat", icon: MessageCircle, label: "AI Chat" },
                { id: "doctors", icon: Stethoscope, label: "Pet Doctors" },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all"
                  style={{
                    background: activeTab === tab.id
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#F0E6E1",
                    color: activeTab === tab.id ? "#FFFFFF" : "#7F8C8D",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    boxShadow: activeTab === tab.id
                      ? "0 8px 24px rgba(102, 126, 234, 0.3)"
                      : "none",
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                {/* Chat Section */}
                {activeTab === "chat" ? (
                  <>
                    <motion.div
                      className="p-8 mb-8 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #667eea15, #764ba215)",
                        border: "1px solid #667eea30",
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="rounded-2xl flex items-center justify-center p-4"
                          style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            width: "80px",
                            height: "80px",
                          }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Brain className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                          <h3
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#667eea",
                              marginBottom: "4px",
                            }}
                          >
                            AI-Powered Assistance
                          </h3>
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "15px",
                              color: "#7F8C8D",
                            }}
                          >
                            Ask me anything about dog care, breeds, health, and training!
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Messages Container */}
                    <motion.div
                      className="p-8 rounded-2xl overflow-y-auto"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #F0E6E1",
                        minHeight: "500px",
                        maxHeight: "600px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="space-y-6">
                        <AnimatePresence>
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                            >
                              <motion.div
                                className="max-w-xs rounded-2xl px-6 py-4"
                                style={{
                                  background: message.isBot
                                    ? "#F0E6E1"
                                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  color: message.isBot ? "#2C3E50" : "#FFFFFF",
                                  boxShadow: message.isBot
                                    ? "0 4px 12px rgba(0, 0, 0, 0.06)"
                                    : "0 4px 12px rgba(102, 126, 234, 0.2)",
                                }}
                                whileHover={{ scale: 1.02 }}
                              >
                                {message.isBot && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <Bot className="w-4 h-4" style={{ color: "#667eea" }} />
                                    <span
                                      style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#667eea",
                                      }}
                                    >
                                      PawBot
                                    </span>
                                  </div>
                                )}
                                <p
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "15px",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  {message.text}
                                </p>
                                <p
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "12px",
                                    color: message.isBot ? "#7F8C8D" : "rgba(255, 255, 255, 0.7)",
                                    marginTop: "6px",
                                    opacity: 0.7,
                                  }}
                                >
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </motion.div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                          >
                            <div
                              className="rounded-2xl px-6 py-4"
                              style={{
                                background: "#F0E6E1",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4" style={{ color: "#667eea" }} />
                                <div className="flex gap-1">
                                  {[0, 1, 2].map((i) => (
                                    <motion.div
                                      key={i}
                                      className="w-2 h-2 rounded-full"
                                      style={{ background: "#667eea" }}
                                      animate={{ y: [0, -6, 0] }}
                                      transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    </motion.div>

                    {/* Input Area */}
                    <motion.div
                      className="mt-8 p-6 rounded-2xl"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #F0E6E1",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <Input
                          type="text"
                          placeholder="Ask PawBot anything..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1 border-0 focus:ring-0 text-base"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                          }}
                        />
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="rounded-full w-12 h-12 p-0 disabled:opacity-50"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                            }}
                          >
                            <Send className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </div>

                      {/* Suggestions */}
                      <motion.div
                        className="flex gap-2 mt-4 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {[
                          "Vaccination schedule",
                          "Best food for puppies",
                          "Exercise tips",
                        ].map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setInputMessage(suggestion)}
                            className="px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                            style={{
                              background: "#F0E6E1",
                              border: "1px solid #E5D7CF",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#2C3E50",
                            }}
                            whileHover={{
                              scale: 1.05,
                              background: "#667eea",
                              color: "#FFFFFF",
                              borderColor: "#667eea",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                  </>
                ) : (
                  <div className="p-8 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #F0E6E1" }}>
                    <PetDoctorsSection />
                  </div>
                )}
              </div>

              {/* Sidebar - Quick Info */}
              <motion.div
                className="space-y-6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { icon: "🐾", title: "Dog Breeds", desc: "Learn about 350+ breeds" },
                  { icon: "💊", title: "Health Tips", desc: "Preventive care guide" },
                  { icon: "🎓", title: "Training", desc: "Behavior & obedience" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="p-6 rounded-2xl cursor-pointer"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #F0E6E1",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <p style={{ fontSize: "32px", marginBottom: "8px" }}>{item.icon}</p>
                    <h4
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#2C3E50",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#7F8C8D",
                      }}
                    >
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
