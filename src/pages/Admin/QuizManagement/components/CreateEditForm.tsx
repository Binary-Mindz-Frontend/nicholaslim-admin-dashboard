/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
      : "MULTIPLE",
  );
  const [quesCategory, setQuesCategory] = useState(
    question?.quesCategory || "SAFETY_PROCUDURE",
  );
  const [quesDifficulty, setQuesDifficulty] = useState(
    question?.quesDeficulty || "EASY",
  );
  const [question_text, setQuestionText] = useState(
    question?.question_text || "",
  );

  const [options, setOptions] = useState<any[]>(
    question?.options || [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  );

  useEffect(() => {
    if (question) {
      setQuesType(question.quesType as "MULTIPLE" | "BOOLEAN");
      setQuesCategory(question.quesCategory);
      setQuesDifficulty(question.quesDeficulty);
      setQuestionText(question.question_text);
      setOptions(question.options || []);
    }
  }, [question]);

  const addOption = () => {
    setOptions([...options, { option_text: "", is_correct: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("At least two options are required");
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];

    // For BOOLEAN (True/False), usually only one can be correct.
    // If you want to allow multiple correct for Boolean too, keep it as is.
    // If you want only one correct for Boolean, add logic here.
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!question_text.trim()) {
      toast.error("Please enter a question");
      return;
    }

    const hasEmptyOption = options.some((opt) => !opt.option_text.trim());
    const hasCorrectOption = options.some((opt) => opt.is_correct);

    if (hasEmptyOption) {
      toast.error("Please fill all option texts");
      return;
    }

    if (!hasCorrectOption) {
      toast.error("Please select at least one correct answer");
      return;
    }

    const data = {
      quizId,
      quesType,
      quesCategory,
      quesDeficulty: quesDifficulty,
      question_text,
      options: options.map((opt) => ({
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      })),
    };

    onSave(data);
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
            {/* Question Type Selector */}
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-6">
                Select Question Type
              </p>
              <div className="flex gap-4">
                {["MULTIPLE", "BOOLEAN"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setQuesType(type as any);
                      if (type === "BOOLEAN") {
                        // Resetting to exactly 2 options for True/False
                        setOptions([
                          { option_text: "True", is_correct: false },
                          { option_text: "False", is_correct: false },
                        ]);
                      } else if (type === "MULTIPLE" && options.length < 2) {
                        // Default options if switching back to Multiple
                        setOptions([
                          { option_text: "", is_correct: false },
                          { option_text: "", is_correct: false },
                          { option_text: "", is_correct: false },
                          { option_text: "", is_correct: false },
                        ]);
                      }
                    }}
                    className={`px-6 py-3 rounded-full text-base font-medium transition-all border cursor-pointer ${
                      quesType === type
                        ? "bg-yellow-400 border-yellow-400"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {type === "MULTIPLE" ? "Multiple Choice" : "True/False"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  Category
                </label>
                <input
                  type="text"
                  value={quesCategory}
                  onChange={(e) => setQuesCategory(e.target.value as any)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  Difficulty
                </label>
                <select
                  value={quesDifficulty}
                  onChange={(e) => setQuesDifficulty(e.target.value as any)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-yellow-500"
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
                className="w-full px-5 py-3 border border-gray-300 rounded-xl resize-none focus:ring-yellow-500"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-medium text-gray-800">Options</p>
                {quesType === "MULTIPLE" && (
                  <button
                    onClick={addOption}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg cursor-pointer transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Option
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-4 border border-gray-100 rounded-2xl bg-gray-50/50"
                  >
                    <div className="flex justify-between">
                      <label className="block text-sm font-bold text-gray-500 uppercase">
                        Option {index + 1}
                      </label>
                      {quesType === "MULTIPLE" && options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        disabled={quesType === "BOOLEAN"}
                        value={option.option_text}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            "option_text",
                            e.target.value,
                          )
                        }
                        className={`w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-yellow-500 ${
                          quesType === "BOOLEAN"
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white"
                        }`}
                        placeholder="Enter option text..."
                      />

                      <label className="flex items-center space-x-2 cursor-pointer w-fit">
                        <input
                          type="checkbox"
                          checked={option.is_correct}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "is_correct",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Correct Answer
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
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
