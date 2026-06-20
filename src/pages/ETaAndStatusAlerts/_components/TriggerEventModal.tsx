'use client';

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useCreateTriggerEventMutation,
  useUpdateTriggerEventMutation,
} from "@/redux/features/triggerEvents/triggerEventsApi";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function TriggerEventModal({ isOpen, onClose, initialData }: any) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      backendTag: "",
      description: "",
      expectedValue: "" as any,
      expectedValueType: "Min",
      status: "IN_TRANSIT",
      isActive: true,
    },
  });

  const [createTriggerEvent, { isLoading: isCreating }] = useCreateTriggerEventMutation();
  const [updateTriggerEvent, { isLoading: isUpdating }] = useUpdateTriggerEventMutation();

  const currentStatus = watch("status");
  const watchIsActive = watch("isActive");

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        name: initialData.name || "",
        backendTag: initialData.backendTag || "",
        description: initialData.description || "",
        expectedValue: initialData.expectedValue !== undefined ? initialData.expectedValue.toString() : "",
        expectedValueType: initialData.expectedValueType || "Min",
        status: initialData.status || "IN_TRANSIT",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    } else {
      reset({
        name: "",
        backendTag: "",
        description: "",
        expectedValue: "",
        expectedValueType: "Min",
        status: "IN_TRANSIT",
        isActive: true,
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload: any = {
        name: data.name,
        backendTag: data.backendTag,
        description: data.description || undefined,
        expectedValue: data.expectedValue ? Number(data.expectedValue) : undefined,
        expectedValueType: data.expectedValueType || undefined,
        status: data.status,
        isActive: data.isActive,
      };

      let res;

      if (initialData) {
        res = await updateTriggerEvent({
          id: initialData.id,
          data: payload,
        }).unwrap();
      } else {
        res = await createTriggerEvent(payload).unwrap();
      }

      if (!res.success) {
        toast.error(res?.error?.message || res?.message || "Failed to perform operation");
        return;
      }

      toast.success(res?.message || "Operation success");
      onClose();
    } catch (err: any) {
      toast.error(err?.error?.message || err?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Trigger Alert" : "Add Trigger Alert"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-1">
            <Label>Alert Name</Label>
            <Input 
              placeholder="e.g. Driver ETA to Next Stop" 
              {...register("name", { required: true })} 
            />
          </div>

          {/* Backend Tag */}
          <div className="space-y-1">
            <Label>Backend Tag</Label>
            <Select
                value={watch("backendTag")}
                onValueChange={(val) => setValue("backendTag", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDER_STATUS">Order Status</SelectItem>
                  <SelectItem value="ETA_MINUTES">ETA (Minutes)</SelectItem>
                  <SelectItem value="ETA_KM">ETA (Kilometers)</SelectItem>
                </SelectContent>
              </Select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Input 
              placeholder="Explain what this metric tracks..." 
              {...register("description")} 
            />
          </div>

          {/* Expected Value & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Expected Value</Label>
              <Input 
                type="number" 
                placeholder="e.g. 30" 
                {...register("expectedValue")} 
              />
            </div>
            <div className="space-y-1">
              <Label>Unit Type</Label>
              <Select
                value={watch("expectedValueType")}
                onValueChange={(val) => setValue("expectedValueType", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Min">Minutes (Min)</SelectItem>
                  <SelectItem value="Km">Kilometers (Km)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Status */}
          <div className="space-y-1">
            <Label>Target Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(val) => setValue("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORDER_PLACED">Order Placed</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="ARRIVED_AT_PICKUP">Arrived at Pickup</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="space-y-1">
            <Label>Active Status</Label>
            <Select
              value={watchIsActive ? "true" : "false"}
              onValueChange={(val) => setValue("isActive", val === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-black font-semibold"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : initialData ? (
              "Update Alert"
            ) : (
              "Create Alert"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
