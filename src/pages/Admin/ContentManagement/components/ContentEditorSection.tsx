import React, { useState } from "react";

interface ContentEditorSectionProps {
  title: string;
  initialContent: string;
  onPublish: (content: string) => void;
  isLoading?: boolean;
}

const buttonClasses =
  "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer";

const buttonClassesDisabled =
  "bg-yellow-300 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg shadow-lg cursor-not-allowed";

/**
 * Reusable component for the content editing textarea and Publish button.
 */
const ContentEditorSection: React.FC<ContentEditorSectionProps> = ({
  title,
  initialContent,
  onPublish,
  isLoading = false,
}) => {
  const [content, setContent] = useState(initialContent);

  // Update internal state when external initialContent changes
  React.useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && content.trim()) {
      onPublish(content);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-10 ">
      <div className="max-w-4xl m-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Enter your text for ${title} here...`}
            rows={15}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className={isLoading ? buttonClassesDisabled : buttonClasses}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing...
                </span>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEditorSection;