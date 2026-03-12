"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { QuizCard } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { decodeNpub, getNpub } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";

interface Level4NIPsProps {
  onComplete: (quizScore: number) => void;
}

export function Level4NIPs({ onComplete }: Level4NIPsProps) {
  const [step, setStep] = useState<"encode" | "decode" | "quiz" | "done">("encode");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");
  const [inputNpub, setInputNpub] = useState("");
  const [quizScore, setQuizScore] = useState(0);

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

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
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
                <code className="block rounded bg-zinc-800 p-3 text-xs text-amber-400 break-all">
                  {decoded}
                </code>
                <button
                  onClick={() => setStep("quiz")}
                  className="mt-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
                >
                  Continue to Quiz
                </button>
              </div>
            )}
          </div>
        </TaskCard>
      )}

      {step === "quiz" && (
        <QuizCard questions={QUIZZES[4]} onComplete={handleQuizComplete} />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={4}
          levelName="NIPs"
          quizScore={quizScore}
          message="You understand NIPs."
        />
      )}
    </div>
  );
}
