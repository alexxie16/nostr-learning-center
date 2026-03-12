"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { QUIZZES } from "@/content/levels";

interface Level5AdvancedProps {
  onComplete: (quizScore: number) => void;
}

export function Level5Advanced({ onComplete }: Level5AdvancedProps) {
  const [step, setStep] = useState<"nip07" | "reaction" | "quiz" | "done">("nip07");
  const [reactionPublished, setReactionPublished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const { pubkey, hasExtension, login, signEvent, publish } = useNostr();

  const handleSignIn = async () => {
    await login();
  };

  const handlePublishReaction = async () => {
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
      console.error(err);
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
            <button
              onClick={handlePublishReaction}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
            >
              Publish Reaction
            </button>
          ) : (
            <div>
              <p className="text-sm text-green-400 mb-2">Reaction published!</p>
              <button
                onClick={() => setStep("quiz")}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
              >
                Continue to Quiz
              </button>
            </div>
          )}
        </TaskCard>
      )}

      {step === "quiz" && (
        <QuizCard questions={QUIZZES[5]} onComplete={handleQuizComplete} />
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
