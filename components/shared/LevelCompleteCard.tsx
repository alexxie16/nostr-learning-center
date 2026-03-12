"use client";

import Link from "next/link";
import { LEVELS } from "@/content/levels";
import { ShareButton } from "./ShareButton";

interface LevelCompleteCardProps {
  level: number;
  levelName: string;
  quizScore: number;
  message: string;
}

export function LevelCompleteCard({
  level,
  levelName,
  quizScore,
  message,
}: LevelCompleteCardProps) {
  const nextLevel = LEVELS.find((l) => l.id === level + 1);

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
      <h3 className="mb-2 text-lg font-medium text-zinc-100">
        Level {level} Complete! ({quizScore}% quiz score)
      </h3>
      <p className="mb-6 text-sm text-zinc-400">{message}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {nextLevel ? (
          <Link
            href={`/play/${nextLevel.id}`}
            className="rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-medium text-zinc-900 hover:bg-amber-400"
          >
            Continue to Level {nextLevel.id}: {nextLevel.name}
          </Link>
        ) : (
          <Link
            href="/"
            className="rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-medium text-zinc-900 hover:bg-amber-400"
          >
            Back to Home
          </Link>
        )}
        <ShareButton level={level} levelName={levelName} />
      </div>
    </div>
  );
}
