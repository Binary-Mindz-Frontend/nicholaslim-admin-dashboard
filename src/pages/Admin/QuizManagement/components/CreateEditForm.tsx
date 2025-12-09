import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import type { Question } from "@/types/questionsTypes";
import toast from "react-hot-toast";

interface Props {
  question?: Question | null;
  quizId?: number;
  onSave: (data: any) => void;
  onBack: () => void;
}

export default function QuestionForm({
  question,
  quizId: propQuizId,
  onSave,
  onBack,
}: Props) {
  const [quizId] = useState<number>(propQuizId || question?.quizId || 1);
  const [quesType, setQuesType] = useState<"MULTIPLE" | "BOOLEAN">(
    question?.quesType === "MULTIPLE" || question?.quesType === "BOOLEAN"
      ? question.quesType
      : "MULTIPLE"
  );
  const [quesCategory, setQuesCategory] = useState<
    "SAFETY_PROCUDURE" | "EQUIPMENT" | "PROTOCOL" | "GENERAL_KNOWLEDGE"
  >(question?.quesCategory || "SAFETY_PROCUDURE");
  const [quesDifficulty, setQuesDifficulty] = useState<
    "EASY" | "MEDIUM" | "HARD"
  >(question?.quesDeficulty || "EASY");
  const [question_text, setQuestionText] = useState(
    question?.question_text || ""
  );
  const [options, setOptions] = useState<any[]>(
    question?.options || [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ]
  );

  useEffect(() => {
    if (question) {
      setQuesType(question.quesType as "MULTIPLE" | "BOOLEAN");
      setQuesCategory(question.quesCategory);
      setQuesDifficulty(question.quesDeficulty);
      setQuestionText(question.question_text);

      if (question.quesType === "BOOLEAN") {
        setOptions([
          { option_text: "True", is_correct: false },
          { option_text: "False", is_correct: false },
        ]);
      } else {
        setOptions(
          question.options || [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
          ]
        );
      }
    }
  }, [question]);

  const handleSave = () => {
    if (!question_text.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (quesType === "MULTIPLE") {
      const hasEmptyOption = options.some((opt) => !opt.option_text.trim());
      const hasCorrectOption = options.some((opt) => opt.is_correct);

      if (hasEmptyOption) {
        toast.error("Please enter all options");
        return;
      }

      if (!hasCorrectOption) {
        toast.error("Please select the correct answer");
        return;
      }
    }

    if (quesType === "BOOLEAN") {
      const hasCorrectOption = options.some((opt) => opt.is_correct);
      if (!hasCorrectOption) {
        toast.error("Please select the correct answer");
        return;
      }
    }

    const data = {
      quizId,
      quesType,
      quesCategory,
      quesDeficulty: quesDifficulty,
      question_text,
      options,
    };

    onSave(data);
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    if (field === "is_correct" && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }

    setOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-gray-700 hover:text-gray-900 mb-8 text-lg font-medium cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Quiz Management
        </button>
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          {question ? "Edit Question" : "Create Question"}
        </h2>
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <div className="space-y-10">
            <div>
              <p className="text-xl font-semibold text-gray-800 mb-6">
                Questions Management
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-6">
                Select Question Type
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setQuesType("MULTIPLE");
                    setOptions([
                      { option_text: "", is_correct: false },
                      { option_text: "", is_correct: false },
                      { option_text: "", is_correct: false },
                      { option_text: "", is_correct: false },
                    ]);
                  }}
                  className={`px-6 py-3 rounded-full text-base font-medium transition-all border cursor-pointer ${
                    quesType === "MULTIPLE"
                      ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Multiple Choice
                </button>
                <button
                  onClick={() => {
                    setQuesType("BOOLEAN");
                    setOptions([
                      { option_text: "True", is_correct: false },
                      { option_text: "False", is_correct: false },
                    ]);
                  }}
                  className={`px-6 py-3 rounded-full text-base font-medium transition-all border cursor-pointer ${
                    quesType === "BOOLEAN"
                      ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  True/False
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  Category
                </label>
                <select
                  value={quesCategory}
                  onChange={(e) =>
                    setQuesCategory(e.target.value as typeof quesCategory)
                  }
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="SAFETY_PROCUDURE">Safety Procedure</option>
                  <option value="GENERAL">General</option>
                  <option value="IQ">IQ</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  Difficulty
                </label>
                <select
                  value={quesDifficulty}
                  onChange={(e) =>
                    setQuesDifficulty(
                      e.target.value as "EASY" | "MEDIUM" | "HARD"
                    )
                  }
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Write a Question
              </label>
              <textarea
                value={question_text}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base resize-none focus:ring-yellow-500 focus:border-yellow-500"
                rows={4}
                placeholder="What is the first action to take before starting your vehicle?"
              />
            </div>
            <div>
              <p className="text-xl font-medium text-gray-800 mb-6">Options</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {options.map((option, index) => (
                  <div key={index} className="space-y-3">
                    <label className="block text-lg font-medium text-gray-800">
                      {quesType === "BOOLEAN"
                        ? option.option_text === "True"
                          ? "True"
                          : "False"
                        : `Option ${index + 1}`}
                    </label>
                    <div className="flex items-center gap-3">
                      {quesType === "MULTIPLE" && (
                        <input
                          type="text"
                          value={option.option_text}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "option_text",
                              e.target.value
                            )
                          }
                          className="flex-1 px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder={`Option ${index + 1}`}
                        />
                      )}
                      {quesType === "BOOLEAN" && (
                        <div className="flex-1 px-5 py-3 border border-gray-300 rounded-xl text-base bg-gray-50">
                          {option.option_text}
                        </div>
                      )}
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={option.is_correct}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "is_correct",
                              e.target.checked
                            )
                          }
                          className="w-5 h-5 text-green-600 rounded-full focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Correct Answer
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {quesType === "MULTIPLE" && (
                <p className="text-sm text-gray-500 mt-2">
                  Note: Fill all 4 options for multiple choice questions
                </p>
              )}
              {quesType === "BOOLEAN" && (
                <p className="text-sm text-gray-500 mt-2">
                  Note: Select whether the statement is True or False
                </p>
              )}
            </div>
            <div className="flex justify-center pt-8">
              <button
                onClick={handleSave}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-16 rounded-xl text-xl shadow-lg transition-colors cursor-pointer"
              >
                {question ? "Update Question" : "Create Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}