"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { ExerciseCard, type ExerciseItem } from "../shared/ExerciseCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { createAndSignEvent } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";

const EXERCISES: ExerciseItem[] = [
  {
    question: "What does 'kind' represent in a Nostr event?",
    options: ["The relay it came from", "The type of event (e.g. note, profile)", "Encryption level"],
    correct: 1,
    explanation: "Kind determines the event type: 0=profile, 1=text note, 4=DM, 7=reaction, etc.",
  },
  {
    question: "Who adds the 'sig' (signature) to an event?",
    options: ["The relay", "The author using their private key", "Anyone can add it"],
    correct: 1,
    explanation: "The author signs with their private key. The signature proves the event wasn't tampered with.",
  },
];

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
  const [step, setStep] = useState<"inspect" | "build" | "ex1" | "ex2" | "quiz" | "done">("inspect");
  const [signedEvent, setSignedEvent] = useState<object | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const { sk, pubkey, signEvent } = useNostr();

  const handleBuildAndSign = async () => {
    try {
      const template = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["t", "nostrlearn"], ["t", "nostr"]],
        content: "Built my first Nostr event! Level 2 complete at Nostr Learning Center 🎯 #nostrlearn #nostr",
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

  const handleQuizComplete = (score: number, results: QuizResultItem[]) => {
    setQuizScore(score);
    setQuizResults(results);
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
                onClick={() => setStep("ex1")}
                className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
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
          questions={QUIZZES[2]}
          onComplete={handleQuizComplete}
          requireAllCorrect
        />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={2}
          levelName="Events"
          quizScore={quizScore}
          message="You understand Nostr events."
          quizResults={quizResults}
        />
      )}
    </div>
  );
}
