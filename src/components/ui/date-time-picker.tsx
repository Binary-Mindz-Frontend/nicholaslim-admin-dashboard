import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    value: string;
    onChange: (val: string) => void;
}

export const DateTimePicker = ({ value, onChange }: DateTimePickerProps) => {
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
