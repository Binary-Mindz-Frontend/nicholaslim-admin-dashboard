import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { useOrderColumns } from "./OrderHistoryTable/OrderHistoryTable";
import StatusTabFilter from "@/components/OrderPlacement/OrderPlacementFilter/OrderPlacementFilter";

export default function OrderHistory() {
  const [status, setStatus] = useState<string | undefined>();


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const handleStatusChange = (value: string | undefined) => {
    setStatus(value);
    setCurrentPage(1);
  };

  // Get the order columns and data with pagination support
  const { orderColumns, orders, isLoading, isError, totalItems, DeleteConfirmDialog } = useOrderColumns({
    status,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Handle loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg">Loading orders...</p>
    </div>
  );

  // Handle error state
  if (isError) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg text-red-600">Error loading orders. Please try again.</p>
    </div>
  );

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="py-2">
          <h1 className="text-black text-2xl font-bold">Order History</h1>
        </div>


        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Total Order</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        {/* <OrderFilter
          category={category}
          setCategory={handleCategoryChange}
          status={status}
          setStatus={handleStatusChange}
          handleResetFilter={handleResetFilter}
        /> */}

         <StatusTabFilter
        activeStatus={status || ""} 
        onStatusChange={handleStatusChange} 
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