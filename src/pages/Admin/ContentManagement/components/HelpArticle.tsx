import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// --- DATA STRUCTURES ---

interface Article {
  title: string;
  text: string;
  category: string;
}

interface ArticleCategory {
  value: string;
  label: string;
}

// --- SHADCN/UI PRIMITIVES (MOCK IMPLEMENTATIONS) ---
// These mock components are included to make the file self-contained and runnable,
// mimicking the structure and styling of shadcn/ui.

/**
 * Mock Select component (Root)
 */
const Select = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block w-48 text-left z-10">{children}</div>
);

/**
 * Mock SelectTrigger component (Button that shows value)
 */
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

/**
 * Mock SelectContent component (The dropdown list wrapper)
 */
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

/**
 * Mock SelectItem component (Individual selectable option)
 */
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

// --- MAIN ARTICLE MANAGEMENT COMPONENT ---

const articleCategories: ArticleCategory[] = [
  { value: "payments", label: "Payments" },
  { value: "onboarding", label: "Driver Onboarding" },
  { value: "support", label: "Customer Support" },
  { value: "safety", label: "Safety Guidelines" },
];

export default function ArticleManagement() {
  // State for the selected category (dropdown)
  const [selectedCategory, setSelectedCategory] = useState<string>("payments");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // State for the article content
  const [article, setArticle] = useState<Article>({
    title: "",
    text: "",
    category: "payments",
  });

  const activeLabel =
    articleCategories.find((c) => c.value === selectedCategory)?.label ||
    "Select Category";

  const handleSelect = (value: string) => {
    setSelectedCategory(value);
    setArticle((prev) => ({ ...prev, category: value }));
    setIsSelectOpen(false);
    // In a real app, this would trigger a fetch of the selected article by category
    console.log(`Category switched to: ${value}`);
  };

  const handleInputChange = (field: "title" | "text", value: string) => {
    setArticle((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save/publish the current article
    if (!article.title || !article.text) {
      // Using alert here is a temporary measure; replace with a custom modal in production
      // The instructions forbid alert(), replacing with console error + modal logic hint
      console.error(
        "Please enter both the article title and text before publishing."
      );
      // Implement custom modal logic here instead of alert()
      return;
    }
    console.log(
      `Publishing article for category: ${article.category}`,
      article
    );
    // The instructions forbid alert(), replacing with console message + modal logic hint
    console.log(
      `Article "${article.title}" published successfully in category "${activeLabel}"!`
    );
    // Implement custom modal logic here instead of alert()
  };

  // Style classes
  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base shadow-sm";
  const buttonPrimary =
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300";

  return (
    <div className="bg-white rounded-xl  p-6 md:p-10">
      <div className="max-w-4xl m-auto">
        <form onSubmit={handlePublish} className="space-y-8">
          {/* Article Title and Dropdown in a single row */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label
                htmlFor="article-title"
                className="block text-xl font-bold text-gray-900"
              >
                Article Title
              </label>
              {/* Dropdown positioned here */}
              <Select>
                <SelectTrigger
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  isOpen={isSelectOpen}
                  placeholder="Select Category"
                  className="w-[180px] h-9"
                >
                  {activeLabel}
                </SelectTrigger>

                <SelectContent isOpen={isSelectOpen}>
                  {articleCategories.map((category) => (
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

            {/* Input field spans full remaining width */}
            <input
              id="article-title"
              type="text"
              value={article.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter title for article"
              className={inputClasses}
              required
            />
          </div>

          {/* Article Text Area */}
          <div>
            <label
              htmlFor="article-text"
              className="block text-xl font-bold text-gray-900 mb-2"
            >
              Article Text
            </label>
            <textarea
              id="article-text"
              rows={15}
              value={article.text}
              onChange={(e) => handleInputChange("text", e.target.value)}
              placeholder="Enter your text..."
              className={`${inputClasses} resize-y`}
              required
            />
          </div>

          {/* Publish Button */}
          <div className="flex justify-center pt-4">
            <button type="submit" className={buttonPrimary}>
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
