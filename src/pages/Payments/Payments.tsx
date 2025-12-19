import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { usePaymentColumns } from "./PaymentTable/PaymentTable";
import RevenueChart from "@/components/Dashboard/RevenueChart/RevenueChart";
import DashboardStats from "./StatCard/StatCard";
import { useGetTransactionByIdQuery, useGetTransactionsQuery } from "@/redux/features/transactions/transactionsApi";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import TransactionDetailsModal from "./StatCard/TransactionDetailsModal/TransactionDetailsModal";
import FilterSection from "./FilterSection/FilterSection";

export default function Payments() {
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | number>("");

  // Use the API query with all parameters
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({
    page,
    limit,
    status: statusFilter,
    dateFilter,
  });

  // Get single transaction by ID
  const { data: transactionByIdData, isLoading: isTransactionLoading } = 
    useGetTransactionByIdQuery(selectedTransactionId, {
      skip: !selectedTransactionId, // Skip query if no ID selected
    });

  // Transform API data to match your table format
  const transformTransactionsToPayments = (transactions: any[]) => {
    return (
      transactions?.map((transaction) => ({
        orderId: transaction.id, // Use transaction id for the view button
        name: transaction.user?.username || "N/A",
        paymentMethod: transaction.pay_type,
        amount: `$${transaction.total_fee}`,
        paymentType: transaction.type,
        status: transaction.tx_status,
      })) || []
    );
  };

  const paymentsData = transformTransactionsToPayments(
    transactionsData?.data || []
  );

  // Handle view button click
  const handleViewClick = (transactionId: string | number) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);
  };

  const { paymentColumns } = usePaymentColumns({ 
    initialData: paymentsData,
    onViewClick: handleViewClick 
  });

  const handleResetFilter = () => {
    setDateFilter("today");
    setStatusFilter("all");
    setPage(1);
  };

  const totalPages = Math.ceil((transactionsData?.total || 0) / limit);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionId("");
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">
            Payments & Transactions
          </h1>
        </div>
        <DashboardStats />

        <RevenueChart />

        {/* Filter Section */}
        <FilterSection
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleResetFilter={handleResetFilter}
        />
      </div>

      {/* Table with loading state */}
      {isLoading ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p>Loading transactions...</p>
        </div>
      ) : (
        <>
          <CustomTable columns={paymentColumns} data={paymentsData} />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              <select
                className="border rounded px-2 py-1 cursor-pointer"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Export Button */}
      <div className="flex justify-center my-4">
        <Button className="bg-primary font-semibold text-black flex items-center gap-1">
          Export data <Download size={16} />
        </Button>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transactionData={transactionByIdData?.data}
        isLoading={isTransactionLoading}
      />
    </div>
  );
}