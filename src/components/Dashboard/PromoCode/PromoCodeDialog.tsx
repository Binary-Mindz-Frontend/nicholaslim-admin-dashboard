/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PromoCodeDialog = ({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: any) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  useEffect(() => {
    if (open) {
      reset(
        defaultValues || {
          promoCode: "",
          discountDesc: "",
          redirectLink: "", // ✅ ডিফল্ট ভ্যালু
          discountType: "FIXED",
          discountValue: "",
          isActive: true,
          expires_at: "",
        },
      );
    }
  }, [defaultValues, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Promo" : "Edit Promo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Promo Code</Label>
            <Input
              {...register("promoCode", { required: true })}
              placeholder="SUMMER50"
            />
          </div>

          <div className="space-y-2">
            <Label>Discount Description</Label>
            <Input
              {...register("discountDesc", { required: true })}
              placeholder="e.g. Get 20% off on your first ride"
            />
          </div>

          {/* ✅ Redirect Link Field যোগ করা হয়েছে */}
          <div className="space-y-2">
            <Label>Redirect Link</Label>
            <Input
              {...register("redirectLink", { required: false })}
              placeholder="https://example.com/promo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                onValueChange={(val) => setValue("discountType", val)}
                value={discountType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                type="number"
                {...register("discountValue", { required: true })}
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expires At</Label>
            <Input
              type="date"
              {...register("expires_at", { required: true })}
            />
          </div>

          <div className="flex items-center justify-between border p-3 rounded-lg">
            <Label>Active Status</Label>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#FFCC00] text-black hover:bg-yellow-500"
            >
              {isLoading ? "Saving..." : "Save Promo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PromoCodeDialog;