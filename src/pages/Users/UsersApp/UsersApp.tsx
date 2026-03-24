import { useState, useEffect } from "react";
import FilterSection from "@/components/Users/FilterSection/FilterSection";
import { useUserColumns } from "./userTable/userTable";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";

export default function UsersPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, allFilter, dateFilter]);

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset all filters and go back to page 1
  const handleResetFilter = () => {
    setDateFilter("");
    setAllFilter("");
    setSearch("");
    setCurrentPage(1);
  };

  // Get columns and users from the custom hook WITH pagination params
  const { userColumns, users, isLoading, isError, totalItems } = useUserColumns({
    status: allFilter === "all" ? "" : allFilter,
    dateFilter: dateFilter,
    search: debouncedSearch,
    page: currentPage,
    limit: itemsPerPage,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Check if data is still loading or if there was an error
  // if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="p-8 text-center text-red-500">Error fetching users</p>;

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-black text-2xl font-bold">Mobile User Management</h1>
          <Link to="/add-new-user"
            className="flex items-center gap-2 px-3 sm:px-6 py-3 bg-yellow-400 cursor-pointer sm:font-bold hover:bg-yellow-500 text-black rounded transition-colors"
          >
            <Plus size={18} />
            Add User
          </Link>
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

        {/* Filter Section */}
        <FilterSection
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          allFilter={allFilter}
          setAllFilter={setAllFilter}
          search={search}
          setSearch={setSearch}
          handleResetFilter={handleResetFilter}
        />
      </div>

      {/* Custom Table Section - Now uses server-paginated data */}
      {isLoading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-100 mb-6">
          <p className="text-lg">Loading users...</p>
        </div>
      ) : (
        <CustomTable columns={userColumns} data={users} />
      )}

      {/* Pagination Component */}
      <AdminTablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <div>
        <NewDynamicChangeLogTable entityType="User" />
      </div>
    </div>
  );
}