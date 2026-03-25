/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import { useGetAllContentLogsQuery } from "@/redux/features/contentManagement/contentManagementApi";
import CustomPagination from "../CustomPagination/CustomPagination";
import { Input } from "@/components/ui/input";
import { CONTENT_TYPE_MAP, ContentType, CorrectContentType } from "@/types/contentManagementType";

interface IColumn {
  header: string;
  accessor: string;
  align?: "left" | "right" | "center";
  render?: (row: any, index: number) => React.ReactNode;
}

interface ContentLogTableProps {
  columns: IColumn[];
  activeTab: ContentType;
  activeTabByRoute: CorrectContentType;
}

export function ContentLogTable({
  columns,
  activeTab,
  activeTabByRoute,
}: ContentLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const faqFor = activeTabByRoute === "User" ? "USER" : "RAIDER";
  const contentType = CONTENT_TYPE_MAP[activeTab];

  const { data: allContentLogs, isLoading } = useGetAllContentLogsQuery({
    search: searchTerm || undefined,
    page,
    limit,
  });

  const allLogs = allContentLogs?.data?.data || [];
  const logs = allLogs.filter((log: any) => 
    log.faqFor === faqFor && log.contentType === contentType
  );

  const meta = allContentLogs?.data?.meta || { total: 0 };

  return (
    <section className="w-full space-y-5">
      {/* Header & Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#1E1B39]">Change Log History</h2>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 border-slate-200 focus:ring-[#FFD52B] focus:border-[#FFD52B]"
          />
        </div>
      </div>

      {/* Dynamic Table Section */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <TableSkeletonLoader />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No logs found"
            description="There are no logs to display at the moment."
            icon={<Calendar />}
            className="py-16"
          />
        ) : (
          <>
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
                  {logs.map((row: any, rowIndex: number) => (
                    <TableRow
                      key={rowIndex}
                      className={`${rowIndex === 0 && page === 1 ? "bg-amber-50/40" : ""} hover:bg-slate-50 transition-colors`}
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
            
            <CustomPagination
              currentPage={page}
              totalItems={meta.total}
              itemsPerPage={limit}
              onPageChange={setPage}
              onItemsPerPageChange={setLimit}
            />
          </>
        )}
      </div>
    </section>
  );
}
