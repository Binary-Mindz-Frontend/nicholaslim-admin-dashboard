import { Filter, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface FilterSectionProps {
  category: string;
  setCategory: (value: string) => void;
  status: string | undefined;
  setStatus: (value: string | undefined) => void;
  handleResetFilter: () => void;
}

export default function OrderFilter({
  category,
  setCategory,
  status,
  setStatus,
  handleResetFilter,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-md px-1 py-1">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter By Label */}
        <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Filter className="h-4 w-4" />
          <span className="text-sm py-1 font-medium whitespace-nowrap">Filter By</span>
        </div>

        {/* Category Dropdown (Better than Text Input for Enums) */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Select
            value={category || "all"}
            onValueChange={(value) => setCategory(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full md:w-[150px] border-none shadow-none px-0 h-8 focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="EXPRESS">Express</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
              <SelectItem value="STACKED">Stacked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Dropdown */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0 h-8 focus:ring-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Canceled</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROGRESS">Progress</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full md:flex-1">
          <Button
            variant="ghost"
            className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-white flex items-center gap-2 w-full justify-start h-8"
            onClick={handleResetFilter}
          >
            <Repeat className="h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      </div>
    </div>
  );
}