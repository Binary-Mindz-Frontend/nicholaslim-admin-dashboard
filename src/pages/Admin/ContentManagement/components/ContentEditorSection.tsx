import React, { useState } from "react";

interface ContentEditorSectionProps {
  // Title to display above the editor (e.g., "Terms & Conditions")
  title: string;
  // Current content associated with the selected tab
  initialContent: string;
  // Function to call when publishing (saving)
  onPublish: (content: string) => void;
}

const buttonClasses =
  "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer";

/**
 * Reusable component for the content editing textarea and Publish button.
 */
const ContentEditorSection: React.FC<ContentEditorSectionProps> = ({
  title,
  initialContent,
  onPublish,
}) => {
  const [content, setContent] = useState(initialContent);

  // Update internal state when external initialContent changes (due to tab switch)
  React.useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish(content);
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
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base resize-y"
            required
          />
          <div className="flex justify-center">
            <button type="submit" className={buttonClasses}>
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEditorSection;
