/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LuScanEye, LuArrowUpDown, LuX } from "react-icons/lu";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import { useNavigate } from "react-router-dom";
import { useGetWalletQuery } from "@/redux/features/wallet/walletApi";
import { FiSearch } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FilterX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Wallet {
  id: number;
  username: string;
  email: string;
  totalWalletBalance: number;
  currentWalletBalance: number;
  created_at?: string;
}

interface SortConfig {
  key: keyof Wallet | null;
  direction: "asc" | "desc";
}

const UserWalletTable: React.FC = () => {
  const navigate = useNavigate();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const queryParams = {
    role: "USER",
    page: currentPage,
    limit: itemsPerPage,
    balanceSort: "desc",
    ...(searchQuery && { search: searchQuery }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
  };

  // Query for fetching wallet data
  const { data, isLoading, error } = useGetWalletQuery(queryParams);

  // Handle sorting
  const handleSort = (key: keyof Wallet) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });

    if (key === "currentWalletBalance") {
    } else if (key === "totalWalletBalance") {
      setCurrentPage(1);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Sort data locally for fields that don't have API sorting
  const sortedData = useMemo(() => {
    if (!data?.data) return [];

    // If sorting by current balance, data is already sorted by API
    if (sortConfig.key === "currentWalletBalance") {
      return data.data;
    }

    if (!sortConfig.key) return data.data;

    return [...data.data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle undefined values
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data?.data, sortConfig]);

  // Define table columns with sortable headers
  const columns = [
    {
      key: "id" as const,
      label: "User ID",
      sortable: true,
      onSort: () => handleSort("id"),
      sortDirection: sortConfig.key === "id" ? sortConfig.direction : undefined,
    },
    {
      key: "username" as const,
      label: "Username",
      sortable: true,
      onSort: () => handleSort("username"),
      sortDirection:
        sortConfig.key === "username" ? sortConfig.direction : undefined,
    },
    {
      key: "email" as const,
      label: "Email",
      sortable: true,
      onSort: () => handleSort("email"),
      sortDirection:
        sortConfig.key === "email" ? sortConfig.direction : undefined,
    },
    {
      key: "currentWalletBalance" as const,
      label: "Current Wallet Balance",
      sortable: true,
      onSort: () => handleSort("currentWalletBalance"),
      sortDirection:
        sortConfig.key === "currentWalletBalance"
          ? sortConfig.direction
          : undefined,
      render: (value: number) => `$${(value || 0).toFixed(2)}`,
    },
    {
      key: "totalWalletBalance" as const,
      label: "Total Wallet Balance",
      sortable: true,
      onSort: () => handleSort("totalWalletBalance"),
      sortDirection:
        sortConfig.key === "totalWalletBalance"
          ? sortConfig.direction
          : undefined,
      render: (value: number) => `$${(value || 0).toFixed(2)}`,
    },
    {
      key: "totalBalanceUsed" as const,
      label: "Total Balance Used",
      sortable: true,
      onSort: () => handleSort("totalWalletBalance"), // Using total as proxy
      sortDirection:
        sortConfig.key === "totalWalletBalance"
          ? sortConfig.direction
          : undefined,
      render: (_: any, row: Wallet) => {
        const totalBalanceUsed =
          (row.totalWalletBalance || 0) - (row.currentWalletBalance || 0);
        return `$${totalBalanceUsed.toFixed(2)}`;
      },
    },
    {
      key: "created_at" as const,
      label: "Created Date",
      sortable: true,
      onSort: () => handleSort("created_at"),
      sortDirection:
        sortConfig.key === "created_at" ? sortConfig.direction : undefined,
      render: (value: string) =>
        value ? format(new Date(value), "dd/MM/yyyy") : "-",
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

  const totalItems = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header with Title */}
      <div className="flex justify-between items-center">
        {(searchQuery || startDate || endDate) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <FilterX size={16} />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Label htmlFor="search">Search</Label>
            <div className="relative mt-1">
              <Input
                id="search"
                type="text"
                placeholder="Username or Email"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Items Per Page Selector */}
          <div>
            <Label>Items per page</Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || startDate || endDate) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                From: {format(startDate, "dd/MM/yyyy")}
                <button
                  onClick={() => setStartDate(undefined)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                To: {format(endDate, "dd/MM/yyyy")}
                <button
                  onClick={() => setEndDate(undefined)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          Error loading wallet data. Please try again.
        </div>
      ) : (
        <>
          <SCustomTable data={sortedData} columns={columns} />

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing{" "}
                {data?.data?.length ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>

              <TablePagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
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
