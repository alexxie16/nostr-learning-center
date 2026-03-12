"use client";

import { useDevMode } from "./DevModeProvider";

export function DevModeToggle() {
  const { devMode, setDevMode } = useDevMode();

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
      <span>Dev</span>
      <button
        type="button"
        role="switch"
        aria-checked={devMode}
        onClick={() => setDevMode(!devMode)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          devMode ? "bg-amber-500/60" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-transform ${
            devMode ? "left-5" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}
