"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  generateKeypair,
  getNpub,
  hasNip07,
  getPublicKeyNip07,
  signEventNip07,
  getPool,
  DEFAULT_RELAYS,
  createAndSignEvent,
} from "@/lib/nostr";
import type { EventTemplate, Event } from "nostr-tools";

type NostrContextValue = {
  pubkey: string | null;
  npub: string | null;
  sk: Uint8Array | null;
  isNip07: boolean;
  login: () => Promise<void>;
  logout: () => void;
  signEvent: (template: EventTemplate) => Promise<Event>;
  publish: (event: Event) => Promise<void>;
  hasExtension: boolean;
};

const NostrContext = createContext<NostrContextValue | null>(null);

export function NostrProvider({ children }: { children: React.ReactNode }) {
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [npub, setNpub] = useState<string | null>(null);
  const [sk, setSk] = useState<Uint8Array | null>(null);
  const [isNip07, setIsNip07] = useState(false);

  const login = useCallback(async () => {
    if (hasNip07()) {
      try {
        const pk = await getPublicKeyNip07();
        setPubkey(pk);
        setNpub(getNpub(pk));
        setSk(null);
        setIsNip07(true);
      } catch (err) {
        console.error("NIP-07 login failed:", err);
        throw err;
      }
    } else {
      const { sk: secretKey, pk } = generateKeypair();
      setPubkey(pk);
      setNpub(getNpub(pk));
      setSk(secretKey);
      setIsNip07(false);
    }
  }, []);

  const logout = useCallback(() => {
    setPubkey(null);
    setNpub(null);
    setSk(null);
    setIsNip07(false);
  }, []);

  const signEvent = useCallback(
    async (template: EventTemplate): Promise<Event> => {
      if (isNip07) {
        return signEventNip07(template);
      }
      if (sk) {
        return createAndSignEvent(template, sk);
      }
      throw new Error("Not logged in. Connect extension or generate keys first.");
    },
    [isNip07, sk]
  );

  const publish = useCallback(async (event: Event) => {
    const pool = getPool();
    const relays = [...DEFAULT_RELAYS];
    const results = pool.publish(relays, event);
    const timeoutMs = 15000;
    const withTimeout = (p: Promise<string>) =>
      Promise.race([
        p,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Relay timeout. Check your connection.")), timeoutMs)
        ),
      ]);
    await Promise.any(results.map(withTimeout));
  }, []);

  const value: NostrContextValue = {
    pubkey,
    npub,
    sk,
    isNip07,
    login,
    logout,
    signEvent,
    publish,
    hasExtension: typeof window !== "undefined" && hasNip07(),
  };

  return (
    <NostrContext.Provider value={value}>{children}</NostrContext.Provider>
  );
}

export function useNostr() {
  const ctx = useContext(NostrContext);
  if (!ctx) throw new Error("useNostr must be used within NostrProvider");
  return ctx;
}
