# Nostr Learn

A simple web game for learning the Nostr protocol. Play through 5 levels (Keys, Events, Relays, NIPs, Advanced), complete hands-on tasks and quizzes, then share your progress on Nostr.

## Features

- **5 Levels**: Keys, Events, Relays, NIPs, Advanced Nostr
- **Hybrid learning**: Hands-on tasks + quizzes
- **Nostr sign-in**: NIP-07 browser extension (Alby, nos2x) or demo keys
- **Share to Nostr**: Publish level completions as kind-1 notes

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
