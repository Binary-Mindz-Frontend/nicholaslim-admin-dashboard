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
import { useGetAdditionalServicesLogsQuery } from "@/redux/features/additionalServices/additionalServicesApi";
import CustomPagination from "@/components/Shared/CustomPagination/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface NewDynamicChangeLogTableProps {
  entityType?: string;
  title?: string;
}

const NewDynamicChangeLogTable = ({
  entityType = "",
  title = "Change Log History",
}: NewDynamicChangeLogTableProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<string>("all");

  const { data: apiResponse, isLoading } = useGetAdditionalServicesLogsQuery({
    page,
    limit,
    entity_type: entityType,
    action: action === "all" ? undefined : action,
    search: search || undefined,
  });

  const logs = apiResponse?.data?.data || [];
  const meta = apiResponse?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const columns = [
    {
      header: "Date",
      render: (row: any, index: number) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 whitespace-nowrap">
            {new Date(row.created_at || row.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
          </span>
          {index === 0 && page === 1 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200">
              LATEST
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded text-[11px] font-bold uppercase whitespace-nowrap ${
            row.action === "CREATE"
              ? "bg-green-100 text-green-700"
              : row.action === "UPDATE"
                ? "bg-blue-100 text-blue-700"
                : row.action === "DELETE"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.action}
        </span>
      ),
    },
    {
      header: "Details",
      render: (row: any) => (
        <div className="flex flex-col gap-1 min-w-[200px]">
          <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">
            {row.entity_type?.replace("-", " ")}
          </span>
          <div
            className="text-sm text-slate-700 font-medium"
            title={row.description}
          >
            {row.description || `Modified ${row.entity_type}`}
          </div>
        </div>
      ),
    },
    {
      header: "Changed By",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold border border-slate-200 uppercase">
            {row.admin?.name?.substring(0, 2) || "AD"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
              {row.admin?.name || "Admin"}
            </span>
            <span className="text-[10px] text-slate-500 uppercase leading-none">
              {row.admin?.role || "STAFF"}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full space-y-6 my-12 pt-8 border-t">
      {/* Header & Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-2xl font-bold text-[#1E1B39]">{title}</h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Action Filter */}
          <div className="w-36">
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-slate-200 focus:ring-amber-400"
            />
          </div>
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
                    className={`${rowIndex === 0 && page === 1 ? "bg-amber-50/40" : ""} hover:bg-slate-50 transition-colors`}
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

      {/* Pagination */}
      <CustomPagination
        currentPage={page}
        totalItems={meta.total}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
      />
    </section>
  );
};

export default NewDynamicChangeLogTable;