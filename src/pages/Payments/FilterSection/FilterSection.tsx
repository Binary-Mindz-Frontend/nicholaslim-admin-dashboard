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
  dateFilter: string;
  setDateFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  handleResetFilter: () => void;
}

export default function FilterSection({
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  handleResetFilter,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Filter Title */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-gray-700">Filters</span>
        </div>

        {/* Date and Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Date Filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-gray-500 mb-1 block">Date Range</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-yellow-500 focus:border-yellow-500">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-yellow-500 focus:border-yellow-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilter}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            <Repeat className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}