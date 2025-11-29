import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export interface CoinFormData {
  id?: number
  eventTrigger: string
  coinAmount: string
  expiryDuration: string
}

interface CoinDialogProps {
  open: boolean
  onClose: () => void
  mode: "add" | "edit"
  defaultValues?: CoinFormData
  onSubmit: (data: CoinFormData) => void
}

const CoinDialog: React.FC<CoinDialogProps> = ({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
}) => {
  const [form, setForm] = useState<CoinFormData>(
    defaultValues || {
      eventTrigger: "",
      coinAmount: "",
      expiryDuration: "",
    }
  )

 useEffect(() => {
    setForm(
      defaultValues || {
        eventTrigger: "",
        coinAmount: "",
        expiryDuration: "",
      }
    )
  }, [defaultValues])

  const handleChange = (key: keyof CoinFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSubmit(form)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Coin" : "Edit Coin"}
          </DialogTitle>
        </DialogHeader>

        {/* Event Trigger */}
        <div className="space-y-3 py-2">
          <div className="flex flex-col gap-2">
            <Label>Event Trigger</Label>
            <Input
              value={form.eventTrigger}
              onChange={(e) => handleChange("eventTrigger", e.target.value)}
              placeholder="Event name"
              className="focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
            />
          </div>

          {/* Coin Amount */}
          <div className="space-y-3 py-2">
            <Label>Coin Amount</Label>
            <Input
              type="number"
              value={form.coinAmount}
              onChange={(e) => handleChange("coinAmount", e.target.value)}
              placeholder="Enter amount"
              className="focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
            />
          </div>

          {/* Expiry Duration */}
          <div className="space-y-3 py-2">
            <Label>Expiry Duration (days)</Label>
            <Input
              type="number"
              value={form.expiryDuration}
              onChange={(e) => handleChange("expiryDuration", e.target.value)}
              placeholder="Expiry days"
              className="focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-[#FFCC00] text-black" onClick={handleSave}>
            {mode === "add" ? "Add" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CoinDialog
