"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectReact from "react-select";
import {
  useCreateSurgePricingRuleMutation,
  useUpdateSurgePricingRuleMutation,
} from "@/redux/features/surgePricingRules/surgePricingRulesApi";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import { useGetDeliveryTypesQuery } from "@/redux/features/deliveryTypes/deliveryTypesApi";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SurgeRuleModal({ isOpen, onClose, initialData }: any) {
  const { register, handleSubmit, reset, setValue, control, watch } = useForm({
    defaultValues: {
      ruleName: "",
      ratioFrom: "",
      ratioTo: "",
      priceMultiplier: "",
      maxCap: "",
      calculationIntervalMinutes: "5",
      status: "ACTIVE",
      serviceZoneIds: [],
      deliveryTypeIds: [],
    },
  });

  const [createRule, { isLoading: isCreating }] =
    useCreateSurgePricingRuleMutation();
  const [updateRule, { isLoading: isUpdating }] =
    useUpdateSurgePricingRuleMutation();

  const { data: zonesData } = useGetServiceZonesQuery({});
  const { data: deliveryData } = useGetDeliveryTypesQuery({});

  const currentStatus = watch("status");

  const zoneOptions =
    zonesData?.data?.data?.data?.map((z: any) => ({
      value: z.id,
      label: z.name,
    })) || [];

  const deliveryOptions =
    deliveryData?.data?.data?.map((d: any) => ({
      value: d.id,
      label: d.name,
    })) || [];

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        ruleName: initialData.ruleName || "",
        ratioFrom: initialData.ratioFrom?.toString() || "",
        ratioTo: initialData.ratioTo?.toString() || "",
        priceMultiplier: initialData.priceMultiplier?.toString() || "",
        maxCap: initialData.maxCap?.toString() || "",
        calculationIntervalMinutes:
          initialData.calculationIntervalMinutes?.toString() || "5",
        status: initialData.status || "ACTIVE",
        serviceZoneIds:
          initialData.serviceZones?.map((z: any) => ({
            value: z.serviceZoneId,
            label: z.serviceZone?.name,
          })) || [],
        deliveryTypeIds:
          initialData.deliveryTypes?.map((d: any) => ({
            value: d.deliveryTypeId,
            label: d.deliveryType?.name,
          })) || [],
      });
    } else {
      reset({
        ruleName: "",
        ratioFrom: "",
        ratioTo: "",
        priceMultiplier: "",
        maxCap: "",
        calculationIntervalMinutes: "5",
        status: "ACTIVE",
        serviceZoneIds: [],
        deliveryTypeIds: [],
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (Number(data.ratioFrom) >= Number(data.ratioTo)) {
        toast.error("Ratio From must be less than Ratio To");
        return;
      }

      const payload = {
        ruleName: data.ruleName,
        ratioFrom: Number(data.ratioFrom),
        ratioTo: Number(data.ratioTo),
        priceMultiplier: Number(data.priceMultiplier),
        maxCap: Number(data.maxCap),
        calculationIntervalMinutes: Number(
          data.calculationIntervalMinutes || 5,
        ),
        status: data.status,
        serviceZoneIds: data.serviceZoneIds?.map((z: any) => z.value) || [],
        deliveryTypeIds: data.deliveryTypeIds?.map((d: any) => d.value) || [],
      };

      let res;

      if (initialData) {
        res = await updateRule({
          id: initialData.id,
          ...payload,
        }).unwrap();
      } else {
        res = await createRule(payload).unwrap();
      }

      toast.success(res?.message || "Success");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Surge Rule" : "Add Surge Rule"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Rule Name */}
          <div className="space-y-1">
            <Label>Rule Name</Label>
            <Input {...register("ruleName", { required: true })} />
          </div>

          {/* Ratio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ratio From</Label>
              <Input
                type="number"
                step="0.01"
                {...register("ratioFrom", { required: true })}
              />
            </div>
            <div>
              <Label>Ratio To</Label>
              <Input
                type="number"
                step="0.01"
                {...register("ratioTo", { required: true })}
              />
            </div>
          </div>

          {/* Service Zones */}
          <div>
            <Label>Service Zones</Label>
            <Controller
              name="serviceZoneIds"
              control={control}
              render={({ field }) => (
                <SelectReact
                  {...field}
                  isMulti
                  options={zoneOptions}
                  className="text-sm"
                />
              )}
            />
          </div>

          {/* Delivery Types */}
          <div>
            <Label>Delivery Types</Label>
            <Controller
              name="deliveryTypeIds"
              control={control}
              render={({ field }) => (
                <SelectReact
                  {...field}
                  isMulti
                  options={deliveryOptions}
                  className="text-sm"
                />
              )}
            />
          </div>

          {/* Pricing & Calculation Interval */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Price Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                {...register("priceMultiplier", { required: true })}
              />
            </div>
            <div>
              <Label>Max Cap</Label>
              <Input
                type="number"
                step="0.1"
                {...register("maxCap", { required: true })}
              />
            </div>
            <div>
              <Label className="text-xs">Interval (Mins)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                placeholder="5"
                {...register("calculationIntervalMinutes", { required: true })}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(val) => setValue("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-black"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : initialData ? (
              "Update Rule"
            ) : (
              "Create Rule"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
