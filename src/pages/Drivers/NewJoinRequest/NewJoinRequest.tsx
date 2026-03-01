import { useState } from "react";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useRequestColumns } from "./RequestTable/RequestTable";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";

export default function NewJoinRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">Driver Join Requests</h1>
        </div>

        {/* Category List Section */}
        {/* <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {totalItems}
            </span>
          </div>
        </div> */}

        {/* Optional: Search/Filter Section */}
        <div className="flex gap-4 items-center mb-2">
          <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto bg-white">
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.raider_name}
              onChange={(e) => {
                setFilters({ ...filters, raider_name: e.target.value });
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full px-2 py-1 border-none rounded-md focus:outline-none"
            />
          </div>
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

          <AdminTablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  );
}