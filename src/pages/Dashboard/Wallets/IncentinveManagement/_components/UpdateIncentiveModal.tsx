/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"// Update with correct Dialog import
import { Input } from "@/components/ui/input"; // Adjust this import according to your setup
import { Button } from "@/components/ui/button"; // Adjust this import according to your setup
import { Calendar } from "lucide-react"; // Adjust if necessary

const UpdateIncentiveModal = ({ incentive, onClose, onSave }: any) => {
  const [name, setName] = useState(incentive.incentive_name);
  const [amount, setAmount] = useState(incentive.incentive_amount);
  const [startDate, setStartDate] = useState(incentive.start_date);
  const [endDate, setEndDate] = useState(incentive.end_date);
  const [status] = useState(incentive.status);
  const [type, setType] = useState(incentive.type);

  const handleSave = () => {
    onSave({
      id: incentive.id,
      incentive_name: name,
      incentive_amount: amount,
      start_date: startDate,
      end_date: endDate,
      status: status,
      type: type,
    });
    onClose(); // Close the modal after saving
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
              <option value="TIME-BASED">Time-based</option>
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
            className="border border-black px-8"
            onClick={onClose} // Close modal without saving
          >
            Cancel
          </Button>
          <Button
            className="bg-black text-white px-8 hover:bg-gray-800"
            onClick={handleSave} // Trigger save action
          >
            Save Incentive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateIncentiveModal;
