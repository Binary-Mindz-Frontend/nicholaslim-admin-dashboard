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
import {
  useCreateIncentiveMutation,
  useUpdateIncentiveMutation,
} from "@/redux/features/incentives/incentivesApi";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incentiveToEdit: any;
}

const CreateIncentiveDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  incentiveToEdit,
}) => {
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
    metric: "COMPLETED_DELIVERIES",
    operator: "GTE",
    ruleValue: "",
  });

  const [createIncentive, { isLoading: isCreating }] =
    useCreateIncentiveMutation();
  const [updateIncentive, { isLoading: isUpdating }] =
    useUpdateIncentiveMutation();
  const { data: zonesRes } = useGetServiceZonesQuery({});
  const { data: vehicleTypesRes } = useGetVehicleTypesQuery({});

  const activeZones =
    zonesRes?.data?.data?.data?.filter((z: any) => z.isActive) || [];
  const vehicleTypes: any[] = vehicleTypesRes?.data?.data || [];

  useEffect(() => {
    if (incentiveToEdit && open) {
      setFormData({
        name: incentiveToEdit.name || "",
        description: incentiveToEdit.description || "",
        start_date: incentiveToEdit.start_date?.split("T")[0] || "",
        end_date: incentiveToEdit.end_date?.split("T")[0] || "",
        driver_type_ids: incentiveToEdit.driver_type_ids || [],
        priority: incentiveToEdit.priority || 1,
        status: incentiveToEdit.status || "ACTIVE",
        reward_type: incentiveToEdit.reward_type || "FIXED",
        reward_value: incentiveToEdit.reward_value?.toString() || "",
        claim_type: incentiveToEdit.claim_type || "AUTO",
        claim_expire: incentiveToEdit.claim_expire?.toString() || "",
        time_constant: incentiveToEdit.time_constant || "HOURS",
        max_claim: incentiveToEdit.max_claim?.toString() || "",
        serviceZoneIds: incentiveToEdit.serviceZoneIds || [],
        metric: incentiveToEdit.rules?.[0]?.metric || "COMPLETED_DELIVERIES",
        operator: incentiveToEdit.rules?.[0]?.operator || "GTE",
        ruleValue: incentiveToEdit.rules?.[0]?.value?.toString() || "",
      });
    } else if (!incentiveToEdit) {
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        driver_type_ids: [],
        priority: 1,
        status: "ACTIVE",
        reward_type: "FIXED",
        reward_value: "",
        claim_type: "AUTO",
        claim_expire: "",
        time_constant: "HOURS",
        max_claim: "",
        serviceZoneIds: [],
        metric: "COMPLETED_DELIVERIES",
        operator: "GTE",
        ruleValue: "",
      });
    }
  }, [incentiveToEdit, open]);

  const handleSubmit = async () => {
    if (!formData.start_date || !formData.end_date) {
      toast.error("Please select both Start and End dates");
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate >= endDate) {
      toast.error("End Date must be after the Start Date");
      return;
    }

    const payload: any = {
      name: formData.name,
      description: formData.description || "No description",
      recurring_type: "ONE_TIME", // Default required by API
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      driver_type_ids: formData.driver_type_ids,
      priority: Number(formData.priority),
      status: formData.status,
      reward_type: formData.reward_type,
      reward_value: Number(formData.reward_value),
      claim_type: formData.claim_type,
      time_constant: formData.time_constant,
      max_claim: Number(formData.max_claim),
      serviceZoneIds: formData.serviceZoneIds,
      rules: [
        {
          metric: formData.metric,
          operator: formData.operator,
          value: Number(formData.ruleValue),
        },
      ],
    };

    // Only include claim_expire if manual
    if (formData.claim_type === "MANUAL") {
      payload.claim_expire = Number(formData.claim_expire);
    }

    try {
      const res = incentiveToEdit
        ? await updateIncentive({ id: incentiveToEdit.id, ...payload }).unwrap()
        : await createIncentive(payload).unwrap();

      if (res.success) {
        toast.success(
          res.message ||
            `Incentive ${incentiveToEdit ? "updated" : "created"} successfully`,
        );
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {incentiveToEdit ? "Edit" : "Create"} Incentive
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 border-t pt-4">
            <h4 className="md:text-lg font-bold">General</h4>
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Incentive Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Summer Bonus"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Incentive description"
            />
          </div>

          <div className="col-span-2 border-t pt-4 mt-2">
            <h4 className="md:text-lg font-bold">Schedule</h4>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
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
            />
          </div>

          <div className="col-span-2">
            <div className="border-t pt-4 mt-2 space-y-4">
              <h4 className="md:text-lg font-bold mb-3">Scope</h4>

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
                        if (
                          formData.serviceZoneIds.length === activeZones.length
                        ) {
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
                    const isSelected = formData.serviceZoneIds.includes(
                      zone.id,
                    );
                    return (
                      <Badge
                        key={zone.id}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            serviceZoneIds: isSelected
                              ? prev.serviceZoneIds.filter(
                                  (id) => id !== zone.id,
                                )
                              : [...prev.serviceZoneIds, zone.id],
                          }));
                        }}
                      >
                        {zone.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Vehicle Type</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vehicleTypes.map((vt: any) => {
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
                              ? prev.driver_type_ids.filter(
                                  (id) => id !== vt.id,
                                )
                              : [...prev.driver_type_ids, vt.id],
                          }));
                        }}
                      >
                        {vt.vehicle_name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2 space-y-4">
              <h4 className="md:text-lg font-bold mb-3">Reward</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reward Type</Label>
                  <Select
                    value={formData.reward_type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, reward_type: v })
                    }
                  >
                    <SelectTrigger>
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
                    placeholder="50"
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
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Claim Type</Label>
                  <Select
                    value={formData.claim_type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, claim_type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTO">AUTO</SelectItem>
                      <SelectItem value="MANUAL">MANUAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.claim_type === "MANUAL" && (
                  <div className="space-y-2 col-span-2">
                    <Label>Claim Expire</Label>
                    <Input
                      type="number"
                      value={formData.claim_expire}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          claim_expire: e.target.value,
                        })
                      }
                      placeholder="2"
                    />
                  </div>
                )}
                {formData.claim_type === "MANUAL" && (
                  <div className="space-y-2">
                    <Label>Mins/Hours/Days</Label>
                    <Select
                      value={formData.time_constant}
                      onValueChange={(v) =>
                        setFormData({ ...formData, time_constant: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MINUTES">Mins</SelectItem>
                        <SelectItem value="HOURS">Hours</SelectItem>
                        <SelectItem value="DAYS">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="DISABLED">DISABLED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 border-t pt-4 mt-2">
            <h4 className="md:text-lg font-bold mb-3">Target Rules</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Metric</Label>
                <Select
                  value={formData.metric}
                  onValueChange={(v) => setFormData({ ...formData, metric: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED_DELIVERIES">
                      Completed Deliveries
                    </SelectItem>
                    <SelectItem value="TOTAL_EARNINGS">
                      Total Earnings
                    </SelectItem>
                    <SelectItem value="ONLINE_HOURS">Online Hours</SelectItem>
                    <SelectItem value="ACCEPTED_ORDERS">
                      Accepted Orders
                    </SelectItem>
                    <SelectItem value="ACCEPTANCE_RATE">
                      Acceptance Rate (%)
                    </SelectItem>
                    <SelectItem value="CONSECUTIVE_TRIPS">
                      Consecutive Trips
                    </SelectItem>
                    <SelectItem value="REFERRAL_COUNT">
                      Referral Count
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Operator</Label>
                <Select
                  value={formData.operator}
                  onValueChange={(v) =>
                    setFormData({ ...formData, operator: v })
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GTE">
                      Greater Than or Equal (&ge;)
                    </SelectItem>
                    <SelectItem value="LTE">
                      Less Than or Equal (&le;)
                    </SelectItem>
                    <SelectItem value="EQ">Equal To (=)</SelectItem>
                    <SelectItem value="GT">Greater Than (&gt;)</SelectItem>
                    <SelectItem value="LT">Less Than (&lt;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs">Target Value</Label>
                <Input
                  type="number"
                  value={formData.ruleValue}
                  onChange={(e) =>
                    setFormData({ ...formData, ruleValue: e.target.value })
                  }
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isCreating || isUpdating}
            onClick={handleSubmit}
            className="text-black"
          >
            {isCreating || isUpdating
              ? "Saving..."
              : incentiveToEdit
                ? "Update Incentive"
                : "Create Incentive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncentiveDialog;
