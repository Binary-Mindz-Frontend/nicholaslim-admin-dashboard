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
  key: string
  description: string
  coin_amount: string
  condition?: {
    maxPerDay?: number
  }
  expire_days: string
  coin_value_in_cent: string
  is_active: boolean
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
  { value: "FIRST_SIGNUP", label: "First Signup", description: "Reward for first time signup" },
  { value: "DAILY_LOGIN", label: "Daily Login", description: "Reward for daily login" },
  { value: "SHARE_ON_SOCIAL", label: "Share on Social", description: "Reward for sharing on social media" },
  { value: "REFERRAL", label: "Referral", description: "Reward for referring new users" },
  { value: "COMPLETED_ORDER", label: "Completed Orders", description: "Reward for completing orders" },
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
      key: "",
      description: "",
      coin_amount: "",
      condition: {},
      expire_days: "",
      coin_value_in_cent: "",
      is_active: true,
    }
  )

  const [showConditionInput, setShowConditionInput] = useState(false)

  useEffect(() => {
    if (open) {
      const initialForm = defaultValues || {
        key: "",
        description: "",
        coin_amount: "",
        condition: {},
        expire_days: "",
        coin_value_in_cent: "",
        is_active: true,
      }
      
      setForm(initialForm)
      
      // Show condition input if COMPLETED_ORDER is selected
      if (initialForm.key === "COMPLETED_ORDER") {
        setShowConditionInput(true)
      } else {
        setShowConditionInput(false)
      }
    }
  }, [defaultValues, open])

  const handleChange = (key: keyof CoinFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleKeyChange = (value: string) => {
    // Update key and auto-fill description
    const selectedTrigger = EVENT_TRIGGERS.find(trigger => trigger.value === value)
    
    setForm((prev) => ({ 
      ...prev, 
      key: value,
      description: selectedTrigger?.description || ""
    }))

    // Show condition input only for COMPLETED_ORDER
    if (value === "COMPLETED_ORDER") {
      setShowConditionInput(true)
      // Initialize condition object for COMPLETED_ORDER
      setForm((prev) => ({ 
        ...prev, 
        condition: { maxPerDay: 0 }
      }))
    } else {
      setShowConditionInput(false)
      // Clear condition for other triggers
      setForm((prev) => ({ 
        ...prev, 
        condition: undefined 
      }))
    }
  }

  const handleConditionChange = (field: "maxPerDay" | "minOrderAmount", value: string) => {
    const numValue = parseInt(value) || 0
    setForm((prev) => ({ 
      ...prev, 
      condition: {
        ...prev.condition,
        [field]: numValue
      }
    }))
  }

  const handleSave = () => {
    // Prepare final data
    const finalData: CoinFormData = {
      ...form,
      coin_amount: form.coin_amount,
      expire_days: form.expire_days,
      coin_value_in_cent: form.coin_value_in_cent,
      is_active: form.is_active
    }

    // Only include condition for COMPLETED_ORDER
    if (form.key !== "COMPLETED_ORDER") {
      delete finalData.condition
    }

    onSubmit(finalData)
  }

  const isFormValid = () => {
    const basicValidation = 
      form.key.trim() !== "" &&
      form.description.trim() !== "" &&
      form.coin_amount.trim() !== "" &&
      form.expire_days.trim() !== "" &&
      form.coin_value_in_cent.trim() !== ""

    // For COMPLETED_ORDER, check condition
    if (form.key === "COMPLETED_ORDER") {
      return basicValidation && form.condition?.maxPerDay !== undefined
    }

    return basicValidation
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Coin Reward" : "Edit Coin Reward"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Event Key (Trigger) */}
          <div className="space-y-2">
            <Label htmlFor="key">Event Trigger *</Label>
            <Select
              value={form.key}
              onValueChange={handleKeyChange}
              disabled={isLoading}
            >
              <SelectTrigger id="key" className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]">
                <SelectValue placeholder="Select event trigger" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TRIGGERS.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    <div>
                      <div className="font-medium">{trigger.label}</div>
                      {/* <div className="text-xs text-gray-500">{trigger.description}</div> */}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
          </div>

          {/* Coin Amount */}
          <div className="space-y-2">
            <Label htmlFor="coin_amount">Coin Amount *</Label>
            <Input
              id="coin_amount"
              type="number"
              min="1"
              value={form.coin_amount}
              onChange={(e) => handleChange("coin_amount", e.target.value)}
              placeholder="Enter coin amount (e.g., 10)"
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
          </div>

          {/* Condition - Only for COMPLETED_ORDER */}
          {showConditionInput && (
            <div className="space-y-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="maxPerDay" className="text-yellow-800">
                  Maximum Rewards Per Day *
                </Label>
                <Input
                  id="maxPerDay"
                  type="number"
                  min="0"
                  value={form.condition?.maxPerDay || ""}
                  onChange={(e) => handleConditionChange("maxPerDay", e.target.value)}
                  placeholder="Enter maximum rewards per day"
                  className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00] bg-white"
                  disabled={isLoading}
                />
                <p className="text-xs text-yellow-700">
                  For COMPLETED_ORDER only: Maximum number of times this reward can be given per day
                </p>
              </div>
            </div>
          )}

          {/* Expiry Days */}
          <div className="space-y-2">
            <Label htmlFor="expire_days">Expiry Days *</Label>
            <Input
              id="expire_days"
              type="number"
              min="1"
              value={form.expire_days}
              onChange={(e) => handleChange("expire_days", e.target.value)}
              placeholder="Enter number of days until expiry"
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Number of days until the earned coins expire
            </p>
          </div>

          {/* Coin Value in Cents */}
          <div className="space-y-2">
            <Label htmlFor="coin_value_in_cent">Coin Value in Cents *</Label>
            <Input
              id="coin_value_in_cent"
              type="number"
              min="1"
              value={form.coin_value_in_cent}
              onChange={(e) => handleChange("coin_value_in_cent", e.target.value)}
              placeholder="Enter value in cents (e.g., 100)"
              className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">1 coin = 100 cents = $1.00</p>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label htmlFor="is_active">Status</Label>
            <Select
              value={form.is_active ? "true" : "false"}
              onValueChange={(value) => handleChange("is_active", value === "true")}
              disabled={isLoading}
            >
              <SelectTrigger id="is_active" className="focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#FFCC00] text-black hover:bg-yellow-500 px-6"
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