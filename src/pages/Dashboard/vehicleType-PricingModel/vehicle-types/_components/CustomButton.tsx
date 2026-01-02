import React from "react";

interface CustomButtonProps {
  bgColor?: string;       // Background color
  borderColor?: string;   // Border color
  indicatorColor?: string; // The small circle color
  text: string;           // Button text
  click?: () => void;     // Optional click handler
  className?: string;     // Extra classes if needed
  isActive?: boolean;     // Active state
  disabled?: boolean;     // Disabled state
}

const CustomButton: React.FC<CustomButtonProps> = ({
  bgColor = "#FFE16B60",
  borderColor = "#FFE16B",
  indicatorColor = "#27C840",
  text,
  click,
  className = "",
  isActive = false,
  disabled = false,
}) => {
  return (
    <button
      onClick={click}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border
        transition-all duration-200 font-medium text-sm
        hover:shadow-md active:scale-95 cursor-pointer
        ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{ 
        backgroundColor: bgColor, 
        borderColor: borderColor 
      }}
    >
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: indicatorColor }}
      ></span>
      <span className="text-gray-800">{text}</span>
    </button>
  );
};

export default CustomButton;