import type { LevelContent } from "./types";

export const level3: LevelContent = {
  id: 3,
  name: "Relays",
  description: "Discover how relays store and distribute events",
  track: "basics",
  quiz: [
    {
      question: "What is a Nostr relay?",
      options: ["A VPN service", "A server that stores and distributes events", "A type of encryption"],
      correct: 1,
      explanation:
        "Relays are WebSocket servers that store and broadcast events. Think of them like email servers: dumb pipes that don't control your identity or forge your messages.",
    },
    {
      question: "Can a relay forge or modify your events?",
      options: ["Yes, relays control everything", "No, events are cryptographically signed", "Only if you allow it"],
      correct: 1,
      explanation:
        "Events are signed. Any modification would break the signature. Relays can censor (refuse to store or broadcast) but cannot alter or create valid events in your name.",
    },
    {
      question: "Can you use multiple relays at once?",
      options: ["No, only one", "Yes, you connect to many relays", "Only with a paid subscription"],
      correct: 1,
      explanation:
        "You typically connect to several relays for redundancy. If one goes down or censors you, others still have your data. Relays are interchangeable infrastructure.",
    },
  ],
};
