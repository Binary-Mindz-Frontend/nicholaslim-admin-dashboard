import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface UsersTablePaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

const UsersTablePagination: React.FC<UsersTablePaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(e.target.value))
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-t-[#FF7A0040] border-[#FF7A0090] bg-gray-50 gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-[#FFD52B] bg-[#FFF5CC] rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
          >
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={50}>50 items</option>
            <option value={100}>100 items</option>
          </select>
        </div>
        <p className="text-sm text-gray-600">
          Showing {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of {totalItems}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-[#FFF5CC] px-3 py-1 border border-[#FFD52B] rounded-md">
           <span className="text-sm text-gray-700 font-semibold">Page {currentPage}</span>
           <span className="text-sm text-gray-500">/ {totalPages || 1}</span>
        </div>

        <div className="flex rounded-md shadow-sm overflow-hidden border border-[#FFD52B] bg-[#FFF5CC]">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 py-2 cursor-pointer bg-[#FFF5CC] border-r border-[#FFD52B] disabled:opacity-50 hover:bg-[#FFEDAD] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="flex items-center justify-center px-3 py-2 cursor-pointer bg-[#FFF5CC] disabled:opacity-50 hover:bg-[#FFEDAD] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default UsersTablePagination
