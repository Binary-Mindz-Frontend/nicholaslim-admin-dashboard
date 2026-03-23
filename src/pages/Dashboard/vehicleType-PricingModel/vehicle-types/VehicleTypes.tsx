/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import VTtablesData from "./_components/VTtablesData";
import AddVehicleModal from "./_components/AddVehicleModal";
import {
  useAddVehicleTypeMutation,
  useGetVehicleTypesQuery,
} from "@/redux/features/vehicleType/vehicleTypeApi";
import toast from "react-hot-toast";
import CustomButton from "./_components/CustomButton";
import { PeakPricingSection } from "./addVehicleTypes/_components/PeakPricingSection";

interface VehicleTypeData {
  vehicle_type: string;
  vehicle_name: string;
  base_price: number;
  per_km_price: number;
  peak_pricing: boolean;
  dimension: string;
  max_load: number;
  isActive: boolean;
}

const VehicleTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  const [addVehicleType, { isLoading: isAdding }] = useAddVehicleTypeMutation();
  const { data: apiResponse, isLoading, refetch } = useGetVehicleTypesQuery("");

  // Generate random colors for vehicle types
  const generateRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD166",
      "#06D6A0",
      "#118AB2",
      "#EF476F",
      "#FF9A76",
      "#7BC950",
      "#2A9D8F",
      "#E9C46A",
      "#F4A261",
      "#E76F51",
      "#264653",
      "#2A9D8F",
      "#E9C46A",
      "#F4A261",
      "#E76F51",
      "#2D9CDB",
      "#FF8D28",
      "#27C840",
      "#00C3D0",
      "#FF383C",
      "#9B5DE5",
      "#F15BB5",
      "#00BBF9",
      "#00F5D4",
      "#FF006E",
      "#8338EC",
      "#3A86FF",
      "#FB5607",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Calculate vehicle type statistics from API response
  const vehicleTypeStats = useMemo(() => {
    const rawData = apiResponse?.data?.data || [];
    if (!Array.isArray(rawData)) return [];

    const statsMap = new Map<string, number>();

    // Count occurrences of each vehicle type
    rawData.forEach((vehicle: any) => {
      const type = vehicle.vehicle_name || "Unknown";
      statsMap.set(type, (statsMap.get(type) || 0) + 1);
    });

    // Convert to array with random colors
    const stats: any[] = Array.from(statsMap.entries()).map(
      ([type, count]) => ({
        vehicle_name: type,
        count,
        color: generateRandomColor(),
      }),
    );

    return stats;
  }, [apiResponse]);

  // Get total vehicle count
  const totalVehicles = useMemo(() => {
    const rawData = apiResponse?.data?.data || [];
    return Array.isArray(rawData) ? rawData.length : 0;
  }, [apiResponse]);

  // Filter data based on selected type
  const filteredData = useMemo(() => {
    const rawData = apiResponse?.data?.data || [];
    if (!Array.isArray(rawData) || selectedType === "all") {
      return rawData;
    }
    return rawData.filter(
      (vehicle: any) => vehicle.vehicle_name === selectedType,
    );
  }, [apiResponse, selectedType]);

  // Reset to "all" when modal is closed and data is refetched
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedType("all");
    }
  }, [isModalOpen]);

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

      refetch(); // Refresh the data
      setIsModalOpen(false);
    } catch (error: any) {
      toast.dismiss();
      console.error("Add failed:", error);
      toast.error(error?.data?.message || "Failed to add vehicle type");
    }
  };

  const handleVehicleTypeClick = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="my-12 mx-6 sm:mx-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Types</h1>
      </div>

      {/* Vehicle Type Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* "All Vehicles" button - always show */}
        <CustomButton
          bgColor={selectedType === "all" ? "#FFEA96" : "#FFE16B40"}
          borderColor="#E2E8F0"
          indicatorColor={selectedType === "all" ? "#2D9CDB" : "#2D9CDB"}
          text={`All vehicles (${totalVehicles})`}
          click={() => handleVehicleTypeClick("all")}
          isActive={selectedType === "all"}
        />

        {/* Dynamic vehicle type buttons */}
        {vehicleTypeStats.map((stat) => (
          <CustomButton
            key={stat.vehicle_name}
            bgColor={
              selectedType === stat.vehicle_name ? "#FFEA96" : "#FFE16B40"
            }
            borderColor="#E2E8F0"
            indicatorColor={stat.color}
            text={`${stat.vehicle_name}`}
            click={() => handleVehicleTypeClick(stat.vehicle_name)}
            isActive={selectedType === stat.vehicle_name}
          />
        ))}

        {/* Show message if no vehicles found */}
        {!isLoading && vehicleTypeStats.length === 0 && (
          <div className="text-gray-500 italic ml-4">
            No vehicle types found. Add your first vehicle type!
          </div>
        )}
      </div>

      {/* Vehicle Types Table */}
      <div className="my-8">
        <VTtablesData
          apiResponse={{
            ...apiResponse,
            data: filteredData, // Pass filtered data to table
          }}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>

      {/* Add Vehicle Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FFCC00] rounded-md py-3 px-10 cursor-pointer hover:bg-[#FFD700] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg"
          disabled={isLoading || isAdding}
        >
          {isAdding ? "Adding..." : "Add Vehicle Type"}
        </button>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVehicle}
        // isSubmitting={isAdding}
      />

      <div className="my-12">
        <PeakPricingSection />
      </div>
    </div>
  );
};

export default VehicleTypes;
