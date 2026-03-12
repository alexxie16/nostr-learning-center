"use client";

import { useState, useEffect } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContent: string;
  onConfirm: (content: string) => Promise<void>;
}

export function ShareModal({
  isOpen,
  onClose,
  defaultContent,
  onConfirm,
}: ShareModalProps) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (isOpen) setContent(defaultContent);
  }, [isOpen, defaultContent]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(content);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setContent(defaultContent);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-zinc-100">
          Share to Nostr
        </h3>
        <p className="mb-3 text-sm text-zinc-400">
          Your note will be public on the Nostr network. Edit below if you&apos;d like:
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 w-full resize-none rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          rows={4}
        />
        {error && (
          <p className="mb-3 text-sm text-red-400">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !content.trim()}
            className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Publishing…" : "Share to the world"}
          </button>
        </div>
      </div>
    </div>
  );
}
