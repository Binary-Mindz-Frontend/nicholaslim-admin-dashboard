import React, { useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// --- DATA STRUCTURES ---

interface HistoryItem {
  id: number;
  title: string;
  publishedBy: string;
  date: string; // Stored as a formatted string for dummy data simplicity
  isActive: boolean;
}

// --- DUMMY DATA ---
// Future implementation note: This data array should be replaced by a state variable
// initialized from an API call (e.g., const [historyData, setHistoryData] = useState<HistoryItem[]>([]))
const DUMMY_HISTORY_DATA: HistoryItem[] = [
  {
    id: 1,
    title: "Company Overview",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 2,
    title: "Our Mission",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 3,
    title: "Our Vision",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 4,
    title: "Our Values",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 5,
    title: "Our Supports",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 6,
    title: "For Drivers",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 7,
    title: "Contact Information",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 8,
    title: "Our Zones",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: true,
  },
  {
    id: 9,
    title: "Service Policy",
    publishedBy: "Admin",
    date: "16 Oct 2025",
    isActive: false,
  },
];

const totalItems = 78; // Dummy total count
const itemsPerPage = 9;

// --- UTILITY COMPONENTS (Reusable Button/Toggle Styles) ---

/**
 * Custom Toggle Switch Component
 */
const ToggleSwitch = ({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
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
 * Action Button Component (Edit/Delete icons)
 */
const ActionButton = ({
  icon: Icon,
  onClick,
  className,
}: {
  icon: React.ElementType;
  onClick: () => void;
  className: string;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer ${className}`}
  >
    <Icon className="w-5 h-5" />
  </button>
);

// --- MAIN COMPONENT ---

export default function ContentHistoryTable() {
  const [data, setData] = useState<HistoryItem[]>(DUMMY_HISTORY_DATA);

  // Future implementation note: currentPage should control API offset/limit
  const [currentPage, setCurrentPage] = useState(1);

  // Handlers for future implementation
  const handleToggle = (id: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
    // Future implementation: Send API request to update active status
    console.log(`Toggling status for ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    // Future implementation: Navigate to edit page for item ID
    console.log(`Editing item ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Future implementation: Show confirmation modal, then send API request to delete
    setData((prevData) => prevData.filter((item) => item.id !== id));
    console.log(`Deleting item ID: ${id}`);
  };

  const handlePageChange = (direction: "next" | "prev") => {
    // Future implementation: Calculate new page based on total pages/items
    console.log(`Navigating to ${direction} page`);
    setCurrentPage((prev) =>
      direction === "next" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  return (
    <div className=" ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">History</h1>

      <div className="bg-white rounded-xl overflow-x-auto border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider rounded-tl-xl"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                Published By
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-bold text-gray-800 uppercase tracking-wider"
              >
                Active/Inactive
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-xs font-bold text-gray-800 uppercase tracking-wider rounded-tr-xl"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-orange-100/70">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.publishedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center">
                    <ToggleSwitch
                      isActive={item.isActive}
                      onToggle={() => handleToggle(item.id)}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    <ActionButton
                      icon={Pencil}
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    />
                    <ActionButton
                      icon={Trash2}
                      onClick={() => handleDelete(item.id)}
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
            Showing 1-{Math.min(itemsPerPage, data.length)} of {totalItems}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handlePageChange("next")}
              // Simplified disabled logic for dummy data
              disabled={data.length < itemsPerPage}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
