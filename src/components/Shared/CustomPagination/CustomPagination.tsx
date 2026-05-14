import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const CustomPagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onItemsPerPageChange(Number(e.target.value));
    onPageChange(1); // Reset to first page
  };

  return (
    <div className="flex items-center justify-between p-4 border border-t-[#FF7A0040] border-[#FF7A0090] bg-gray-50">
      {/* Left: Rows per page + count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Rows per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="text-sm border border-[#FFD52B] bg-[#FFF5CC] rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFD52B]"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600">
          Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of{" "}
          {totalItems}
        </p>
      </div>

      {/* Right: Prev / Next */}
      <div className="flex rounded-md shadow-sm overflow-hidden border border-[#FFD52B] bg-[#FFF5CC]">
        <div
          onClick={handlePrevious}
          className="flex items-center justify-center px-3 py-2 border-r border-[#FFD52B] rounded-l-md cursor-pointer"
        >
          <button
            disabled={currentPage === 1}
            className="flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        <span className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700">
          {currentPage} / {totalPages || 1}
        </span>

        <div
          onClick={handleNext}
          className="flex items-center justify-center px-3 py-2 border-l border-[#FFD52B] rounded-r-md cursor-pointer"
        >
          <button
            disabled={currentPage >= totalPages}
            className="flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
