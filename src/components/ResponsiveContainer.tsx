import { ReactNode } from "react";
import { useLayout } from "../contexts/LayoutContext";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = "" }: ResponsiveContainerProps) {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";

  if (isMobile) {
    return (
      <div
        className={className}
        style={{
          maxWidth: "393px",
          margin: "0 auto",
          width: "100%",
          minHeight: "100vh",
          background: "#000",
          padding: "12px",
          borderRadius: "48px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "calc(100vh - 24px)",
            background: "#FFF",
            borderRadius: "40px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "32px",
              background: "#000",
              borderRadius: "20px",
              zIndex: 9999,
            }}
          />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: "100%" }}>
      {children}
    </div>
  );
}
