/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Plus, Edit, Trash2, Clock, BookOpen, Layers } from "lucide-react";
import { StatusSwitch } from "@/pages/Dashboard/vehicleType-PricingModel/vehicle-types/_components/StatusSwitch";

interface QuizTableProps {
  quizzes: any[];
  onEdit: (quiz: any) => void;
  onDelete: (id: number) => void;
  onToggleActive: (quiz: any) => void;
  onAddQuestions: (id: number) => void;
}

const AllQuizShowTable: React.FC<QuizTableProps> = ({ 
  quizzes, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onAddQuestions 
}) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No quiz found.</p>
        <p className="text-gray-400 mt-2">Create your first quiz to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Title
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Category
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time Limit
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {quizzes.map((quiz: any) => (
            <tr key={quiz.id} className="hover:bg-yellow-50 transition-colors duration-150">
              <td className="px-8 py-5">
                <div>
                  <div className="font-semibold text-gray-800 text-lg">{quiz.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{quiz.description}</div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="px-3 py-1.5 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                  {quiz.category}
                </span>
              </td>
              <td className="px-8 py-5">
                <span className={`px-3 py-1.5 text-xs rounded-full font-medium ${
                  quiz.QuizOption.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800'
                    : quiz.QuizOption.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {quiz.QuizOption.difficulty}
                </span>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {quiz.QuizOption.timeLimit} min
                </div>
              </td>
              <td className="px-8 py-5">
                <StatusSwitch
                  status={quiz.is_active ? "Active" : "Inactive"}
                  onChange={(newStatus) => {
                    // Handle the status change
                    const shouldBeActive = newStatus === "Active";
                    // Only trigger toggle if status actually changed
                    if (shouldBeActive !== quiz.is_active) {
                      onToggleActive(quiz);
                    }
                  }}
                />
              </td>
              <td className="px-8 py-5">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onAddQuestions(quiz.id!)}
                    className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer flex items-center transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Questions
                  </button>
                  <button
                    onClick={() => onEdit(quiz)}
                    className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md cursor-pointer flex items-center transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(quiz.id!)}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer flex items-center transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllQuizShowTable;