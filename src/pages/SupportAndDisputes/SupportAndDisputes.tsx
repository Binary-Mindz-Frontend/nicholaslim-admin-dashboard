import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { useSupportDisputeColumns } from "./SupportAndDisputesTable/SupportAndDisputesTable";
import {
  useDeleteDisputeMutation,
  useGetDisputesQuery,
} from "@/redux/features/disputes/disputesApi";
import FilterSection from "./FilterSection/FilterSection";
import Pagination from "./Pagination/Pagination";
import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";

export default function SupportAndDisputes() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [disputeToDelete, setDisputeToDelete] = useState<number | null>(null);

  const {
    data: disputesData,
    isLoading,
    refetch,
  } = useGetDisputesQuery({
    page,
    limit,
    status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
  });

  const [deleteDispute, { isLoading: isDeleting }] = useDeleteDisputeMutation();

  const rows = disputesData?.data?.data || [];
  const meta = disputesData?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Handle view click
  const handleViewClick = (id: number) => {
    navigate(`/support/view/${id}`);
  };

  // Handle delete click
  const handleDeleteClick = (id: number) => {
    setDisputeToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (disputeToDelete) {
      try {
        await deleteDispute(disputeToDelete).unwrap();
        // Refetch the data after successful deletion
        refetch();
      } catch (error) {
        console.error("Failed to delete dispute:", error);
      } finally {
        setShowDeleteModal(false);
        setDisputeToDelete(null);
      }
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDisputeToDelete(null);
  };

  const { columns } = useSupportDisputeColumns({
    data: rows,
    onDelete: handleDeleteClick,
    onView: handleViewClick,
  });

  const handleResetFilter = () => {
    setPage(1);
    setStatusFilter("");
    setDateFilter("");
    setAllFilter("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">Support & Disputes</h1>
        </div>

        {/* Filters */}
        <FilterSection
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          allFilter={allFilter}
          setAllFilter={setAllFilter}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          handleResetFilter={handleResetFilter}
        />
      </div>

      {/* TABLE */}
      <div className="mb-4">
        <CustomTable columns={columns} data={rows} isLoading={isLoading} />
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        itemsPerPage={meta.limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <NewDynamicChangeLogTable entityType="Dispute" />
    </div>
  );
}
