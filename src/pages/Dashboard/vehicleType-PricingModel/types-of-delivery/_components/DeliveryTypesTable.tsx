/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import TablePagination from "../../../_components/TablePagination";
import { StatusSwitch } from "../../vehicle-types/_components/StatusSwitch";
import SCustomTable from "../../../_components/CutomTable";
import { Edit2 } from "lucide-react";
import {
  useUpdateDeliveryTypeMutation,
  useDeleteDeliveryTypeMutation,
} from "@/redux/features/deliveryTypes/deliveryTypesApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";
import EditDeliveryTypeModal from "./EditDeliveryTypeModal";

interface DeliveryType {
  id: string;
  name: string;
  description: string;
  price_multiplier: string;
  collection_time: number;
  collection_unit: string;
  delivery_time: number;
  delivery_unit: string;
  allow_stack: boolean;
  priority: number;
  is_active: boolean;
  vehicle_type_ids?: number[];
  vehicle_types?: {
    id: number;
    delivery_type_id: number;
    vehicle_type_id: number;
    vehicle_type: any;
  }[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: DeliveryType[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface DeliveryTypesTableProps {
  apiResponse: ApiResponse | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const DeliveryTypesTable: React.FC<DeliveryTypesTableProps> = ({
  apiResponse,
  isLoading,
  refetch,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>(null);
  const [deliveryToDeleteId, setDeliveryToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  const [updateDeliveryType] = useUpdateDeliveryTypeMutation();
  const [deleteDeliveryType] = useDeleteDeliveryTypeMutation();

  const deliveryTypes = apiResponse?.data?.data || [];
  const totalItems = apiResponse?.data?.meta?.total || 0;

  const handleEditClick = (delivery: DeliveryType) => {
    setSelectedDelivery(delivery);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeliveryToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deliveryToDeleteId) return;

    setIsDeleting(true);
    try {
      const res = await deleteDeliveryType(deliveryToDeleteId).unwrap();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Delivery type deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeliveryToDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete delivery type");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Active" | "Inactive"
  ) => {
    try {
      const delivery = deliveryTypes.find((d) => d.id.toString() === id);
      if (!delivery) return;

      const updateData = {
        id,
        is_active: newStatus === "Active",
        vehicle_type_ids: delivery.vehicle_types?.map((vt: any) => vt.vehicle_type_id) || [],
      };

      // Ensure vehicle_type_ids is not empty if the backend requires it
      if (updateData.vehicle_type_ids.length === 0) {
        toast.error("Cannot update status: No vehicle types associated.");
        return;
      }

      const res = await updateDeliveryType(updateData).unwrap();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleUpdateDelivery = async (data: any) => {
    const toastId = toast.loading("Updating delivery type...");
    try {
      const result = await updateDeliveryType(data).unwrap();
      if (result.success) {
        toast.success("Delivery type updated successfully!", { id: toastId });
        setIsEditModalOpen(false);
        refetch();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update", { id: toastId });
    }
  };

  const formatTime = (time: number, unit: string) => {
    if (unit === "HOURS") {
      return `${time.toFixed(2)} Hrs`;
    }
    return `${time} Min`;
  };

  const columns = [
    { key: "name" as const, label: "Name" },
    {
      key: "price_multiplier" as const,
      label: "Price Multiplier",
      render: (val: string) => `${val}x`,
    },
    {
      key: "collection_time" as const,
      label: "Collection Time",
      render: (val: number, row: DeliveryType) => formatTime(val, row.collection_unit),
    },
    {
      key: "delivery_time" as const,
      label: "Delivery Time",
      render: (val: number, row: DeliveryType) => formatTime(val, row.delivery_unit),
    },
    {
      key: "allow_stack" as const,
      label: "Stackable",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    { key: "priority" as const, label: "Priority" },
    {
      key: "actions" as const,
      label: "Actions",
      render: (_: any, row: DeliveryType) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto cursor-pointer border border-[#00BFFF] hover:bg-blue-100"
            onClick={() => handleEditClick(row)}
          >
            <Edit2 size={16} className="text-[#00BFFF]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
            onClick={() => handleDeleteClick(row.id.toString())}
          >
            <FiTrash size={16} className="text-[#FF4D4F]" />
          </Button>
        </div>
      ),
    },
    {
      key: "is_active" as const,
      label: "Status",
      render: (is_active: boolean, row: DeliveryType) => (
        <StatusSwitch
          key={`${row.id}-${is_active}`}
          status={is_active ? "Active" : "Inactive"}
          onChange={(newStatus) => handleStatusChange(row.id.toString(), newStatus)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div>
      <SCustomTable data={deliveryTypes} columns={columns} />

      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          // If the API supports pagination parameters, you'd call refetch with new page here
        }}
      />

      {selectedDelivery && (
        <EditDeliveryTypeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDelivery(null);
          }}
          onSubmit={handleUpdateDelivery}
          initialData={selectedDelivery}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeliveryToDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Delivery Type"
        description="Are you sure you want to delete this delivery type? This action cannot be undone."
      />
    </div>
  );
};

export default DeliveryTypesTable;
