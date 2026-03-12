import type { LevelContent } from "./types";

export const level4: LevelContent = {
  id: 4,
  name: "NIPs",
  description: "Explore Nostr Implementation Possibilities",
  quiz: [
    {
      question: "What does NIP stand for?",
      options: ["Nostr Identity Protocol", "Nostr Implementation Possibilities", "Network Internet Protocol"],
      correct: 1,
      explanation:
        "NIPs are technical specs that extend Nostr. Like BIPs for Bitcoin, they standardize new features (NIP-19 bech32, NIP-05 identifiers, etc.) so clients stay interoperable.",
    },
    {
      question: "NIP-19 defines:",
      options: ["Encrypted messaging", "Human-readable identifiers (npub, nsec, note1)", "Relay discovery"],
      correct: 1,
      explanation:
        "NIP-19 specifies bech32-encoded identifiers: npub (public key), nsec (private key), note1 (event id), nprofile (profile with relays), etc.",
    },
    {
      question: "NIP-05 allows:",
      options: ["Linking your key to a domain (user@domain.com)", "Direct messages", "Event reactions"],
      correct: 0,
      explanation:
        "NIP-05 lets you map a human-readable identifier like alice@example.com to your Nostr public key via a JSON file on your domain. Useful for discoverability.",
    },
  ],
};
