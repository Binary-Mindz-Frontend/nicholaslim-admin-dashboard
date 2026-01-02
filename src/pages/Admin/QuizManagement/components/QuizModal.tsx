import React, { useState, useEffect } from "react";
import { X, Plus, Save, Edit, BookOpen, AlertCircle, Layers, Hash, Clock } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quizData: any) => void;
  initialData?: any | null;
  isEditMode: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditMode 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_active: true,
    created_by_id: 1,
    QuizOption: {
      timeLimit: 30,
      difficulty: "easy" as "easy" | "medium" | "hard",
      shuffleQuestions: true
    }
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        is_active: true,
        created_by_id: 1,
        QuizOption: {
          timeLimit: 30,
          difficulty: "easy",
          shuffleQuestions: true
        }
      });
    }
  }, [isEditMode, initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith("QuizOption.")) {
      const optionName = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        QuizOption: {
          ...prev.QuizOption,
          [optionName]: type === 'checkbox' 
            ? (e.target as HTMLInputElement).checked 
            : optionName === 'timeLimit' 
              ? parseInt(value) 
              : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-5000">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            {isEditMode ? (
              <>
                <Edit className="w-5 h-5 mr-2" />
                Edit Quiz
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Create New Quiz
              </>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 flex items-center">
              <Layers className="w-4 h-4 mr-1" />
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter category"
            />
          </div>

          <div className="space-y-2 border-t pt-4">
            <h3 className="font-medium flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Quiz Options
            </h3>
            
            <div>
              <label className="text-sm font-medium mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Time Limit (minutes)
              </label>
              <input
                type="number"
                name="QuizOption.timeLimit"
                value={formData.QuizOption.timeLimit}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Difficulty
              </label>
              <select
                name="QuizOption.difficulty"
                value={formData.QuizOption.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="QuizOption.shuffleQuestions"
                checked={formData.QuizOption.shuffleQuestions}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded cursor-pointer"
                id="shuffle"
              />
              <label htmlFor="shuffle" className="text-sm cursor-pointer">
                Shuffle Questions
              </label>
            </div>
          </div>

          {!isEditMode && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded cursor-pointer"
                id="active"
              />
              <label htmlFor="active" className="text-sm cursor-pointer">
                Active Quiz
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 cursor-pointer flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md cursor-pointer flex items-center"
            >
              {isEditMode ? (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Update Quiz
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Create Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;