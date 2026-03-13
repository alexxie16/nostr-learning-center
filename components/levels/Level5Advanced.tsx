"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { ExerciseCard, type ExerciseItem } from "../shared/ExerciseCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { QUIZZES } from "@/content/levels";

const EXERCISES: ExerciseItem[] = [
  {
    question: "What kind number is a reaction (like, emoji response)?",
    options: ["1", "4", "7", "9734"],
    correct: 2,
    explanation: "Reactions are kind-7 events that reference another event via an 'e' tag.",
  },
  {
    question: "What are Zaps in Nostr?",
    options: ["Relay pings", "Encrypted DMs", "Bitcoin Lightning tips over Nostr", "Profile badges"],
    correct: 2,
    explanation: "Zaps are Lightning payments sent as Nostr events. NIP-57 defines the zap protocol.",
  },
];

interface Level5AdvancedProps {
  onComplete: (quizScore: number) => void;
}

export function Level5Advanced({ onComplete }: Level5AdvancedProps) {
  const [step, setStep] = useState<"nip07" | "reaction" | "ex1" | "ex2" | "quiz" | "done">("nip07");
  const [reactionPublished, setReactionPublished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const [reactionError, setReactionError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const { pubkey, hasExtension, login, signEvent, publish } = useNostr();

  const handleSignIn = async () => {
    await login();
  };

  const handlePublishReaction = async () => {
    setReactionError(null);
    setPublishing(true);
    try {
      // Create a reaction (kind 7) to a placeholder note
      const template = {
        kind: 7,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["e", "0000000000000000000000000000000000000000000000000000000000000001"],
          ["p", "0000000000000000000000000000000000000000000000000000000000000001"],
        ],
        content: "+",
      };
      const event = await signEvent(template);
      await publish(event);
      setReactionPublished(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Publish failed. Try again.";
      setReactionError(msg);
    } finally {
      setPublishing(false);
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
      {step === "nip07" && (
        <TaskCard
          title="NIP-07: Sign in with Nostr"
          description="NIP-07 lets browser extensions (Alby, nos2x) provide signing. Connect your extension to use your real identity."
          completed={!!pubkey}
        >
          <div className="space-y-4">
            {!pubkey ? (
              <button
                onClick={handleSignIn}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
              >
                {hasExtension ? "Sign in with Extension" : "Generate Demo Keys"}
              </button>
            ) : (
              <div>
                <p className="text-sm text-green-400">Connected! Pubkey: {pubkey.slice(0, 20)}…</p>
                <button
                  onClick={() => setStep("reaction")}
                  className="mt-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
                >
                  Publish a Reaction
                </button>
              </div>
            )}
            {!hasExtension && (
              <p className="text-xs text-zinc-500">
                Install a Nostr extension (Alby, nos2x) to sign in with your real key.
              </p>
            )}
          </div>
        </TaskCard>
      )}

      {step === "reaction" && (
        <TaskCard
          title="Publish a Reaction (Kind 7)"
          description="Reactions are kind-7 events that reference another event. Publish one to complete this task."
          completed={reactionPublished}
        >
          {!reactionPublished ? (
            <div className="space-y-3">
              {reactionError && (
                <p className="text-sm text-red-400">{reactionError}</p>
              )}
              <button
                onClick={handlePublishReaction}
                disabled={publishing}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? "Publishing…" : "Publish Reaction"}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-green-400 mb-2">Reaction published!</p>
              <button
                onClick={() => setStep("ex1")}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
              >
                Continue
              </button>
            </div>
          )}
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
          questions={QUIZZES[5]}
          onComplete={handleQuizComplete}
          requireAllCorrect
        />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={5}
          levelName="Advanced Nostr"
          quizScore={quizScore}
          message="You've mastered advanced Nostr."
          quizResults={quizResults}
        />
      )}
    </div>
  );
}
