import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useGetUserProfileQuery } from "@/redux/features/usersTypes/usersTypesApi"
import { useCreateIncentiveMutation } from "@/redux/features/incentives/incentivesApi"


interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateIncentiveDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [amount, setAmount] = useState("")

  // API hooks
  const { data: userData } = useGetUserProfileQuery(undefined);
  const [createIncentive, { isLoading }] = useCreateIncentiveMutation();

  const handleCreate = async () => {
    if (!name || !type || !startDate || !endDate || !amount) {
      toast.error("All fields are required");
      return;
    }

    const adminId = userData?.data?.adminProfiles?.[0]?.id;
    console.log('adminId', adminId)

    if (!adminId) {
      toast.error("Admin ID not found");
      return;
    }

    const payload = {
      adminId: adminId,
      incentive_name: name,
      type: type.toUpperCase(), // "REFERRAL", "PERFORMANCE"
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      incentive_amount: Number(amount),
      status: "ONGOING",
    };

    try {
     await createIncentive(payload).unwrap();
      toast.success("Incentive created successfully");

      // Reset fields
      setName("");
      setType("");
      setStartDate("");
      setEndDate("");
      setAmount("");

      onOpenChange(false); // close modal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create incentive");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Incentive</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Incentive Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weekly Bonus"
              className="bg-gray-100 py-5"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full px-3 py-2 bg-gray-100 rounded-md border text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="REFERRAL">Referral</option>
              <option value="TIME-BASED">Time-based</option>
            </select>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-100 py-5"
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
                  className="bg-gray-100 py-5"
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Incentive Amount</label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="30"
              type="number"
              className="bg-gray-100 py-5"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            className="border border-black px-8"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={isLoading}
            onClick={handleCreate}
            className="bg-black text-white px-8"
          >
            {isLoading ? "Saving..." : "Save Incentive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncentiveDialog;
