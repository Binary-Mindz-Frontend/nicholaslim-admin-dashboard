/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useCreateIncentiveMutation,
  useUpdateIncentiveMutation,
} from "@/redux/features/incentives/incentivesApi";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
import { GeneralSection } from "./components/GeneralSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { ScopeSection } from "./components/ScopeSection";
import { RewardSection } from "./components/RewardSection";
import { TargetRulesSection } from "./components/TargetRulesSection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incentiveToEdit: any;
}

interface ScheduleData {
  recurring_type: string;
  start_date: string;
  end_date: string;
  days_of_week: string[];
  month: string;
  day_of_month: number[];
  week_of_month: number[];
}

const formatToDateTimeLocal = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    // If it's already a date-only string like YYYY-MM-DD, append T00:00
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return `${dateStr}T00:00`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
};

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

  const [schedule, setSchedule] = useState<ScheduleData>({
    recurring_type: "ONE_TIME",
    start_date: "",
    end_date: "",
    days_of_week: [],
    month: "Jan",
    day_of_month: [],
    week_of_month: [],
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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Updated days of week to match API expected values
  const daysOfWeekList = ["MON", "TUE", "WED", "THURS", "FRI", "SAT", "SUN"];

  useEffect(() => {
    if (incentiveToEdit && open) {
      // Handle days_of_week - ensure it's always an array
      let daysOfWeek = incentiveToEdit.days_of_week || [];
      // If it's a string (like "ALL") or not an array, convert to array
      if (!Array.isArray(daysOfWeek)) {
        if (daysOfWeek === "ALL") {
          // When "ALL" is received, we show all days as selected in UI
          daysOfWeek = [...daysOfWeekList];
        } else {
          daysOfWeek = [];
        }
      }

      const formattedStartDate = formatToDateTimeLocal(
        incentiveToEdit.start_date,
      );
      const formattedEndDate = formatToDateTimeLocal(incentiveToEdit.end_date);

      let initialRuleGroups = incentiveToEdit.ruleGroups || [];
      if (
        initialRuleGroups.length === 0 &&
        incentiveToEdit.rules &&
        incentiveToEdit.rules.length > 0
      ) {
        initialRuleGroups = [
          {
            label: "Group A",
            rules: incentiveToEdit.rules.map((r: any) => ({
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
        name: incentiveToEdit.name || "",
        description: incentiveToEdit.description || "",
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        driver_type_ids:
          incentiveToEdit.driver_types?.map((dt: any) => dt?.id || dt) || [],
        priority: incentiveToEdit.priority || 1,
        status: incentiveToEdit.status || "ACTIVE",
        reward_type: incentiveToEdit.reward_type || "FIXED",
        reward_value: incentiveToEdit.reward_value?.toString() || "",
        claim_type: incentiveToEdit.claim_type || "AUTO",
        claim_expire: incentiveToEdit.claim_expire?.toString() || "",
        time_constant: incentiveToEdit.time_constant || "HOURS",
        max_claim:
          incentiveToEdit.max_clam?.toString() ||
          incentiveToEdit.max_claim?.toString() ||
          "",
        serviceZoneIds:
          incentiveToEdit.serviceZones?.map((sz: any) => sz.id) ||
          incentiveToEdit.serviceZoneIds ||
          [],
        ruleGroups: initialRuleGroups,
      });

      setSchedule({
        recurring_type: incentiveToEdit.recurring_type || "ONE_TIME",
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        days_of_week: daysOfWeek,
        month: incentiveToEdit.month || "Jan",
        day_of_month: incentiveToEdit.day_of_month || [],
        week_of_month: incentiveToEdit.week_of_month || [],
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
        ruleGroups: [
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
        ],
      });

      setSchedule({
        recurring_type: "ONE_TIME",
        start_date: "",
        end_date: "",
        days_of_week: [],
        month: "Jan",
        day_of_month: [],
        week_of_month: [],
      });
    }
  }, [incentiveToEdit, open]);

  const validateMonthlyDates = (): boolean => {
    if (schedule.recurring_type !== "MONTHLY") return true;

    const monthIndex = months.indexOf(schedule.month);
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const invalidDays = schedule.day_of_month.filter(
      (day) => day > daysInMonth,
    );
    if (invalidDays.length > 0) {
      toast.error(
        `${schedule.month} does not have days: ${invalidDays.join(", ")}`,
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (schedule.recurring_type === "ONE_TIME") {
      if (!schedule.start_date) {
        toast.error("Please select Start Date & Time");
        return;
      }
    } else {
      if (!schedule.start_date || !schedule.end_date) {
        toast.error("Please select both Start and End Date & Time");
        return;
      }
      const startDate = new Date(schedule.start_date);
      const endDate = new Date(schedule.end_date);
      if (startDate >= endDate) {
        toast.error("End Date & Time must be after the Start Date & Time");
        return;
      }
    }

    if (
      schedule.recurring_type === "WEEKLY" &&
      schedule.days_of_week.length === 0
    ) {
      toast.error("Please select at least one day of week");
      return;
    }

    if (schedule.recurring_type === "MONTHLY") {
      if (
        schedule.day_of_month.length === 0 &&
        schedule.week_of_month.length === 0
      ) {
        toast.error("Please select at least one day of month or week of month");
        return;
      }
      if (!validateMonthlyDates()) {
        return;
      }
    }
    const payload: any = {
      name: formData.name,
      description: formData.description || "No description",
      recurring_type: schedule.recurring_type,
      start_date: new Date(schedule.start_date).toISOString(),
      driver_type_ids: formData.driver_type_ids,
      priority: Number(formData.priority),
      status: formData.status,
      reward_type: formData.reward_type,
      reward_value: Number(formData.reward_value),
      claim_type: formData.claim_type,
      time_constant: formData.time_constant,
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
    if (schedule.recurring_type !== "ONE_TIME") {
      payload.end_date = new Date(schedule.end_date).toISOString();
    }
    if (schedule.recurring_type === "WEEKLY") {
      if (schedule.days_of_week.length === daysOfWeekList.length) {
        payload.days_of_week = [...daysOfWeekList];
      } else {
        payload.days_of_week = schedule.days_of_week;
      }
    }

    if (schedule.recurring_type === "MONTHLY") {
      if (schedule.day_of_month.length > 0) {
        payload.day_of_month = schedule.day_of_month;
      }
      if (schedule.week_of_month.length > 0) {
        payload.week_of_month = schedule.week_of_month;
      }
      payload.month = schedule.month;
      if (schedule.days_of_week.length > 0) {
        if (schedule.days_of_week.length === daysOfWeekList.length) {
          payload.days_of_week = [...daysOfWeekList];
        } else {
          payload.days_of_week = schedule.days_of_week;
        }
      }
    }

    if (formData.claim_type === "MANUAL") {
      payload.claim_expire = Number(formData.claim_expire);
    }

    try {
      let res;
      if (incentiveToEdit) {
        res = await updateIncentive({
          id: incentiveToEdit.id,
          ...payload,
        }).unwrap();
      } else {
        // For create, just pass the payload
        res = await createIncentive(payload).unwrap();
      }

      if (res.success) {
        toast.success(
          res.message ||
            `Incentive ${incentiveToEdit ? "updated" : "created"} successfully`,
        );
        onOpenChange(false);
      } else if (!res.success) {
        toast.error(
          res.error?.message ||
            res.error?.response?.message ||
            "Something went wrong",
        );
      }
    } catch (error: any) {
      console.error("Error details:", error);
      toast.error(
        error?.data?.message || error?.message || "Something went wrong",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] sm:max-w-[728px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {incentiveToEdit ? "Edit" : "Create"} Incentive
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* General Section */}
          <GeneralSection formData={formData} setFormData={setFormData} />

          {/* Schedule Section */}
          <ScheduleSection schedule={schedule} setSchedule={setSchedule} />

          {/* Scope Section */}
          <ScopeSection
            formData={formData}
            setFormData={setFormData}
            activeZones={activeZones}
            vehicleTypes={vehicleTypes}
          />

          {/* Reward Section */}
          <RewardSection formData={formData} setFormData={setFormData} />

          {/* Target Rules Section */}
          <TargetRulesSection formData={formData} setFormData={setFormData} />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            disabled={isCreating || isUpdating}
            onClick={handleSubmit}
            className="text-black cursor-pointer"
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
