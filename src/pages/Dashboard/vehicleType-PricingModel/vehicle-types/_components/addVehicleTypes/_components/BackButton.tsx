import type React from "react"
import { GoArrowLeft } from "react-icons/go";

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, label = "Back to Vehicle Types" }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center cursor-pointer gap-2 text-foreground hover:text-gray-700 transition-colors mb-6"
    >
      <GoArrowLeft size={22} />
      <span className="text-xl">{label}</span>
    </button>
  )
}
