import type { LevelContent, QuizQuestion, TrackId } from "./types";
import { level1 } from "./1-keys";
import { level2 } from "./2-events";
import { level3 } from "./3-relays";
import { level4 } from "./4-nips";
import { level5 } from "./5-advanced";
import { level6 } from "./6-nip-core";
import { level7 } from "./7-nip-identity";
import { level8 } from "./8-nip-browser";
import { level9 } from "./9-nip-zaps";
import { level10 } from "./10-nip-relays";
import { level11 } from "./11-nip-social";

const levels: LevelContent[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
];

export type { LevelContent, QuizQuestion, TrackId };
export {
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
};

/** Ordered list of level metadata for navigation and display */
export const LEVELS = levels.map((l) => ({
  id: l.id,
  name: l.name,
  description: l.description,
  track: l.track,
}));

/** Quiz questions by level id */
export const QUIZZES: Record<number, QuizQuestion[]> = Object.fromEntries(
  levels.map((l) => [l.id, l.quiz])
);

/** Track definitions for UI grouping */
export const TRACKS: { id: TrackId; name: string; description: string }[] = [
  { id: "basics", name: "Basics", description: "Getting started" },
  { id: "nips", name: "Advanced", description: "Delve into NIPs" },
  { id: "kinds", name: "Advanced", description: "Build Kinds" },
];

/** Levels grouped by track */
export const LEVELS_BY_TRACK = TRACKS.map((track) => ({
  ...track,
  levels: levels.filter((l) => l.track === track.id),
}));
