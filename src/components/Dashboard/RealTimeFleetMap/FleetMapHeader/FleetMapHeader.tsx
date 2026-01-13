import React from 'react';
import { Category } from '@/types/fleet';

interface FleetMapHeaderProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  lastUpdated: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  children: React.ReactNode;
}

const FleetMapHeader: React.FC<FleetMapHeaderProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
//   lastUpdated,
  onZoomIn,
  onZoomOut,
  children
}) => {
  return (
    <div className="w-full h-[600px] bg-white shadow-sm border border-border rounded-2xl flex flex-col mt-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-6 relative z-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Real-Time Fleet Map
        </h1>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all text-sm sm:text-base relative z-20 ${
                selectedCategory === category.id
                  ? "bg-yellow-200 border-yellow-400"
                  : "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
              }`}
            >
              <span
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${category.color}`}
              ></span>
              <span className="text-gray-700">
                {category.label} ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-white m-6 rounded-lg shadow-lg overflow-hidden">
        {children}

        {/* Zoom Controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50"
            onClick={onZoomIn}
          >
            +
          </button>
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50"
            onClick={onZoomOut}
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
};

export default FleetMapHeader;