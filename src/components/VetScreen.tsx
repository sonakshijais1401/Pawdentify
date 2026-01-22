import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Users, FileText, Calendar, TrendingUp, MessageSquare, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { useLayout } from "../contexts/LayoutContext";

export function VetScreen() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [activeTab, setActiveTab] = useState("dashboard");

  const vetTools = [
    {
      icon: Stethoscope,
      title: "Pet Health Records",
      description: "Access and manage patient health records",
      color: "#F4A261"
    },
    {
      icon: Calendar,
      title: "Appointments",
      description: "Schedule and manage veterinary appointments",
      color: "#E76F51"
    },
    {
      icon: FileText,
      title: "Medical Reports",
      description: "Generate and review medical reports",
      color: "#2A9D8F"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Track practice performance and insights",
      color: "#264653"
    }
  ];

  const communityFeatures = [
    {
      icon: Users,
      title: "Vet Community",
      description: "Connect with fellow veterinarians",
      color: "#F4A261"
    },
    {
      icon: MessageSquare,
      title: "Expert Discussions",
      description: "Participate in professional discussions",
      color: "#E76F51"
    },
    {
      icon: Search,
      title: "Research Hub",
      description: "Access latest veterinary research",
      color: "#2A9D8F"
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F3" }}>
      <div
        style={{
          maxWidth: !isMobile ? "1200px" : "100%",
          margin: "0 auto",
          padding: isMobile ? "16px" : "32px",
        }}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1
            className="mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🩺 Veterinarian Dashboard
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              color: "#7F8C8D",
            }}
          >
            Professional tools and community for pet care experts
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {["dashboard", "tools", "community", "patients"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl transition-all whitespace-nowrap ${
                activeTab === tab ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
              style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))" }}
            >
              {/* Quick Stats */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-4" style={{ color: "#2C3E50" }}>Today's Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: "#F4A261" }}>12</div>
                    <div className="text-sm text-gray-600">Appointments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: "#E76F51" }}>8</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-4" style={{ color: "#2C3E50" }}>Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Buddy's checkup completed</div>
                      <div className="text-sm text-gray-600">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">New patient registered</div>
                      <div className="text-sm text-gray-600">4 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
              style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))" }}
            >
              {vetTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.title}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${tool.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: tool.color }} />
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: "#2C3E50" }}>{tool.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{tool.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "community" && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
              style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))" }}
            >
              {communityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${feature.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: "#2C3E50" }}>{feature.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "patients" && (
            <motion.div
              key="patients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: "#2C3E50" }}>Patient Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" style={{ background: "#F4A261" }}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Buddy", owner: "John Doe", lastVisit: "2024-01-15", status: "Healthy" },
                    { name: "Luna", owner: "Jane Smith", lastVisit: "2024-01-10", status: "Follow-up needed" },
                    { name: "Max", owner: "Bob Johnson", lastVisit: "2024-01-08", status: "Vaccination due" }
                  ].map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-600">Owner: {patient.owner}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Last visit: {patient.lastVisit}</div>
                        <div className={`text-sm font-medium ${
                          patient.status === "Healthy" ? "text-green-600" :
                          patient.status === "Follow-up needed" ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {patient.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
