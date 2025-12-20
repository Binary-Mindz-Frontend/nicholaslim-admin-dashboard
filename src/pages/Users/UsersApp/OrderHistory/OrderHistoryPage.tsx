import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { useOrderHistoryColumns } from "./OrderHistoryTable";

export default function OrderHistoryPage() {
  const { id } = useParams(); // This is the User ID from the URL
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Hook specifically for Order History
  const { 
    orderColumns, 
    orders, 
    isLoading, 
    isError, 
    totalItems 
  } = useOrderHistoryColumns({
    userId: Number(id),
    page: currentPage,
    limit: itemsPerPage,
  });

  // Handle loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Fetching order history...</p>
      </div>
    </div>
  );

  // Handle error state
  if (isError) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg text-red-600 font-medium">Error loading order history. Please try again.</p>
    </div>
  );

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA] min-h-screen">
      <div className="w-full mx-auto space-y-4 mb-6">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 py-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white rounded-full shadow-sm hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Button>
          <div>
            <h1 className="text-black text-2xl font-bold">Order History</h1>
            
          </div>
        </div>

        {/* Stats Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Total Orders</span>
            <span className="bg-yellow-50 text-black px-3 py-1 rounded-full text-base font-bold border border-[#969696]">
              {totalItems}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length > 0 ? (
          <>
            <CustomTable columns={orderColumns} data={orders} />
            
            <div className="border-t">
              <TablePagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-white">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <ShoppingBag className="text-gray-300" size={32} />
            </div>
            <p className="text-lg text-gray-500 font-medium">No order history found for this user.</p>
          </div>
        )}
      </div>
    </div>
  );
}