import type { LevelContent, QuizQuestion, TrackId } from "./types";
import { loadLevels } from "./load";

const levels = loadLevels();

export type { LevelContent, QuizQuestion, TrackId };

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
