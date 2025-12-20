import React, { useState } from "react";
import { useParams } from "react-router-dom"; // For getting the ID from the URL
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { useGetWalletHistoryQuery } from "@/redux/features/wallet/walletApi";

// import { useGetWalletHistoryQuery } from "@/redux/api/walletApi" // Assuming you have set up the API

// interface WalletHistory {
//   id: number
//   transactionId: string
//   transactionType: string
//   type: string
//   amount: string
//   status: string
//   createdAt: string
// }

const SingleWalletTable: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from URL params
  console.log(id);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Query to fetch wallet history for a specific user
  const { data, isLoading, error } = useGetWalletHistoryQuery({
    userId: id, // Pass the userId from URL
    page: currentPage,
    limit: itemsPerPage,
    // type: "PAYMENT", // You can modify the type query based on requirement (optional)
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
        const statusColors =
          status === "SUCCESS"
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800";
        return (
          <span
            className={`inline-flex items-center justify-center ${statusColors} w-[90px] h-[32px] text-xs font-semibold rounded-sm`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading wallet history</div>}


      {/* <h2 className="text-2xl font-semibold mb-4">Wallet History for User</h2> */}

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
