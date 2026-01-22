import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, MapPin, Phone, Award, Check, ArrowLeft, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PawHoverEffect } from "./PawHoverEffect";
import { DogMascot } from "./DogMascot";
import { useLayout } from "../contexts/LayoutContext";

interface VetRegistrationScreenProps {
  onBack: () => void;
  onRegister: (vetData: VetData) => void;
}

interface VetData {
  name: string;
  email: string;
  password: string;
  experience: string;
  clinicLocation: string;
  contact: string;
  agreedToTerms: boolean;
}

