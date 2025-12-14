import { GoArrowLeft } from "react-icons/go";
import QuizCard from "./QuizCard";
import type { Question } from "@/types/questionsTypes";

interface Props {
  questions: Question[];
  onCreate: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: number) => void;
}

export default function QuizList({
  questions,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className=" ">
      <div className="pt-6 md:pt-16 pb-8">
        <button onClick={() => window.history.back()} className="flex items-center cursor-pointer gap-2 text-foreground hover:text-gray-700 transition-colors mb-6 bg-[#fdc700] px-4 py-2 rounded-sm">
          <GoArrowLeft size={22} />
          <span className="text-xl">Back</span>
        </button>
        <div className="flex justify-between items-center mb-16 flex-col md:flex-row gap-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Quiz Management
          </h1>
          <button
            onClick={onCreate}
            className="btn-yellow px-4 py-2 text-xl flex items-center gap-4 rounded-sm cursor-pointer"
          >
            Create Questions
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No questions found. Create your first question!
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
          >
            {questions.map((q) => (
              <QuizCard
                key={q.id}
                question={q}
                onEdit={() => onEdit(q)}
                onDelete={() => onDelete(q.id!)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
