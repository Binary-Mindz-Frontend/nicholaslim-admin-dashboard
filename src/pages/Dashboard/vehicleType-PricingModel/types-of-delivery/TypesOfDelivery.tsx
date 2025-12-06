import type React from "react";
import { useState, useEffect } from "react";
import TypesDeliveryCard, { DeliveryType as FrontendDeliveryType } from "./_components/TypesDeliveryCard";
import { 
  useGetDeliveryTypesQuery, 
  useUpdateDeliveryTypeMutation 
} from "@/redux/features/deliveryTypes/deliveryTypesApi";
import toast from "react-hot-toast";

// API response type
interface ApiDeliveryType {
  id: string;
  name: string;
  percentage: string;
  pickup_duration: number;
  delivery_duration: number;
  created_at: string;
  updated_at: string;
}

// Convert API data to frontend format
const convertToFrontendFormat = (apiData: ApiDeliveryType): FrontendDeliveryType => {
  // Convert pickup_duration (minutes) to hours/minutes
  const pickupHours = Math.floor(apiData.pickup_duration / 60);
  const pickupMinutes = apiData.pickup_duration % 60;
  const pickupTime = pickupHours > 0 ? pickupHours : pickupMinutes;
  const pickupUnit = pickupHours > 0 ? "Hour" as const : "Min" as const;

  // Convert delivery_duration (minutes) to hours/minutes
  const deliveryHours = Math.floor(apiData.delivery_duration / 60);
  const deliveryMinutes = apiData.delivery_duration % 60;
  const deliveryTime = deliveryHours > 0 ? deliveryHours : deliveryMinutes;
  const deliveryUnit = deliveryHours > 0 ? "Hour" as const : "Min" as const;

  return {
    id: apiData.id,
    name: apiData.name,
    percentage: parseFloat(apiData.percentage),
    pickupTime,
    pickupUnit,
    deliveryTime,
    deliveryUnit,
  };
};

// Convert frontend format to API format
const convertToApiFormat = (frontendData: FrontendDeliveryType) => {
  // Convert hours to minutes if needed
  const pickupDuration = frontendData.pickupUnit === "Hour" 
    ? frontendData.pickupTime * 60 
    : frontendData.pickupTime;

  const deliveryDuration = frontendData.deliveryUnit === "Hour"
    ? frontendData.deliveryTime * 60
    : frontendData.deliveryTime;

  return {
    name: frontendData.name.toUpperCase(), // API expects uppercase
    percentage: frontendData.percentage,
    pickup_duration: pickupDuration,
    delivery_duration: deliveryDuration,
  };
};

const DeliveryTypesPage: React.FC = () => {
  const [deliveryTypes, setDeliveryTypes] = useState<FrontendDeliveryType[]>([]);

  const { data: apiResponse, isLoading, error, refetch } = useGetDeliveryTypesQuery("");
  const [updateDeliveryType, { isLoading: isUpdating }] = useUpdateDeliveryTypeMutation();

  useEffect(() => {
    if (apiResponse?.success && apiResponse.data) {
      const convertedData = (apiResponse.data as ApiDeliveryType[]).map(convertToFrontendFormat);
      setDeliveryTypes(convertedData);
    }
  }, [apiResponse]);

  const handleSave = async (updatedDelivery: FrontendDeliveryType) => {
    try {
      // Convert to API format
      const apiData = convertToApiFormat(updatedDelivery);
      
      // Add ID for update
      const updateData = {
        id: updatedDelivery.id,
        ...apiData,
      };

      const result = await updateDeliveryType(updateData).unwrap();
      
      if (result.success) {
        toast.success("Delivery type updated successfully!");
        
        // Update local state
        setDeliveryTypes(prev => 
          prev.map(delivery => 
            delivery.id === updatedDelivery.id ? updatedDelivery : delivery
          )
        );
        
        // Optionally refetch
        refetch();
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Failed to update delivery type");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-red-500">Error loading delivery types</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Type of Delivery</h1>
        </div>

        {/* Grid of Delivery Cards */}
        <div className="flex flex-col gap-6">
          {deliveryTypes.map((delivery) => (
            <TypesDeliveryCard 
              key={delivery.id} 
              delivery={delivery} 
              onSave={handleSave}
              isSaving={isUpdating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTypesPage;