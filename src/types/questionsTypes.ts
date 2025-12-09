// types/questionsTypes.ts
export type QuestionOption = {
  option_text: string;
  is_correct: boolean;
};

export type Question = {
  id?: number;
  quizId: number;
  quesType: "MULTIPLE" | "BOOLEAN" | "SHORT_ANSWER" | "ESSAY"; // Changed TRUE_FALSE to BOOLEAN
  quesCategory: "SAFETY_PROCUDURE" | "EQUIPMENT" | "PROTOCOL" | "GENERAL_KNOWLEDGE";
  quesDeficulty: "EASY" | "MEDIUM" | "HARD";
  question_text: string;
  options: QuestionOption[];
  createdAt?: string;
  updatedAt?: string;
};

export const convertToUIQuestion = (apiQuestion: Question) => ({
  id: apiQuestion.id?.toString() || "",
  quizId: apiQuestion.quizId,
  question: apiQuestion.question_text,
  category: apiQuestion.quesCategory,
  difficulty: apiQuestion.quesDeficulty,
  type: apiQuestion.quesType,
  correctAnswer: apiQuestion.options.find(opt => opt.is_correct)?.option_text || "",
  options: apiQuestion.options,
});

export type QuizResult = {
  id?: number;
  raiderId?: number;
  quizId: number;
  total_questions: number;
  correct_answers: number;
  score: number;
  completed_at?: string;
  attempt_count?: number;
};

export type QuizResultsFilterParams = {
  minScore?: number;
  maxScore?: number;
  minCorrect?: number;
  minAttempts?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "score" | "attempt_count" | "completed_at";
  sortOrder?: "asc" | "desc";
};