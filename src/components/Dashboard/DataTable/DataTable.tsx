"use client";

import React from "react";

export type Column<T> =
  | {
      header: string;
      accessor: keyof T;
      cell?: (row: T) => React.ReactNode;
    }
  | {
      header: string;
      accessor?: undefined;
      cell: (row: T) => React.ReactNode;
    };

export interface ITableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const CustomTable = <T extends object>({ columns, data }: ITableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg border border-[#F0E5C9]">
      <table className="min-w-full divide-y divide-[#F0E5C9]">
        {/* HEADER */}
        <thead className="bg-[#FFFBEA]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-5 py-4 text-center text-sm font-bold text-[#141414] border-b border-[#F0E5C9]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-[#F0E5C9]">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 1 ? "bg-[#F7F9FA]" : "bg-white"
              } pointer-events-auto`}   // ✅ Allow interactivity
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
                    "                                  // ✅ Fix interaction inside cells
                  >
                    <div
                      className="inline-block"
                      onClick={(e) => e.stopPropagation()}     // ✅ Prevent row from eating clicks
                      onMouseDown={(e) => e.stopPropagation()}
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
  );
};

export default CustomTable;
