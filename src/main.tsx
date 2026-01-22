import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LayoutProvider } from "./contexts/LayoutContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ScanHistoryProvider } from "./contexts/ScanHistoryContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ScanHistoryProvider>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </ScanHistoryProvider>
  </AuthProvider>
);
  
