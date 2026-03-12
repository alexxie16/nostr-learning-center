"use client";

import { useState, useEffect } from "react";
import { useNostr } from "./NostrProvider";

export function AuthButton() {
  const { pubkey, npub, login, logout, hasExtension } = useNostr();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pubkey) {
    return (
      <div className="flex items-center gap-3">
        <code className="rounded bg-zinc-800 px-2 py-1 text-xs text-amber-400 max-w-[140px] truncate">
          {npub}
        </code>
        <button
          onClick={logout}
          className="rounded bg-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 transition-colors"
    >
      {!mounted ? "Sign in" : hasExtension ? "Sign in with Nostr" : "Generate Demo Keys"}
    </button>
  );
}
