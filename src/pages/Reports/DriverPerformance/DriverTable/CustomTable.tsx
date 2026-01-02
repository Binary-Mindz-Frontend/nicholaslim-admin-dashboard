// src/components/Dashboard/DataTable/DataTable.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Column<T> =
  | {
      header: string;
      accessor: keyof T;
      cell?: (row: T) => React.ReactNode;
      sortable?: boolean;
    }
  | {
      header: string;
      accessor?: undefined;
      cell: (row: T) => React.ReactNode;
      sortable?: boolean;
    };

export interface ITableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
  onRowClick?: (row: T) => void;
  className?: string;
}

const CustomTable = <T extends object>({ 
  columns, 
  data, 
  isLoading = false,
  emptyMessage = "No data available",
  itemsPerPage = 10,
  onRowClick,
  className = ""
}: ITableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return currentData;
    
    return [...currentData].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [currentData, sortConfig]);

  if (isLoading) {
    return (
      <div className={`w-full bg-white rounded-lg border border-[#F0E5C9] ${className}`}>
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-gray-500">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`w-full bg-white rounded-lg border border-[#F0E5C9] ${className}`}>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-gray-500">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto bg-white rounded-lg border border-[#F0E5C9]">
        <table className="min-w-full divide-y divide-[#F0E5C9]">
          {/* HEADER */}
          <thead className="bg-[#FFFBEA]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-center text-sm font-bold text-[#141414] border-b border-[#F0E5C9] cursor-pointer hover:bg-[#FFF8D6] transition-colors"
                  onClick={() => column.accessor && handleSort(column.accessor)}
                >
                  <div className="flex items-center justify-center gap-2">
                    {column.header}
                    {column.accessor && sortConfig.key === column.accessor && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-[#F0E5C9]">
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 1 ? "bg-[#F7F9FA]" : "bg-white"
                } pointer-events-auto hover:bg-blue-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => {
                  const content = column.cell
                    ? column.cell(row)
                    : column.accessor
                    ? String(row[column.accessor])
                    : "";

                  return (
                    <td
                      key={colIndex}
                      className="
                        px-5 py-4 text-sm text-[#1E1E1E] text-center whitespace-nowrap
                        pointer-events-auto
                      "                                
                    >
                      <div
                        className="inline-block max-w-[150px] overflow-hidden text-ellipsis"
                        onClick={(e) => e.stopPropagation()}    
                        onMouseDown={(e) => e.stopPropagation()}
                        title={column.accessor && typeof row[column.accessor] === 'string' 
                          ? String(row[column.accessor]) 
                          : undefined}
                      >
                        {content}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border border-[#F0E5C9] rounded-lg">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {endIndex > data.length ? data.length : endIndex}
            </span>{" "}
            of <span className="font-medium">{data.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;