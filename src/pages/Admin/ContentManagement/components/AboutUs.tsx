import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AboutUsContent {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
}

interface AboutUsManagementProps {
  onDelete: (id: number, type: "aboutus", data: any) => void;
  onEdit: (content: AboutUsContent, type: "aboutus") => void;
  onPublish: (data: { title: string; content: string }) => Promise<void>;
  data: AboutUsContent[];
  isLoading?: boolean;
}

export default function AboutUsManagement({
  onDelete,
  onEdit,
  onPublish,
  data: aboutUsData,
  isLoading = false,
}: AboutUsManagementProps) {
  const MAX_CHARACTERS = 1000;
  const [aboutUs, setAboutUs] = useState({
    title: "",
    content: "",
  });
  const [aboutUsList, setAboutUsList] = useState<AboutUsContent[]>(
    aboutUsData || []
  );

  // Update local about us list when data prop changes
  useEffect(() => {
    if (aboutUsData) {
      setAboutUsList(aboutUsData);
    }
  }, [aboutUsData]);

  const handleInputChange = (field: "title" | "content", value: string) => {
    if (field === "content" && value.length > MAX_CHARACTERS) {
      value = value.substring(0, MAX_CHARACTERS);
    }
    setAboutUs((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (aboutUsItem: AboutUsContent) => {
    onEdit(aboutUsItem, "aboutus");
  };

  const handleDeleteClick = (aboutUsItem: AboutUsContent) => {
    onDelete(aboutUsItem.id, "aboutus", aboutUsItem);
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aboutUs.title.trim() || !aboutUs.content.trim()) {
      toast.error("Please enter both title and content before publishing.");
      return;
    }

    try {
      await onPublish(aboutUs);
      setAboutUs({ title: "", content: "" });
    } catch (error) {
      // Error is handled by parent component
      console.error("Failed to publish About Us content:", error);
    }
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base shadow-sm";
  const buttonPrimary =
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-8">
      {/* Existing About Us Content */}
      {aboutUsList.length > 0 && (
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Existing About Us Content
          </h3>
          <div className="space-y-4">
            {aboutUsList.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New About Us Content Form */}
      <div className="bg-white rounded-xl p-6 md:p-10">
        <div className="max-w-4xl m-auto">
          <form onSubmit={handlePublishSubmit} className="space-y-8">
            {/* Title Input Section */}
            <div>
              <label className="block text-xl font-bold text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                value={aboutUs.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter title for About Us content"
                className={inputClasses}
                required
                disabled={isLoading}
              />
            </div>

            {/* About Us Text Area Section with Character Counter */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xl font-bold text-gray-900">
                  About us Text
                </label>
                <span className="text-sm text-gray-500">
                  {aboutUs.content.length}/{MAX_CHARACTERS}
                </span>
              </div>
              <textarea
                rows={15}
                value={aboutUs.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter your text here..."
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
                disabled={isLoading || !aboutUs.title.trim() || !aboutUs.content.trim()}
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