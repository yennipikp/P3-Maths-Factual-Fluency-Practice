export type TableSelection = '6' | '7' | '8' | '9' | 'mix';

export interface Question {
  id: number;
  table: number; // 6, 7, 8, or 9
  factorA: number;
  factorB: number;
  correctAnswer: number;
  userAnswer: number | null;
  timeSpentMs?: number;
  tip?: string;
}

export interface QuizResult {
  tableSelection: TableSelection;
  totalQuestions: number;
  score: number; // Points out of 60
  accuracyPercent: number;
  totalTimeSpentSeconds: number;
  averageTimePerQuestion: number;
  bestStreak: number;
  questions: Question[];
  completedAt: string;
}

export interface TableStats {
  timesPlayed: number;
  bestScore: number;
  lastScore: number;
  lastPlayedAt: string;
}
