"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { QuizCard } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { createAndSignEvent } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";

interface Level2EventsProps {
  onComplete: (quizScore: number) => void;
}

const SAMPLE_EVENT = {
  id: "abc123...",
  pubkey: "npub1...",
  created_at: 1700000000,
  kind: 1,
  tags: [],
  content: "Hello Nostr!",
  sig: "def456...",
};

export function Level2Events({ onComplete }: Level2EventsProps) {
  const [step, setStep] = useState<"inspect" | "build" | "quiz" | "done">("inspect");
  const [signedEvent, setSignedEvent] = useState<object | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const { sk, pubkey, signEvent } = useNostr();

  const handleBuildAndSign = async () => {
    try {
      const template = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [] as string[][],
        content: "I completed Level 2: Events in Nostr Learn!",
      };
      let event;
      if (sk) {
        event = createAndSignEvent(template, sk);
      } else {
        event = await signEvent(template);
      }
      setSignedEvent(event);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setStep("done");
    onComplete(score);
  };

  return (
    <div className="space-y-6">
      {step === "inspect" && (
        <TaskCard
          title="Inspect an Event"
          description="Every piece of data in Nostr is an event. Here's the structure:"
          completed={step !== "inspect"}
        >
          <pre className="rounded bg-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto">
            {JSON.stringify(SAMPLE_EVENT, null, 2)}
          </pre>
          <p className="text-sm text-zinc-500 mt-2">
            id, pubkey, kind, content, tags, sig — these define a Nostr event.
          </p>
          <button
            onClick={() => setStep("build")}
            className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
          >
            Build & Sign an Event
          </button>
        </TaskCard>
      )}

      {step === "build" && (
        <TaskCard
          title="Build & Sign a Kind-1 Event"
          description="Create a text note (kind 1), sign it with your key, and see the result."
          completed={!!signedEvent}
        >
          {!signedEvent ? (
            <div>
              {!pubkey && (
                <p className="text-sm text-zinc-500 mb-2">
                  Sign in or generate keys from the header first, then click below.
                </p>
              )}
              <button
                onClick={handleBuildAndSign}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
              >
                Sign Event
              </button>
            </div>
          ) : (
            <div>
              <pre className="rounded bg-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto max-h-48">
                {JSON.stringify(signedEvent, null, 2)}
              </pre>
              <button
                onClick={() => setStep("quiz")}
                className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
              >
                Continue to Quiz
              </button>
            </div>
          )}
        </TaskCard>
      )}

      {step === "quiz" && (
        <QuizCard questions={QUIZZES[2]} onComplete={handleQuizComplete} />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={2}
          levelName="Events"
          quizScore={quizScore}
          message="You understand Nostr events."
        />
      )}
    </div>
  );
}
