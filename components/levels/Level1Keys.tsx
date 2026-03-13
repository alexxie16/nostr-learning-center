"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { ExerciseCard, type ExerciseItem } from "../shared/ExerciseCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { generateKeypair, getNpub } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";

const EXERCISES: ExerciseItem[] = [
  {
    question: "Which key should you NEVER share?",
    options: ["Public key (npub)", "Private key (nsec)", "Both"],
    correct: 1,
    explanation: "Your private key (nsec) proves you control your identity. Anyone with it can sign events as you.",
  },
  {
    question: "What format is a Nostr public key typically displayed in?",
    options: ["Hex string", "npub... (bech32)", "Base64"],
    correct: 1,
    explanation: "NIP-19 defines bech32 encoding. The 'npub' prefix makes keys human-readable and includes a checksum.",
  },
];

interface Level1KeysProps {
  onComplete: (quizScore: number) => void;
}

export function Level1Keys({ onComplete }: Level1KeysProps) {
  const [step, setStep] = useState<"task" | "ex1" | "ex2" | "quiz" | "done">("task");
  const [generatedNpub, setGeneratedNpub] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const { npub, login } = useNostr();

  const handleGenerate = () => {
    const { pk } = generateKeypair();
    setGeneratedNpub(getNpub(pk));
  };

  const handleCopy = async () => {
    const toCopy = npub || generatedNpub;
    if (toCopy) await navigator.clipboard.writeText(toCopy);
  };

  const handleQuizComplete = (score: number, results: QuizResultItem[]) => {
    setQuizScore(score);
    setQuizResults(results);
    setStep("done");
    onComplete(score);
  };

  const displayNpub = npub || generatedNpub;

  return (
    <div className="space-y-6">
      {step === "task" && (
        <TaskCard
          title="Generate a Keypair"
          description="In Nostr, your identity is a cryptographic keypair. Generate one below and see your public key (npub)."
          completed={!!displayNpub}
        >
          <div className="space-y-4">
            {!displayNpub ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGenerate}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
                >
                  Generate Keypair
                </button>
                <span className="text-zinc-500 text-sm">or</span>
                <button
                  onClick={() => login().then(() => setGeneratedNpub(""))}
                  className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800"
                >
                  Sign in with Extension
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Your public key (npub):</p>
                <code className="block rounded bg-zinc-800 p-3 text-sm text-amber-400 break-all">
                  {displayNpub}
                </code>
                <button
                  onClick={handleCopy}
                  className="mt-2 rounded bg-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-600"
                >
                  Copy to clipboard
                </button>
              </div>
            )}
            {displayNpub && (
              <button
                onClick={() => setStep("ex1")}
                className="block rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
              >
                Continue
              </button>
            )}
          </div>
        </TaskCard>
      )}

      {step === "ex1" && (
        <ExerciseCard
          exercise={EXERCISES[0]!}
          onCorrect={() => setStep("ex2")}
        />
      )}

      {step === "ex2" && (
        <ExerciseCard
          exercise={EXERCISES[1]!}
          onCorrect={() => setStep("quiz")}
        />
      )}

      {step === "quiz" && (
        <QuizCard
          questions={QUIZZES[1]}
          onComplete={handleQuizComplete}
          requireAllCorrect
        />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={1}
          levelName="Keys"
          quizScore={quizScore}
          message="You learned about Nostr keys."
          quizResults={quizResults}
        />
      )}
    </div>
  );
}
