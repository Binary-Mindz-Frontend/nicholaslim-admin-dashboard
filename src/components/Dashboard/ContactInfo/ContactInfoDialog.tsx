import { useEffect } from "react"
import { useForm } from "react-hook-form"
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

interface ContactInfoDialogProps {
  open: boolean
  onClose: () => void
  defaultValues: any
  onSubmit: (data: any) => void
  isLoading: boolean
}

const ContactInfoDialog = ({ open, onClose, defaultValues, onSubmit, isLoading }: ContactInfoDialogProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      service_email: "",
      service_number: ""
    }
  })

  useEffect(() => {
    if (open && defaultValues) {
      reset({
        service_email: defaultValues.service_email,
        service_number: defaultValues.service_number
      })
    }
  }, [open, defaultValues, reset])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Contact Info</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service_email">Service Email</Label>
            <Input 
              id="service_email" 
              type="email"
              {...register("service_email", { required: true })} 
              placeholder="admin@gmail.com" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_number">Service Number</Label>
            <Input 
              id="service_number" 
              {...register("service_number", { required: true })} 
              placeholder="99" 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#FFCC00] text-black hover:bg-yellow-500"
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactInfoDialog