import React, { useState } from "react";
import { useParams } from "react-router-dom"; // For getting the ID from the URL
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { useGetWalletHistoryQuery } from "@/redux/features/wallet/walletApi";
import { ArrowLeft } from "lucide-react";

// Enums for transaction type and status
enum WalletTransactionType {
  PAYOUT = "PAYOUT",
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
  DEDUCTION = "DEDUCTION",
}

enum WalletTransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

const DriverWalletHistoryTable: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from URL params
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Query to fetch wallet history for a specific user
  const { data, isLoading, error } = useGetWalletHistoryQuery({
    userId: id, // Pass the userId from URL
    page: currentPage,
    limit: itemsPerPage,
    type: WalletTransactionType.PAYMENT, // Use enum for type
  });

  const totalItems = data?.total || 0;
  const displayData = data?.data || [];

  const columns = [
    {
      key: "transactionId" as const,
      label: "Transaction ID",
    },
    {
      key: "transactionType" as const,
      label: "Transaction Type",
      render: (value: string) => {
        // Dynamically render transaction type using the enum
        return Object.values(WalletTransactionType).includes(value as WalletTransactionType)
          ? value
          : "Unknown Type";
      },
    },
    {
      key: "createdAt" as const,
      label: "Transaction Date",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: "amount" as const,
      label: "Amount",
      render: (value: string) => `$${parseFloat(value).toFixed(2)}`,
    },
    {
      key: "status" as const,
      label: "Status",
      render: (status: string) => {
        // Dynamically render status using the enum
        const statusEnum = WalletTransactionStatus[status as keyof typeof WalletTransactionStatus];

        const statusColors =
          statusEnum === WalletTransactionStatus.SUCCESS
            ? "bg-green-200 text-green-800"
            : statusEnum === WalletTransactionStatus.FAILED
            ? "bg-red-200 text-red-800"
            : "bg-yellow-200 text-yellow-800"; // For "PENDING"

        return (
          <span
            className={`inline-flex items-center justify-center ${statusColors} w-[90px] h-[32px] text-xs font-semibold rounded-sm`}
          >
            {statusEnum || "Unknown Status"}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading wallet history</div>}

      {/* Go Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-6 py-2 bg-yellow-500 cursor-pointer text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </button>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 my-6">
          Driver Wallet History
        </h1>
      </div>

      {/* Wallet History Table */}
      <SCustomTable data={displayData} columns={columns} />

      {/* Pagination Component */}
      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DriverWalletHistoryTable;
