import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState, useEffect } from "react";
import { usePaymentColumns } from "./PaymentTable/PaymentTable";
import DashboardStats from "./StatCard/StatCard";
import {
  useGetTransactionByIdQuery,
  useGetTransactionGraphQuery,
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
} from "@/redux/features/transactions/transactionsApi";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react";
import TransactionDetailsModal from "./StatCard/TransactionDetailsModal/TransactionDetailsModal";
import FilterSection from "./FilterSection/FilterSection";
import RevenueChart from "./StatCard/RevenueChart";

export default function Payments() {
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Generate dynamic years (current year and previous 4 years)
  const currentYear = new Date().getFullYear();
  const [years] = useState<number[]>(
    Array.from({ length: 5 }, (_, i) => currentYear - i)
  );
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | number
  >("");

  // Use the API query with all parameters
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({
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

  // Get stats data
  const { data: transactionStatsData, isLoading: statsLoading } =
    useGetTransactionStatsQuery(undefined);

  // Get graph data with year parameter
  const { data: transactionGraphData, isLoading: graphLoading } =
    useGetTransactionGraphQuery(selectedYear);

  // Transform API data to match your table format
  const transformTransactionsToPayments = (transactions: any[]) => {
    return (
      transactions?.map((transaction) => ({
        id: transaction.id,
        orderId: transaction.id,
        transactionCode: transaction.transaction_code,
        name: transaction.user?.username || "N/A",
        paymentMethod: transaction.pay_type,
        amount: `$${parseFloat(transaction.total_fee || "0").toFixed(2)}`,
        paymentType: transaction.type,
        status: transaction.tx_status,
        paymentStatus: transaction.payment_status,
        created_at: transaction.created_at,
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
    onViewClick: handleViewClick,
  });

  const handleResetFilter = () => {
    setDateFilter("today");
    setStatusFilter("all");
    setPage(1);
    setLimit(10);
    setSelectedYear(currentYear.toString());
  };

  // Calculate total pages - adjust based on your API response structure
  const totalItems = transactionsData?.total || transactionsData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionId("");
  };

  // Refetch when filters change
  useEffect(() => {
    refetchTransactions();
  }, [page, limit, statusFilter, dateFilter, refetchTransactions]);

  return (
    <div className="px-4 md:px-8 lg:px-10 sm:p-6 bg-[#F5F7FA] min-h-screen">
      <div className="w-full mx-auto space-y-6 mb-6">
        <div className="pt-4 sm:pt-6">
          <h1 className="text-black text-2xl md:text-3xl font-bold">
            Payments & Transactions
          </h1>
        </div>

        {/* Stats Section with Loading */}
        <div className="">
          <DashboardStats 
            statsData={transactionStatsData?.data} 
            isLoading={statsLoading} 
          />
        </div>

        {/* Revenue Chart Section */}
        <div className="mt-6">
          <RevenueChart
            graphData={transactionGraphData?.data}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            isLoading={graphLoading}
            years={years}
          />
        </div>

        {/* Filter Section */}
        <div className="mt-6">
          <FilterSection
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleResetFilter={handleResetFilter}
          />
        </div>
      </div>

      {/* Error Handling */}
      {transactionsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-red-500" />
            <p className="text-red-600 font-medium">
              Error loading transactions
            </p>
          </div>
          <p className="text-red-500 text-sm mt-1">
            Unable to fetch transactions. Please check your connection and try
            again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => refetchTransactions()}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Table Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              className="border rounded-md px-3 py-1.5 text-sm cursor-pointer bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
        </div>

        {/* Table with loading state */}
        {transactionsLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-64 mx-auto"></div>
              <div className="flex justify-center mt-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-gray-600 mt-4 animate-pulse">Loading transactions...</p>
          </div>
        ) : paymentsData.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500 mb-4">
              {statusFilter !== "all" || dateFilter !== "today"
                ? "Try adjusting your filters to see more results"
                : "No transactions available for the selected period"}
            </p>
            <Button
              variant="outline"
              onClick={handleResetFilter}
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <CustomTable columns={paymentColumns} data={paymentsData} />

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-3 sm:mb-0">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalItems)} of {totalItems} entries
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          page === pageNum
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page >= totalPages}
                  className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Export Button */}
        {/* <div className="flex justify-center my-6">
          <Button className="bg-yellow-500 hover:bg-yellow-600 font-semibold text-white flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-md">
            <Download size={18} />
            Export Data (CSV)
          </Button>
        </div> */}

        {/* Transaction Details Modal */}
        <TransactionDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          transactionData={transactionByIdData?.data}
          isLoading={isTransactionLoading}
        />
      </div>
    </div>
  );
}