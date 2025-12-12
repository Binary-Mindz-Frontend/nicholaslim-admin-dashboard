import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Article {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

interface ArticleManagementProps {
  onDelete: (id: number, type: "article", data: any) => void;
  onEdit: (article: Article, type: "article") => void;
  onPublish: (data: { title: string; content: string }) => Promise<void>;
  data: Article[];
  isLoading?: boolean;
}

export default function ArticleManagement({
  onDelete,
  onEdit,
  onPublish,
  data: articlesData,
  isLoading = false,
}: ArticleManagementProps) {
  const [article, setArticle] = useState({
    title: "",
    content: "",
  });
  const [articles, setArticles] = useState<Article[]>(articlesData || []);

  // Update local articles when data prop changes
  useEffect(() => {
    if (articlesData) {
      setArticles(articlesData);
    }
  }, [articlesData]);

  const handleInputChange = (field: "title" | "content", value: string) => {
    setArticle((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (articleItem: Article) => {
    onEdit(articleItem, "article");
  };

  const handleDeleteClick = (articleItem: Article) => {
    onDelete(articleItem.id, "article", articleItem);
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!article.title.trim() || !article.content.trim()) {
      toast.error("Please enter both title and content before publishing.");
      return;
    }

    try {
      await onPublish(article);
      setArticle({ title: "", content: "" });
    } catch (error) {
      // Error is handled by parent component
      console.error("Failed to publish article:", error);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base shadow-sm";
  const buttonPrimary =
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-8">
      {/* Existing Articles */}
      {articles.length > 0 && (
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Articles</h3>
          <div className="space-y-4">
            {articles.map((articleItem) => (
              <div key={articleItem.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">{articleItem.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(articleItem)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(articleItem)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2">{articleItem.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Article Form */}
      <div className="bg-white rounded-xl p-6 md:p-10">
        <div className="max-w-4xl m-auto">
          <form onSubmit={handlePublishSubmit} className="space-y-8">
            {/* Article Title */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xl font-bold text-gray-900">
                  Article Title
                </label>
              </div>
              <input
                type="text"
                value={article.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter title for article"
                className={inputClasses}
                required
                disabled={isLoading}
              />
            </div>

            {/* Article Text Area */}
            <div>
              <label className="block text-xl font-bold text-gray-900 mb-2">
                Article Text
              </label>
              <textarea
                rows={15}
                value={article.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter your text..."
                className={`${inputClasses} resize-y`}
                required
                disabled={isLoading}
              />
            </div>

            {/* Publish Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className={buttonPrimary}
                disabled={isLoading || !article.title.trim() || !article.content.trim()}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
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
    </div>
  );
}