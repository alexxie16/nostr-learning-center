"use client";

import Link from "next/link";
import { LEVELS } from "@/content/levels";
import { useProgress } from "./ProgressProvider";

export function LevelSelect() {
  const { progress, isLevelUnlocked } = useProgress();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LEVELS.map((level) => {
        const unlocked = isLevelUnlocked(level.id);
        const completed = progress.completedLevels.includes(level.id);
        const score = progress.quizScores[level.id];

        return (
          <Link
            key={level.id}
            href={unlocked ? `/play/${level.id}` : "#"}
            className={`block rounded-xl border p-6 transition-colors ${
              unlocked
                ? "border-zinc-600 bg-zinc-900/50 hover:border-amber-500/50 hover:bg-zinc-900"
                : "cursor-not-allowed border-zinc-800 bg-zinc-900/30 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-500">
                Level {level.id}
              </span>
              {completed && (
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                  Done {score !== undefined ? `${score}%` : ""}
                </span>
              )}
              {!unlocked && (
                <span className="text-xs text-zinc-500">Locked</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">{level.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{level.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
