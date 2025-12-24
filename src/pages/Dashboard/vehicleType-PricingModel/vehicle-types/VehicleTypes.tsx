import { useState } from "react";
import CustomButton from "../../_components/CustomButton";
import VTtablesData from "./_components/VTtablesData";
import AddVehicleModal from "./_components/AddVehicleModal";
import {
  useAddVehicleTypeMutation,
  useGetVehicleTypesQuery,
} from "@/redux/features/vehicleType/vehicleTypeApi";
import toast from "react-hot-toast";

interface VehicleTypeData {
  vehicle_type: string;
  base_price: number;
  per_km_price: number;
  peak_pricing: boolean;
  dimension: string;
  max_load: number;
  isActive: boolean;
}

const VehicleTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addVehicleType, { isLoading: isAdding }] = useAddVehicleTypeMutation();
  const { data: apiResponse, isLoading, refetch } = useGetVehicleTypesQuery("");

  const handleAddVehicle = async (data: VehicleTypeData) => {
    toast.loading("Adding vehicle type...");

    try {
      const result = await addVehicleType(data).unwrap();

      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }

      toast.dismiss();
      toast.success("Vehicle type added successfully!");

      setIsModalOpen(false);
    } catch (error: any) {
      toast.dismiss();
      console.error("Add failed:", error);
      toast.error("Failed to add vehicle type");
    }
  };

  return (
    <div className="my-12 mx-6 sm:mx-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Types</h1>
        <div className="flex gap-2">
          <CustomButton
            bgColor="#FFEA96"
            borderColor="#E2E8F0"
            indicatorColor="#2D9CDB"
            text="All vehicles (245)"
            // click={() => toast.success("Showing all vehicles")}
          />
          <CustomButton
            bgColor="#FFE16B40"
            borderColor="#E2E8F0"
            indicatorColor="#FF8D28"
            text="Bikes (128)"
            // click={() => toast.success("Showing bikes")}
          />
          <CustomButton
            bgColor="#FFE16B40"
            borderColor="#E2E8F0"
            indicatorColor="#27C840"
            text="Cars (89)"
            // click={() => toast.success("Showing cars")}
          />
          <CustomButton
            bgColor="#FFE16B40"
            borderColor="#E2E8F0"
            indicatorColor="#00C3D0"
            text="Van (20)"
            // click={() => toast.success("Showing vans")}
          />
          <CustomButton
            bgColor="#FFE16B40"
            borderColor="#E2E8F0"
            indicatorColor="#FF383C"
            text="Truck (5)"
            // click={() => toast.success("Showing trucks")}
          />
        </div>
      </div>
      <div className="my-12">
        <VTtablesData
          apiResponse={apiResponse}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FFCC00] rounded-md py-2 px-8 cursor-pointer hover:bg-[#FFD700] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isAdding ? "Adding..." : "Add Vehicle Type"}
        </button>
      </div>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVehicle}
      />
    </div>
  );
};

export default VehicleTypes;
