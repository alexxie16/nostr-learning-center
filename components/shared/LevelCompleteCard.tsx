"use client";

import Link from "next/link";
import { LEVELS } from "@/content/levels";
import { ShareButton } from "./ShareButton";
import type { QuizResultItem } from "./QuizCard";

interface LevelCompleteCardProps {
  level: number;
  levelName: string;
  quizScore: number;
  message: string;
  quizResults?: QuizResultItem[];
}

function QuizResultsList({ results }: { results: QuizResultItem[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-zinc-300">Quiz results</h4>
      {results.map((r, i) => {
        const isCorrect = r.userChoice === r.correct;
        return (
          <div
            key={i}
            className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
          >
            <p className="mb-2 font-medium text-zinc-100">{r.question}</p>
            <p className="mb-2 text-sm">
              Your answer:{" "}
              <span
                className={
                  isCorrect ? "text-green-400" : "text-red-400 line-through"
                }
              >
                {r.options[r.userChoice]}
              </span>
              {!isCorrect && (
                <span className="ml-1 text-zinc-400">
                  (correct: {r.options[r.correct]})
                </span>
              )}
            </p>
            <p className="text-sm text-zinc-400">{r.explanation}</p>
          </div>
        );
      })}
    </div>
  );
}

export function LevelCompleteCard({
  level,
  levelName,
  quizScore,
  message,
  quizResults,
}: LevelCompleteCardProps) {
  const nextLevel = LEVELS.find((l) => l.id === level + 1);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
        <h3 className="mb-2 text-lg font-medium text-zinc-100">
          Level {level} Complete! ({quizScore}% quiz score)
        </h3>
        <p className="mb-6 text-sm text-zinc-400">{message}</p>
        {quizResults && quizResults.length > 0 && (
          <div className="mb-6">
            <QuizResultsList results={quizResults} />
          </div>
        )}
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
    </div>
  );
}
