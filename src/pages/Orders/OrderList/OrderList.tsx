import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { useOrderColumns } from "./OrderTable/OrderTable";
import TrackOrderSection from "./TrackOrderSection/TrackOrderSection";
import OrderFilter from "@/components/Orders/OrderFilter/OrderFilter";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default function OrderList() {
  // Filter states
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Format dates for API
  const formatDateForAPI = (date: Date | undefined) => {
    return date ? format(date, "yyyy-MM-dd") : undefined;
  };

  // Filter reset function
  const handleResetFilter = () => {
    setCategory("");
    setStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch("");
    setCurrentPage(1);
  };

  // Handler functions that reset to page 1
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (value: Date | undefined) => {
    setStartDate(value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (value: Date | undefined) => {
    setEndDate(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
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
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-black text-2xl font-bold">Order Management</h1>
          <Link
            to="/order"
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500 text-black transition-colors cursor-pointer"
          >
            <Plus size={20} className="mr-2" />
            Create New Role
          </Link>
        </div>

        {/* Track Order Section */}
        <TrackOrderSection onTrack={handleSearchChange} />

        {/* Filter Section with Calendar */}
        <OrderFilter
          category={category}
          setCategory={handleCategoryChange}
          status={status}
          setStatus={handleStatusChange}
          startDate={startDate}
          setStartDate={handleStartDateChange}
          endDate={endDate}
          setEndDate={handleEndDateChange}
          search={search}
          setSearch={handleSearchChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={handleItemsPerPageChange}
          handleResetFilter={handleResetFilter}
          totalItems={totalItems}
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