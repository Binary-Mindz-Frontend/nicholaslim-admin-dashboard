import type { Question } from "./types";

export const dummyQuestions: Question[] = [
  {
    id: "Q001",
    question: "What is the first action to take before starting your vehicle?",
    category: "Safety Procedures",
    difficulty: "Easy",
    type: "Multiple Choice",
    options: [
      "Check mirrors",
      "Adjust seat and mirrors",
      "Start engine",
      "Put on seatbelt",
    ],
    correctAnswer: "Adjust seat and mirrors",
  },
  {
    id: "Q002",
    question: "Drivers must maintain a rating of at least 4.5 stars",
    category: "Platform Rules",
    difficulty: "Medium",
    type: "True/False",
    correctAnswer: "True",
  },
  {
    id: "Q003",
    question: "What is the first action to take before starting your vehicle?",
    category: "Safety Procedures",
    difficulty: "Easy",
    type: "Multiple Choice",
    correctAnswer: "Put on seatbelt",
  },
  {
    id: "Q004",
    question: "What is the first action to take before starting your vehicle?",
    category: "Safety Procedures",
    difficulty: "Easy",
    type: "Multiple Choice",
    correctAnswer: "Check mirrors",
  },
];
