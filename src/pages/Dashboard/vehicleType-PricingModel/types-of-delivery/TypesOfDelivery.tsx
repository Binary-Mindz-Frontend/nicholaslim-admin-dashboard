/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { 
  useGetDeliveryTypesQuery, 
  useAddDeliveryTypeMutation 
} from "@/redux/features/deliveryTypes/deliveryTypesApi";
import toast from "react-hot-toast";
import DeliveryTypesTable from "./_components/DeliveryTypesTable";
import AddDeliveryTypeModal from "./_components/AddDeliveryTypeModal";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";

const DeliveryTypesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiResponse, isLoading, refetch } = useGetDeliveryTypesQuery("");
  const [addDeliveryType, { isLoading: isAdding }] = useAddDeliveryTypeMutation();

  const handleAddDeliveryType = async (data: any) => {
    toast.loading("Adding delivery type...");

    try {
      const result = await addDeliveryType(data).unwrap();

      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }

      toast.dismiss();
      toast.success(result.message || "Delivery type added successfully!");

      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.dismiss();
      console.error("Add failed:", error);
      toast.error(error?.data?.message || "Failed to add delivery type");
    }
  };

  return (
    <div className="my-12 mx-6 sm:mx-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Types</h1>
      </div>

      {/* Delivery Types Table */}
      <div className="my-8">
        <DeliveryTypesTable
          apiResponse={apiResponse}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>

      {/* Add Delivery Type Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FFCC00] rounded-md py-3 px-10 cursor-pointer hover:bg-[#FFD700] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg"
          disabled={isLoading || isAdding}
        >
          {isAdding ? "Adding..." : "Add Delivery Type"}
        </button>
      </div>

      {/* Add Delivery Type Modal */}
      <AddDeliveryTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDeliveryType}
      />

      <div>
        <NewDynamicChangeLogTable entityType="DeliveryType" />
      </div>
    </div>
  );
};

export default DeliveryTypesPage;