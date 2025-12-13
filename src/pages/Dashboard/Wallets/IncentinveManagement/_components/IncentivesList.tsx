/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from 'sweetalert2';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuPencil } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { 
  useGetAllIncentivesQuery, 
  useDeleteIncentiveMutation,
  useUpdateIncentiveMutation // Add this import
} from "@/redux/features/incentives/incentivesApi";
import UpdateIncentiveModal from './UpdateIncentiveModal';

const IncentivesList: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllIncentivesQuery(undefined);
  const [deleteIncentive] = useDeleteIncentiveMutation();
  const [updateIncentive] = useUpdateIncentiveMutation(); // Add update mutation
  const [selectedIncentive, setSelectedIncentive] = useState<any>(null);

  if (isLoading) return <p>Loading...</p>;

  const incentives = data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-[#CAE2B6] text-[#32620B]";
      case "ONGOING":
        return "bg-[#FFFAE6] text-[#FFCC00]";
      case "ENDED":
        return "bg-[#FF4D4F40] text-[#FF4D4F]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleEditIncentive = (item: any) => {
    setSelectedIncentive(item);
  };

  const handleDeleteIncentive = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteIncentive(id).unwrap();
        Swal.fire('Deleted!', 'Your incentive has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete incentive.', 'error');
      }
    }
  };

  // Add this function to handle save
  const handleSaveIncentive = async (updatedData: any) => {
    if (!selectedIncentive?.id) return;
    
    try {
      // Prepare the data for API call
      const payload = {
        id: selectedIncentive.id,
        ...updatedData
      };
      
      await updateIncentive(payload).unwrap();
      await refetch(); // Refresh the list
      Swal.fire('Success!', 'Incentive updated successfully.', 'success');
      setSelectedIncentive(null); // Close modal
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error!', 'Failed to update incentive.', 'error');
    }
  };

  return (
    <div className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#FFD52B40] border border-[#FFD52B]">
            <tr>
              <th className="px-4 py-3">Incentive Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Actions</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#FF7A0080]">
            {incentives.map((item: any) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.incentive_name}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{formatDate(item.start_date)}</td>
                <td className="px-4 py-3">{formatDate(item.end_date)}</td>
                <td className="px-4 py-3 font-semibold">${item.incentive_amount}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
                      onClick={() => handleEditIncentive(item)}
                    >
                      <LuPencil size={16} className="text-[#00BFFF]" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
                      onClick={() => handleDeleteIncentive(item?.id)}
                    >
                      <FiTrash size={16} className="text-[#FF4D4F]" />
                    </Button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center font-medium text-xs rounded-sm ${getStatusColor(
                      item.status
                    )} h-7 w-24`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIncentive && (
        <UpdateIncentiveModal
          incentive={selectedIncentive}
          onClose={() => setSelectedIncentive(null)}
          onSave={handleSaveIncentive} // Pass the save handler
        />
      )}
    </div>
  );
};

export default IncentivesList;