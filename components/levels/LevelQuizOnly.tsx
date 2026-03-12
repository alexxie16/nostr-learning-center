"use client";

import { useState } from "react";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { QUIZZES } from "@/content/levels";

interface LevelQuizOnlyProps {
  levelId: number;
  levelName: string;
  message: string;
  onComplete: (quizScore: number) => void;
}

export function LevelQuizOnly({
  levelId,
  levelName,
  message,
  onComplete,
}: LevelQuizOnlyProps) {
  const [step, setStep] = useState<"quiz" | "done">("quiz");
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);

  const questions = QUIZZES[levelId];
  if (!questions?.length) return null;

  const handleQuizComplete = (score: number, results: QuizResultItem[]) => {
    setQuizScore(score);
    setQuizResults(results);
    setStep("done");
    onComplete(score);
  };

  return (
    <div className="space-y-6">
      {step === "quiz" && (
        <QuizCard questions={questions} onComplete={handleQuizComplete} />
      )}
      {step === "done" && (
        <LevelCompleteCard
          level={levelId}
          levelName={levelName}
          quizScore={quizScore}
          message={message}
          quizResults={quizResults}
        />
      )}
    </div>
  );
}
