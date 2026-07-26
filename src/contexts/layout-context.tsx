import React, { createContext, useContext, useEffect, useState } from "react";

export type LayoutType = "sidebar" | "topbar" | "dock";

interface LayoutContextType {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<LayoutType>(() => {
    const stored = localStorage.getItem("esi-ui-layout");
    if (stored === "sidebar" || stored === "topbar" || stored === "dock") {
      return stored as LayoutType;
    }
    return "sidebar"; // default
  });

  useEffect(() => {
    localStorage.setItem("esi-ui-layout", layout);
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
