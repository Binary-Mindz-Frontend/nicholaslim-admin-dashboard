import React, { useState, useEffect } from "react";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleData: any;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({
  isOpen,
  onClose,
  articleData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (articleData) {
      setFormData({
        title: articleData.title || "",
        content: articleData.content || "",
      });
    }
  }, [articleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: articleData.id,
      ...formData,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Article</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticleModal;