import React from "react";

interface CustomButtonProps {
  bgColor?: string;       // Background color
  borderColor?: string;   // Border color
  indicatorColor?: string; // The small circle color
  text: string;           // Button text
  click?: () => void;   // Optional click handler
  className?: string;     // Extra classes if needed
}

const CustomButton: React.FC<CustomButtonProps> = ({
  bgColor = "#FFE16B60",
  borderColor = "#FFE16B",
  indicatorColor = "#27C840",
  text,
  click,
  className = "",
}) => {
  return (
    <button
      onClick={click}
      className={`flex items-center justify-center gap-2 p-2 rounded-md border  cursor-pointer
        ${className}`}
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <span
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: indicatorColor }}
      ></span>
      <span>{text}</span>
    </button>
  );
};

export default CustomButton;
