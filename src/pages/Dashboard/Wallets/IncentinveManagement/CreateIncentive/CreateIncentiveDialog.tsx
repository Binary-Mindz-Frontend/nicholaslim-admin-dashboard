/* eslint-disable react-hooks/exhaustive-deps */
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

interface ScheduleData {
  recurring_type: string;
  start_date: string;
  end_date: string;
  days_of_week: string[];
  month: string;
  day_of_month: number[];
  week_of_month: number[];
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

  const [schedule, setSchedule] = useState<ScheduleData>({
    recurring_type: "ONE_TIME",
    start_date: "",
    end_date: "",
    days_of_week: [],
    month: "Jan",
    day_of_month: [],
    week_of_month: [],
  });

  const [tempDayOfMonth, setTempDayOfMonth] = useState("");
  const [tempWeekOfMonth, setTempWeekOfMonth] = useState("");

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
  const weekOfMonths = ["1", "2", "3", "4", "5"];
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

      setFormData({
        name: incentiveToEdit.name || "",
        description: incentiveToEdit.description || "",
        start_date: incentiveToEdit.start_date?.split("T")[0] || "",
        end_date: incentiveToEdit.end_date?.split("T")[0] || "",
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
        metric: incentiveToEdit.rules?.[0]?.metric || "COMPLETED_DELIVERIES",
        operator: incentiveToEdit.rules?.[0]?.operator || "GTE",
        ruleValue: incentiveToEdit.rules?.[0]?.value?.toString() || "",
      });

      setSchedule({
        recurring_type: incentiveToEdit.recurring_type || "ONE_TIME",
        start_date: incentiveToEdit.start_date?.split("T")[0] || "",
        end_date: incentiveToEdit.end_date?.split("T")[0] || "",
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
        metric: "COMPLETED_DELIVERIES",
        operator: "GTE",
        ruleValue: "",
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
      setTempDayOfMonth("");
      setTempWeekOfMonth("");
    }
  }, [incentiveToEdit, open]);

  const handleAddDayOfMonth = () => {
    if (tempDayOfMonth) {
      const days = tempDayOfMonth
        .split(",")
        .map((d) => parseInt(d.trim()))
        .filter((d) => !isNaN(d) && d >= 1 && d <= 31);
      const uniqueDays = [...new Set([...schedule.day_of_month, ...days])];
      setSchedule({ ...schedule, day_of_month: uniqueDays });
      setTempDayOfMonth("");
    }
  };

  const handleRemoveDayOfMonth = (day: number) => {
    setSchedule({
      ...schedule,
      day_of_month: schedule.day_of_month.filter((d) => d !== day),
    });
  };

  const handleAddWeekOfMonth = (week: string) => {
    if (!week) {
      toast.error("Please select a week");
      return;
    }
    const weekNum = parseInt(week);
    if (!schedule.week_of_month.includes(weekNum)) {
      setSchedule({
        ...schedule,
        week_of_month: [...schedule.week_of_month, weekNum].sort(
          (a, b) => a - b,
        ),
      });
    }
    setTempWeekOfMonth("");
  };

  const handleRemoveWeekOfMonth = (week: number) => {
    setSchedule({
      ...schedule,
      week_of_month: schedule.week_of_month.filter((w) => w !== week),
    });
  };

  const toggleDayOfWeek = (day: string) => {
    if (schedule.days_of_week.includes(day)) {
      setSchedule({
        ...schedule,
        days_of_week: schedule.days_of_week.filter((d) => d !== day),
      });
    } else {
      setSchedule({
        ...schedule,
        days_of_week: [...schedule.days_of_week, day],
      });
    }
  };

  const handleSelectAllDays = () => {
    if (schedule.days_of_week.length === daysOfWeekList.length) {
      setSchedule({ ...schedule, days_of_week: [] });
    } else {
      setSchedule({ ...schedule, days_of_week: [...daysOfWeekList] });
    }
  };

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
        toast.error("Please select Start Date");
        return;
      }
    } else {
      if (!schedule.start_date || !schedule.end_date) {
        toast.error("Please select both Start and End dates");
        return;
      }
      const startDate = new Date(schedule.start_date);
      const endDate = new Date(schedule.end_date);
      if (startDate >= endDate) {
        toast.error("End Date must be after the Start Date");
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
      rules: [
        {
          metric: formData.metric,
          operator: formData.operator,
          value: Number(formData.ruleValue),
        },
      ],
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

          <div className="space-y-2 col-span-2">
            <Label>Recurring Schedule</Label>
            <Select
              value={schedule.recurring_type}
              onValueChange={(v) =>
                setSchedule({
                  ...schedule,
                  recurring_type: v,
                  days_of_week: [],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONE_TIME">One-time</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {schedule.recurring_type === "ONE_TIME" ? (
            <div className="space-y-2 col-span-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={schedule.start_date}
                onChange={(e) =>
                  setSchedule({ ...schedule, start_date: e.target.value })
                }
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={schedule.start_date}
                  onChange={(e) =>
                    setSchedule({ ...schedule, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={schedule.end_date}
                  onChange={(e) =>
                    setSchedule({ ...schedule, end_date: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {schedule.recurring_type === "WEEKLY" && (
            <div className="space-y-2 col-span-2">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge
                  variant={
                    schedule.days_of_week.length === daysOfWeekList.length
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={handleSelectAllDays}
                >
                  All Days
                </Badge>
                {daysOfWeekList.map((day) => (
                  <Badge
                    key={day}
                    variant={
                      schedule.days_of_week.includes(day)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleDayOfWeek(day)}
                  >
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {schedule.recurring_type === "MONTHLY" && (
            <>
              <div className="space-y-2 col-span-2">
                <Label>Month</Label>
                <Select
                  value={schedule.month}
                  onValueChange={(v) => setSchedule({ ...schedule, month: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Days of Month</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="1,2,5,10"
                    value={tempDayOfMonth}
                    onChange={(e) => setTempDayOfMonth(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddDayOfMonth}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {schedule.day_of_month.map((day) => (
                    <Badge
                      key={day}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => handleRemoveDayOfMonth(day)}
                    >
                      {day} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Week of Month</Label>
                <div className="flex gap-2">
                  <Select
                    value={tempWeekOfMonth}
                    onValueChange={setTempWeekOfMonth}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekOfMonths.map((week) => (
                        <SelectItem key={week} value={week}>
                          Week {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => handleAddWeekOfMonth(tempWeekOfMonth)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {schedule.week_of_month.map((week) => (
                    <Badge
                      key={week}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => handleRemoveWeekOfMonth(week)}
                    >
                      Week {week} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Days of Week</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge
                    variant={
                      schedule.days_of_week.length === daysOfWeekList.length
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={handleSelectAllDays}
                  >
                    All Days
                  </Badge>
                  {daysOfWeekList.map((day) => (
                    <Badge
                      key={day}
                      variant={
                        schedule.days_of_week.includes(day)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleDayOfWeek(day)}
                    >
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

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
                  <>
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
                  </>
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
