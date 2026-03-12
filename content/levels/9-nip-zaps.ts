import type { LevelContent } from "./types";

export const level9: LevelContent = {
  id: 9,
  name: "Zaps & Payments (NIP-57, NIP-47, NIP-75)",
  description: "Lightning zaps, wallet connect, and zap goals",
  track: "nips",
  quiz: [
    {
      question: 'What are "Zaps" in Nostr, defined by NIP-57?',
      options: [
        "Relay pings",
        "DNS lookups",
        "Lightning payments attached to notes or profiles",
        "Encrypted messages",
      ],
      correct: 2,
      explanation:
        "NIP-57 describes Lightning zap payments linked to Nostr events.",
    },
    {
      question: "Which kind number represents a Zap event in NIP-57?",
      options: ["1", "9734", "9735", "10002"],
      correct: 2,
      explanation:
        "Zap payments use kind 9735; zap requests use kind 9734.",
    },
    {
      question: "What does NIP-47 (Nostr Wallet Connect) enable?",
      options: [
        "Direct DM encryption",
        "Remote control of a wallet via Nostr events",
        "Relay access lists",
        "Calendar events",
      ],
      correct: 1,
      explanation:
        "NIP-47 lets clients talk to wallets over Nostr to request and manage payments.",
    },
    {
      question: 'NIP-75 "Zap Goals" is used for:',
      options: [
        "Describing target amounts and purposes for zaps",
        "Defining new key formats",
        "Relay performance scoring",
        "Encrypted payload versions",
      ],
      correct: 0,
      explanation:
        "NIP-75 defines zap goals so users can signal funding targets and purposes.",
    },
  ],
};
