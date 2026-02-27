import { useState } from "react";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useRequestColumns } from "./RequestTable/RequestTable";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";

export default function NewJoinRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    raiderId: undefined,
    raider_name: "",
  });

  // Pass pagination and filter params to the hook
  const { requestColumns, requests, isLoading, isError, totalItems } = useRequestColumns({
    page: currentPage,
    limit: itemsPerPage,
    raiderId: filters.raiderId,
    raider_name: filters.raider_name || undefined,
  });

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">Driver Join Requests</h1>
        </div>

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Optional: Search/Filter Section */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.raider_name}
            onChange={(e) => {
              setFilters({ ...filters, raider_name: e.target.value });
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500">Error loading requests</div>
        </div>
      ) : (
        <>
          <CustomTable columns={requestColumns} data={requests} />

          <TablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page: number) => {
              console.log("Page changed to:", page);
              setCurrentPage(page);
            }}
          />
        </>
      )}
    </div>
  );
}