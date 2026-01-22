import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeIntroScreen } from "./components/WelcomeIntroScreen";
import { LoginScreen } from "./components/LoginScreen";
import { VetLoginScreen } from "./components/VetLoginScreen";
import { VetOnboardingScreen, VetData } from "./components/VetOnboardingScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { PetDoctorsSection } from "./components/PetDoctorsSection";
import VetDashboardSection from "./components/VetDashboardSection";
import { HomeScreen } from "./components/HomeScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { HistoryScreen } from "./components/HistoryScreen";

import { ProfileScreen } from "./components/ProfileScreen";
import { CameraScreen } from "./components/CameraScreen";
import { PawbotScreen } from "./components/PawbotScreen";
import { CommunityScreen } from "./components/CommunityScreen";
import { VetScreen } from "./components/VetScreen";
import { BirthdayCelebration } from "./components/BirthdayCelebration";
import { BottomNavigation } from "./components/BottomNavigation";
import { PetAccessoriesScreen } from "./components/PetAccessoriesScreen";
import { DogQuizScreen } from "./components/DogQuizScreen";
import { LayoutSwitcher } from "./components/LayoutSwitcher";
import { ConfettiBackground } from "./components/ConfettiBackground";
import { useLayout } from "./contexts/LayoutContext";
import { getDogProfile } from "./services/dogProfileStorage";
import { ScanHistoryProvider } from "./contexts/ScanHistoryContext";

import { useCustomPawCursor, CustomPawCursor } from "./components/DogPawCursor";
import { Home, Camera, Users, Bot, User, ShoppingBag, Brain, RefreshCw, Calendar, Clock } from "lucide-react";
import BookAppointment from "./components/BookAppointment";


console.log("API KEY →", import.meta.env.VITE_FIREBASE_API_KEY);


interface DogData {
  name: string;
  age: string;
  birthday: string;
  hasAudio: boolean;
}

export default function App() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const { cursorPos, isHovering, isClicking, isMobile: isMobileDevice } = useCustomPawCursor();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "vet" | null>(null);
  const [showVetLogin, setShowVetLogin] = useState(false);
  const [vetCurrentScreen, setVetCurrentScreen] = useState<"login" | "onboarding" | "petDoctors" | "dashboard">("login");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dogData, setDogData] = useState<DogData | null>(null);
  const [vetData, setVetData] = useState<VetData | null>(null);
  const [activeScreen, setActiveScreen] = useState("home");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [showBirthdayCelebration, setShowBirthdayCelebration] =
    useState(false);

  // Check if today is dog's birthday
  // On app mount, load dog profile from localStorage so onboarding doesn't reappear
  useEffect(() => {
    try {
      const p = getDogProfile();
      if (p) {
        setDogData({ name: p.name, age: p.age, birthday: p.birthday, hasAudio: false });
        setHasCompletedOnboarding(true);
      }
    } catch (e) {}
  }, []);

  // Check if today is dog's birthday
  useEffect(() => {
    if (dogData?.birthday && hasCompletedOnboarding && userType === "user" && dogData.name !== "Future Companion") {
      const today = new Date();
      const birthday = new Date(dogData.birthday);
      const isBirthday =
        today.getMonth() === birthday.getMonth() &&
        today.getDate() === birthday.getDate();

      // Only show birthday celebration if it's actually the birthday AND the user has been using the app
      // (not immediately after onboarding)
      if (isBirthday && activeScreen === "home") {
        // Add a delay to ensure the user has had time to use the app
        const onboardingTime = localStorage.getItem('onboardingCompleted');
        const now = Date.now();
        
        if (!onboardingTime) {
          localStorage.setItem('onboardingCompleted', now.toString());
        } else {
          const timeSinceOnboarding = now - parseInt(onboardingTime);
          // Only show birthday if it's been at least 5 minutes since onboarding (300000ms)
          if (timeSinceOnboarding > 300000) {
            setTimeout(() => {
              setShowBirthdayCelebration(true);
            }, 1000);
          }
        }
      }
    }
  }, [dogData, hasCompletedOnboarding, userType, activeScreen]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserType("user");
  };

  const handleShowVetLogin = () => {
    setShowVetLogin(true);
  };

  const handleVetLogin = () => {
    setIsLoggedIn(true);
    setUserType("vet");
  };

  const handleSetVetScreen = (screen: string) => {
    setVetCurrentScreen(screen as "login" | "onboarding" | "petDoctors" | "dashboard");
  };

  const handleVetOnboardingComplete = (data: VetData) => {
    setVetData(data);
    setHasCompletedOnboarding(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleOnboardingComplete = async (data: DogData) => {
    setDogData(data);
    setHasCompletedOnboarding(true);
    // Set onboarding completion time to prevent immediate birthday celebration
    localStorage.setItem('onboardingCompleted', Date.now().toString());
  };

  const handleQuizRedirect = () => {
    setHasCompletedOnboarding(true);
    setActiveScreen("quiz");
    // Set onboarding completion time to prevent immediate birthday celebration
    localStorage.setItem('onboardingCompleted', Date.now().toString());
    // Set dummy data for non-pet owners
    const dummyData = {
      name: "Future Companion",
      age: "0",
      birthday: new Date().toISOString().split('T')[0],
      hasAudio: false,
    };
    setDogData(dummyData);
  };

  const handleTakePhoto = () => {
    setActiveScreen("camera");
  };

  const handlePhotoTaken = (imageData: string, predictions: any) => {
    setScannedImage(imageData);
    setScanResult(predictions);
    setActiveScreen("results");
  };

  const handleBackToHome = () => {
    setActiveScreen("home");
  };

  



  const handleNavigate = (screen: string) => {
    if (screen === "camera") {
      handleTakePhoto();
    } else {
      setActiveScreen(screen);
      try {
        const path = screen === 'history' ? '/history' : `/${screen}`;
        window.history.pushState({}, '', path);
      } catch (e) {
        // ignore
      }
    }
  };

  // Sync URL on initial load (support direct link to /history)
  useEffect(() => {
    try {
      const p = window.location.pathname.replace(/^\//, '');
      if (p === 'history') setActiveScreen('history');
    } catch (e) {
      // noop
    }
  }, []);

  const handleRefresh = () => {
    // Reload the entire page while keeping the session
    window.location.reload();
  };

  // Screen transition variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  // Show welcome intro screen first
  if (showWelcome) {
    return <WelcomeIntroScreen onComplete={handleWelcomeComplete} />;
  }

  // Show vet login screen with navigation flow
  if (showVetLogin && !isLoggedIn) {
    if (vetCurrentScreen === "login") {
      return <VetLoginScreen onBack={() => setShowVetLogin(false)} onVetLogin={handleVetLogin} setScreen={handleSetVetScreen} />;
    }
    if (vetCurrentScreen === "onboarding") {
      return (
        <VetOnboardingScreen
          onComplete={(data) => {
            handleVetOnboardingComplete(data);
            setVetCurrentScreen("dashboard");
          }}
        />
      );
    }
    if (vetCurrentScreen === "dashboard") {
      return <VetDashboardSection />;
    }
    if (vetCurrentScreen === "petDoctors") {
      return <PetDoctorsSection />;
    }
  }

  // Show login screen
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} onVetLogin={handleShowVetLogin} />;
  }

  // Show vet onboarding
  if (userType === "vet" && !hasCompletedOnboarding) {
    return (
      <VetOnboardingScreen
        onComplete={(data) => {
          handleVetOnboardingComplete(data);
          setVetCurrentScreen("dashboard");
        }}
      />
    );
  }

  // If a vet has completed onboarding and the vet flow requests the dashboard, show it
  if (userType === "vet" && hasCompletedOnboarding && vetCurrentScreen === "dashboard") {
    return <VetDashboardSection />;
  }

  // Show onboarding screen for users only
  if (userType === "user" && !hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} onQuizRedirect={handleQuizRedirect} />;
  }

  // Show birthday celebration if it's the dog's birthday
  if (showBirthdayCelebration && dogData) {
    return (
      <BirthdayCelebration
        dogName={dogData.name}
        onClose={() => setShowBirthdayCelebration(false)}
      />
    );
  }

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "appointments", icon: Calendar, label: "Appointments" },
    { id: "community", icon: Users, label: "Community" },
    { id: "camera", icon: Camera, label: "Scan" },
    { id: "pawbot", icon: Bot, label: "Pawbot" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "history", icon: Clock, label: "History" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "quiz", icon: Brain, label: "Quiz" },
  ];



  return (
    <ScanHistoryProvider>
      {/* Custom Paw Cursor - Desktop Only */}
      <CustomPawCursor 
        cursorPos={cursorPos}
        isHovering={isHovering}
        isClicking={isClicking}
        isMobile={isMobileDevice}
      />

      {/* Colorful Falling Confetti Animation */}
      <ConfettiBackground />

      {/* Global Layout Switcher - Always Visible */}
      <LayoutSwitcher />
      
      <div
        className="min-h-screen relative"
        style={{ background: "#FFF8F3", cursor: isMobileDevice ? 'auto' : 'none' }}
      >
        {/* Desktop Sidebar Navigation - Enhanced */}
        {!isMobile && hasCompletedOnboarding && (
          <div
            className="fixed left-0 top-0 bottom-0 w-72 z-30 overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
              borderRight: "1px solid #F0E6E1",
              boxShadow: "4px 0 16px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="p-8 flex flex-col h-full">
              {/* Logo Section */}
              <div className="mb-12">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h1
                    className="mb-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    🐾 Pawdentify
                  </h1>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#B0BEC5",
                      fontWeight: 500,
                    }}
                  >
                    Your Dog's Story Awaits
                  </p>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group"
                      whileHover={{ x: 4 }}
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #F4A26125 0%, #E76F5115 100%)"
                          : "transparent",
                        color: isActive ? "#F4A261" : "#7F8C8D",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: isActive ? 600 : 500,
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xl"
                          style={{ background: "linear-gradient(180deg, #F4A261 0%, #E76F51 100%)" }}
                          layoutId="activeIndicator"
                        />
                      )}
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full"
                          style={{ background: "#F4A261" }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer Section */}
              <motion.div
                className="pt-6 border-t space-y-3"
                style={{ borderColor: "#F0E6E1" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Refresh Button */}
                <motion.button
                  onClick={handleRefresh}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all"
                  style={{
                    background: "linear-gradient(135deg, #F4A26125 0%, #E76F5115 100%)",
                    color: "#F4A261",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1.5px solid #F4A26140",
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    background: "linear-gradient(135deg, #F4A26135 0%, #E76F5125 100%)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </motion.button>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#CFD8DC",
                    textAlign: "center",
                  }}
                >
                  v1.0.0 • Made with 🐾
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className="app-container"
          style={{
            marginLeft: !isMobile && hasCompletedOnboarding ? "288px" : "0",
            paddingLeft: !isMobile && hasCompletedOnboarding ? "0" : "0",
            paddingRight: !isMobile && hasCompletedOnboarding ? "0" : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
        <AnimatePresence mode="wait">
          {activeScreen === "home" && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <HomeScreen
                onTakePhoto={handleTakePhoto}
                dogName={dogData?.name}
              />
            </motion.div>
          )}
          {activeScreen === "camera" && (
            <motion.div
              key="camera"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <CameraScreen
                onBack={handleBackToHome}
                onPhotoTaken={handlePhotoTaken}
              />
            </motion.div>
          )}
          {activeScreen === "appointments" && (
            <motion.div
              key="appointments"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <BookAppointment />
            </motion.div>
          )}
          {activeScreen === "results" && (
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ResultsScreen onBack={handleBackToHome} result={scanResult} image={scannedImage} />
            </motion.div>
          )}

          {activeScreen === "history" && (
            <motion.div
              key="history"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <HistoryScreen onViewResult={(entry) => {
                // Build a minimal result shape expected by ResultsScreen
                setScanResult({
                  predictions: [
                    {
                      breed: entry.predictedBreed,
                      confidence: entry.confidence ?? 0,
                      description: undefined,
                    },
                  ],
                });
                setScannedImage(entry.image || null);
                try { window.history.pushState({}, '', '/results'); } catch(e) {}
                setActiveScreen('results');
              }} />
            </motion.div>
          )}

          {activeScreen === "pawbot" && (
            <motion.div
              key="pawbot"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PawbotScreen />
            </motion.div>
          )}
          {activeScreen === "community" && (
            <motion.div
              key="community"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <CommunityScreen />
            </motion.div>
          )}
          {activeScreen === "profile" && (
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ProfileScreen dogData={dogData} />
            </motion.div>
          )}
          {activeScreen === "shop" && (
            <motion.div
              key="shop"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PetAccessoriesScreen />
            </motion.div>
          )}
          {activeScreen === "quiz" && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <DogQuizScreen />
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNavigation
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
        />
      </div>
      </div>
    </ScanHistoryProvider>
  );
}


