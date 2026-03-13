# Nostr Learning Center

An interactive web game for learning the Nostr protocol. Master the decentralized protocol through hands-on tasks and quizzes, then sign in with Nostr to save progress across devices and share achievements.

## Features

- **11 levels** in 3 tracks (Basics → Advanced NIPs → Advanced Kinds):
  - **Basics (5)**: Keys, Events, Relays, NIPs, Kinds — interactive tasks (generate keys, sign events, fetch from relays, encode/decode npub, publish reactions) plus a quiz per level
  - **Advanced NIPs (6)**: Core (01/02/17), Identity (05/19), Browser (07/46), Zaps (57/47/75), Relays (65/66/50), Social (51/52/53/58/72) — quiz-only levels with explanations
  - **Advanced Kinds** — coming soon
- **Quizzes** — multiple-choice with instant feedback and explanations for each answer
- **Sign in** — NIP-07 extension (Alby, nos2x) or demo keys (try without an extension)
- **Progress sync** — when using NIP-07, progress saves to Nostr via NIP-78 so you can pick up on another device
- **Share** — publish level completions as kind-1 notes (`#nostrlearn` / `#nostr`)
- **Developer mode** — toggle to unlock all levels for testing

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech

- Next.js 14 (App Router)
- nostr-tools
- Tailwind CSS
- NIP-07 (extension sign-in), NIP-78 (app data / progress sync)
