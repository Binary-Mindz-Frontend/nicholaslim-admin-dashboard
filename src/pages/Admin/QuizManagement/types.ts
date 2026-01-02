export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "Multiple Choice" | "True/False";

export interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: Difficulty;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}

export interface Raider {
  id: number;
  userId: number;
  is_online: boolean;
  is_available: boolean;
  raider_status: string;
  LoginType: string;
  raider_verificationFromAdmin: string;
  isSuspended: boolean;
  suspendedDuration: string | null;
  suspensionReason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  is_active: boolean;
  created_by_id: number;
  created_at: string;
  QuizOption?: {
    timeLimit: number;
    difficulty: string;
    shuffleQuestions: boolean;
  };
}

export interface QuizResult {
  id: number;
  raiderId: number;
  quizId: number;
  total_questions: number;
  correct_answers: number;
  score: number;
  attempt_count: number;
  completed_at: string;
  raider: Raider;
  quiz: Quiz;
}

export interface QuizResultsResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    limit: number;
    total: number;
    data: QuizResult[];
  };
}

export interface FilterParams {
  minScore?: number;
  maxScore?: number;
  minCorrect?: number;
  minAttempts?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}