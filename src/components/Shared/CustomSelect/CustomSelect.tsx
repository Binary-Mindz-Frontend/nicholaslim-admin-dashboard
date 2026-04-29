/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, UIEvent } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

interface SelectOption {
  id: string | number;
  name: string;
}

interface CustomSelectProps {
  value: string;
  onValueChange: (name: string, id: string | number) => void;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  onSearchChange?: (query: string) => void;
  onScrollEnd?: () => void;
  isLoading?: boolean;
}

const CustomSelect = ({
  value,
  onValueChange,
  placeholder,
  options,
  disabled = false,
  className = "",
  size = "default",
  onSearchChange,
  onScrollEnd,
  isLoading = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "h-8 px-2 text-sm",
    default: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Trigger when user is 5px from the bottom
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      if (onScrollEnd && !isLoading) {
        onScrollEnd();
      }
    }
  };

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full rounded-lg bg-white px-3 border border-gray-400 ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col min-w-[250px]">
          <div className="p-2 border-b">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div
            className="overflow-y-auto max-h-[250px]"
            onScroll={handleScroll}
          >
            {options.map((option, index) => (
              <div
                key={`${option.id}-${index}`}
                onClick={() => {
                  onValueChange(option.name, option.id);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className="px-3 py-2.5 text-sm hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
              >
                {option.name}
              </div>
            ))}

            {isLoading && (
              <div className="p-3 flex justify-center items-center gap-2 text-orange-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading more...</span>
              </div>
            )}

            {options.length === 0 && !isLoading && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
