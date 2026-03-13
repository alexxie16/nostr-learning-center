"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { ExerciseCard, type ExerciseItem } from "../shared/ExerciseCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { decodeNpub, getNpub } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";

const EXERCISES: ExerciseItem[] = [
  {
    question: "What does NIP stand for?",
    options: ["Nostr Identity Protocol", "Nostr Implementation Possibilities", "Network Internet Protocol"],
    correct: 1,
    explanation: "NIPs are technical specs that extend Nostr. Like BIPs for Bitcoin.",
  },
  {
    question: "NIP-05 allows linking your key to what?",
    options: ["A relay URL", "A domain (e.g. user@example.com)", "A Lightning address"],
    correct: 1,
    explanation: "NIP-05 maps a human-readable identifier like alice@example.com to your Nostr public key via a JSON file on your domain.",
  },
];

interface Level4NIPsProps {
  onComplete: (quizScore: number) => void;
}

export function Level4NIPs({ onComplete }: Level4NIPsProps) {
  const [step, setStep] = useState<"encode" | "decode" | "ex1" | "ex2" | "quiz" | "done">("encode");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");
  const [inputNpub, setInputNpub] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);

  const handleEncode = () => {
    // Use a sample hex pubkey for encoding demo
    const sampleHex = "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d";
    setEncoded(getNpub(sampleHex));
  };

  const handleDecode = () => {
    try {
      const hex = decodeNpub(inputNpub);
      setDecoded(hex);
    } catch {
      setDecoded("Invalid npub");
    }
  };

  const handleQuizComplete = (score: number, results: QuizResultItem[]) => {
    setQuizScore(score);
    setQuizResults(results);
    setStep("done");
    onComplete(score);
  };

  return (
    <div className="space-y-6">
      {step === "encode" && (
        <TaskCard
          title="NIP-19: Encode"
          description="NIP-19 defines human-readable identifiers. Encode a hex pubkey to npub format."
          completed={!!encoded}
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-500">
              Sample hex: 3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d
            </p>
            <button
              onClick={handleEncode}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
            >
              Encode to npub
            </button>
            {encoded && (
              <div>
                <p className="text-xs text-zinc-500">Result:</p>
                <code className="block rounded bg-zinc-800 p-3 text-sm text-amber-400 break-all">
                  {encoded}
                </code>
                <button
                  onClick={() => setStep("decode")}
                  className="mt-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
                >
                  Decode npub
                </button>
              </div>
            )}
          </div>
        </TaskCard>
      )}

      {step === "decode" && (
        <TaskCard
          title="NIP-19: Decode"
          description="Decode an npub back to hex. Paste an npub below."
          completed={!!decoded}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="npub1..."
              value={inputNpub}
              onChange={(e) => setInputNpub(e.target.value)}
              className="w-full rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 border border-zinc-600"
            />
            <button
              onClick={handleDecode}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
            >
              Decode
            </button>
            {decoded && (
              <div>
                <p className="text-xs text-zinc-500">Hex result:</p>
                <code
                  className={`block rounded bg-zinc-800 p-3 text-xs break-all ${
                    decoded === "Invalid npub" ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {decoded}
                </code>
                {decoded !== "Invalid npub" && (
                  <button
                    onClick={() => setStep("ex1")}
                    className="mt-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}
          </div>
        </TaskCard>
      )}

      {step === "ex1" && (
        <ExerciseCard exercise={EXERCISES[0]!} onCorrect={() => setStep("ex2")} />
      )}

      {step === "ex2" && (
        <ExerciseCard exercise={EXERCISES[1]!} onCorrect={() => setStep("quiz")} />
      )}

      {step === "quiz" && (
        <QuizCard
          questions={QUIZZES[4]}
          onComplete={handleQuizComplete}
          requireAllCorrect
        />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={4}
          levelName="NIPs"
          quizScore={quizScore}
          message="You understand NIPs."
          quizResults={quizResults}
        />
      )}
    </div>
  );
}
