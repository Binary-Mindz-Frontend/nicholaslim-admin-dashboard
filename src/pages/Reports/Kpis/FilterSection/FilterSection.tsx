import { Filter, Repeat, Calendar } from "lucide-react";
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
  allFilter: string;
  setAllFilter: (value: string) => void;
  handleResetFilter: () => void;
  fromDate?: string;
  toDate?: string;
  setFromDate?: (value: string) => void;
  setToDate?: (value: string) => void;
  showCustomDateRange?: boolean;
}

export default function FilterSection({
  dateFilter,
  setDateFilter,
//   allFilter,
//   setAllFilter,
  handleResetFilter,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  showCustomDateRange = false,
}: FilterSectionProps) {
  
  // Handle date filter change
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    
    // If custom date range is selected, clear the custom dates
    if (value !== 'custom' && setFromDate && setToDate) {
      setFromDate('');
      setToDate('');
    }
  };

  return (
    <div className="w-full bg-white rounded-md px-1 py-1">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter By */}
        <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Filter className="h-4 w-4" />
          <span className="text-sm py-1 font-medium">Filter By</span>
        </div>

        {/* Date Dropdown */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-full md:w-[140px] border-none shadow-none px-0">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range Inputs */}
        {showCustomDateRange && dateFilter === 'custom' && (
          <>
            {/* From Date */}
            <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={fromDate || ''}
                  onChange={(e) => setFromDate && setFromDate(e.target.value)}
                  className="w-full md:w-[140px] outline-none text-sm bg-transparent"
                  placeholder="From Date"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={toDate || ''}
                  onChange={(e) => setToDate && setToDate(e.target.value)}
                  className="w-full md:w-[140px] outline-none text-sm bg-transparent"
                  placeholder="To Date"
                />
              </div>
            </div>
          </>
        )}

        {/* Reset Button */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full md:flex-1">
          <Button
            variant="ghost"
            className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-white flex items-center gap-2 w-full justify-start"
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