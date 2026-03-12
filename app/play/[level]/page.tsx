"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LEVELS } from "@/content/levels";
import { useProgress } from "@/components/ProgressProvider";
import { useDevMode } from "@/components/DevModeProvider";
import { DevModeToggle } from "@/components/DevModeToggle";
import { Level1Keys } from "@/components/levels/Level1Keys";
import { Level2Events } from "@/components/levels/Level2Events";
import { Level3Relays } from "@/components/levels/Level3Relays";
import { Level4NIPs } from "@/components/levels/Level4NIPs";
import { Level5Advanced } from "@/components/levels/Level5Advanced";
import { LevelQuizOnly } from "@/components/levels/LevelQuizOnly";

const LEVEL_COMPONENTS: Record<
  number,
  React.ComponentType<{ onComplete: (quizScore: number) => void }>
> = {
  1: Level1Keys,
  2: Level2Events,
  3: Level3Relays,
  4: Level4NIPs,
  5: Level5Advanced,
  6: (props) => (
    <LevelQuizOnly
      levelId={6}
      levelName="Core NIPs (01, 02, 17)"
      message="You understand core Nostr NIPs."
      onComplete={props.onComplete}
    />
  ),
  7: (props) => (
    <LevelQuizOnly
      levelId={7}
      levelName="Identity & Keys (NIP-05, NIP-19)"
      message="You understand identity and key NIPs."
      onComplete={props.onComplete}
    />
  ),
  8: (props) => (
    <LevelQuizOnly
      levelId={8}
      levelName="Browser & Signing (NIP-07, NIP-46)"
      message="You understand browser and signing NIPs."
      onComplete={props.onComplete}
    />
  ),
  9: (props) => (
    <LevelQuizOnly
      levelId={9}
      levelName="Zaps & Payments (NIP-57, NIP-47, NIP-75)"
      message="You understand zaps and payment NIPs."
      onComplete={props.onComplete}
    />
  ),
  10: (props) => (
    <LevelQuizOnly
      levelId={10}
      levelName="Relay & Discovery (NIP-65, NIP-66, NIP-50)"
      message="You understand relay and discovery NIPs."
      onComplete={props.onComplete}
    />
  ),
  11: (props) => (
    <LevelQuizOnly
      levelId={11}
      levelName="Social, Content & UX (NIP-51, 52, 53, 58, 72)"
      message="You understand social and content NIPs."
      onComplete={props.onComplete}
    />
  ),
};

export default function PlayPage() {
  const params = useParams();
  const levelNum = Number(params.level);
  const { isLevelUnlocked, markLevelComplete } = useProgress();
  useDevMode(); // subscribe to re-render when dev mode toggles

  const unlocked = isLevelUnlocked(levelNum);
  const levelInfo = LEVELS.find((l) => l.id === levelNum);
  const LevelComponent = LEVEL_COMPONENTS[levelNum] ?? null;

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
        <div className="mx-auto flex max-w-3xl items-center justify-between mb-8">
          <Link href="/" className="text-lg font-semibold text-amber-500">
            ← Nostr Learning Center
          </Link>
          <DevModeToggle />
        </div>
        <p className="text-zinc-400">Complete the previous level first.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Enable Developer Mode to bypass restrictions.
        </p>
        <Link href="/" className="mt-4 inline-block text-amber-500 hover:underline">
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
            ← Nostr Learning Center
          </Link>
          <div className="flex items-center gap-4">
            <DevModeToggle />
            <span className="text-sm text-zinc-400">
              Level {levelNum}: {levelInfo.name}
            </span>
          </div>
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
