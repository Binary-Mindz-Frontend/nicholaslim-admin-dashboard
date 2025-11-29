/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Question } from "../types";

interface Props {
  question?: Question | null;
  onSave: (data: any) => void;
  onBack: () => void;
}

export default function QuestionForm({ question, onSave, onBack }: Props) {
  const [type, setType] = useState<"Multiple Choice" | "True/False">(
    question?.type || "Multiple Choice"
  );
  const [category, setCategory] = useState(
    question?.category || "Safety Procedures"
  );
  const [difficulty, setDifficulty] = useState(question?.difficulty || "Easy");
  const [text, setText] = useState(question?.question || "");
  const [options, setOptions] = useState<string[]>(
    question?.type === "Multiple Choice"
      ? question.options || ["", "", "", ""]
      : ["", "", "", ""]
  );
  const [correct, setCorrect] = useState(question?.correctAnswer || "");

  const handleSave = () => {
    // Check if the correct answer is selected for Multiple Choice, or if it's True/False
    // and if True/False, ensure 'True' or 'False' is selected.
    if (
      !text ||
      (type === "Multiple Choice" && !correct) ||
      (type === "True/False" && !correct)
    ) {
      alert("Please fill all required fields and select an answer.");
      return;
    }

    // For multiple choice, ensure all option fields are filled if the question type is selected
    if (
      type === "Multiple Choice" &&
      options.some((option) => !option.trim())
    ) {
      alert("Please fill all multiple choice options.");
      return;
    }

    onSave({
      question: text,
      category,
      difficulty,
      type,
      options: type === "Multiple Choice" ? options : undefined,
      correctAnswer: correct,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {" "}
        {/* Adjusted padding */}
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-gray-700 hover:text-gray-900 mb-8 text-lg font-medium" // Adjusted margin and hover
        >
          <ArrowLeft className="w-5 h-5" /> {/* Slightly smaller icon */}
          Back to Quiz Management
        </button>
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          {" "}
          {/* Adjusted margin */}
          Edit Questions
        </h2>
        <div className="bg-white rounded-3xl shadow-lg p-12">
          {" "}
          {/* Adjusted shadow */}
          <div className="space-y-10">
            {" "}
            {/* Adjusted general spacing between sections */}
            <div>
              <p className="text-xl font-semibold text-gray-800 mb-6">
                {" "}
                {/* Larger, bolder title */}
                Questions Management
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-6">
                {" "}
                {/* Larger, bolder title */}
                Select Question Type
              </p>
              <div className="flex gap-4 justify-center">
                {" "}
                {/* Reduced gap */}
                <button
                  onClick={() => {
                    setType("Multiple Choice");
                    setCorrect(""); // Clear correct answer when switching type
                  }}
                  className={`px-6 py-3 rounded-full text-base font-medium transition-all border ${
                    // Smaller padding, rounded, border
                    type === "Multiple Choice"
                      ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-md" // Yellow button style
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" // Neutral button style
                  }`}
                >
                  Multiple Questions
                </button>
                <button
                  onClick={() => {
                    setType("True/False");
                    setCorrect(""); // Clear correct answer when switching type
                    // Reset options if they were for multiple choice, though True/False doesn't use them
                    setOptions(["", "", "", ""]);
                  }}
                  className={`px-6 py-3 rounded-full text-base font-medium transition-all border ${
                    // Smaller padding, rounded, border
                    type === "True/False"
                      ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-md" // Yellow button style
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" // Neutral button style
                  }`}
                >
                  True/False
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {" "}
              {/* Reduced gap */}
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  {" "}
                  {/* Smaller label */}
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500" // Styled to match image inputs
                >
                  <option>Safety Procedures</option>
                  <option>Platform Rules</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  {" "}
                  {/* Smaller label */}
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500" // Styled to match image inputs
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                {" "}
                {/* Smaller label */}
                Write a Question
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base resize-none focus:ring-yellow-500 focus:border-yellow-500" // Styled to match image inputs
                rows={4} // Adjusted rows for visual fit
                placeholder="What is the first action to take before starting your vehicle?"
              />
            </div>
            {type === "Multiple Choice" && (
              <div className="grid grid-cols-2 gap-8">
                {" "}
                {/* Reduced gap */}
                {/* Options 1 & 2 */}
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">
                    Options 1
                  </label>
                  <input
                    type="text"
                    value={options[0]}
                    onChange={(e) => handleOptionChange(0, e.target.value)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500 mb-6" // Styled to match inputs, adjusted margin
                    placeholder="What is the first action to ..."
                  />
                  <label className="block text-lg font-medium text-gray-800 mb-3">
                    Options 3
                  </label>
                  <input
                    type="text"
                    value={options[2]}
                    onChange={(e) => handleOptionChange(2, e.target.value)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500" // Styled to match inputs
                    placeholder="What is the first action to ..."
                  />
                </div>
                {/* Options 3 & 4 */}
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">
                    Options 2
                  </label>
                  <input
                    type="text"
                    value={options[1]}
                    onChange={(e) => handleOptionChange(1, e.target.value)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500 mb-6" // Styled to match inputs, adjusted margin
                    placeholder="What is the first action to ..."
                  />
                  <label className="block text-lg font-medium text-gray-800 mb-3">
                    Options 4
                  </label>
                  <input
                    type="text"
                    value={options[3]}
                    onChange={(e) => handleOptionChange(3, e.target.value)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:ring-yellow-500 focus:border-yellow-500" // Styled to match inputs
                    placeholder="What is the first action to ..."
                  />
                </div>
              </div>
            )}
            <div>
              <p className="text-xl font-medium text-gray-800 mb-6">
                {" "}
                {/* Larger, bolder title */}
                Answer Options
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {" "}
                {/* Grid for answer options, adjusted gap */}
                {type === "True/False"
                  ? ["True", "False"].map((val) => (
                      <label
                        key={val}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors
                          ${
                            correct === val
                              ? "bg-green-50 border-green-500 shadow-sm"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`} // Styled answer options
                      >
                        <input
                          type="radio"
                          name="ans"
                          checked={correct === val}
                          onChange={() => setCorrect(val)}
                          className="w-5 h-5 text-green-600 focus:ring-green-500 mr-4" // Styled radio button
                        />
                        <span
                          className={`text-lg font-medium ${
                            correct === val ? "text-green-700" : "text-gray-800"
                          }`}
                        >
                          {val}
                        </span>
                      </label>
                    ))
                  : options.filter(Boolean).map(
                      (
                        opt,
                        i // Filter out empty options for display
                      ) => (
                        <label
                          key={i}
                          className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors
                          ${
                            correct === opt
                              ? "bg-green-50 border-green-500 shadow-sm"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`} // Styled answer options
                        >
                          <input
                            type="radio"
                            name="ans"
                            checked={correct === opt}
                            onChange={() => setCorrect(opt)}
                            className="w-5 h-5 text-green-600 focus:ring-green-500 mr-4" // Styled radio button
                          />
                          <span
                            className={`text-lg font-medium ${
                              correct === opt
                                ? "text-green-700"
                                : "text-gray-800"
                            }`}
                          >
                            {opt}
                          </span>
                        </label>
                      )
                    )}
              </div>
            </div>
            <div className="flex justify-center pt-8">
              {" "}
              {/* Adjusted padding */}
              <button
                onClick={handleSave}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-16 rounded-xl text-xl shadow-lg transition-colors" // Styled button
              >
                {question ? "Edit" : "Create"}{" "}
                {/* Changed text to "Edit" as in the image */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
