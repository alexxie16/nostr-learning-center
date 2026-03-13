"use client";

import { useState } from "react";

export interface ExerciseItem {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ExerciseCardProps {
  exercise: ExerciseItem;
  onCorrect: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function ExerciseCard({ exercise, onCorrect }: ExerciseCardProps) {
  const [options] = useState(() =>
    shuffle(exercise.options.map((opt, idx) => ({ opt, idx })))
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (originalIdx: number) => {
    if (showResult) return;
    setSelected(originalIdx);
    setShowResult(true);
    setIsCorrect(originalIdx === exercise.correct);
  };

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
      <p className="text-sm text-amber-500/80 mb-2">Exercise — answer correctly to continue</p>
      <h3 className="text-lg font-medium text-zinc-100 mb-4">{exercise.question}</h3>
      <ul className="space-y-2">
        {options.map(({ opt, idx }) => {
          const wasCorrect = idx === exercise.correct;
          const wasWrong = selected === idx && !wasCorrect;
          const revealed = showResult && (wasCorrect || wasWrong);
          return (
            <li key={idx}>
              <button
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left rounded-lg px-4 py-3 border transition-colors ${
                  revealed
                    ? wasCorrect
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-zinc-600 hover:border-zinc-500 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-200"
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {showResult && (
        <div className="mt-4 space-y-3">
          <p
            className={`text-sm ${isCorrect ? "text-green-400" : "text-red-400"}`}
          >
            {isCorrect
              ? "Correct! Well done."
              : "Not quite. Review the explanation and try again."}
          </p>
          <p className="text-sm text-zinc-500">{exercise.explanation}</p>
          {isCorrect ? (
            <button
              onClick={onCorrect}
              className="w-full rounded-lg bg-amber-500 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => {
                setSelected(null);
                setShowResult(false);
              }}
              className="w-full rounded-lg border border-zinc-600 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
