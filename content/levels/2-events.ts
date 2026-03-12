import type { LevelContent } from "./types";

export const level2: LevelContent = {
  id: 2,
  name: "Events",
  description: "Understand how data is structured in Nostr",
  track: "basics",
  quiz: [
    {
      question: "Which field uniquely identifies a Nostr event?",
      options: ["pubkey", "id", "created_at"],
      correct: 1,
      explanation:
        "The 'id' is the SHA-256 hash of the event's serialized content. It uniquely identifies each event; two events with the same content would have the same id.",
    },
    {
      question: "What does 'kind' represent in an event?",
      options: ["The relay it came from", "The type of event (e.g. note, profile)", "Encryption level"],
      correct: 1,
      explanation:
        "Kind determines the event type: 0=profile, 1=text note, 4=DM, 7=reaction, 9734=zap, etc. Clients and relays use it to interpret the event correctly.",
    },
    {
      question: "Who adds the 'sig' (signature) to an event?",
      options: ["The relay", "The author using their private key", "Anyone can add it"],
      correct: 1,
      explanation:
        "The author signs the event with their private key. The signature proves the event wasn't tampered with and that it came from the key owner. Relays cannot forge signatures.",
    },
  ],
};
