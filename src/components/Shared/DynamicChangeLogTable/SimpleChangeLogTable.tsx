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
import { Calendar, Search } from "lucide-react";
import TableSkeletonLoader from "../TableSkeletonLoader/TableSkeletonLoader";
import EmptyState from "../EmptyState/EmptyState";
import CustomPagination from "@/components/Shared/CustomPagination/CustomPagination";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

// Column definition interface
export interface TableColumn {
  header: string;
  render: (row: any, index: number) => ReactNode;
}

interface SimpleChangeLogTableProps {
  title?: string;
  logs: any[];
  columns: TableColumn[]; // Columns now coming from props
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  page: number;
  limit: number;
  search: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (search: string) => void;
}

const SimpleChangeLogTable = ({
  title = "Change Log History",
  logs,
  columns,
  meta,
  isLoading,
  page,
  limit,
  search,
  onPageChange,
  onLimitChange,
  onSearchChange,
}: SimpleChangeLogTableProps) => {
  return (
    <section className="w-full space-y-6 my-12 pt-8 border-t">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-2xl font-bold text-[#1E1B39]">{title}</h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-white border-slate-200 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <TableSkeletonLoader />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No logs found"
            description="There are no activity logs matching your filters."
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
                      className="py-4 font-bold text-slate-900"
                    >
                      {col.header.toUpperCase()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.map((row: any, rowIndex: number) => (
                  <TableRow
                    key={rowIndex}
                    className={`${rowIndex === 0 && page === 1 ? "bg-amber-50/40" : ""
                      } hover:bg-slate-50 transition-colors`}
                  >
                    {columns.map((col, colIndex) => (
                      <TableCell key={colIndex} className="py-4">
                        {col.render(row, rowIndex)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CustomPagination
        currentPage={page}
        totalItems={meta?.total}
        itemsPerPage={limit}
        onPageChange={onPageChange}
        onItemsPerPageChange={onLimitChange}
      />
    </section>
  );
};

export default SimpleChangeLogTable;