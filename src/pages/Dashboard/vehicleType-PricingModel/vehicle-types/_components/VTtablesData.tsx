/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import TablePagination from "../../../_components/TablePagination";
import { StatusSwitch } from "./StatusSwitch";
import SCustomTable from "../../../_components/CutomTable";
import { Edit2 } from "lucide-react";
import {
  useUpdateVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
} from "@/redux/features/vehicleType/vehicleTypeApi";
import EditVehicleModal from "./EditVehicleModal";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";

interface Vehicle {
  id: string;
  vehicle_type: string;
  vehicle_name: string;
  max_load: string;
  base_price: string;
  dimension?: string;
  dimension_width?: string;
  dimension_height?: string;
  dimension_length?: string;
  isActive: boolean;
  per_km_price: string;
  peak_pricing: boolean;
  admin_id?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehicle[];
}

interface VTtablesDataProps {
  apiResponse: ApiResponse;
  isLoading: boolean;
  refetch: () => void;
}

const VTtablesData: React.FC<VTtablesDataProps> = ({
  apiResponse,
  isLoading,
  refetch,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDeleteId, setVehicleToDeleteId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  const [updateVehicleType] = useUpdateVehicleTypeMutation();
  const [deleteVehicleType] = useDeleteVehicleTypeMutation();

  const vehicleTypes = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
  const totalItems = vehicleTypes.length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = vehicleTypes.slice(startIndex, endIndex);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDeleteId) return;

    setIsDeleting(true);
    try {
      const res = await deleteVehicleType(vehicleToDeleteId).unwrap();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Vehicle type deleted successfully!");
      setIsDeleteModalOpen(false);
      setVehicleToDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete vehicle type");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Active" | "Inactive",
  ) => {
    try {
      const vehicle = vehicleTypes.find((v) => v.id === id);
      if (!vehicle) return;

      const updateData = {
        id,
        vehicle_type: vehicle.vehicle_type,
        base_price: parseFloat(vehicle.base_price),
        per_km_price: parseFloat(vehicle.per_km_price),
        peak_pricing: vehicle.peak_pricing,
        dimension: vehicle.dimension,
        max_load: parseFloat(vehicle.max_load),
        isActive: newStatus === "Active",
      };

      const res = await updateVehicleType(updateData).unwrap();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(`Vehicle status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleUpdateVehicle = async (data: any) => {
    const toastId = toast.loading("Updating vehicle type...");
    try {
      const updateData = {
        id: data.id,
        vehicle_type: data.vehicle_type,
        vehicle_name: data.vehicle_name,
        vehicle_desc: data.vehicle_desc,
        base_price: parseFloat(data.base_price),
        per_km_price: parseFloat(data.per_km_price),
        peak_pricing: Boolean(data.peak_pricing),
        dimension_width: parseFloat(data.dimension_width),
        dimension_height: parseFloat(data.dimension_height),
        dimension_length: parseFloat(data.dimension_length),
        max_load: parseFloat(data.max_load),
        base_distance: parseFloat(data.base_distance),
        isActive: Boolean(data.isActive),
      };

      const result = await updateVehicleType(updateData).unwrap();
      if (result.success) {
        toast.success("Vehicle type updated successfully!", { id: toastId });
        setIsEditModalOpen(false);
        refetch();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update", { id: toastId });
    }
  };

  const columns = [
    { key: "vehicle_name" as const, label: "Vehicle Type" },
    {
      key: "max_load" as const,
      label: "Max Load",
      render: (max_load: string) => `${max_load} KG`,
    },
    {
      key: "dimension" as const,
      label: "Dimensions (m)",
      render: (_: string, row: Vehicle) => {
        const h = row.dimension_height || 0;
        const w = row.dimension_width || 0;
        const l = row.dimension_length || 0;
        return `${h}m x ${w}m x ${l}m`;
      },
    },
    {
      key: "base_distance" as const,
      label: "Base Dist.",
      render: (val: string) => `${val} KM`,
    },
    {
      key: "base_price" as const,
      label: "Base Price",
      render: (value: string) => `$${value}`,
    },
    {
      key: "per_km_price" as const,
      label: "Per KM Price",
      render: (value: string) => `$${value}`,
    },
    {
      key: "peak_pricing" as const,
      label: "Peak Pricing",
      render: (peak_pricing: boolean) =>
        peak_pricing ? "Enabled" : "Disabled",
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: (_: any, row: Vehicle) => (
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
            onClick={() => handleDeleteClick(row.id)}
          >
            <FiTrash size={16} className="text-[#FF4D4F]" />
          </Button>
        </div>
      ),
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (isActive: boolean, row: Vehicle) => (
        <StatusSwitch
          status={isActive ? "Active" : "Inactive"}
          onChange={(newStatus) => handleStatusChange(row.id, newStatus)}
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
      <SCustomTable data={displayData} columns={columns} />

      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {selectedVehicle && (
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
          }}
          onSubmit={handleUpdateVehicle}
          initialData={selectedVehicle}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setVehicleToDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle Type"
        description="Are you sure you want to delete this vehicle type? This action cannot be undone."
      />
    </div>
  );
};

export default VTtablesData;
