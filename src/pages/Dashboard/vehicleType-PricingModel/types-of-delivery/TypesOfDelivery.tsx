import type React from "react";
import { useState, useEffect } from "react";
import TypesDeliveryCard, { DeliveryType as FrontendDeliveryType } from "./_components/TypesDeliveryCard";
import { 
  useGetDeliveryTypesQuery, 
  useUpdateDeliveryTypeMutation 
} from "@/redux/features/deliveryTypes/deliveryTypesApi";
import toast from "react-hot-toast";

interface ApiDeliveryType {
  id: number | string;
  name: string;
  price_multiplier: string;
  collection_time: number;
  collection_unit: string;
  delivery_time: number;
  delivery_unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const convertToFrontendFormat = (apiData: ApiDeliveryType): FrontendDeliveryType => {
  const pickupUnit = apiData.collection_unit === "MINUTES" ? "Min" : "Hour";
  const deliveryUnit = apiData.delivery_unit === "MINUTES" ? "Min" : "Hour";

  return {
    id: apiData.id.toString(),
    name: apiData.name,
    percentage: parseFloat(apiData.price_multiplier) || 0,
    pickupTime: apiData.collection_time,
    pickupUnit: pickupUnit,
    deliveryTime: apiData.delivery_time,
    deliveryUnit: deliveryUnit,
  };
};

const convertToApiFormat = (frontendData: FrontendDeliveryType) => {
  return {
    id: frontendData.id,
    name: frontendData.name,
    price_multiplier: frontendData.percentage.toString(),
    collection_time: frontendData.pickupTime,
    collection_unit: frontendData.pickupUnit === "Min" ? "MINUTES" : "HOURS",
    delivery_time: frontendData.deliveryTime,
    delivery_unit: frontendData.deliveryUnit === "Min" ? "MINUTES" : "HOURS",
  };
};

const DeliveryTypesPage: React.FC = () => {
  const [deliveryTypes, setDeliveryTypes] = useState<FrontendDeliveryType[]>([]);

  const { data: apiResponse, isLoading, error, refetch } = useGetDeliveryTypesQuery("");
  const [updateDeliveryType, { isLoading: isUpdating }] = useUpdateDeliveryTypeMutation();

  useEffect(() => {
    const rawData = apiResponse?.data?.data;
    if (apiResponse?.success && Array.isArray(rawData)) {
      const convertedData = rawData.map(convertToFrontendFormat);
      setDeliveryTypes(convertedData);
    }
  }, [apiResponse]);

  const handleSave = async (updatedDelivery: FrontendDeliveryType) => {
    toast.loading("Updating delivery type...");
    try {
      const apiData = convertToApiFormat(updatedDelivery);
      
      const result = await updateDeliveryType(apiData).unwrap();
      
      if (result.success) {
        toast.dismiss();
        toast.success("Delivery type updated successfully!");
        
        setDeliveryTypes(prev => 
          prev.map(delivery => 
            delivery.id === updatedDelivery.id ? updatedDelivery : delivery
          )
        );
        refetch();
      } 
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.dismiss();
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