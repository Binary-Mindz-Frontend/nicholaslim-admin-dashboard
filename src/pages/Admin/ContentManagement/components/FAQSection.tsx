import React, { useState } from "react";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";

// --- DATA STRUCTURES ---

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQCategory {
  value: string;
  label: string;
}

// --- SHADCN/UI PRIMITIVES (MOCK IMPLEMENTATIONS) ---

const Select = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block w-48 text-left z-10">{children}</div>
);

const SelectTrigger = ({
  children,
  placeholder,
  className,
  onClick,
  isOpen,
}: {
  children: React.ReactNode;
  placeholder: string;
  className?: string;
  onClick: () => void;
  isOpen: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 ${className} transition-colors shadow-sm`}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
  >
    {children || <span className="text-gray-500">{placeholder}</span>}
    <ChevronDown
      className={`h-4 w-4 text-gray-400 transition-transform ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
    />
  </button>
);

const SelectContent = ({
  children,
  className,
  isOpen,
}: {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}) => (
  <div
    className={`absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-xl transition-all duration-300 
      ${
        isOpen
          ? "opacity-100 max-h-60"
          : "opacity-0 max-h-0 pointer-events-none"
      }
    `}
    style={{ transformOrigin: "top" }}
  >
    <div className={`p-1 ${className}`}>{children}</div>
  </div>
);

const SelectItem = ({
  children,
  value,
  onClick,
  isSelected,
}: {
  children: React.ReactNode;
  value: string;
  onClick: (value: string) => void;
  isSelected: boolean;
}) => (
  <div
    onClick={() => onClick(value)}
    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm transition-colors
      ${
        isSelected
          ? "bg-yellow-50 font-medium text-yellow-800"
          : "hover:bg-gray-50 text-gray-800"
      }
    `}
  >
    {children}
  </div>
);

// --- MAIN COMPONENT ---

const faqCategories: FAQCategory[] = [
  { value: "payments", label: "Payments" },
  { value: "cancellation", label: "Cancellations" },
  { value: "technical", label: "Technical Issues" },
  { value: "general", label: "General" },
];

export default function FAQManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>("payments");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    { id: 1, question: "Question no.1", answer: "Answer for question no.1" },
    { id: 2, question: "Question no.2", answer: "Answer for question no.2" },
    { id: 3, question: "Question no.3", answer: "Answer for question no.3" },
  ]);

  const activeLabel =
    faqCategories.find((c) => c.value === selectedCategory)?.label ||
    "Select Category";

  const handleSelect = (value: string) => {
    setSelectedCategory(value);
    setIsSelectOpen(false);
  };

  const handleQuestionChange = (
    id: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddQuestion = () => {
    const newId =
      faqItems.length > 0 ? Math.max(...faqItems.map((i) => i.id)) + 1 : 1;
    setFaqItems((prevItems) => [
      ...prevItems,
      { id: newId, question: "", answer: "" },
    ]);
  };

  const handleDeleteQuestion = (id: number) => {
    setFaqItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Publishing FAQs for category: ${selectedCategory}`, faqItems);
    alert(
      `Published ${faqItems.length} questions for "${activeLabel}" successfully!`
    );
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base shadow-sm";
  const buttonPrimary =
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer";
  const buttonSecondary =
    "bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 flex items-center justify-center gap-2 cursor-pointer";

  return (
    <div className="bg-white rounded-xl  p-6 md:p-10">
      <div className="max-w-4xl m-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">FAQ's</h2>

          <Select>
            <SelectTrigger
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              isOpen={isSelectOpen}
              placeholder="Select Category"
              className="w-[180px]"
            >
              {activeLabel}
            </SelectTrigger>

            <SelectContent isOpen={isSelectOpen}>
              {faqCategories.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  onClick={handleSelect}
                  isSelected={category.value === selectedCategory}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={item.id}
              className="space-y-2 pb-4 border-b border-gray-100 last:border-b-0 relative"
            >
              {/* DELETE BUTTON */}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(item.id)}
                className="absolute right-0 top-0 text-red-500 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <label
                htmlFor={`q-${item.id}`}
                className="block text-lg font-semibold text-gray-800"
              >
                Question no.{index + 1}
              </label>
              <input
                id={`q-${item.id}`}
                type="text"
                value={item.question}
                onChange={(e) =>
                  handleQuestionChange(item.id, "question", e.target.value)
                }
                placeholder="Enter question"
                className={inputClasses}
                required
              />

              <label
                htmlFor={`a-${item.id}`}
                className="block text-md font-medium text-gray-700 pt-2"
              >
                Answer
              </label>
              <input
                id={`a-${item.id}`}
                value={item.answer}
                onChange={(e) =>
                  handleQuestionChange(item.id, "answer", e.target.value)
                }
                placeholder="Enter answer"
                className={`${inputClasses} resize-none`}
                required
              />
            </div>
          ))}

          <div className="flex justify-center md:justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className={buttonSecondary}
            >
              <PlusCircle className="w-5 h-5" />
              Add New Question
            </button>
            <button type="submit" className={buttonPrimary}>
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
