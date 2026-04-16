/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuPencil } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import {
  useGetAllIncentivesQuery,
  useDeleteIncentiveMutation,
} from "@/redux/features/incentives/incentivesApi";
import CustomPagination from "@/components/Shared/CustomPagination/CustomPagination";
import CreateIncentiveDialog from "../CreateIncentive/CreateIncentiveDialog";

const IncentivesList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIncentive, setSelectedIncentive] = useState<any>(null);

  const { data, isLoading, refetch } = useGetAllIncentivesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteIncentive] = useDeleteIncentiveMutation();

  if (isLoading) return <p className="p-4">Loading...</p>;

  const incentives = data?.data?.data || [];
  const totalItems = data?.data?.meta?.total || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-[#CAE2B6] text-[#32620B]";
      case "DISABLED":
        return "bg-[#FF4D4F40] text-[#FF4D4F]";
      default:
        return "bg-yellow-100 text-black";
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditClick = (incentive: any) => {
    setSelectedIncentive(incentive);
    setOpenModal(true);
  };

  const handleDeleteIncentive = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FF4D4F",
    });

    if (result.isConfirmed) {
      try {
        await deleteIncentive(id).unwrap();
        Swal.fire("Deleted!", "Incentive has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete incentive.", "error");
      }
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-[#FFD52B40] border-b border-[#FFD52B]">
            <tr>
              <th className="px-4 py-3 text-left">Incentive Name</th>
              <th className="px-4 py-3 text-left">Zone</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-left">Reward</th>
              <th className="px-4 py-3 text-left">Actions</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#FF7A0080]">
            {incentives.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No incentives found
                </td>
              </tr>
            ) : (
              incentives.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.serviceZones && item.serviceZones.length > 0
                      ? item.serviceZones
                          .map((sz: any) => sz.zoneName || sz.name)
                          .join(", ")
                      : "All Zones"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(item.start_date)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.recurring_type === "ONE_TIME"
                      ? "N/A"
                      : formatDate(item.end_date)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">
                    {item.reward_type === "FIXED" ? "$" : ""}
                    {item.reward_value}
                    {item.reward_type === "PERCENTAGE" ? "%" : ""}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-50"
                        onClick={() => handleEditClick(item)}
                      >
                        <LuPencil size={16} className="text-[#00BFFF]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-50"
                        onClick={() => handleDeleteIncentive(item?.id)}
                      >
                        <FiTrash size={16} className="text-[#FF4D4F]" />
                      </Button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center font-medium text-[10px] rounded-sm ${getStatusColor(
                        item.status,
                      )} h-6 w-20 uppercase`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setCurrentPage(1);
        }}
      />

      {/* Reusable Dialog for both Create (if added elsewhere) and Update */}
      <CreateIncentiveDialog
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);
          if (!open) {
            setSelectedIncentive(null);
            refetch(); // Refresh list on close
          }
        }}
        incentiveToEdit={selectedIncentive}
      />
    </div>
  );
};

export default IncentivesList;
