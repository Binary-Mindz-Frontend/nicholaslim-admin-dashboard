import type React from "react"
import { useState } from "react"
import { IoMdRepeat } from "react-icons/io";

export interface FilterField {
  id: string
  label: string
  type: "dropdown" | "text" | "date"
  placeholder?: string
  options?: Array<{ label: string; value: string }>
}

export interface FilterBarProps {
  fields?: FilterField[]
  onFilterChange?: (filters: Record<string, string>) => void
  onReset?: () => void
  showResetButton?: boolean
  className?: string
}

const CustomFilterBar: React.FC<FilterBarProps> = ({
  fields = [],
  onFilterChange,
  onReset,
  showResetButton = true,
  className = "",
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleFilterChange = (fieldId: string, value: string) => {
    const updated = { ...filters, [fieldId]: value }
    setFilters(updated)
    onFilterChange?.(updated)
  }

  const handleReset = () => {
    setFilters({})
    onReset?.()
  }

  const hasActive = Object.values(filters).some((v) => v)

  return (
    <div
      className={`flex items-center   bg-[#FFFDEE] border border-[#FFCC00] rounded-lg ${className}`}
    >
      {/* Filter Icon & Label */}
      <div className="flex gap-2 items-center px-6 bg-white text-[#6D6D6D] font-semibold text-sm">
        <svg className="w-4  h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="tracking-wide">Filter By</span>
      </div>

      {/* Fields Row */}
      <div className="flex items-center ">
        {fields.map((field) => (
          <div key={field.id} className="relative">
            {field.type === "dropdown" ? (
              <div className="relative">
                <select
                  value={filters[field.id] || ""}
                  onChange={(e) => handleFilterChange(field.id, e.target.value)}
                  className="bg-white border border-[#D9D9D9]  px-3 py-[6px] pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#FFCC00]"
                >
                  <option value="">{field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
               
              </div>
            ) : field.type === "date" ? (
              <input
                type="date"
                value={filters[field.id] || ""}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
                className="bg-white border  border-[#D9D9D9] rounded-md px-3 py-[6px] text-sm text-gray-700 focus:border-[#FFCC00] focus:outline-none"
              />
            ) : (
              <input
                type="text"
                placeholder={field.placeholder || field.label}
                value={filters[field.id] || ""}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
                className="bg-white border border-[#D9D9D9] rounded-md px-3 py-[6px] text-sm text-gray-700 focus:border-[#FFCC00] focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* Reset Filter */}
      {showResetButton && hasActive && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1 mx-6 cursor-pointer text-[#E24848] text-sm font-medium hover:underline"
        >
          <IoMdRepeat size={20}/>
          Reset Filter
        </button>
      )}
    </div>
  )
}

export default CustomFilterBar
