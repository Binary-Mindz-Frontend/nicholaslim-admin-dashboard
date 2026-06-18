/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUpdateIncentiveMutation } from "@/redux/features/incentives/incentivesApi";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
import { TargetRulesSection } from "../CreateIncentive/components/TargetRulesSection";

interface Props {
  incentive: any;
  onClose: () => void;
}

const UpdateIncentiveModal = ({ incentive, onClose }: Props) => {
  const [updateIncentive, { isLoading }] = useUpdateIncentiveMutation();
  const { data: zonesRes } = useGetServiceZonesQuery({});
  const { data: vehicleTypesRes } = useGetVehicleTypesQuery({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    driver_type_ids: [] as number[],
    priority: 1,
    status: "ACTIVE",
    reward_type: "FIXED",
    reward_value: "",
    claim_type: "AUTO",
    claim_expire: "",
    time_constant: "HOURS",
    max_claim: "",
    serviceZoneIds: [] as number[],
    ruleGroups: [
      {
        label: "Group A",
        rules: [
          {
            metric: "COMPLETED_DELIVERIES",
            operator: "GTE",
            value: "" as string | number,
          },
        ],
      },
    ] as {
      label: string;
      rules: {
        metric: string;
        operator: string;
        value: string | number;
      }[];
    }[],
  });

  // Pre-fill data when the modal opens
  useEffect(() => {
    if (incentive) {
      let initialRuleGroups = incentive.ruleGroups || [];
      if (
        initialRuleGroups.length === 0 &&
        incentive.rules &&
        incentive.rules.length > 0
      ) {
        initialRuleGroups = [
          {
            label: "Group A",
            rules: incentive.rules.map((r: any) => ({
              metric: r.metric || "COMPLETED_DELIVERIES",
              operator: r.operator || "GTE",
              value: r.value?.toString() || "",
            })),
          },
        ];
      }
      if (initialRuleGroups.length === 0) {
        initialRuleGroups = [
          {
            label: "Group A",
            rules: [
              {
                metric: "COMPLETED_DELIVERIES",
                operator: "GTE",
                value: "",
              },
            ],
          },
        ];
      }

      setFormData({
        name: incentive.name || incentive.incentive_name || "",
        description: incentive.description || "",
        start_date: incentive.start_date
          ? new Date(incentive.start_date).toISOString().split("T")[0]
          : "",
        end_date: incentive.end_date
          ? new Date(incentive.end_date).toISOString().split("T")[0]
          : "",
        driver_type_ids: incentive.driver_type_ids
          ? incentive.driver_type_ids
          : incentive.driver_types?.map((dt: any) => dt.id) || [],
        priority: incentive.priority || 1,
        status: incentive.status || "ACTIVE",
        reward_type: incentive.reward_type || "FIXED",
        reward_value: (
          incentive.reward_value ||
          incentive.incentive_amount ||
          ""
        ).toString(),
        claim_type: incentive.claim_type || "AUTO",
        claim_expire: incentive.claim_expire?.toString() || "",
        time_constant: incentive.time_constant || "HOURS",
        max_claim:
          incentive.max_claim?.toString() ||
          incentive.max_clam?.toString() ||
          "",
        serviceZoneIds: incentive.serviceZones?.map((sz: any) => sz.id) || [],
        ruleGroups: initialRuleGroups,
      });
    }
  }, [incentive]);

  const activeZones =
    zonesRes?.data?.data?.data?.filter((z: any) => z.isActive) || [];

  const vehicleTypes: any[] = vehicleTypesRes?.data?.data || [];

  const handleUpdate = async () => {
    const payload = {
      id: incentive.id,
      name: formData.name,
      description: formData.description || "Updated description",
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      driver_type_ids: formData.driver_type_ids,
      priority: Number(formData.priority),
      status: formData.status,
      reward_type: formData.reward_type,
      reward_value: Number(formData.reward_value),
      claim_type: formData.claim_type,
      time_constant: formData.time_constant,

      ...(formData.claim_type === "MANUAL" && {
        claim_expire: Number(formData.claim_expire),
      }),

      max_claim: Number(formData.max_claim),
      serviceZoneIds: formData.serviceZoneIds,
      ruleGroups: formData.ruleGroups.map((g: any) => ({
        label: g.label || "Group",
        rules: g.rules.map((r: any) => ({
          metric: r.metric,
          operator: r.operator,
          value: Number(r.value) || 0,
        })),
      })),
    };

    try {
      const res = await updateIncentive(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Incentive updated successfully");
        onClose();
      }

      if (!res.success) {
        toast.error(res.error.response.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update incentive");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] sm:max-w-[728px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update Incentive
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Name */}
          <div className="space-y-2 col-span-2">
            <Label>Incentive Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-gray-50"
              placeholder="Incentive description"
            />
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="bg-gray-50"
            />
          </div>

          {/* Service Zones */}
          <div className="space-y-2 col-span-2">
            <Label>Service Zones</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {activeZones.length > 0 && (
                <Badge
                  variant={
                    formData.serviceZoneIds.length === activeZones.length
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    if (formData.serviceZoneIds.length === activeZones.length) {
                      setFormData({ ...formData, serviceZoneIds: [] });
                    } else {
                      setFormData({
                        ...formData,
                        serviceZoneIds: activeZones.map((z: any) => z.id),
                      });
                    }
                  }}
                >
                  All Zones
                </Badge>
              )}
              {activeZones.map((zone: any) => {
                const isSelected = formData.serviceZoneIds.includes(zone.id);
                return (
                  <Badge
                    key={zone.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          serviceZoneIds: formData.serviceZoneIds.filter(
                            (id) => id !== zone.id,
                          ),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          serviceZoneIds: [...formData.serviceZoneIds, zone.id],
                        });
                      }
                    }}
                  >
                    {zone.name}
                  </Badge>
                );
              })}
              {activeZones.length === 0 && (
                <span className="text-sm text-gray-500">
                  No active zones available
                </span>
              )}
            </div>
          </div>

          {/* Vehicle Types — dynamic multi-select */}
          <div className="space-y-2 col-span-2">
            <Label>Vehicle Type</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {vehicleTypes.length > 0 ? (
                vehicleTypes.map((vt: any) => {
                  const isSelected = formData.driver_type_ids.includes(vt.id);
                  return (
                    <Badge
                      key={vt.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          driver_type_ids: isSelected
                            ? prev.driver_type_ids.filter((id) => id !== vt.id)
                            : [...prev.driver_type_ids, vt.id],
                        }));
                      }}
                    >
                      {vt.vehicle_name}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-sm text-gray-500">
                  No vehicle types available
                </span>
              )}
            </div>
            {formData.driver_type_ids.length === 0 &&
              vehicleTypes.length > 0 && (
                <span className="text-xs text-gray-400 mt-1 block">
                  Select one or more vehicle types
                </span>
              )}
          </div>

          {/* Reward Config */}
          <div className="space-y-2">
            <Label>Reward Type</Label>
            <Select
              value={formData.reward_type}
              onValueChange={(v) =>
                setFormData({ ...formData, reward_type: v })
              }
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED">FIXED</SelectItem>
                <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                <SelectItem value="POINTS">POINTS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reward Value</Label>
            <Input
              type="number"
              value={formData.reward_value}
              onChange={(e) =>
                setFormData({ ...formData, reward_value: e.target.value })
              }
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Max Claim</Label>
            <Input
              type="number"
              value={formData.max_claim}
              onChange={(e) =>
                setFormData({ ...formData, max_claim: e.target.value })
              }
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Claim Type</Label>
            <Select
              value={formData.claim_type}
              onValueChange={(v) => setFormData({ ...formData, claim_type: v })}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTO">AUTO</SelectItem>
                <SelectItem value="MANUAL">MANUAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claim Expire — only visible when claim_type is MANUAL */}
          {formData.claim_type === "MANUAL" && (
            <div className="space-y-2 col-span-2">
              <Label>Claim Expire</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.claim_expire}
                  onChange={(e) =>
                    setFormData({ ...formData, claim_expire: e.target.value })
                  }
                  className="bg-gray-50 flex-1"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Mins/Hours/Days</Label>
            <Select
              value={formData.time_constant}
              onValueChange={(v) =>
                setFormData({ ...formData, time_constant: v })
              }
            >
              <SelectTrigger className="bg-gray-50 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MINUTES">Mins</SelectItem>
                <SelectItem value="HOURS">Hours</SelectItem>
                <SelectItem value="DAYS">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="DISABLED">DISABLED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Rules Section */}
          <TargetRulesSection formData={formData} setFormData={setFormData} />
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-8 border-slate-300 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleUpdate}
            className="text-black cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Incentive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateIncentiveModal;
