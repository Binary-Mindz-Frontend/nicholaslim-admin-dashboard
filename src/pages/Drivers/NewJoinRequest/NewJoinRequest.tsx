import { useState } from "react";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useRequestColumns } from "./RequestTable/RequestTable";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";
import DriverFilter from "@/components/Drivers/DriverFilter/DriverFilter";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";

export default function NewJoinRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [raiderId, setRaiderId] = useState<number | undefined>();
  const [raiderName, setRaiderName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string | undefined>("PENDING");
  const [search, setSearch] = useState("");

  // Handler functions that also reset to page 1
  const handleRaiderIdChange = (value: number | undefined) => {
    setRaiderId(value);
    setCurrentPage(1);
  };

  const handleRaiderNameChange = (value: string) => {
    setRaiderName(value);
    setCurrentPage(1);
  };

  const handleVerificationStatusChange = (value: string | undefined) => {
    setVerificationStatus(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Filter reset function
  const handleResetFilter = () => {
    setRaiderId(undefined);
    setRaiderName("");
    setVerificationStatus("PENDING");
    setSearch("");
    setCurrentPage(1);
  };

  // Pass pagination and filter params to the hook
  const { requestColumns, requests, isLoading, isError, totalItems } = useRequestColumns({
    page: currentPage,
    limit: itemsPerPage,
    raiderId,
    raider_name: raiderName || undefined,
    raiderVerificationFromAdmin: verificationStatus,
    search: search || undefined,
  });

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">
            Driver Join Requests
          </h1>
        </div>

        {/* Filter Section */}
        <DriverFilter
          raiderId={raiderId}
          setRaiderId={handleRaiderIdChange}
          raiderName={raiderName}
          setRaiderName={handleRaiderNameChange}
          verificationStatus={verificationStatus}
          setVerificationStatus={handleVerificationStatusChange}
          search={search}
          setSearch={handleSearchChange}
          handleResetFilter={handleResetFilter}
          showApproved={false}
        />
      </div>

      {/* Loading and Error States */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500">Error loading requests</div>
        </div>
      ) : requests.length > 0 ? (
        <>
          <CustomTable columns={requestColumns} data={requests} />

          <AdminTablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg">
          <p className="text-lg text-gray-500">No requests found</p>
        </div>
      )}
      <NewDynamicChangeLogTable entityType="rider_approval" />
    </div>
  );
}
