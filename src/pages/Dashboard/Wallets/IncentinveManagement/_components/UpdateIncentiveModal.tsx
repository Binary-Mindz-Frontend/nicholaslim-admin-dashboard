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

interface Props {
  incentive: any;
  onClose: () => void;
}

const UpdateIncentiveModal = ({ incentive, onClose }: Props) => {
  const [updateIncentive, { isLoading }] = useUpdateIncentiveMutation();
  const { data: zonesRes } = useGetServiceZonesQuery({});

  // Match the state structure of CreateIncentiveDialog
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    driver_type: "BIKE",
    priority: 1,
    status: "ACTIVE",
    reward_type: "FIXED",
    reward_value: "",
    claim_type: "AUTO",
    serviceZoneId: "0",
    metric: "COMPLETED_DELIVERIES",
    operator: "GTE",
    ruleValue: "",
  });

  // Pre-fill data when the modal opens
  useEffect(() => {
    if (incentive) {
      setFormData({
        name: incentive.name || incentive.incentive_name || "",
        description: incentive.description || "",
        // Formats date to YYYY-MM-DD for the HTML input
        start_date: incentive.start_date
          ? new Date(incentive.start_date).toISOString().split("T")[0]
          : "",
        end_date: incentive.end_date
          ? new Date(incentive.end_date).toISOString().split("T")[0]
          : "",
        driver_type: incentive.driver_type || "BIKE",
        priority: incentive.priority || 1,
        status: incentive.status || "ACTIVE",
        reward_type: incentive.reward_type || "FIXED",
        reward_value: (
          incentive.reward_value ||
          incentive.incentive_amount ||
          ""
        ).toString(),
        claim_type: incentive.claim_type || "AUTO",
        serviceZoneId: (incentive.serviceZoneId || "0").toString(),
        metric: incentive.rules?.[0]?.metric || "COMPLETED_DELIVERIES",
        operator: incentive.rules?.[0]?.operator || "GTE",
        ruleValue: (incentive.rules?.[0]?.value || "").toString(),
      });
    }
  }, [incentive]);

  const activeZones =
    zonesRes?.data?.data?.data?.filter((z: any) => z.isActive) || [];

  const handleUpdate = async () => {
    // Construct payload exactly like the Create version
    const payload = {
      id: incentive.id, // Important for updates
      name: formData.name,
      description: formData.description || "Updated description",
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      driver_type: formData.driver_type,
      priority: Number(formData.priority),
      status: formData.status,
      reward_type: formData.reward_type,
      reward_value: Number(formData.reward_value),
      claim_type: formData.claim_type,
      serviceZoneId: Number(formData.serviceZoneId),
      rules: [
        {
          metric: formData.metric,
          operator: formData.operator,
          value: Number(formData.ruleValue),
        },
      ],
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
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

          {/* Zone & Driver Type */}
          <div className="space-y-2">
            <Label>Service Zone</Label>
            <Select
              value={formData.serviceZoneId}
              onValueChange={(v) =>
                setFormData({ ...formData, serviceZoneId: v })
              }
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Zones (Default)</SelectItem>
                {activeZones.map((zone: any) => (
                  <SelectItem key={zone.id} value={zone.id.toString()}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Driver Type</Label>
            <Select
              value={formData.driver_type}
              onValueChange={(v) =>
                setFormData({ ...formData, driver_type: v })
              }
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BIKE">BIKE</SelectItem>
                <SelectItem value="CAR">CAR</SelectItem>
                <SelectItem value="CYCLE">CYCLE</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Reward Value & Status */}
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

          {/* Rules Section (Simplified to match Create style) */}
          <div className="col-span-2 border-t pt-4 mt-2">
            <h4 className="text-sm font-bold mb-3">Target Rules</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Metric</Label>
                <Select
                  value={formData.metric}
                  onValueChange={(v) => setFormData({ ...formData, metric: v })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Metric" />
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
                    <SelectValue placeholder="Select Operator" />
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
              <div className="space-y-1">
                <Label className="text-xs">Target</Label>
                <Input
                  type="number"
                  value={formData.ruleValue}
                  onChange={(e) =>
                    setFormData({ ...formData, ruleValue: e.target.value })
                  }
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
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
