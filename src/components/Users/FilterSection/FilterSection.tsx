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

  allFilter: string;
  setAllFilter: (value: string) => void;

  search: string;
  setSearch: (value: string) => void;

  handleResetFilter: () => void;
}

export default function FilterSection({
  dateFilter,
  setDateFilter,
  allFilter,
  setAllFilter,
  search,
  setSearch,
  handleResetFilter,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-md px-1 py-1">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Field */}
        <div className="flex items-center gap-2 px-4 py-1.5 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-[250px]">
          <input
            type="text"
            placeholder="Name, Email, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>

        {/* Filter By */}
        <div
          className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md 
          w-full sm:w-[48%] md:w-auto"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm py-1 font-medium">Filter By</span>
        </div>

        {/* Date Dropdown */}
        <div
          className="px-4 py-1 border border-yellow-400 rounded-md 
          w-full sm:w-[48%] md:w-auto"
        >
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* All Dropdown */}
        <div
          className="px-4 py-1 border border-yellow-400 rounded-md 
          w-full sm:w-[48%] md:w-auto"
        >
          <Select value={allFilter} onValueChange={setAllFilter}>
            <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deleted">deleted</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
