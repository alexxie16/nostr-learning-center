"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNostr } from "./NostrProvider";
import {
  type Progress,
  loadProgress,
  saveProgress,
  markLevelComplete as markLevelCompleteLocal,
  fetchProgressFromNostr,
  createProgressEventTemplate,
  mergeProgress,
  isLevelUnlocked,
} from "@/lib/progress";

type ProgressContextValue = {
  progress: Progress;
  refresh: () => void;
  markLevelComplete: (level: number, quizScore: number) => void;
  isLevelUnlocked: (level: number) => boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { pubkey, isNip07, signEvent, publish } = useNostr();
  const [progress, setProgress] = useState<Progress>({ completedLevels: [], quizScores: {} });

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // When user signs in with NIP-07: fetch from Nostr and merge
  useEffect(() => {
    if (!pubkey || !isNip07) return;

    fetchProgressFromNostr(pubkey).then((remote) => {
      const local = loadProgress();
      if (remote) {
        const merged = mergeProgress(local, remote);
        saveProgress(merged);
        setProgress(merged);
      } else if (local.completedLevels.length > 0) {
        // No remote yet - backup local to Nostr
        const template = createProgressEventTemplate(local);
        signEvent(template)
          .then((ev) => publish(ev))
          .then(() => {})
          .catch(console.error);
      }
    });
  }, [pubkey, isNip07, signEvent, publish]);

  const markLevelComplete = useCallback(
    (level: number, quizScore: number) => {
      const updated = markLevelCompleteLocal(level, quizScore);
      setProgress(updated);

      if (pubkey && isNip07) {
        const template = createProgressEventTemplate(updated);
        signEvent(template)
          .then((ev) => publish(ev))
          .catch(console.error);
      }
    },
    [pubkey, isNip07, signEvent, publish]
  );

  const value: ProgressContextValue = {
    progress,
    refresh,
    markLevelComplete,
    isLevelUnlocked: (level) => isLevelUnlocked(level, progress),
  };

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
