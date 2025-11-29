import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

export function FilterBar() {
  const [frequencyFilter, setFrequencyFilter] = useState("daily");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("today");

  function handleResetFilters() {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {/* Filter By */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-700">Filter By</span>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-24 border border-slate-300 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Daily */}
        <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
          <SelectTrigger className="w-24 border border-slate-300 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>

        {/* All */}
        <Select value={rangeFilter} onValueChange={setRangeFilter}>
          <SelectTrigger className="w-20 border border-slate-300 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Filter Button */}
      <Button
        variant="outline"
        size="sm"
        className="border-2 border-yellow-300 bg-yellow-100 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
        onClick={handleResetFilters}
      >
        <X className="mr-1 h-4 w-4" />
        Reset Filter
      </Button>
    </div>
  );
}
