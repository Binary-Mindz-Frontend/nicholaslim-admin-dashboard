
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"

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
              placeholder="Weekby Completion Bonus"
              className="bg-gray-100 py-5 focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full px-3 py-2 rounded-md bg-gray-100 focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00] border text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Performance">Performance</option>
              <option value="Referral">Referral</option>
              <option value="Time-based">Time-based</option>
            </select>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium ">Start Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-100 py-5 focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* End */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">End Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-100 py-5 focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
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
              className="bg-gray-100 py-5 focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button variant="outline" className="cursor-pointer border border-black px-8" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-black text-white cursor-pointer hover:text-black">Save Incentive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateIncentiveDialog
