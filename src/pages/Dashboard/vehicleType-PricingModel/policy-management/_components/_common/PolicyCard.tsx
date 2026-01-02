import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";

export interface PolicyData {
  id: string;
  title: string;
  description: string;
  isPublist: boolean;
  modifiedDate: string;
  created_at: string;
  updated_at: string;
}

interface PolicyCardProps {
  policy: PolicyData;
  onEdit: (policy: PolicyData) => void;
  onDelete: (id: string) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
          {policy.title}
        </h3>
        <Badge
          variant="outline"
          className={`px-4 py-1 transition-all duration-300 ${
            policy.isPublist === true
              ? "bg-[#32620B70] text-white border-[#32620B70] group-hover:scale-105"
              : "bg-gray-100 text-gray-700 border-gray-300 group-hover:bg-gray-200"
          }`}
        >
          {policy.isPublist ? "Published" : "Draft"}
        </Badge>
      </div>

      <p className="text-base mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
        {policy.description}
      </p>

      <p className="text-gray-500 text-base mb-6 group-hover:text-gray-600 transition-colors duration-300">
        Modified on {formatDate(policy.updated_at)}
      </p>

      <div className="flex gap-3">
        <Button
          onClick={() => onEdit(policy)}
          className="flex-1 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 rounded cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow"
        >
          Edit Content
        </Button>
        <button
          onClick={() => onDelete(policy.id)}
          className="p-2 text-[#FF4D4F] hover:bg-red-50 rounded border border-[#FF4D4F] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Delete policy"
        >
          <FiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;