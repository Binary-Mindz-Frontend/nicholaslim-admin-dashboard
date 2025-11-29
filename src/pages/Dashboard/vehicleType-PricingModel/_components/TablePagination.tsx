import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TablePaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
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

  return (
    <div className="flex items-center justify-between p-4 border border-t-[#FF7A0040] border-[#FF7A0090] bg-gray-50">
      <p className="text-sm text-gray-600">
        Showing {startIndex + 1}-{endIndex} of {totalItems}
      </p>

      <div className="flex rounded-md shadow-sm overflow-hidden border border-[#FFD52B] bg-[#FFF5CC]">
        {/* Previous Button */}
        <div  onClick={handlePrevious} className="flex items-center justify-center px-3 py-2 cursor-pointer bg-[#FFF5CC] border-r border-[#FFD52B] rounded-l-md">
          <button
           
            disabled={currentPage === 1}
            className="flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Next Button */}
        <div  onClick={handleNext} className="flex items-center justify-center px-3 py-2 cursor-pointer bg-[#FFF5CC] rounded-r-md">
          <button

            disabled={currentPage >= totalPages}
            className="flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TablePagination
