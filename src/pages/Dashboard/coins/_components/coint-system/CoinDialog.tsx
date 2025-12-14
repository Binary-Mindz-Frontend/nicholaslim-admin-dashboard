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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CoinFormData {
  id?: number
  eventTrigger: string
  coinAmount: string
  expiryDuration: string
  coinValueInCent?: string
}

interface CoinDialogProps {
  open: boolean
  onClose: () => void
  mode: "add" | "edit"
  defaultValues?: CoinFormData
  onSubmit: (data: CoinFormData) => void
  isLoading?: boolean
}

const EVENT_TRIGGERS = [
  { value: "FIRST_SIGNUP", label: "First Signup" },
  { value: "DAILY_LOGIN", label: "Daily Login" },
  { value: "SHARE_ON_SOCIAL", label: "Share on Social" },
  { value: "REFERRAL", label: "Referral" },
  { value: "COMPLETED20_ORDER", label: "Completed 20 Orders" },
]

const CoinDialog: React.FC<CoinDialogProps> = ({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
  isLoading = false,
}) => {
  const [form, setForm] = useState<CoinFormData>(
    defaultValues || {
      eventTrigger: "",
      coinAmount: "",
      expiryDuration: "",
      coinValueInCent: "",
    }
  )

  useEffect(() => {
    if (open) {
      setForm(
        defaultValues || {
          eventTrigger: "",
          coinAmount: "",
          expiryDuration: "",
          coinValueInCent: "",
        }
      )
    }
  }, [defaultValues, open])

  const handleChange = (key: keyof CoinFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSubmit(form)
  }

  const isFormValid = () => {
    return (
      form.eventTrigger.trim() !== "" &&
      form.coinAmount.trim() !== "" &&
      form.expiryDuration.trim() !== "" &&
      form.coinValueInCent?.trim() !== ""
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Coin" : "Edit Coin"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Event Trigger */}
          <div className="space-y-2">
            <Label htmlFor="eventTrigger">Event Trigger *</Label>
            <Select
              value={form.eventTrigger}
              onValueChange={(value) => handleChange("eventTrigger", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="eventTrigger" className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]">
                <SelectValue placeholder="Select event trigger" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TRIGGERS.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    {trigger.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coin Amount */}
          <div className="space-y-2">
            <Label htmlFor="coinAmount">Coin Amount *</Label>
            <Input
              id="coinAmount"
              type="number"
              min="0"
              step="0.01"
              value={form.coinAmount}
              onChange={(e) => handleChange("coinAmount", e.target.value)}
              placeholder="Enter coin amount (e.g., 50.00)"
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
          </div>

          {/* Coin Value in Cents */}
          <div className="space-y-2">
            <Label htmlFor="coinValueInCent">Coin Value in Cents *</Label>
            <Input
              id="coinValueInCent"
              type="number"
              min="0"
              value={form.coinValueInCent}
              onChange={(e) => handleChange("coinValueInCent", e.target.value)}
              placeholder="Enter value in cents (e.g., 5000)"
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">1 coin = 100 cents</p>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDuration">Expiry Date *</Label>
            <Input
              id="expiryDuration"
              type="date"
              value={form.expiryDuration}
              onChange={(e) => handleChange("expiryDuration", e.target.value)}
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#FFCC00] text-black hover:bg-yellow-500"
            onClick={handleSave}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === "add" ? "Adding..." : "Updating..."}
              </span>
            ) : (
              mode === "add" ? "Add Coin" : "Update Coin"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CoinDialog