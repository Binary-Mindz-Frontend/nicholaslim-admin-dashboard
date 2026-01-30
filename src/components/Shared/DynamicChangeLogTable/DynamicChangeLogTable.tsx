/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "lucide-react";
import TableSkeletonLoader from "../TableSkeletonLoader/TableSkeletonLoader";
import EmptyState from "../EmptyState/EmptyState";

interface IColumn {
  header: string;
  accessor: string;
  align?: "left" | "right" | "center";
  render?: (row: any, index: number) => React.ReactNode;
}

interface DynamicChangeLogTableProps {
  columns: IColumn[];
  data: any[];
  isLoading?: boolean;
}

export function DynamicChangeLogTable({
  columns,
  data = [],
  isLoading = false,
}: DynamicChangeLogTableProps) {

  return (
    <section className="w-full space-y-5">
      {/* Header & Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#1E1B39]">Change Log History</h2>
      </div>

      {/* Dynamic Table Section */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <TableSkeletonLoader />
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No logs found"
            description="There are no logs to display at the moment."
            icon={<Calendar />}
            className="py-16"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {columns.map((col, index) => (
                    <TableHead
                      key={index}
                      className={`py-4 font-bold text-slate-900 ${col.align === "right" ? "text-right" : "text-left"}`}
                    >
                      {col.header.toUpperCase()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={`${rowIndex === 0 ? "bg-amber-50/40" : ""} hover:bg-slate-50 transition-colors`}
                  >
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={`py-4 ${col.align === "right" ? "text-right" : "text-left"}`}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : row[col.accessor] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
