"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { LEVELS } from "@/content/levels";
import { useProgress } from "@/components/ProgressProvider";
import { Level1Keys } from "@/components/levels/Level1Keys";
import { Level2Events } from "@/components/levels/Level2Events";
import { Level3Relays } from "@/components/levels/Level3Relays";
import { Level4NIPs } from "@/components/levels/Level4NIPs";
import { Level5Advanced } from "@/components/levels/Level5Advanced";

const LEVEL_COMPONENTS = {
  1: Level1Keys,
  2: Level2Events,
  3: Level3Relays,
  4: Level4NIPs,
  5: Level5Advanced,
} as const;

export default function PlayPage() {
  const params = useParams();
  const levelNum = Number(params.level);
  const { isLevelUnlocked, markLevelComplete } = useProgress();

  const unlocked = isLevelUnlocked(levelNum);
  const levelInfo = LEVELS.find((l) => l.id === levelNum);
  const LevelComponent = levelNum >= 1 && levelNum <= 5 ? LEVEL_COMPONENTS[levelNum as 1 | 2 | 3 | 4 | 5] : null;

  const handleComplete = (quizScore: number) => {
    markLevelComplete(levelNum, quizScore);
  };

  if (!levelInfo || !LevelComponent) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-zinc-400">Level not found.</p>
        <Link href="/" className="mt-4 text-amber-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-zinc-400">Complete the previous level first.</p>
        <Link href="/" className="mt-4 text-amber-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-amber-500">
            ← Nostr Learn
          </Link>
          <span className="text-sm text-zinc-400">
            Level {levelNum}: {levelInfo.name}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-zinc-100">
          Level {levelNum} — {levelInfo.name}
        </h2>
        <LevelComponent onComplete={handleComplete} />
      </main>
    </div>
  );
}
