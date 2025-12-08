import { useState } from "react";
import { useGetUserTypesQuery } from "@/redux/features/usersTypes/usersTypesApi"; // RTK Query hook
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import FilterSection from "@/components/Shared/FilterSection/FilterSection";
import { useUserColumns } from "./userTable/userTable"; // The updated hook

export default function UsersPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");

  // Fetching user data using the custom RTK query hook
  const { data: usersData, isLoading, isError } = useGetUserTypesQuery({
    active: "", // Filter active status if needed
    verified: "", // Filter verified status if needed
    deleted: "", // Add other filters if needed
    dateFilter: "", // Apply date filter if needed
  });

  // Reset all filters
  const handleResetFilter = () => {
    setDateFilter("");
    setAllFilter("");
  };

  // Get columns and users from the custom hook
  const { userColumns, users } = useUserColumns(); // Passing users data dynamically

  // Filter the users based on the selected filters
  const filteredUsers = users.filter((user) => {
    if (dateFilter === "today" && new Date(user.joiningDate).toLocaleDateString() !== new Date().toLocaleDateString()) return false;
    if (dateFilter === "yesterday" && new Date(user.joiningDate).toLocaleDateString() !== new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()) return false;
    if (dateFilter === "last7days" && (new Date() - new Date(user.joiningDate)) / (1000 * 3600 * 24) > 7) return false;
    if (dateFilter === "last30days" && (new Date() - new Date(user.joiningDate)) / (1000 * 3600 * 24) > 30) return false;
    if (dateFilter === "thismonth" && new Date(user.joiningDate).getMonth() !== new Date().getMonth()) return false;

    if (allFilter === "active" && user.activeStatus === false) return false;
    if (allFilter === "inactive" && user.activeStatus === true) return false;
    if (allFilter === "verified" && user.is_verified === false) return false;
    if (allFilter === "unverified" && user.is_verified === true) return false;

    return true;
  });

  // Check if data is still loading or if there was an error
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching users</p>;

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">User's- App</h1>
        </div>

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {filteredUsers.length}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <FilterSection
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          allFilter={allFilter}
          setAllFilter={setAllFilter}
          handleResetFilter={handleResetFilter}
        />
      </div>

      {/* Custom Table Section */}
      <CustomTable columns={userColumns} data={filteredUsers} />

      {/* Add New User Button */}
      <div className="flex justify-center my-6">
        <button
          className="px-3 sm:px-6 py-3 bg-yellow-400 cursor-pointer sm:font-bold hover:bg-yellow-500 text-black rounded transition-colors"
        >
          Add new user
        </button>
      </div>
    </div>
  );
}
