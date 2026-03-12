export const LEVELS = [
  { id: 1, name: "Keys", description: "Learn about cryptographic keypairs and Nostr identity" },
  { id: 2, name: "Events", description: "Understand how data is structured in Nostr" },
  { id: 3, name: "Relays", description: "Discover how relays store and distribute events" },
  { id: 4, name: "NIPs", description: "Explore Nostr Implementation Possibilities" },
  { id: 5, name: "Advanced Nostr", description: "DMs, reactions, Zaps, and more" },
] as const;

export const QUIZZES: Record<
  number,
  { question: string; options: string[]; correct: number }[]
> = {
  1: [
    { question: "Which key should you NEVER share?", options: ["Public key (npub)", "Private key (nsec)", "Both"], correct: 1 },
    { question: "What format is a Nostr public key typically displayed in?", options: ["Hex string", "npub... (bech32)", "Base64"], correct: 1 },
    { question: "Your Nostr identity is derived from:", options: ["A username you choose", "A cryptographic keypair", "An email address"], correct: 1 },
  ],
  2: [
    { question: "Which field uniquely identifies a Nostr event?", options: ["pubkey", "id", "created_at"], correct: 1 },
    { question: "What does 'kind' represent in an event?", options: ["The relay it came from", "The type of event (e.g. note, profile)", "Encryption level"], correct: 1 },
    { question: "Who adds the 'sig' (signature) to an event?", options: ["The relay", "The author using their private key", "Anyone can add it"], correct: 1 },
  ],
  3: [
    { question: "What is a Nostr relay?", options: ["A VPN service", "A server that stores and distributes events", "A type of encryption"], correct: 1 },
    { question: "Can a relay forge or modify your events?", options: ["Yes, relays control everything", "No, events are cryptographically signed", "Only if you allow it"], correct: 1 },
    { question: "Can you use multiple relays at once?", options: ["No, only one", "Yes, you connect to many relays", "Only with a paid subscription"], correct: 1 },
  ],
  4: [
    { question: "What does NIP stand for?", options: ["Nostr Identity Protocol", "Nostr Implementation Possibilities", "Network Internet Protocol"], correct: 1 },
    { question: "NIP-19 defines:", options: ["Encrypted messaging", "Human-readable identifiers (npub, nsec, note1)", "Relay discovery"], correct: 1 },
    { question: "NIP-05 allows:", options: ["Linking your key to a domain (user@domain.com)", "Direct messages", "Event reactions"], correct: 0 },
  ],
  5: [
    { question: "What is a Nostr 'reaction' (kind 7)?", options: ["A comment on a note", "A like/emoji response to an event", "A direct message"], correct: 1 },
    { question: "Zaps (kind 9734) are:", options: ["Encrypted notes", "Bitcoin Lightning tips over Nostr", "Profile updates"], correct: 1 },
    { question: "NIP-07 enables:", options: ["Encrypted DMs", "Browser extension sign-in (window.nostr)", "Relay authentication"], correct: 1 },
  ],
};
