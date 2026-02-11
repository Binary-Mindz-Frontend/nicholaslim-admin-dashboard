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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const AdditionalServiceDialog = ({
  open,
  onClose,
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: any) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      service_name: "",
      value: "",
      desc: "",
      isActive: true,
    },
  });

  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (open) {
      reset(
        defaultValues || {
          service_name: "",
          value: "",
          desc: "",
          isActive: true,
        },
      );
    }
  }, [defaultValues, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Service" : "Edit Service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service_name">Service Name</Label>
            <Input
              id="service_name"
              {...register("service_name", { required: true })}
              placeholder="Service Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value/Price</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              {...register("value", { required: true })}
              placeholder="99.99"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              {...register("desc")}
              placeholder="Description"
            />
          </div>

          {mode !== "add" && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FFCC00] text-black hover:bg-yellow-500 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : mode === "add"
                  ? "Add Service"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalServiceDialog;
