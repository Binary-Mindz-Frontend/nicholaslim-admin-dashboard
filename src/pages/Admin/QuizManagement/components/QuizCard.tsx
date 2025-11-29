import { Pencil, Trash2 } from "lucide-react";
import type { Question } from "../types";

interface Props {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
}

export default function QuizCard({ question, onEdit, onDelete }: Props) {
  const badgeColor =
    question.difficulty === "Easy"
      ? "bg-cyan-100 text-cyan-700 border-cyan-300"
      : question.difficulty === "Medium"
      ? "bg-amber-100 text-amber-700 border-amber-300"
      : "bg-pink-100 text-pink-700 border-pink-300";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{question.id}</h3>

          {/* Action and Badge Container - Like the top right of the image */}
          <div className="flex items-center gap-2">
            {/* Edit Button - Styled as just the icon, like the image */}
            <button
              onClick={onEdit}
              aria-label="Edit question"
              className="p-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>

            {/* Difficulty Badge */}
            <span
              className={`px-4 py-1 border rounded-lg text-sm font-medium ${badgeColor}`}
            >
              {question.difficulty}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-8 leading-relaxed">
          {question.question}
        </p>

        <div className="flex gap-4 mb-8">
          <span className="px-5 py-2 bg-gray-100 text-gray-700 rounded-sm text-sm font-medium">
            {question.category}
          </span>
          <span className="px-5 py-2 bg-gray-100 text-gray-700 rounded-sm text-sm font-medium">
            {question.type}
          </span>
        </div>

        {/* Separated Delete Button for clarity - your original code had edit/delete here */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
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
