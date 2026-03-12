# Nostr Learning Center

An interactive web game for learning the Nostr protocol. Master the decentralized protocol through hands-on tasks and quizzes, then sign in with Nostr to save progress across devices and share achievements.

## Features

- **11 levels** across 3 tracks:
  - **Basics** (5): Keys, Events, Relays, NIPs, Kinds — hands-on tasks + quizzes
  - **Advanced NIPs** (6): Core (01/02/17), Identity (05/19), Browser (07/46), Zaps (57/47/75), Relays (65/66/50), Social (51/52/53/58/72) — quizzes
  - **Advanced Kinds** — coming soon
- **Hybrid learning**: Hands-on tasks (Keys, Events, Relays, NIPs, Kinds) and quizzes with explanations
- **Nostr sign-in**: NIP-07 browser extension (Alby, nos2x) or generate demo keys for try-it mode
- **Progress sync**: When signed in with NIP-07, progress syncs to Nostr via NIP-78 (kind 30078)
- **Share to Nostr**: Publish level completions as kind-1 notes with `#nostrlearn` and `#nostr` tags
- **Developer mode**: Unlock all levels for testing (localStorage toggle)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Tech

- Next.js 14 (App Router)
- nostr-tools
- Tailwind CSS
- NIP-07 (extension sign-in), NIP-78 (app data / progress sync)
