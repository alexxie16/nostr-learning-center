export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export type TrackId = "basics" | "nips" | "kinds";

export interface LevelContent {
  id: number;
  name: string;
  description: string;
  track: TrackId;
  quiz: QuizQuestion[];
}
