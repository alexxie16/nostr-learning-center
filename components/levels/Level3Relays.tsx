"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { ExerciseCard, type ExerciseItem } from "../shared/ExerciseCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { fetchEvents, DEFAULT_RELAYS } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";
import type { Event } from "nostr-tools";

const NOTE_TO_PUBLISH = {
  kind: 1,
  tags: [["t", "nostrlearn"]],
  content: "Publishing to Nostr relays! Working on Level 3 at Nostr Learning Center 📡 #nostrlearn",
};

const EXERCISES: ExerciseItem[] = [
  {
    question: "Can a relay forge or modify your signed events?",
    options: ["Yes, relays control everything", "No, events are cryptographically signed", "Only if you allow it"],
    correct: 1,
    explanation: "Events are signed. Any modification would break the signature. Relays can censor but cannot alter valid events.",
  },
  {
    question: "Can you use multiple relays at once?",
    options: ["No, only one", "Yes, you connect to many relays", "Only with a paid subscription"],
    correct: 1,
    explanation: "You typically connect to several relays for redundancy. If one goes down or censors you, others still have your data.",
  },
];

interface Level3RelaysProps {
  onComplete: (quizScore: number) => void;
}

export function Level3Relays({ onComplete }: Level3RelaysProps) {
  const [step, setStep] = useState<"connect" | "fetch" | "publish" | "ex1" | "ex2" | "quiz" | "done">("connect");
  const [events, setEvents] = useState<Event[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const { signEvent, publish, pubkey } = useNostr();

  const handleFetch = async () => {
    setStep("fetch");
    setLoading(true);
    try {
      const evs = await fetchEvents(DEFAULT_RELAYS, { kinds: [1], limit: 5 });
      setEvents(evs);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    setPublishError(null);
    if (!pubkey) {
      setPublishError("You need to sign in first. Use the Sign in button in the header.");
      return;
    }
    setPublishing(true);
    try {
      const template = {
        ...NOTE_TO_PUBLISH,
        created_at: Math.floor(Date.now() / 1000),
      };
      const event = await signEvent(template);
      await publish(event);
      setPublished(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Publish failed. Try again.";
      setPublishError(msg);
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
      {step === "connect" && (
        <TaskCard
          title="Connect to Relays"
          description="Relays store and distribute events. We'll connect to public relays."
          completed={true}
        >
          <p className="text-sm text-zinc-400">
            Relays used: {DEFAULT_RELAYS.join(", ")}
          </p>
          <button
            onClick={handleFetch}
            className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
          >
            Fetch Recent Events
          </button>
        </TaskCard>
      )}

      {step === "fetch" && (
        <TaskCard
          title="Fetch from Relay"
          description="Query the relay for recent kind-1 (text) events."
          completed={events.length > 0}
        >
          {loading ? (
            <p className="text-zinc-500">Fetching events…</p>
          ) : (
            <div>
              <p className="text-sm text-zinc-500 mb-2">
                Fetched {events.length} events:
              </p>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {events.slice(0, 5).map((e) => (
                  <li key={e.id} className="rounded bg-zinc-800 p-2 text-xs">
                    <span className="text-amber-400">{e.pubkey.slice(0, 16)}…</span>:{" "}
                    {e.content.slice(0, 60)}…
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep("publish")}
                className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
              >
                Publish Your Note
              </button>
            </div>
          )}
        </TaskCard>
      )}

      {step === "publish" && (
        <TaskCard
          title="Publish to Relay"
          description="Publish your completion note to the Nostr network."
          completed={published}
        >
          {!published ? (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">Note you will publish (kind 1):</p>
              <pre className="rounded bg-zinc-800 p-4 text-xs text-zinc-300 overflow-x-auto">
                {JSON.stringify(
                  { ...NOTE_TO_PUBLISH, created_at: "<set at publish>" },
                  null,
                  2
                )}
              </pre>
              {!pubkey && (
                <p className="text-sm text-amber-400">
                  Sign in with the button in the header first (or generate demo keys).
                </p>
              )}
              {publishError && (
                <p className="text-sm text-red-400">{publishError}</p>
              )}
              <button
                onClick={handlePublish}
                disabled={!pubkey || publishing}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? "Publishing…" : "Publish Note"}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-green-400 text-sm mb-2">Published successfully!</p>
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
          questions={QUIZZES[3]}
          onComplete={handleQuizComplete}
          requireAllCorrect
        />
      )}

      {step === "done" && (
        <LevelCompleteCard
          level={3}
          levelName="Relays"
          quizScore={quizScore}
          message="You understand relays."
          quizResults={quizResults}
        />
      )}
    </div>
  );
}
