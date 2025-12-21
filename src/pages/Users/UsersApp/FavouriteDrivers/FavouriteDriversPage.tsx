import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"; // Added for ID and navigation
import { ArrowLeft } from "lucide-react"; // For the back button icon
import { Button } from "@/components/ui/button";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import { useDriverColumns } from "./FavouriteDriverTable";

export default function FavouriteDrivers() {
  const { id } = useParams(); // Get User ID from URL
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { 
    driverColumns, 
    drivers, 
    isLoading, 
    isError, 
    totalItems 
  } = useDriverColumns({
    raiderId: Number(id), // Convert string ID to Number
  });

  // Handle loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading driver details...</p>
      </div>
    </div>
  );

  // Handle error state
  if (isError) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg text-red-600 font-medium">Error loading drivers. Please try again.</p>
    </div>
  );

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA] min-h-screen">
      <div className="w-full mx-auto space-y-4 mb-6">
        
        {/* Header Section with Back Button */}
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
            <h1 className="text-black text-2xl font-bold">Favourite Drivers</h1>
    
          </div>
        </div>

        {/* Stats Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Drivers Found</span>
            <span className="bg-[#FFEA96] text-gray-700 px-3 py-1 rounded-full text-base font-bold border border-yellow-400">
              {totalItems}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {drivers.length > 0 ? (
          <>
            <CustomTable columns={driverColumns} data={drivers} />
            
            <div className=" border-t">
              <TablePagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => {
                  console.log("Page changed to:", page);
                  setCurrentPage(page);
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-white">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <ArrowLeft className="text-gray-300" size={32} />
            </div>
            <p className="text-lg text-gray-500 font-medium">No driver records found for this user.</p>
          </div>
        )}
      </div>
    </div>
  );
}