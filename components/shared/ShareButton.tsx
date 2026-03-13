"use client";

import { useState } from "react";
import { useNostr } from "../NostrProvider";
import { ShareModal } from "./ShareModal";

interface ShareButtonProps {
  level: number;
  levelName: string;
  onSuccess?: () => void;
}

const APP_URL = typeof window !== "undefined" ? window.location.origin : "";

/** Level-specific share hooks to make posts more engaging */
const SHARE_HOOKS: Record<number, string> = {
  1: "Generated my first Nostr keypair 🔑",
  2: "Built and signed my first Nostr event ✍️",
  3: "Fetched events from relays and published to the network 📡",
  4: "Encoded and decoded npub — NIP-19 in action",
  5: "Published a reaction on Nostr ⚡",
  6: "Core NIPs (01, 02, 17) — protocol foundations unlocked",
  7: "Identity & keys (NIP-05, NIP-19) mastered",
  8: "Browser signing & NIP-46 — no more pasting keys",
  9: "Zaps & Lightning (NIP-57, 47, 75) — payments on Nostr",
  10: "Relay discovery & NIP-65, 66, 50 — the network layer",
  11: "Social, lists, bookmarks (NIP-51, 52, 53, 58, 72) — full Nostr stack",
};

function getDefaultShareContent(level: number, levelName: string): string {
  const hook = SHARE_HOOKS[level] ?? `Finished Level ${level}: ${levelName}`;
  return `${hook}\n\nLevel ${level} complete at Nostr Learning Center — learn the protocol by doing, not just reading.\n\nTry it → ${APP_URL}\n\n#nostrlearn #nostr`;
}

export function ShareButton({ level, levelName, onSuccess }: ShareButtonProps) {
  const { pubkey, signEvent, publish } = useNostr();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const defaultContent = getDefaultShareContent(level, levelName);

  const handleShareClick = () => {
    if (!pubkey) return;
    setShowModal(true);
  };

  const handleConfirm = async (content: string) => {
    const template = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["t", "nostrlearn"], ["t", "nostr"]],
      content: content.trim(),
    };
    const event = await signEvent(template);
    await publish(event);
    setStatus("success");
    setShowModal(false);
    onSuccess?.();
  };

  if (!pubkey) {
    return (
      <p className="text-sm text-zinc-500">
        Sign in or generate keys to share your progress on Nostr.
      </p>
    );
  }

  if (status === "success") {
    return (
      <p className="text-sm text-green-400">Shared to Nostr successfully!</p>
    );
  }

  return (
    <>
      <button
        onClick={handleShareClick}
        className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800"
      >
        Share to Nostr
      </button>
      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultContent={defaultContent}
        onConfirm={handleConfirm}
      />
    </>
  );
}
