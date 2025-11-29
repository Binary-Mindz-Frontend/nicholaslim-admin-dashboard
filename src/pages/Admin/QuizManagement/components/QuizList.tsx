import QuizCard from "./QuizCard";
import type { Question } from "../types";

interface Props {
  questions: Question[];
  onCreate: () => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
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
        <div className="flex justify-between items-center mb-16 flex-col md:flex-row gap-4">
          <h1 className="text-2xl md:text-4xl  font-bold text-gray-900">
            Quiz Management
          </h1>
          <button
            onClick={onCreate}
            className="btn-yellow px-4 py-2 text-xl flex items-center gap-4 rounded-sm"
          >
            Create Questions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {questions.map((q) => (
            <QuizCard
              key={q.id}
              question={q}
              onEdit={() => onEdit(q)}
              onDelete={() => onDelete(q.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
