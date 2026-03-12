import type { LevelContent, QuizQuestion } from "./types";
import { level1 } from "./1-keys";
import { level2 } from "./2-events";
import { level3 } from "./3-relays";
import { level4 } from "./4-nips";
import { level5 } from "./5-advanced";

const levels: LevelContent[] = [level1, level2, level3, level4, level5];

export type { LevelContent, QuizQuestion };
export { level1, level2, level3, level4, level5 };

/** Ordered list of level metadata for navigation and display */
export const LEVELS = levels.map((l) => ({
  id: l.id,
  name: l.name,
  description: l.description,
}));

/** Quiz questions by level id */
export const QUIZZES: Record<number, QuizQuestion[]> = Object.fromEntries(
  levels.map((l) => [l.id, l.quiz])
);
