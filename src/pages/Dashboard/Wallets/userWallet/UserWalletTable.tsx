/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuScanEye } from "react-icons/lu";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import { useNavigate } from "react-router-dom";
import { useGetWalletQuery } from "@/redux/features/wallet/walletApi";
import { FiSearch } from "react-icons/fi";
// import { useGetWalletQuery } from "@/redux/api/walletApi" // Assuming you have set up the API

interface Wallet {
  id: number;
  username: string;
  email: string;
  totalWalletBalance: number;
  currentWalletBalance: number;
}

const UserWalletTable: React.FC = () => {
  const navigate = useNavigate();

  // State for pagination and search query
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 20;

  // Query for fetching wallet data
  const { data, isLoading, error } = useGetWalletQuery({
    role: "USER", // Example role
    search: searchQuery, // Passing the search query
    page: currentPage,
    limit: itemsPerPage,
  });

  // Handling total number of items dynamically from the API response
  const totalItems = data?.total || 0;

  // Calculate data to display based on pagination
  const displayData = data?.data || [];

  // Define table columns
  const columns = [
    {
      key: "id" as const,
      label: "User Id",
    },
    {
      key: "username" as const,
      label: "Username",
    },
    {
      key: "email" as const,
      label: "Email",
    },
    {
      key: "currentWalletBalance" as const,
      label: "Current Wallet Balance",
      render: (value: number) => `$${value}`,
    },
    {
      key: "totalWalletBalance" as const,
      label: "Total Wallet Balance",
      render: (value: number) => `$${value}`,
    },
    {
      key: "totalBalanceUsed" as const,
      label: "Total Balance Used",
      render: (_: any, row: Wallet) => {
        const totalBalanceUsed =
          row.totalWalletBalance - row.currentWalletBalance;
        return `$${totalBalanceUsed}`;
      },
    },
    {
      label: "Action",
      render: (_: any, row: Wallet) => (
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/wallet-user/${row.id}`)}
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search query changes
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search by Username or Email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2.5 w-full max-w-md pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
        />
        <FiSearch
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        />
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading wallet data</div>}

      <SCustomTable data={displayData} columns={columns} />

      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserWalletTable;
