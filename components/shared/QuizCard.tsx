"use client";

import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    // Only count non-last questions here; last question is counted in handleNext
    if (idx === q.correct && !isLast) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const score = Math.round(
        ((correctCount + (selected === q.correct ? 1 : 0)) / questions.length) * 100
      );
      onComplete(score);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
      <p className="text-sm text-zinc-400 mb-2">
        Question {current + 1} of {questions.length}
      </p>
      <h3 className="text-lg font-medium text-zinc-100 mb-4">{q.question}</h3>
      <ul className="space-y-2">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correct;
          const isWrong = selected === idx && !isCorrect;
          const revealed = showResult && (isCorrect || isWrong);
          return (
            <li key={idx}>
              <button
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left rounded-lg px-4 py-3 border transition-colors ${
                  revealed
                    ? isCorrect
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
        <button
          onClick={handleNext}
          className="mt-4 w-full rounded-lg bg-amber-500 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
        >
          {isLast ? "Finish Quiz" : "Next"}
        </button>
      )}
    </div>
  );
}
