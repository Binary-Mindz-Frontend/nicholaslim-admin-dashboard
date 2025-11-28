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
