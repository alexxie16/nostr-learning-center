"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { isDeveloperMode, setDeveloperMode as setDevModeStorage } from "@/lib/devMode";

type DevModeContextValue = {
  devMode: boolean;
  setDevMode: (on: boolean) => void;
};

const DevModeContext = createContext<DevModeContextValue | null>(null);

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [devMode, setDevModeState] = useState(false);

  useEffect(() => {
    setDevModeState(isDeveloperMode());
  }, []);

  const setDevMode = useCallback((on: boolean) => {
    setDevModeStorage(on);
    setDevModeState(on);
  }, []);

  return (
    <DevModeContext.Provider value={{ devMode, setDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) throw new Error("useDevMode must be used within DevModeProvider");
  return ctx;
}
