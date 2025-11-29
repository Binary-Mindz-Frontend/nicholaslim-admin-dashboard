/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import QuizList from "./QuizList";

import { dummyQuestions } from "../dummyData";
import type { Question } from "../types";
import QuestionForm from "./CreateEditForm";

export default function QuizSection() {
  const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
  const [view, setView] = useState<"list" | "form">("list");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const handleSave = (data: any) => {
    if (currentQuestion) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === currentQuestion.id ? { ...q, ...data } : q))
      );
    } else {
      const newQ = {
        id: `Q${String(questions.length + 1).padStart(3, "0")}`,
        ...data,
      };
      setQuestions([...questions, newQ]);
    }
    setView("list");
    setCurrentQuestion(null);
  };

  return view === "list" ? (
    <QuizList
      questions={questions}
      onCreate={() => {
        setCurrentQuestion(null);
        setView("form");
      }}
      onEdit={(q) => {
        setCurrentQuestion(q);
        setView("form");
      }}
      onDelete={(id) => setQuestions((prev) => prev.filter((q) => q.id !== id))}
    />
  ) : (
    <QuestionForm
      question={currentQuestion}
      onSave={handleSave}
      onBack={() => setView("list")}
    />
  );
}
