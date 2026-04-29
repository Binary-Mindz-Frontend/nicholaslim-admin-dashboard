import React, { useState } from "react";
import { useGetNotificationLogsQuery } from "@/redux/features/notificationServices/notificationServicesApi";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useLogColumns } from "./_components/useLogColumns/useLogColumns";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";
import NotificationFilterLog from "./_components/NotificationFilterLog/NotificationFilterLog";
import TableSkeletonLoader from "@/components/Shared/TableSkeletonLoader/TableSkeletonLoader";

const NotificationLogHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [category, setCategory] = useState<string>("all");

  const { logColumns } = useLogColumns();

  // API Call
  const { data: response, isLoading } = useGetNotificationLogsQuery({
    page: currentPage,
    limit: itemsPerPage,
    category: category === "all" ? undefined : category,
  });

  const logs = response?.data?.data || [];
  const totalItems = response?.data?.total || 0;

  const handleResetFilter = () => {
    setCategory("all");
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-black text-xl sm:text-2xl font-bold">
            Audit Log History
          </h1>
          <p className="text-sm text-gray-500">
            Track all notification actions performed by admins
          </p>
        </div>
      </div>

      {/* Filter Section - Reusing the same styled filter */}
      <NotificationFilterLog
        category={category}
        setCategory={(v) => {
          setCategory(v);
          setCurrentPage(1);
        }}
        handleReset={handleResetFilter}
      />

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeletonLoader />
          </div>
        ) : (
          <>
            <CustomTable columns={logColumns} data={logs} />

            <div className="p-4 border-t border-gray-100">
              <AdminTablePagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationLogHistory;
