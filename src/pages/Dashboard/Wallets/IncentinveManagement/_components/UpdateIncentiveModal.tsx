/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useGetUserProfileQuery } from "@/redux/features/usersTypes/usersTypesApi"

// Define proper props interface
interface UpdateIncentiveModalProps {
  incentive: any;
  onClose: () => void;
  onSave: (data: any) => void; // Add this prop
}

const UpdateIncentiveModal = ({ incentive, onClose, onSave }: UpdateIncentiveModalProps) => {
  const [name, setName] = useState(incentive.incentive_name);
  const [amount, setAmount] = useState(incentive.incentive_amount);
  const [startDate, setStartDate] = useState(new Date(incentive.start_date).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(incentive.end_date).toISOString().split("T")[0]);
  const [status, setStatus] = useState(incentive.status); // Make this editable if needed
  const [type, setType] = useState(incentive.type);

  const { data: userData } = useGetUserProfileQuery(undefined);
  const adminId = userData?.data?.adminProfiles?.[0]?.id;

  const handleSave = () => {
    // Prepare the data in the format expected by the API
    const updatedData = {
      adminId: adminId,
      incentive_name: name,
      incentive_amount: Number(amount), // Convert to number
      start_date: `${startDate}T00:00:00Z`, // Format as ISO string
      end_date: `${endDate}T23:59:59Z`, // Format as ISO string
      status: status,
      type: type,
    };
    
    // Call the onSave function passed from parent
    onSave(updatedData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update Incentive
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Incentive Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Incentive Name</label>
            <Input
              placeholder="Weekly Bonus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 py-3"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-md border text-sm"
            >
              <option value="">Select type</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="REFERRAL">Referral</option>
              <option value="TIME_BASED">Time-based</option>
            </select>
          </div>

          {/* Status (optional - if you want it to be editable) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-md border text-sm"
            >
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="ENDED">Ended</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-100 py-3"
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">End Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-100 py-3"
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Incentive Amount</label>
            <Input
              placeholder="30"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-100 py-3"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            className="border border-black px-8 cursor-pointer "
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-black text-white px-8 cursor-pointer hover:bg-gray-800"
            onClick={handleSave}
          >
            Save Incentive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateIncentiveModal;