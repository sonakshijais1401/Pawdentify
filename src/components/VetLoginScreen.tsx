import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Stethoscope, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLayout } from "../contexts/LayoutContext";

interface VetLoginScreenProps {
  onBack: () => void;
  onVetLogin: () => void;
  setScreen?: (screen: string) => void;
}

export function VetLoginScreen({ onBack, onVetLogin, setScreen }: VetLoginScreenProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      onVetLogin();
      setScreen?.("onboarding");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div style={{ maxWidth: isMobile ? "480px" : "500px", margin: "0 auto", minHeight: "100vh" }}>
        <div className="flex flex-col justify-center items-center min-h-screen px-6 py-12">
          
          <button onClick={onBack} className="absolute top-6 left-6 text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
          >
            <Stethoscope className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div className="text-center mb-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Veterinarian Login</h1>
            <p className="text-white/90 text-sm">Join as a Paw Protocol Expert</p>
          </motion.div>

          <motion.div
            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="vet@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-2"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    className="pl-12 h-12 rounded-xl border-2"
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={!email || !password}
                className="w-full h-12 rounded-xl text-base font-semibold"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                Login as Veterinarian
              </Button>

              <p className="text-center text-sm text-gray-600">
                New expert? <span className="text-purple-600 font-semibold cursor-pointer">Register here</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
