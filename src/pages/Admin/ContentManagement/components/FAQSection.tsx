import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isActive: boolean;
}

interface FAQManagementProps {
  onDelete: (id: number, type: "faq", data: any) => void;
  onEdit: (faq: FAQItem, type: "faq") => void;
  onPublish: (data: { question: string; answer: string }[]) => Promise<void>;
  data: FAQItem[];
  isLoading?: boolean;
}

export default function FAQManagement({
  onDelete,
  onEdit,
  onPublish,
  data: faqData,
  isLoading = false,
}: FAQManagementProps) {
  const [faqItems, setFaqItems] = useState<FAQItem[]>(faqData || []);
  const [localFaqs, setLocalFaqs] = useState<Array<{ question: string; answer: string }>>([]);

  // Update local FAQ items when data prop changes
  useEffect(() => {
    if (faqData) {
      setFaqItems(faqData);
    }
  }, [faqData]);

  const handleQuestionChange = (index: number, field: "question" | "answer", value: string) => {
    const updatedLocalFaqs = [...localFaqs];
    updatedLocalFaqs[index] = { ...updatedLocalFaqs[index], [field]: value };
    setLocalFaqs(updatedLocalFaqs);
  };

  const handleAddQuestion = () => {
    setLocalFaqs([...localFaqs, { question: "", answer: "" }]);
  };

  const handleDeleteLocalQuestion = (index: number) => {
    const updatedLocalFaqs = localFaqs.filter((_, i) => i !== index);
    setLocalFaqs(updatedLocalFaqs);
  };

  const handleEditClick = (faq: FAQItem) => {
    onEdit(faq, "faq");
  };

  const handleDeleteClick = (faq: FAQItem) => {
    onDelete(faq.id, "faq", faq);
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty FAQs
    const validFAQs = localFaqs.filter(faq => faq.question.trim() && faq.answer.trim());
    
    if (validFAQs.length === 0) {
      toast.error("Please add at least one question and answer before publishing.");
      return;
    }

    try {
      await onPublish(validFAQs);
      setLocalFaqs([]);
    } catch (error) {
      // Error is handled by parent component
      console.error("Failed to publish FAQs:", error);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base shadow-sm";
  const buttonPrimary =
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const buttonSecondary =
    "bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 flex items-center justify-center gap-2 cursor-pointer";

  return (
    <div className="bg-white rounded-xl p-6 md:p-10">
      <div className="max-w-4xl m-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">FAQ's</h2>
        </div>

        <form onSubmit={handlePublishSubmit} className="space-y-6">
          {/* Existing FAQs from API */}
          {faqItems.map((item, index) => (
            <div
              key={item.id}
              className="space-y-2 pb-4 border-b border-gray-100 last:border-b-0 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-lg font-semibold text-gray-800">
                  Question no.{index + 1}
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(item)}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(item)}
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <input
                type="text"
                value={item.question}
                readOnly
                className={`${inputClasses} bg-gray-50`}
                placeholder="Question"
              />

              <label className="block text-md font-medium text-gray-700 pt-2">
                Answer
              </label>
              <input
                value={item.answer}
                readOnly
                className={`${inputClasses} bg-gray-50 resize-none`}
                placeholder="Answer"
              />
            </div>
          ))}

          {/* Local FAQs being added */}
          {localFaqs.map((faq, index) => (
            <div
              key={`local-${index}`}
              className="space-y-2 pb-4 border-b border-gray-100 last:border-b-0 relative"
            >
              <button
                type="button"
                onClick={() => handleDeleteLocalQuestion(index)}
                className="absolute right-0 top-0 text-red-500 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <label className="block text-lg font-semibold text-gray-800">
                New Question no.{index + 1}
              </label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                placeholder="Enter question"
                className={inputClasses}
                required
                disabled={isLoading}
              />

              <label className="block text-md font-medium text-gray-700 pt-2">
                Answer
              </label>
              <input
                value={faq.answer}
                onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                placeholder="Enter answer"
                className={`${inputClasses} resize-none`}
                required
                disabled={isLoading}
              />
            </div>
          ))}

          <div className="flex justify-center md:justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className={buttonSecondary}
              disabled={isLoading}
            >
              <PlusCircle className="w-5 h-5" />
              Add New Question
            </button>
            <button 
              type="submit" 
              className={buttonPrimary}
              disabled={isLoading || localFaqs.length === 0}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}