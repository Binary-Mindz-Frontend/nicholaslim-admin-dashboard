/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuScanEye, LuArrowUpDown, LuX } from "react-icons/lu";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import { useNavigate } from "react-router-dom";
import { useUserGetWalletQuery } from "@/redux/features/wallet/walletApi";
import { FiSearch } from "react-icons/fi";
import CustomPagination from "@/components/Shared/CustomPagination/CustomPagination";

interface Wallet {
  id: number;
  username: string;
  email: string;
  totalWalletBalance: number;
  currentWalletBalance: number;
}

const UserWalletTable: React.FC = () => {
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceSort, setBalanceSort] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading, error } = useUserGetWalletQuery({
    role: "USER",
    search: searchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage,
    balanceSort: balanceSort,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const totalItems = data?.total || 0;
  const displayData = data?.data || [];

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    resetPage();
  };

  const handleBalanceSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBalanceSort(e.target.value as "asc" | "desc");
    resetPage();
  };

  // const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setStartDate(e.target.value);
  //   resetPage();
  // };

  // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEndDate(e.target.value);
  //   resetPage();
  // };

  const handleClearFilters = () => {
    setSearchQuery("");
    setBalanceSort("asc");
    setStartDate("");
    setEndDate("");
    resetPage();
  };

  const hasActiveFilters = searchQuery || startDate || endDate;

  const columns = [
    { key: "id" as const, label: "User Id" },
    { key: "username" as const, label: "Username" },
    { key: "email" as const, label: "Email" },
    {
      key: "currentWalletBalance" as const,
      label: "Current Wallet Balance",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "totalWalletBalance" as const,
      label: "Total Wallet Balance",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "totalBalanceUsed" as const,
      label: "Total Balance Used",
      render: (_: any, row: Wallet) =>
        `$${(row.totalWalletBalance - row.currentWalletBalance).toFixed(2)}`,
    },
    {
      label: "Action",
      render: (_: any, row: Wallet) => (
        <Button
          onClick={() => navigate(`/wallet-user/${row.id}`)}
          variant="ghost"
          size="sm"
          className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
        >
          <LuScanEye />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Filter Bar ── */}
      <div className="flex justify-between flex-wrap  gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by username, email or phone..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BFFF]"
          />
        </div>

        {/* Balance Sort */}
        <div className="flex items-center gap-1.5">
          <LuArrowUpDown className="text-gray-400 shrink-0" size={15} />
          <select
            value={balanceSort}
            onChange={handleBalanceSortChange}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#00BFFF] cursor-pointer"
          >
            <option value="desc">Balance: High → Low</option>
            <option value="asc">Balance: Low → High</option>
          </select>
        </div>

        {/* Start Date */}
        {/* <div className="flex items-center gap-1.5">
          <LuCalendar className="text-gray-400 shrink-0" size={15} />
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00BFFF]"
          />
        </div> */}

        {/* End Date */}
        {/* <div className="flex items-center gap-1.5">
          <LuCalendar className="text-gray-400 shrink-0" size={15} />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00BFFF]"
          />
        </div> */}

        {/* Clear Filters — only shows when search or date is active */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 border border-red-300 rounded-md px-3 py-2 transition-colors"
          >
            <LuX size={14} />
            Clear
          </button>
        )}
      </div>

      {/* ── Status ── */}
      {isLoading && (
        <div className="text-center py-6 text-gray-500">Loading...</div>
      )}
      {error && (
        <div className="text-center py-6 text-red-500">
          Error loading wallet data
        </div>
      )}

      {/* ── Table ── */}
      <SCustomTable columns={columns} data={displayData} />

      {/* ── Pagination ── */}
      <CustomPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          resetPage();
        }}
      />
    </div>
  );
};

export default UserWalletTable;

// /* eslint-disable @typescript-eslint/no-explicit-any */

// import type React from "react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { LuScanEye } from "react-icons/lu";
// import TablePagination from "@/pages/Dashboard/_components/TablePagination";
// import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
// import { useNavigate } from "react-router-dom";
// import { useGetWalletQuery } from "@/redux/features/wallet/walletApi";
// import { FiSearch } from "react-icons/fi";
// // import { useGetWalletQuery } from "@/redux/api/walletApi" // Assuming you have set up the API

// interface Wallet {
//   id: number;
//   username: string;
//   email: string;
//   totalWalletBalance: number;
//   currentWalletBalance: number;
// }

// const UserWalletTable: React.FC = () => {
//   const navigate = useNavigate();

//   // State for pagination and search query
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const itemsPerPage = 20;

//   // Query for fetching wallet data
//   const { data, isLoading, error } = useGetWalletQuery({
//     role: "USER", // Example role
//     search: searchQuery, // Passing the search query
//     page: currentPage,
//     limit: itemsPerPage,
//   });

//   // Handling total number of items dynamically from the API response
//   const totalItems = data?.total || 0;

//   // Calculate data to display based on pagination
//   const displayData = data?.data || [];

//   // Define table columns
//   const columns = [
//     {
//       key: "id" as const,
//       label: "User Id",
//     },
//     {
//       key: "username" as const,
//       label: "Username",
//     },
//     {
//       key: "email" as const,
//       label: "Email",
//     },
//     {
//       key: "currentWalletBalance" as const,
//       label: "Current Wallet Balance",
//       render: (value: number) => `$${value}`,
//     },
//     {
//       key: "totalWalletBalance" as const,
//       label: "Total Wallet Balance",
//       render: (value: number) => `$${value}`,
//     },
//     {
//       key: "totalBalanceUsed" as const,
//       label: "Total Balance Used",
//       render: (_: any, row: Wallet) => {
//         const totalBalanceUsed =
//           row.totalWalletBalance - row.currentWalletBalance;
//         return `$${totalBalanceUsed}`;
//       },
//     },
//     {
//       label: "Action",
//       render: (_: any, row: Wallet) => (
//         <div className="flex gap-2">
//           <Button
//             onClick={() => navigate(`/wallet-user/${row.id}`)}
//             variant="ghost"
//             size="sm"
//             className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
//           >
//             <LuScanEye size={16} className="text-[#00BFFF]" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to page 1 when search query changes
//   };

//   return (
//     <div>
//       {/* Search Bar */}
//       <div className="mb-8 relative">
//         <input
//           type="text"
//           placeholder="Search by Username or Email"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           className="p-2.5 w-full max-w-md pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
//         />
//         <FiSearch
//           size={20}
//           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//         />
//       </div>

//       {isLoading && <div>Loading...</div>}
//       {error && <div>Error loading wallet data</div>}

//       <SCustomTable data={displayData} columns={columns} />

//       <TablePagination
//         currentPage={currentPage}
//         totalItems={totalItems}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//       />
//     </div>
//   );
// };

// export default UserWalletTable;
