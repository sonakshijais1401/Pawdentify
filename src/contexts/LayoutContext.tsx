import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  viewMode: "mobile" | "desktop";
  setViewMode: (mode: "mobile" | "desktop") => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">(
    window.innerWidth < 768 ? "mobile" : "desktop"
  );

  return (
    <LayoutContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
}
