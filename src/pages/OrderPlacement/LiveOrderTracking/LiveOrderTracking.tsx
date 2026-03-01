import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";

import OrderFilter from "@/components/Orders/OrderFilter/OrderFilter";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import LiveTrackOrderSection from "./LiveTrackOrderSection/LiveTrackOrderSection";
import { useOrderColumns } from "./LiveOrderTable/LiveOrderTable";

export default function LiveOrderTracking() {
  // Direct filter states (Following DriverList structure)
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>(); // Changed to Date
  const [endDate, setEndDate] = useState<Date | undefined>(); // Changed to Date
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter reset function
  const handleResetFilter = () => {
    setCategory("");
    setStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch("");
    setCurrentPage(1); // Reset to page 1 when filters are reset
  };

  // Handler functions that also reset to page 1
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatus(value);
    setCurrentPage(1);
  };

  // Add this function here
  const handleTrackOrder = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Convert Date objects to strings for the API
  const formatDateForApi = (date: Date | undefined): string | undefined => {
    return date ? date.toISOString() : undefined;
  };

  // Get the order columns and data with pagination support
  const {
    orderColumns,
    orders,
    isLoading,
    isError,
    totalItems,
    DeleteConfirmDialog,
  } = useOrderColumns({
    category,
    status,
    startDate: formatDateForApi(startDate), // Convert Date to string for API
    endDate: formatDateForApi(endDate), // Convert Date to string for API
    search,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Handle loading state
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading orders...</p>
      </div>
    );

  // Handle error state
  if (isError)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">
          Error loading orders. Please try again.
        </p>
      </div>
    );

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="py-2">
          <h1 className="text-black text-2xl font-bold">Order Tracking</h1>
          <p className="text-[#6B6B6B]">
            Monitor and manage all active shipments in real-time
          </p>
        </div>

        {/* Track Order Section */}
        <LiveTrackOrderSection onTrack={handleTrackOrder} />

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">
              Order List
            </span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <OrderFilter
          category={category}
          setCategory={handleCategoryChange}
          status={status}
          setStatus={handleStatusChange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          search={search}
          setSearch={setSearch}
          handleResetFilter={handleResetFilter}
        />
      </div>

      {/* Custom Table Section */}
      {orders.length > 0 ? (
        <>
          <CustomTable columns={orderColumns} data={orders} />

          {/* Pagination Component */}
          <TablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-100">
          <p className="text-lg text-gray-500">No orders found</p>
        </div>
      )}
      <DeleteConfirmDialog />
    </div>
  );
}
