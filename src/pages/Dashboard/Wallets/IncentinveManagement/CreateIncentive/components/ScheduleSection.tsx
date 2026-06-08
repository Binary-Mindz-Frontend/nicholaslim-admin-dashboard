import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ScheduleData {
  recurring_type: string;
  start_date: string;
  end_date: string;
  days_of_week: string[];
  month: string;
  day_of_month: number[];
  week_of_month: number[];
}

interface ScheduleSectionProps {
  schedule: ScheduleData;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleData>>;
}

const DateTimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const dateObj = value ? new Date(value) : undefined;
  const dateValue = dateObj && !isNaN(dateObj.getTime()) ? dateObj : undefined;

  const timeValue = dateValue
    ? `${String(dateValue.getHours()).padStart(2, "0")}:${String(dateValue.getMinutes()).padStart(2, "0")}`
    : "00:00";

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const [hours, minutes] = timeValue.split(":").map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedLocal = `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    onChange(formattedLocal);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value; // HH:mm
    const baseDate = dateValue || new Date();
    const [hours, minutes] = timeVal.split(":").map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedLocal = `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    onChange(formattedLocal);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border border-input shadow-sm p-3 h-10 hover:bg-transparent",
            !dateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {dateValue ? (
            format(dateValue, "PPP p")
          ) : (
            <span>Pick Date & Time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col bg-white border shadow-md rounded-md" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-600">Time</span>
          <Input
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="w-[120px] h-8 text-sm px-2 py-1"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  schedule,
  setSchedule,
}) => {
  const [tempDayOfMonth, setTempDayOfMonth] = useState("");
  const [tempWeekOfMonth, setTempWeekOfMonth] = useState("");

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
  const daysOfWeekList = ["MON", "TUE", "WED", "THURS", "FRI", "SAT", "SUN"];

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
          (a, b) => a - b
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

  return (
    <>
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
          <Label>Start Date & Time</Label>
          <DateTimePicker
            value={schedule.start_date}
            onChange={(val) =>
              setSchedule({ ...schedule, start_date: val })
            }
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Start Date & Time</Label>
            <DateTimePicker
              value={schedule.start_date}
              onChange={(val) =>
                setSchedule({ ...schedule, start_date: val })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>End Date & Time</Label>
            <DateTimePicker
              value={schedule.end_date}
              onChange={(val) =>
                setSchedule({ ...schedule, end_date: val })
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
    </>
  );
};
