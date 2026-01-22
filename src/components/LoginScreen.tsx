import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DogMascot } from "./DogMascot";
import { PawHoverEffect } from "./PawHoverEffect";
import { useLayout } from "../contexts/LayoutContext";
import { loginUser, registerUser } from "../firebaseAuth";

interface LoginScreenProps {
  onLogin: () => void;
  onVetLogin?: () => void;
}

export function LoginScreen({ onLogin, onVetLogin }: LoginScreenProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showMascot, setShowMascot] = useState(true);
  const [mascotMessage, setMascotMessage] = useState(
    "Hey there! Ready to discover amazing dog breeds? Let's get started!"
  );

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    setError("");
    
    try {
      if (isSignUp) {
        await registerUser(email, password);
        setMascotMessage("Account created successfully!");
      } else {
        await loginUser(email, password);
        setMascotMessage("Awesome! Let's go on this pawsome journey together!");
      }
      
      setIsAnimating(true);
      setTimeout(() => {
        onLogin();
      }, 1500);
    } catch (error) {
      setError(error.message);
      setMascotMessage("Oops! " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFocus = () => {
    setMascotMessage("Great! Just enter your email and password to continue.");
  };

  return (
    <div className="min-h-screen" style={{ background: isMobile ? "#FFF8F3" : "#FAFAFA" }}>
      <div
        style={{
          maxWidth: !isMobile ? "1200px" : "480px",
          margin: "0 auto",
          minHeight: "100vh",
        }}
      >
        {isMobile ? (
          <div className="flex flex-col justify-center items-center min-h-screen px-6 py-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mb-8"
            >
              <div
                className="w-32 h-32 rounded-full overflow-hidden relative"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(244, 162, 97, 0.3)",
                  border: "4px solid #F4A261",
                }}
              >
                <motion.img
                  src="https://thumbs.dreamstime.com/b/cute-white-puppy-peeking-torn-yellow-paper-saying-hello-sunshine-adorable-hole-words-written-below-creating-400553475.jpg"
                  alt="Pawdentify Logo"
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <motion.div
              className="text-center mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#2C3E50",
                }}
              >
                Pawdentify
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  color: "#7F8C8D",
                }}
              >
                Discover every dog's unique story
              </p>
            </motion.div>

            <motion.div
              className="w-full max-w-md"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="p-8"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "24px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                }}
              >
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2C3E50",
                      }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleEmailFocus}
                        className="pl-12 h-12"
                        style={{
                          borderRadius: "12px",
                          border: "1px solid #ECEFF1",
                          background: "#F7F9FA",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2C3E50",
                      }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && email && password && handleLogin()}
                        className="pl-12 h-12"
                        style={{
                          borderRadius: "12px",
                          border: "1px solid #ECEFF1",
                          background: "#F7F9FA",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#DC2626" }}>
                        {error}
                      </p>
                    </div>
                  )}

                  <PawHoverEffect>
                    <Button
                      onClick={handleLogin}
                      disabled={!email || !password || loading}
                      className="w-full h-12 disabled:opacity-50"
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
                      {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Get Started")}
                    </Button>
                  </PawHoverEffect>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" style={{ borderColor: "#ECEFF1" }}></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span
                        className="px-3"
                        style={{
                          background: "#FFFFFF",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          color: "#BDC3C7",
                        }}
                      >
                        or
                      </span>
                    </div>
                  </div>

                  <PawHoverEffect scaleOnHover={1.01}>
                    <Button
                      onClick={() => onVetLogin && onVetLogin()}
                      variant="outline"
                      className="w-full h-12"
                      style={{
                        borderRadius: "16px",
                        border: "2px solid #F4A261",
                        background: "#FFFFFF",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#F4A261",
                      }}
                    >
                      🩺 Veterinarian Login
                    </Button>
                  </PawHoverEffect>
                </div>
              </div>

              <div className="text-center mt-6">
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#7F8C8D",
                  }}
                >
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                    }}
                    style={{ color: "#F4A261", fontWeight: 600 }}
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-2 min-h-screen">
            <div
              className="flex flex-col justify-center items-center p-12"
              style={{
                background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div
                  className="rounded-full overflow-hidden mb-8"
                  style={{
                    width: "200px",
                    height: "200px",
                    background: "#FFFFFF",
                    border: "6px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <motion.img
                    src="https://thumbs.dreamstime.com/b/cute-white-puppy-peeking-torn-yellow-paper-saying-hello-sunshine-adorable-hole-words-written-below-creating-400553475.jpg"
                    alt="Pawdentify Logo"
                    className="w-full h-full object-cover"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              <h1
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "56px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Pawdentify
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  color: "rgba(255, 255, 255, 0.9)",
                  textAlign: "center",
                  maxWidth: "400px",
                }}
              >
                AI-powered dog breed identification with a community of dog lovers worldwide
              </p>
            </div>

            <div className="flex flex-col justify-center items-center p-12 bg-white">
              <motion.div
                className="w-full max-w-md"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#2C3E50",
                  }}
                >
                  Welcome Back
                </h2>
                <p
                  className="mb-8"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    color: "#7F8C8D",
                  }}
                >
                  Log in to continue your journey
                </p>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email-desktop"
                      className="block mb-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2C3E50",
                      }}
                    >
                      Email Address
                    </label>
                    <Input
                      id="email-desktop"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleEmailFocus}
                      className="h-14"
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #ECEFF1",
                        background: "#F7F9FA",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password-desktop"
                      className="block mb-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2C3E50",
                      }}
                    >
                      Password
                    </label>
                    <Input
                      id="password-desktop"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && email && password && handleLogin()}
                      className="h-14"
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #ECEFF1",
                        background: "#F7F9FA",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                      }}
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#DC2626" }}>
                        {error}
                      </p>
                    </div>
                  )}

                  <PawHoverEffect>
                    <Button
                      onClick={handleLogin}
                      disabled={!email || !password || loading}
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
                      {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Get Started")}
                    </Button>
                  </PawHoverEffect>

                  <PawHoverEffect scaleOnHover={1.01}>
                    <Button
                      onClick={() => onVetLogin && onVetLogin()}
                      variant="outline"
                      className="w-full h-14"
                      style={{
                        borderRadius: "16px",
                        border: "2px solid #F4A261",
                        background: "#FFFFFF",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#F4A261",
                      }}
                    >
                      🩺 Veterinarian Login
                    </Button>
                  </PawHoverEffect>

                  <div className="text-center pt-4">
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        color: "#7F8C8D",
                      }}
                    >
                      {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                      <button 
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError("");
                        }}
                        style={{ color: "#F4A261", fontWeight: 600 }}
                      >
                        {isSignUp ? "Sign in" : "Sign up"}
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {showMascot && (
        <DogMascot
          message={mascotMessage}
          position={isMobile ? "bottom-right" : "bottom-left"}
          animation="wave"
          onClose={() => setShowMascot(false)}
        />
      )}

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.6, repeat: Infinity },
                }}
                style={{ fontSize: "100px" }}
              >
                🐕
              </motion.div>
              <motion.p
                className="text-white mt-6"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Welcome to Pawdentify!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
