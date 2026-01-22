import { Home, Camera, Bot, Brain, Users, ShoppingBag, RefreshCw, Calendar } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  
  const handleRefresh = () => {
    window.location.reload();
  };

  // Only show bottom navigation in mobile view
  if (!isMobile) return null;
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "community", icon: Users, label: "Community" },
    { id: "camera", icon: Camera, label: "Scan" },
    { id: "quiz", icon: Brain, label: "Quiz" },
    { id: "appointments", icon: Calendar, label: "Appointments" },
    { id: "pawbot", icon: Bot, label: "Pawbot" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg z-40">
      {/* Scrollable Navigation for 6 items */}
      <div className="max-w-md mx-auto overflow-x-auto hide-scrollbar">
        <div className="flex justify-start items-center h-16 px-2 gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 flex-shrink-0 px-3 py-2 rounded-lg ${
                  isActive ? "text-blue-600 bg-blue-50" : "text-gray-400"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110" : "scale-100"
                }`} />
                <span className="text-xs font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 flex-shrink-0 px-3 py-2 rounded-lg text-orange-500 hover:bg-orange-50 active:scale-95"
            title="Refresh App"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-xs font-medium whitespace-nowrap">
              Refresh
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
