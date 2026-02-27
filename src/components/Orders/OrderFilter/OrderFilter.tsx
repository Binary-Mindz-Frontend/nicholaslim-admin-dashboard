import { Filter, Repeat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  handleResetFilter: () => void;
  totalItems?: number;
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
  itemsPerPage,
  setItemsPerPage,
  handleResetFilter,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-md p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by Order ID or User Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-yellow-400 rounded-md focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter By Label */}
        <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md bg-yellow-50">
          <Filter className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium whitespace-nowrap">
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
              <SelectItem value="PROGRESS">Progress</SelectItem>
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

        {/* Items Per Page Dropdown */}
        <div className="flex items-center gap-2 px-4 py-1 border border-yellow-400 rounded-md">
          <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20 border-none shadow-none px-0 h-8 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            entries
          </span>
        </div>

        {/* Total Items Badge */}
        {/* <div className="flex items-center gap-2 px-4 py-1 bg-gray-100 rounded-md">
          <span className="text-sm font-medium">Total:</span>
          <span className="text-sm font-bold text-yellow-600">
            {totalItems}
          </span>
        </div> */}

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
