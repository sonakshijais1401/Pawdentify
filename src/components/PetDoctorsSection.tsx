import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, MapPin, Star, Phone, Calendar, Award, Clock, MessageCircle, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  available: boolean;
  experience: string;
  image: string;
  phone: string;
  responseTime: string;
  nextAvailable: string;
}

const doctors: Doctor[] = [
  { 
    id: 1, 
    name: "Dr. Sarah Johnson", 
    specialty: "General Veterinarian", 
    rating: 4.9, 
    reviews: 234, 
    distance: "2.3 km", 
    available: true, 
    experience: "15 years", 
    image: "👩⚕️",
    phone: "+1-234-567-8901",
    responseTime: "< 5 min",
    nextAvailable: "Today at 2:30 PM"
  },
  { 
    id: 2, 
    name: "Dr. Michael Chen", 
    specialty: "Surgery Specialist", 
    rating: 4.8, 
    reviews: 189, 
    distance: "3.1 km", 
    available: false, 
    experience: "12 years", 
    image: "👨⚕️",
    phone: "+1-234-567-8902",
    responseTime: "~ 15 min",
    nextAvailable: "Tomorrow at 10:00 AM"
  },
  { 
    id: 3, 
    name: "Dr. Emily Rodriguez", 
    specialty: "Dental Care", 
    rating: 4.9, 
    reviews: 312, 
    distance: "1.8 km", 
    available: true, 
    experience: "10 years", 
    image: "👩⚕️",
    phone: "+1-234-567-8903",
    responseTime: "< 3 min",
    nextAvailable: "Today at 4:00 PM"
  },
  { 
    id: 4, 
    name: "Dr. James Wilson", 
    specialty: "Emergency Care", 
    rating: 4.7, 
    reviews: 156, 
    distance: "4.2 km", 
    available: true, 
    experience: "18 years", 
    image: "👨⚕️",
    phone: "+1-234-567-8904",
    responseTime: "Immediate",
    nextAvailable: "24/7 Available"
  },
];

const specialtyColors: { [key: string]: { primary: string; secondary: string; light: string } } = {
  "General Veterinarian": { primary: "#F4A261", secondary: "#E76F51", light: "#FFF8F3" },
  "Surgery Specialist": { primary: "#2A9D8F", secondary: "#264653", light: "#F7FFFE" },
  "Dental Care": { primary: "#E76F51", secondary: "#F4A261", light: "#FFF8F3" },
  "Emergency Care": { primary: "#264653", secondary: "#2A9D8F", light: "#F7FFFE" },
};

export function PetDoctorsSection() {
  const [expandedDoctor, setExpandedDoctor] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
          boxShadow: "0 8px 24px rgba(244, 162, 97, 0.2)",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: "#FFFFFF" }}
          animate={{ y: [0, -15, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.2)" }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Stethoscope className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  marginBottom: "4px",
                }}
              >
                Find Your Pet Doctor
              </h3>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: 500,
                }}
              >
                Trusted veterinarians with real-time availability 💜
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Doctors Grid */}
      <motion.div
        className="grid grid-cols-1 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {doctors.map((doctor) => {
          const colors = specialtyColors[doctor.specialty] || specialtyColors["General Veterinarian"];
          const isExpanded = expandedDoctor === doctor.id;

          return (
            <motion.div
              key={doctor.id}
              variants={itemVariants}
              onHoverStart={() => setExpandedDoctor(doctor.id)}
              onHoverEnd={() => setExpandedDoctor(null)}
              onClick={() => setExpandedDoctor(isExpanded ? null : doctor.id)}
              className="cursor-pointer"
            >
              <motion.div
                className="rounded-3xl overflow-hidden relative group"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${colors.primary}20`,
                  boxShadow: isExpanded
                    ? `0 12px 32px ${colors.primary}15`
                    : `0 4px 16px ${colors.primary}10`,
                }}
                animate={{
                  boxShadow: isExpanded
                    ? `0 12px 32px ${colors.primary}15`
                    : `0 4px 16px ${colors.primary}10`,
                }}
                transition={{ duration: 0.3 }}
              >


                {/* Main Content */}
                <div className="p-5 relative z-10">
                  {/* Header with Avatar and Info */}
                  <div className="flex gap-4 mb-4">
                    {/* Avatar */}
                    <motion.div
                      className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
                      style={{
                        background: `${colors.primary}10`,
                        border: `1px solid ${colors.primary}30`,
                      }}
                      animate={{
                        scale: isExpanded ? 1.1 : 1,
                        rotate: isExpanded ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {doctor.image}
                    </motion.div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <motion.h4
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "18px",
                              fontWeight: 800,
                              color: "#2C3E50",
                              marginBottom: "3px",
                            }}
                            animate={{ scale: isExpanded ? 1.05 : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {doctor.name}
                          </motion.h4>
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              color: colors.primary,
                              fontWeight: 600,
                            }}
                          >
                            {doctor.specialty}
                          </p>
                        </div>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: doctor.available ? 1 : 0,
                            opacity: doctor.available ? 1 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Badge
                            className="bg-green-100 text-green-700 border-0 text-xs font-bold"
                          >
                            <CheckCircle size={12} className="mr-1" />
                            Available
                          </Badge>
                        </motion.div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <motion.div
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1"
                          style={{
                            background: `${colors.primary}08`,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#2C3E50",
                            }}
                          >
                            {doctor.rating}
                          </span>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              color: "#7F8C8D",
                            }}
                          >
                            ({doctor.reviews})
                          </span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1"
                          style={{
                            background: `${colors.primary}08`,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Award size={14} style={{ color: colors.primary }} />
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: colors.primary,
                            }}
                          >
                            {doctor.experience}
                          </span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1"
                          style={{
                            background: `${colors.primary}08`,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <MapPin size={14} style={{ color: colors.primary }} />
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: colors.primary,
                            }}
                          >
                            {doctor.distance}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="border-t pt-4 space-y-4"
                        style={{ borderColor: `${colors.primary}30` }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      >
                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <motion.div
                            className="rounded-2xl p-3"
                            style={{
                              background: `${colors.primary}05`,
                              border: `1px solid ${colors.primary}20`,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Clock size={14} style={{ color: colors.primary }} />
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "11px",
                                  color: "#7F8C8D",
                                  fontWeight: 600,
                                }}
                              >
                                Response Time
                              </span>
                            </div>
                            <p
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "13px",
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              {doctor.responseTime}
                            </p>
                          </motion.div>

                          <motion.div
                            className="rounded-2xl p-3"
                            style={{
                              background: `${colors.primary}05`,
                              border: `1px solid ${colors.primary}20`,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar size={14} style={{ color: colors.primary }} />
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "11px",
                                  color: "#7F8C8D",
                                  fontWeight: 600,
                                }}
                              >
                                Next Available
                              </span>
                            </div>
                            <p
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: colors.primary,
                              }}
                            >
                              {doctor.nextAvailable}
                            </p>
                          </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            className="flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2"
                            style={{
                              background: colors.primary,
                              border: "none",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#FFFFFF",
                              boxShadow: `0 4px 12px ${colors.primary}25`,
                            }}
                            whileHover={{
                              scale: 1.02,
                              boxShadow: `0 6px 16px ${colors.primary}30`,
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              // Trigger booking action
                              alert(`Booking appointment with ${doctor.name}...`);
                            }}
                          >
                            <Calendar size={16} />
                            Book Appointment
                          </motion.button>

                          <motion.button
                            className="py-3 px-4 rounded-2xl flex items-center justify-center"
                            style={{
                              background: `${colors.primary}08`,
                              border: `1px solid ${colors.primary}30`,
                            }}
                            whileHover={{
                              scale: 1.02,
                              background: `${colors.primary}15`,
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(`tel:${doctor.phone}`)}
                          >
                            <Phone size={16} style={{ color: colors.primary }} />
                          </motion.button>

                          <motion.button
                            className="py-3 px-4 rounded-2xl flex items-center justify-center"
                            style={{
                              background: `${colors.primary}08`,
                              border: `1px solid ${colors.primary}30`,
                            }}
                            whileHover={{
                              scale: 1.02,
                              background: `${colors.primary}15`,
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MessageCircle size={16} style={{ color: colors.primary }} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Emergency Banner - Premium */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6"
        style={{
          background: "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)",
          boxShadow: "0 8px 24px rgba(231, 111, 81, 0.2)",
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        whileHover={{ scale: 1.01 }}
      >


        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AlertCircle className="w-8 h-8 text-white" />
            </motion.div>

            <div className="flex-1">
              <h4
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: "4px",
                }}
              >
                🚨 24/7 Emergency Care
              </h4>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                }}
              >
                Immediate help for urgent situations. Call anytime!
              </p>
            </div>

            <motion.button
              className="flex-shrink-0 px-6 py-3 rounded-2xl"
              style={{
                background: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontWeight: 800,
                color: "#E76F51",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("tel:+1-800-738-4357")}
            >
              Call Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
