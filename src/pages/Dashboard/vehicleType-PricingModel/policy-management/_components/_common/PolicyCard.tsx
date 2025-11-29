
import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi"

export interface PolicyData {
  id: string
  title: string
  description: string
  status: "Published" | "Draft"
  modifiedDate: string
}

interface PolicyCardProps {
  policy: PolicyData
  onEdit: (policy: PolicyData) => void
  onDelete: (id: string) => void
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with title and status badge */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{policy.title}</h3>
        <Badge
          variant="outline"
          className={ ` !rounded-sm px-4 py-1 ${
            policy.status === "Published"
              ? "bg-[#32620B70] ] "
              : "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          {policy.status}
        </Badge>
      </div>

      {/* Description */}
      <p className=" text-base mb-4">{policy.description}</p>

      {/* Modified date */}
      <p className="text-gray-500 text-base mb-6">Modified on {policy.modifiedDate}</p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => onEdit(policy)}
          className="flex-1 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 rounded cursor-pointer"
        >
          {/* <Edit className="w-4 h-4 mr-2" /> */}
          Edit Content
        </Button>
        <button
          onClick={() => onDelete(policy.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded border border-red-200 cursor-pointer"
          aria-label="Delete policy"
        >
          <FiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default PolicyCard
