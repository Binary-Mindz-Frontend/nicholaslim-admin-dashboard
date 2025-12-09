import { Pencil, Trash2 } from "lucide-react";
import { Question, QuestionOption } from "@/types/questionsTypes";

interface Props {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}

export default function QuizCard({ question, onEdit, onDelete }: Props) {
  // Map API difficulty to UI display text
  const getDifficultyText = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    switch (difficulty) {
      case "EASY":
        return "Easy";
      case "MEDIUM":
        return "Medium";
      case "HARD":
        return "Hard";
      default:
        return difficulty;
    }
  };

  // Map API category to UI display text
  const getCategoryText = (category: string) => {
    switch (category) {
      case "SAFETY_PROCEDURE":
        return "Safety Procedure";
      case "EQUIPMENT":
        return "Equipment";
      case "PROTOCOL":
        return "Protocol";
      case "GENERAL_KNOWLEDGE":
        return "General Knowledge";
      default:
        return category;
    }
  };

  // Map API question type to UI display text
  const getTypeText = (type: string) => {
    switch (type) {
      case "MULTIPLE":
        return "Multiple Choice";
      case "BOOLEAN":
        return "True/False"; // Changed from TRUE_FALSE to BOOLEAN
      case "SHORT_ANSWER":
        return "Short Answer";
      case "ESSAY":
        return "Essay";
      default:
        return type;
    }
  };

  const badgeColor =
    question.quesDeficulty === "EASY"
      ? "bg-cyan-100 text-cyan-700 border-cyan-300"
      : question.quesDeficulty === "MEDIUM"
      ? "bg-amber-100 text-amber-700 border-amber-300"
      : "bg-pink-100 text-pink-700 border-pink-300";

  const correctAnswer =
    question.options.find((opt: QuestionOption) => opt.is_correct)
      ?.option_text || "No correct answer set";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="p-8 grid grid-rows-[auto_1fr_auto_auto_auto] gap-6 h-full">
        {/* Header - auto height */}
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-gray-900">Q{question.id}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              aria-label="Edit question"
              className="p-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <span
              className={`px-4 py-1 border rounded-lg text-sm font-medium ${badgeColor}`}
            >
              {getDifficultyText(question.quesDeficulty)}
            </span>
          </div>
        </div>

        {/* Question text - takes remaining space */}
        <div className="overflow-y-auto">
          <p className="text-gray-700 leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Options - auto height */}
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Options:</p>
          <ul className="space-y-2">
            {question.options.map((option, index) => (
              <li key={index} className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    option.is_correct ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
                <span
                  className={`${
                    option.is_correct
                      ? "text-green-700 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {option.option_text}
                </span>
                {option.is_correct && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Correct
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags - auto height */}
        <div className="flex gap-4">
          <span className="px-5 py-2 bg-gray-100 text-gray-700 rounded-sm text-sm font-medium">
            {getCategoryText(question.quesCategory)}
          </span>
          <span className="px-5 py-2 bg-gray-100 text-gray-700 rounded-sm text-sm font-medium">
            {getTypeText(question.quesType)}
          </span>
        </div>

        {/* Footer - auto height */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Correct answer: <span className="font-medium">{correctAnswer}</span>
          </span>
          <button
            onClick={onDelete}
            aria-label="Delete question"
            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
