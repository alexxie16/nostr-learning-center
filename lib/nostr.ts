import {
  generateSecretKey,
  getPublicKey,
  finalizeEvent,
  nip19,
  SimplePool,
  type Event,
  type EventTemplate,
} from "nostr-tools";

export const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.nostr.band",
] as const;

/** NIP-78 app data identifier for progress sync */
export const PROGRESS_D_TAG = "nostr-learn-progress";

let pool: SimplePool | null = null;

export function getPool(): SimplePool {
  if (typeof window === "undefined") throw new Error("Pool only available in browser");
  if (!pool) {
    pool = new SimplePool();
  }
  return pool;
}

export async function fetchEvents(relays: readonly string[], filter: { kinds?: number[]; limit?: number }) {
  const p = getPool();
  return p.querySync([...relays], filter);
}

export function generateKeypair() {
  const sk = generateSecretKey();
  const pk = getPublicKey(sk);
  return { sk, pk };
}

export function getNpub(pk: string): string {
  return nip19.npubEncode(pk);
}

export function getNsec(sk: Uint8Array): string {
  return nip19.nsecEncode(sk);
}

export function decodeNpub(npub: string): string {
  const decoded = nip19.decode(npub);
  if (decoded.type !== "npub") throw new Error("Invalid npub");
  return decoded.data as string;
}

export function createAndSignEvent(
  template: EventTemplate,
  sk: Uint8Array
): Event {
  return finalizeEvent(template, sk);
}

export function hasNip07(): boolean {
  return typeof window !== "undefined" && !!window.nostr;
}

export async function getPublicKeyNip07(): Promise<string> {
  if (!hasNip07()) throw new Error("NIP-07 extension not available");
  return window.nostr!.getPublicKey();
}

export async function signEventNip07(template: EventTemplate): Promise<Event> {
  if (!hasNip07()) throw new Error("NIP-07 extension not available");
  return window.nostr!.signEvent(template);
}
