export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LevelContent {
  id: number;
  name: string;
  description: string;
  quiz: QuizQuestion[];
}
