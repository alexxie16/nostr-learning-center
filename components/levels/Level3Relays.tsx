"use client";

import { useState } from "react";
import { TaskCard } from "../shared/TaskCard";
import { QuizCard, type QuizResultItem } from "../shared/QuizCard";
import { LevelCompleteCard } from "../shared/LevelCompleteCard";
import { useNostr } from "../NostrProvider";
import { fetchEvents, DEFAULT_RELAYS } from "@/lib/nostr";
import { QUIZZES } from "@/content/levels";
import type { Event } from "nostr-tools";

interface Level3RelaysProps {
  onComplete: (quizScore: number) => void;
}

export function Level3Relays({ onComplete }: Level3RelaysProps) {
  const [step, setStep] = useState<"connect" | "fetch" | "publish" | "quiz" | "done">("connect");
  const [events, setEvents] = useState<Event[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const { signEvent, publish } = useNostr();

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
    try {
      const template = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["t", "nostrlearn"]],
        content: "I completed Level 3: Relays in Nostr Learn! 🚀",
      };
      const event = await signEvent(template);
      await publish(event);
      setPublished(true);
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
            <button
              onClick={handlePublish}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400"
            >
              Publish Note
            </button>
          ) : (
            <div>
              <p className="text-green-400 text-sm mb-2">Published successfully!</p>
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
        <QuizCard questions={QUIZZES[3]} onComplete={handleQuizComplete} />
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
