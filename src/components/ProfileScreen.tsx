import { motion } from "framer-motion";
import { Settings, Star, Heart, TrendingUp, Edit2, Share2, User, Plus, Camera, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { PawHoverEffect } from "./PawHoverEffect";
import { DogMascot } from "./DogMascot";
import { useLayout } from "../contexts/LayoutContext";
import { useState, useEffect } from "react";
import { PawtoonsViewer } from "./PawtoonsViewer";
import { PawtoonsUploadModal } from "./PawtoonsUploadModal";
import { ResponsiveContainer } from "./ResponsiveContainer";
import { logoutUser } from "../firebaseAuth";
import { clearScanHistory, getScanHistory, ScanHistoryEntry } from "../services/scanHistoryService";
import { useAuth } from "../contexts/AuthContext";
import { getDogProfile } from "../services/dogProfileStorage";

interface DogData {
  name: string;
  age: string;
  birthday: string;
  hasAudio: boolean;
}

interface ProfileScreenProps {
  dogData: DogData | null;
}

export function ProfileScreen({ dogData }: ProfileScreenProps) {
  const { dogProfile, setDogProfile, user } = useAuth(); // moved to top
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const [showMascot, setShowMascot] = useState(true);
  const [pawtoons, setPawtoons] = useState<Array<{id: string; image: string; text?: string; timestamp: Date}>>([]);
  const [showPawtoons, setShowPawtoons] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pawtoonMusic, setPawtoonMusic] = useState<string>();

  // Recent activity (latest 3 scans) and total scans
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [totalScans, setTotalScans] = useState<number>(0);

  const stats = [
    { icon: Camera, label: "Scans", value: String(totalScans || 0), color: "#F4A261" },
    { icon: Heart, label: "Favorites", value: "12", color: "#FF6B9D" },
    { icon: Star, label: "Points", value: "450", color: "#FFD93D" },
    { icon: TrendingUp, label: "Streak", value: "7 days", color: "#58D68D" },
  ];

  // Load recent activity and total scans from localStorage (persisted scan history, user-specific)
  useEffect(() => {
    try {
      const allStored = JSON.parse(localStorage.getItem('paw_scanHistory_v1') || '[]') || [];
      const userHistory = user ? allStored.filter((item: any) => item.userId === user.uid) : [];
      const sorted = (userHistory || []).slice().sort((a: any, b: any) => {
        const da = new Date(a.date ?? a.timestamp ?? a.time ?? a.createdAt).getTime();
        const db = new Date(b.date ?? b.timestamp ?? b.time ?? b.createdAt).getTime();
        return db - da;
      }).slice(0, 3);

      setRecentActivity(sorted);
      setTotalScans((userHistory || []).length || 0);
    } catch (e) {
      // ignore parse errors
    }
  }, [user]); // optional chaining handled by conditional above

  const achievements = [
    { id: 1, name: "First Scan", desc: "Completed your first breed identification", icon: "🎯", unlocked: true, color: "#F4A261" },
    { id: 2, name: "Breed Expert", desc: "Scanned 10 different breeds", icon: "🏆", unlocked: true, color: "#FFD93D" },
    { id: 3, name: "Social Pup", desc: "Shared 5 posts in community", icon: "💬", unlocked: true, color: "#5DADE2" },
    { id: 4, name: "Week Warrior", desc: "7 day streak achieved", icon: "🔥", unlocked: true, color: "#FF6B9D" },
    { id: 5, name: "Dog Whisperer", desc: "Scan 50 dogs", icon: "✨", unlocked: false, color: "#BDC3C7" },
    { id: 6, name: "Community Star", desc: "Get 100 likes", icon: "⭐", unlocked: false, color: "#BDC3C7" },
  ];

  const [recentScans, setRecentScans] = useState<ScanHistoryEntry[]>([]);

  // if no dog profile in context, try to load from storage
  useEffect(() => {
    if (!dogProfile) {
      const p = getDogProfile();
      if (p) setDogProfile(p);
    }
    if (!dogProfile) {
      try { window.history.pushState({}, '', '/onboarding'); } catch(e) {}
    }
  }, []);

  const timeAgo = (iso?: string) => {
    if (!iso) return '—';
    const now = Date.now();
    const t = new Date(iso).getTime();
    const diff = Math.max(0, now - t);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  // Load and subscribe to scan history updates (user-specific)
  useEffect(() => {
    let mounted = true;

    const load = () => {
      try {
        const all = user ? getScanHistory(user.uid) : [];
        const sorted = all.slice().sort((a, b) => {
          const ta = new Date(a.timestamp).getTime();
          const tb = new Date(b.timestamp).getTime();
          return tb - ta;
        });
        if (mounted) setRecentScans(sorted.slice(0, 3));
      } catch (e) {
        // ignore
      }
    };

    load();

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key.includes('scan') || e.key.includes('paw_scanHistory')) load();
    };

    window.addEventListener('storage', onStorage);

    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) load();
    });

    const iv = setInterval(load, 1500);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', () => {});
      clearInterval(iv);
    };
  }, [user]);

  const handleUploadPawtoons = (newPawtoons: Array<{ image: string; text: string }>, music?: string) => {
    const pawtoonItems = newPawtoons.map((p) => ({
      id: Date.now().toString() + Math.random(),
      image: p.image,
      text: p.text,
      timestamp: new Date(),
    }));
    setPawtoons((prev) => {
      const next = [...prev, ...pawtoonItems];
      try {
        localStorage.setItem('userStory', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    if (music) setPawtoonMusic(music);
  };

  const handleLogout = async () => {
    try {
      if (user) {
        clearScanHistory(user.uid);
      }
      try { localStorage.removeItem('userStory'); } catch(e) {}
      await logoutUser();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Load persisted user story (pawtoons) from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userStory');
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{id: string; image: string; text?: string; timestamp: string}>;
        // Normalize timestamp back to Date
        const normalized = parsed.map((p) => ({ ...p, timestamp: p.timestamp ? new Date(p.timestamp) : new Date() }));
        setPawtoons(normalized as any);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", paddingBottom: isMobile ? "80px" : "0" }}>
      <ResponsiveContainer>
        {isMobile ? (
          <>
            <div
              className="relative overflow-hidden pt-12 pb-24"
              style={{
                background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
              }}
            >
              <motion.div
                className="absolute w-32 h-32 rounded-full blur-3xl"
                style={{ background: "rgba(255, 255, 255, 0.2)", top: "20%", right: "10%" }}
                animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="px-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    Profile
                  </h2>
                  <div className="flex gap-2">
                    <PawHoverEffect>
                      <button
                        className="p-2 rounded-full"
                        style={{
                          background: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <Settings className="w-6 h-6 text-white" />
                      </button>
                    </PawHoverEffect>
                    <PawHoverEffect>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-full"
                        style={{
                          background: "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <LogOut className="w-6 h-6 text-white" />
                      </button>
                    </PawHoverEffect>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <motion.div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                      border: "3px solid #000000",
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <User className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                      }}
                    >
                        {profile?.name || "My Dog"}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                        Age: {profile?.age} years
                    </p>
                    <div className="flex gap-2 mt-2">
                      <PawHoverEffect scaleOnHover={1.05}>
                        <button
                          className="px-4 py-2 rounded-full flex items-center gap-2"
                          style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                            color: "#FFFFFF",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {profile?.name || "My Dog"}
                          </div>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </PawHoverEffect>
                      <PawHoverEffect scaleOnHover={1.05}>
                        <button
                          style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                            color: "#FFFFFF",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: "none",
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </PawHoverEffect>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 -mt-16 relative z-10">
              <div
                className="p-6 grid grid-cols-2 gap-4"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "24px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  border: "2px solid #000000",
                }}
              >
                {stats.map((stat, idx) => (
                  <PawHoverEffect
                    key={stat.label}
                    scaleOnHover={1.05}
                    glowColor={stat.color}
                  >
                    <motion.div
                      className="text-center p-4"
                      style={{
                        background: "#FAFAFA",
                        borderRadius: "16px",
                        border: "2px solid #000000",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1, type: "spring" }}
                    >
                      <div
                        className="inline-flex items-center justify-center rounded-full mb-2"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: `${stat.color}20`,
                        }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#2C3E50",
                        }}
                      >
                        {stat.value}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          color: "#7F8C8D",
                        }}
                      >
                        {stat.label}
                      </p>
                    </motion.div>
                  </PawHoverEffect>
                ))}
              </div>
            </div>

            <div className="px-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2C3E50",
                  }}
                >
                  Pawtoons
                </h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                <motion.button
                  onClick={() => setShowUploadModal(true)}
                  className="flex-shrink-0"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                    border: "3px solid #000000",
                    boxShadow: "0 4px 12px rgba(244, 162, 97, 0.3)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-8 h-8 text-white mx-auto" />
                </motion.button>
                {pawtoons.map((pawtoon, idx) => (
                  <motion.button
                    key={pawtoon.id}
                    onClick={() => setShowPawtoons(true)}
                    className="flex-shrink-0 relative"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: "3px solid #F4A261",
                      overflow: "hidden",
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={pawtoon.image} alt="Pawtoon" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="px-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2C3E50",
                  }}
                >
                  Achievements
                </h3>
                <button
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#F4A261",
                  }}
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {achievements.slice(0, 4).map((achievement, idx) => (
                  <PawHoverEffect
                    key={achievement.id}
                    glowColor={achievement.color}
                    scaleOnHover={1.05}
                  >
                    <motion.div
                      className="p-4 text-center"
                      style={{
                        background: "#FAFAFA",
                        borderRadius: "16px",
                        border: "2px solid #000000",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <div
                        className="inline-flex items-center justify-center rounded-full mb-3"
                        style={{
                          width: "56px",
                          height: "56px",
                          background: `${achievement.color}20`,
                          fontSize: "24px",
                        }}
                      >
                        {achievement.unlocked ? achievement.icon : "🔒"}
                      </div>
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#2C3E50",
                        }}
                      >
                        {achievement.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          color: "#7F8C8D",
                        }}
                      >
                        {achievement.desc}
                      </p>
                    </motion.div>
                  </PawHoverEffect>
                ))}
              </div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#2C3E50",
                }}
              >
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((item, idx) => (
                  <PawHoverEffect key={item.id ?? idx} scaleOnHover={1.02}>
                    <motion.div
                      className="p-4 flex items-center gap-4"
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "16px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        border: "2px solid #000000",
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.06 }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "#F4A26110",
                        }}
                      >
                        <img src={item.image ?? item.img ?? ''} alt={item.breed ?? item.predictedBreed ?? 'Scan'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2C3E50",
                          }}
                        >
                          {item.breed ?? item.predictedBreed ?? 'Unknown'}
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            color: "#7F8C8D",
                          }}
                        >
                          {timeAgo(item.date ?? item.timestamp ?? item.time ?? item.createdAt)} • {typeof (item.confidence ?? item.score) !== 'undefined' ? `${item.confidence ?? item.score}%` : '—'}
                        </p>
                      </div>
                    </motion.div>
                  </PawHoverEffect>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="px-12 py-10 max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div
              className="mb-12"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "48px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                }}
              >
                Your Profile
              </h2>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  color: "#7F8C8D",
                }}
              >
                Manage your dog&apos;s profile and track your achievements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                className="col-span-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <motion.div
                  className="p-8 text-center rounded-2xl"
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #F0E6E1",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(244, 162, 97, 0.15)" }}
                >
                  <motion.div
                    className="rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      width: "140px",
                      height: "140px",
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      boxShadow: "0 12px 32px rgba(244, 162, 97, 0.3)",
                      border: "3px solid rgba(244, 162, 97, 0.3)",
                      margin: "-70px auto 24px",
                    }}
                    whileHover={{ scale: 1.08, rotate: 8 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <User className="w-20 h-20 text-white" />
                  </motion.div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "32px",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {dogData?.name || "My Dog"}
                  </h3>
                  <p
                    className="mb-8"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      color: "#7F8C8D",
                      fontWeight: 500,
                    }}
                  >
                    Age: {dogData?.age} years
                  </p>
                  <div className="flex gap-3 justify-center">
                    <PawHoverEffect>
                      <Button
                        className="flex-1"
                        style={{
                          background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                          borderRadius: "12px",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          boxShadow: "0 4px 12px rgba(244, 162, 97, 0.3)",
                          border: "none",
                          height: "44px",
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </PawHoverEffect>
                    <PawHoverEffect>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="px-4"
                        style={{
                          borderRadius: "12px",
                          border: "2px solid #E74C3C",
                          color: "#E74C3C",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          height: "44px",
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </PawHoverEffect>
                  </div>

                  <div className="mt-8 pt-8" style={{ borderTop: "1px solid #ECEFF1" }}>
                    {stats.map((stat, idx) => (
                      <motion.div
                        key={stat.label}
                        className="flex items-center justify-between mb-5"
                        whileHover={{ x: 4, scale: 1.02 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="rounded-xl flex items-center justify-center"
                            style={{
                              width: "44px",
                              height: "44px",
                              background: `${stat.color}15`,
                            }}
                          >
                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                          </div>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "15px",
                              color: "#7F8C8D",
                              fontWeight: 500,
                            }}
                          >
                            {stat.label}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "20px",
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stat.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="col-span-2 space-y-6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  className="p-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    border: "2px solid #000000",
                  }}
                >
                  <h3
                    className="mb-6"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#2C3E50",
                    }}
                  >
                    Pawtoons
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    <motion.button
                      onClick={() => setShowUploadModal(true)}
                      className="flex-shrink-0 flex flex-col items-center justify-center"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                        border: "3px solid #000000",
                        boxShadow: "0 4px 12px rgba(244, 162, 97, 0.3)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-10 h-10 text-white" />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#FFFFFF", marginTop: "4px" }}>Add Story</span>
                    </motion.button>
                    {pawtoons.map((pawtoon, idx) => (
                      <motion.button
                        key={pawtoon.id}
                        onClick={() => setShowPawtoons(true)}
                        className="flex-shrink-0 relative"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          border: "4px solid #F4A261",
                          overflow: "hidden",
                        }}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <img src={pawtoon.image} alt="Pawtoon" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    border: "2px solid #000000",
                  }}
                >
                  <h3
                    className="mb-6"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#2C3E50",
                    }}
                  >
                    Achievements
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <PawHoverEffect key={achievement.id} glowColor={achievement.color}>
                        <motion.div
                          className="p-5 text-center"
                          style={{
                            background: "#FAFAFA",
                            borderRadius: "20px",
                            border: "2px solid #000000",
                            opacity: achievement.unlocked ? 1 : 0.6,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div
                            className="inline-flex items-center justify-center rounded-full mb-3"
                            style={{
                              width: "70px",
                              height: "70px",
                              background: `${achievement.color}20`,
                              fontSize: "36px",
                            }}
                          >
                            {achievement.unlocked ? achievement.icon : "🔒"}
                          </div>
                          <p
                            className="mb-2"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#2C3E50",
                            }}
                          >
                            {achievement.name}
                          </p>
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              color: "#7F8C8D",
                              lineHeight: "1.5",
                            }}
                          >
                            {achievement.desc}
                          </p>
                        </motion.div>
                      </PawHoverEffect>
                    ))}
                  </div>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "24px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    border: "2px solid #000000",
                  }}
                >
                  <h3
                    className="mb-6"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#2C3E50",
                    }}
                  >
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivity.map((item, idx) => (
                      <PawHoverEffect key={item.id ?? idx}>
                        <motion.div
                          className="p-5 flex items-center gap-4"
                          style={{
                            background: "#FAFAFA",
                            borderRadius: "16px",
                            border: "2px solid #000000",
                          }}
                          whileHover={{ scale: 1.02 }}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * idx }}
                        >
                          <div
                            className="rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                              width: "56px",
                              height: "56px",
                              background: "#F4A26110",
                            }}
                          >
                            <img
                              src={item.image ?? item.img ?? item.photo ?? ''}
                              alt={item.breed ?? item.predictedBreed ?? 'Scan'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#2C3E50",
                              }}
                            >
                              {item.breed ?? item.predictedBreed ?? 'Unknown'}
                            </p>
                            <p
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                color: "#7F8C8D",
                              }}
                            >
                              {timeAgo(item.date ?? item.timestamp ?? item.time ?? item.createdAt)}
                              {typeof (item.confidence ?? item.score) !== 'undefined' && ` • ${item.confidence ?? item.score}%`}
                            </p>
                          </div>
                        </motion.div>
                      </PawHoverEffect>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </ResponsiveContainer>

      {showMascot && (
        <DogMascot
          message="Looking pawsome! Keep up the great work discovering new breeds!"
          position={isMobile ? "bottom-right" : "bottom-left"}
          animation="excited"
          onClose={() => setShowMascot(false)}
          autoHide={8000}
        />
      )}

      {showPawtoons && pawtoons.length > 0 && (
        <PawtoonsViewer
          pawtoons={pawtoons}
          music={pawtoonMusic}
          onClose={() => setShowPawtoons(false)}
        />
      )}

      {showUploadModal && (
        <PawtoonsUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadPawtoons}
        />
      )}
    </div>
  );
}
