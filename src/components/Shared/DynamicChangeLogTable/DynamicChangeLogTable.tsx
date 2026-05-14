// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
// import TableSkeletonLoader from "../TableSkeletonLoader/TableSkeletonLoader";
// import EmptyState from "../EmptyState/EmptyState";
// import { Button } from "@/components/ui/button"; // Assuming you have a UI button component

// interface IColumn {
//   header: string;
//   accessor: string;
//   align?: "left" | "right" | "center";
//   render?: (row: any, index: number) => React.ReactNode;
// }

// interface DynamicChangeLogTableProps {
//   columns: IColumn[];
//   data: any[];
//   isLoading?: boolean;
//   // New Filter Props
//   filters: {
//     logType: string | undefined;
//     fromDate: string | undefined;
//     toDate: string | undefined;
//     page: number;
//     limit: number;
//   };
//   setFilters: (filters: any) => void;
//   meta?: {
//     total: number;
//     totalPages: number;
//   };
// }

// export function DynamicChangeLogTable({
//   columns,
//   data = [],
//   isLoading = false,
//   filters,
//   setFilters,
//   meta,
// }: DynamicChangeLogTableProps) {
//   const handleFilterChange = (key: string, value: any) => {
//     setFilters((prev: any) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
//   };

//   return (
//     <section className="w-full space-y-5">
//       {/* Header & Filter Section */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <h2 className="text-xl font-bold text-[#1E1B39]">Change Log History</h2>

//         <div className="flex flex-wrap items-center gap-3">
//           {/* Log Type Filter */}
//           <select
//             value={filters.logType}
//             onChange={(e) => handleFilterChange("logType", e.target.value)}
//             className="rounded-lg border border-slate-200 p-2 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
//           >
//             <option value="">All Log Types</option>
//             <option value="STANDARD_COMMISSION_RATE">
//               Standard Commission
//             </option>
//             <option value="RAIDER_COMPENSATION_ROLE">
//               Raider Compensation
//             </option>
//             <option value="RAIDER_DEDUCTION_FEE">Raider Deduction</option>
//             <option value="USER_FEE_STRUCTURE">User Fee Structure</option>
//             <option value="USER_DYNAMIC_SURGE">User Dynamic Surge</option>
//           </select>

//           {/* Date Range */}
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={filters.fromDate}
//               onChange={(e) => handleFilterChange("fromDate", e.target.value)}
//               className="rounded-lg border border-slate-200 p-2 text-sm outline-none bg-white"
//             />
//             <span className="text-slate-400">to</span>
//             <input
//               type="date"
//               value={filters.toDate}
//               onChange={(e) => handleFilterChange("toDate", e.target.value)}
//               className="rounded-lg border border-slate-200 p-2 text-sm outline-none bg-white"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Dynamic Table Section */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {isLoading ? (
//           <div className="p-6">
//             <TableSkeletonLoader />
//           </div>
//         ) : data.length === 0 ? (
//           <EmptyState
//             title="No logs found"
//             description="There are no logs to display at the moment."
//             icon={<Calendar />}
//             className="py-16"
//           />
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-slate-50">
//                     {columns.map((col, index) => (
//                       <TableHead
//                         key={index}
//                         className={`py-4 font-bold text-slate-900 ${col.align === "right" ? "text-right" : "text-left"}`}
//                       >
//                         {col.header.toUpperCase()}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {data.map((row, rowIndex) => (
//                     <TableRow
//                       key={rowIndex}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       {columns.map((col, colIndex) => (
//                         <TableCell
//                           key={colIndex}
//                           className={`py-4 ${col.align === "right" ? "text-right" : "text-left"}`}
//                         >
//                           {col.render
//                             ? col.render(row, rowIndex)
//                             : row[col.accessor] || "-"}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination UI */}
//             {meta && meta.totalPages > 1 && (
//               <div className="flex items-center justify-between border-t border-slate-100 p-4">
//                 <p className="text-sm text-slate-500">
//                   Showing page {filters.page} of {meta.totalPages}
//                 </p>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={filters.page === 1}
//                     onClick={() =>
//                       setFilters((p: any) => ({ ...p, page: p.page - 1 }))
//                     }
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     disabled={filters.page >= meta.totalPages}
//                     onClick={() =>
//                       setFilters((p: any) => ({ ...p, page: p.page + 1 }))
//                     }
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// }


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
  filters: {
    logType?: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit: number;
    search?: string;
  };
  setFilters: (filters: any) => void;
  meta?: {
    total: number;
    totalPages: number;
  };
}

export function DynamicChangeLogTable({
  columns,
  data = [],
  isLoading = false,
  filters,
  setFilters,
  meta,
}: DynamicChangeLogTableProps) {
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <section className="w-full space-y-6 my-12 pt-8 border-t">
      {/* Header & Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-2xl font-bold text-[#1E1B39]">Change Log History</h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Log Type Filter */}
          <select
            value={filters.logType}
            onChange={(e) => handleFilterChange("logType", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 py-2 bg-white text-sm outline-none focus:ring-2 focus:ring-amber-400/20"
          >
            <option value="">All Log Types</option>
            <option value="STANDARD_COMMISSION_RATE">Standard Commission</option>
            <option value="RAIDER_COMPENSATION_ROLE">Raider Compensation</option>
            <option value="RAIDER_DEDUCTION_FEE">Raider Deduction</option>
            <option value="USER_FEE_STRUCTURE">User Fee Structure</option>
            <option value="USER_DYNAMIC_SURGE">User Dynamic Surge</option>
          </select>

          {/* Search Bar - Matching New Design */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder="Search logs..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-9 bg-white border-slate-200 focus:ring-amber-400"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              className="rounded-lg border border-slate-200 p-2 text-sm outline-none bg-white"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
              className="rounded-lg border border-slate-200 p-2 text-sm outline-none bg-white"
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
                    className={`
                        ${rowIndex === 0 && filters.page === 1 ? "bg-amber-50/40" : ""} 
                        hover:bg-slate-50 transition-colors
                    `}
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

      {/* Custom Pagination Integration */}
      {meta && (
        <CustomPagination
          currentPage={filters.page}
          totalItems={meta.total}
          itemsPerPage={filters.limit}
          onPageChange={(page) => setFilters((p: any) => ({ ...p, page }))}
          onItemsPerPageChange={(limit) =>
            setFilters((p: any) => ({ ...p, limit, page: 1 }))
          }
        />
      )}
    </section>
  );
}