import { Filter, Repeat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface FilterSectionProps {
  raiderId: number | undefined;
  setRaiderId: (value: number | undefined) => void;

  raiderName: string;
  setRaiderName: (value: string) => void;

  verificationStatus: string | undefined;
  setVerificationStatus: (value: string | undefined) => void;

  handleResetFilter: () => void;
  handleApplyFilters: () => void;
}

export default function DriverFilter({
  raiderId,
  setRaiderId,
  raiderName,
  setRaiderName,
  verificationStatus,
  setVerificationStatus,
  handleResetFilter,
  handleApplyFilters,
}: FilterSectionProps) {
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="w-full bg-white rounded-md px-1 py-1">
      <div className="flex flex-wrap items-center gap-3">

        {/* Filter By */}
        <div
          className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md 
          w-full sm:w-[48%] md:w-auto"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm py-1 font-medium">Filter By</span>
        </div>

        {/* Raider ID Input */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <input
            type="number"
            value={raiderId || ""}
            onChange={(e) => setRaiderId(e.target.value ? Number(e.target.value) : undefined)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Raider ID"
            className="w-full px-2 py-1 border-none rounded-md focus:outline-none"
          />
        </div>

        {/* Raider Name Input */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <input
            type="text"
            value={raiderName}
            onChange={(e) => setRaiderName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Raider Name"
            className="w-full px-2 py-1 border-none rounded-md focus:outline-none"
          />
        </div>

        {/* Verification Status Dropdown */}
        <div
          className="px-4 py-1 border border-yellow-400 rounded-md 
          w-full sm:w-[48%] md:w-auto"
        >
          <Select 
            value={verificationStatus || "all"} 
            onValueChange={(value) => {
              setVerificationStatus(value === "all" ? undefined : value);
              // Auto-apply when dropdown changes
              setTimeout(() => handleApplyFilters(), 100);
            }}
          >
            <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Button
            variant="ghost"
            className="text-black cursor-pointer hover:text-blue-700 hover:bg-white flex items-center gap-2 w-full justify-start"
            onClick={handleApplyFilters}
          >
            <Search className="h-4 w-4 text-yellow-400" />
            Search
          </Button>
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