"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/content/levels";

export interface QuizResultItem {
  question: string;
  options: string[];
  correct: number;
  userChoice: number;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (score: number, results: QuizResultItem[]) => void;
}

const MAX_QUESTIONS = 4;

export function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [displayQuestions] = useState(() =>
    shuffle([...questions]).slice(0, MAX_QUESTIONS)
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionIndex: number; selectedIndex: number }[]>([]);

  if (displayQuestions.length === 0) return null;
  const q = displayQuestions[current];
  const isLast = current === displayQuestions.length - 1;

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    setAnswers((prev) => [...prev, { questionIndex: current, selectedIndex: idx }]);
    if (idx === q.correct && !isLast) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const lastCorrect = selected === q.correct ? 1 : 0;
      const score = Math.round(
        ((correctCount + lastCorrect) / displayQuestions.length) * 100
      );
      const results: QuizResultItem[] = displayQuestions.map((quest, i) => ({
        question: quest.question,
        options: quest.options,
        correct: quest.correct,
        userChoice: i === current ? (selected ?? 0) : (answers[i]?.selectedIndex ?? 0),
        explanation: quest.explanation,
      }));
      onComplete(score, results);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
      <p className="text-sm text-zinc-400 mb-2">
        Question {current + 1} of {displayQuestions.length}
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
