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

export function ShareButton({ level, levelName, onSuccess }: ShareButtonProps) {
  const { pubkey, signEvent, publish } = useNostr();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const defaultContent = `I completed Level ${level}: ${levelName} in Nostr Learning Center! 🔗 ${APP_URL}`;

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
