/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LuScanEye } from "react-icons/lu";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
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

const DriverWalletTable: React.FC = () => {
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

  // Create query params object conditionally
  const queryParams = {
    role: "RAIDER",
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

    // Special handling for balance sorting (API supports it)
    if (key === "currentWalletBalance") {
      setCurrentPage(1); // Reset to first page when sorting changes
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

    // If sorting by balance, data is already sorted by API
    if (
      sortConfig.key === "currentWalletBalance" ||
      sortConfig.key === "totalWalletBalance"
    ) {
      return data.data;
    }

    if (!sortConfig.key) return data.data;

    return [...data.data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

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
      render: (value: number) => `$${value.toFixed(2)}`,
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
      render: (value: number) => `$${value.toFixed(2)}`,
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
          row.totalWalletBalance - row.currentWalletBalance;
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
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/wallet-driver/${row.id}`)}
            variant="ghost"
            size="sm"
            className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
          >
            <LuScanEye size={16} className="text-[#00BFFF]" />
          </Button>
        </div>
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
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

export default DriverWalletTable;
