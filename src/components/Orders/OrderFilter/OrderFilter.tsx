import { Filter, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface FilterSectionProps {
  category: string;
  setCategory: (value: string) => void;
  status: string | undefined;
  setStatus: (value: string | undefined) => void;
  startDate: Date | undefined;
  setStartDate: (value: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (value: Date | undefined) => void;
  search: string;
  setSearch: (value: string) => void;
  handleResetFilter: () => void;
}

export default function OrderFilter({
  category,
  setCategory,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  search,
  setSearch,
  handleResetFilter,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-md p-4">
      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Field */}
        <div className="flex items-center gap-2 px-4 py-3 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-[250px]">
          <input
            type="text"
            placeholder="Search by Order ID or User Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>
        {/* Filter By Label */}
        <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md ">
          <Filter className="h-4 w-4 " />
          <span className="text-sm py-1 font-medium whitespace-nowrap">
            Filter By
          </span>
        </div>

        {/* Category Dropdown */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md min-w-[150px]">
          <Select
            value={category || "all"}
            onValueChange={(value) => setCategory(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full border-none shadow-none px-0 h-8 focus:ring-0">
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
        <div className="px-4 py-1 border border-yellow-400 rounded-md min-w-[130px]">
          <Select
            value={status || "all"}
            onValueChange={(value) =>
              setStatus(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full border-none shadow-none px-0 h-8 focus:ring-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Canceled</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              {/* <SelectItem value="PROGRESS">Progress</SelectItem> */}
              <SelectItem value="ONGOING">Ongoing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date Calendar */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md min-w-[200px]">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">
              From:
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-0 shadow-none p-0 h-8 hover:bg-transparent",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* End Date Calendar */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md min-w-[200px]">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">
              To:
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-0 shadow-none p-0 h-8 hover:bg-transparent",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP")
                  ) : (
                    <span>Pick end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>



        {/* Reset Button */}
        <div className="flex-1 min-w-[120px]">
          <Button
            variant="ghost"
            className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-red-50 flex items-center gap-2 w-full justify-center h-8 border border-red-200 rounded-md"
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
