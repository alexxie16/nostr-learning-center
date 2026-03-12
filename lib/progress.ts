import type { EventTemplate } from "nostr-tools";
import { getPool, DEFAULT_RELAYS, PROGRESS_D_TAG } from "./nostr";

const STORAGE_KEY = "nostr-learn-progress";

export interface Progress {
  completedLevels: number[];
  quizScores: Record<number, number>;
}

/** Merge remote progress with local, taking the superset (max progress) */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const completedLevels = Array.from(
    new Set([...local.completedLevels, ...remote.completedLevels])
  ).sort((a, b) => a - b);
  const quizScores = { ...local.quizScores };
  for (const [level, score] of Object.entries(remote.quizScores)) {
    const n = Number(level);
    if (!(n in quizScores) || (remote.quizScores[n] ?? 0) > (quizScores[n] ?? 0)) {
      quizScores[n] = remote.quizScores[n] ?? 0;
    }
  }
  return { completedLevels, quizScores };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") {
    return { completedLevels: [], quizScores: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedLevels: [], quizScores: {} };
    const parsed = JSON.parse(raw) as Progress;
    return {
      completedLevels: parsed.completedLevels ?? [],
      quizScores: parsed.quizScores ?? {},
    };
  } catch {
    return { completedLevels: [], quizScores: {} };
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isLevelUnlocked(level: number, progress: Progress): boolean {
  if (level === 1) return true;
  return progress.completedLevels.includes(level - 1);
}

export function markLevelComplete(level: number, quizScore: number): Progress {
  const progress = loadProgress();
  if (!progress.completedLevels.includes(level)) {
    progress.completedLevels = [...progress.completedLevels, level].sort(
      (a, b) => a - b
    );
  }
  progress.quizScores[level] = quizScore;
  saveProgress(progress);
  return progress;
}

/** Fetch progress event from Nostr relays (NIP-78, kind 30078) */
export async function fetchProgressFromNostr(pubkey: string): Promise<Progress | null> {
  try {
    const pool = getPool();
    const events = await pool.querySync(
      [...DEFAULT_RELAYS],
      {
        kinds: [30078],
        authors: [pubkey],
        "#d": [PROGRESS_D_TAG],
        limit: 1,
      }
    );
    const ev = events[0];
    if (!ev?.content) return null;
    const parsed = JSON.parse(ev.content) as Progress;
    return {
      completedLevels: parsed.completedLevels ?? [],
      quizScores: parsed.quizScores ?? {},
    };
  } catch {
    return null;
  }
}

/** Publish progress to Nostr (NIP-78). Requires signEvent and publish from NostrProvider. */
export function createProgressEventTemplate(progress: Progress): EventTemplate {
  return {
    kind: 30078,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["d", PROGRESS_D_TAG]],
    content: JSON.stringify(progress),
  };
}
