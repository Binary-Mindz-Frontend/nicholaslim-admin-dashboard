import React, { useState } from "react";
import { useParams } from "react-router-dom"; // For getting the ID from the URL
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { useGetWalletHistoryQuery } from "@/redux/features/wallet/walletApi";

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

const SingleWalletTable: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from URL params
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Query to fetch wallet history for a specific user
  const { data, isLoading, error } = useGetWalletHistoryQuery({
    userId: id, // Pass the userId from URL
    page: currentPage,
    limit: itemsPerPage,
    type: WalletTransactionType.PAYMENT, // Example of using enum for dynamic type
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
        // Render transaction type dynamically based on the enum
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
        // Render status dynamically based on the enum
        const statusEnum = WalletTransactionStatus[status as keyof typeof WalletTransactionStatus];

        const statusColors =
          statusEnum === WalletTransactionStatus.SUCCESS
            ? "bg-green-200 text-green-800"
            : statusEnum === WalletTransactionStatus.FAILED
            ? "bg-red-200 text-red-800"
            : "bg-yellow-200 text-yellow-800";

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

export default SingleWalletTable;
