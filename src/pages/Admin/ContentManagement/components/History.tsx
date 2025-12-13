import React from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryItem {
  id: number;
  contenttype: string;
  description: string;
  isPublished: boolean;
  version?: string | null;
  answer?: string; // For FAQ
  content?: string; // For articles and about us
  title?: string; // For articles and about us
  question?: string; // For FAQ
  published?: boolean; // For articles
  isActive?: boolean; // For FAQ and About Us
}

interface ContentHistoryTableProps {
  data: HistoryItem[];
  onEdit: (content: HistoryItem) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isPublished: boolean) => void;
  activeTab: string;
}

// Map API content types to display names
const CONTENT_TYPE_DISPLAY: Record<string, string> = {
  TERMSANDCONDITION: "Terms & Conditions",
  PRIVACYPOLICY: "Privacy Policy",
  CANCELLATIONANDWAITINGPOLICY: "Cancellation & Waiting Policy",
  FAQ: "FAQ",
  ARTICLE: "Article",
  ABOUTUS: "About Us",
};

/**
 * Toggle Switch Component
 */
const ToggleSwitch = ({
  isActive,
  onToggle,
  disabled = false,
}: {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive ? "bg-green-500" : "bg-gray-300"
    }`}
    aria-checked={isActive}
    role="switch"
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        isActive ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

/**
 * Action Button Component
 */
const ActionButton = ({
  icon: Icon,
  onClick,
  className,
  disabled = false,
}: {
  icon: React.ElementType;
  onClick: () => void;
  className: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    <Icon className="w-5 h-5" />
  </button>
);

export default function ContentHistoryTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  activeTab,
}: ContentHistoryTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getDisplayTitle = (item: HistoryItem) => {
    return CONTENT_TYPE_DISPLAY[item.contenttype] || item.contenttype;
  };

  // const getDescriptionPreview = (item: HistoryItem) => {
  //   // For FAQ, show the question
  //   if (activeTab === "FAQ List" && item.question) {
  //     return item.question;
  //   }
  //   // For articles and about us, show the title
  //   if (item.title) {
  //     return item.title;
  //   }
  //   // For regular content, show the description
  //   return item.description || "No description";
  // };

  const getContentPreview = (item: HistoryItem) => {
    // For FAQ, show answer
    if (activeTab === "FAQ List" && item.answer) {
      return item.answer;
    }
    // For articles and about us, show content
    if (item.content) {
      return item.content;
    }
    // For regular content, show description
    return item.description || "No content";
  };

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">History</h1>
        <div className="bg-white rounded-xl p-12 border border-gray-100">
          <p className="text-gray-500 text-lg">
            No {activeTab.toLowerCase()} history available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {activeTab} History
      </h1>

      <div className="bg-white rounded-xl overflow-x-auto border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider rounded-tl-xl"
              >
                {activeTab === "FAQ List"
                  ? "Question"
                  : activeTab === "Help Articles List"
                  ? "Article Title"
                  : activeTab === "About Us"
                  ? "Title"
                  : "Content Type"}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                {activeTab === "FAQ List"
                  ? "Answer Preview"
                  : activeTab === "Help Articles List"
                  ? "Content Preview"
                  : "Description Preview"}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                Version
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-bold text-gray-800 uppercase tracking-wider rounded-tr-xl"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-orange-100/70">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getDisplayTitle(item)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <div className="truncate" title={getContentPreview(item)}>
                    {getContentPreview(item).substring(0, 60)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.version || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center">
                    <ToggleSwitch
                      isActive={item.isPublished}
                      onToggle={() =>
                        onToggleStatus(item.id, !item.isPublished)
                      }
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    <ActionButton
                      icon={Pencil}
                      onClick={() => onEdit(item)}
                      className="text-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    />
                    <ActionButton
                      icon={Trash2}
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}