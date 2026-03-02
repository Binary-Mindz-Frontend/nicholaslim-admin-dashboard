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
  raiderId: number | undefined;
  setRaiderId: (value: number | undefined) => void;

  raiderName: string;
  setRaiderName: (value: string) => void;

  verificationStatus: string | undefined;
  setVerificationStatus: (value: string | undefined) => void;

  search: string;
  setSearch: (value: string) => void;

  handleResetFilter: () => void;
  showApproved?: boolean;
}

export default function DriverFilter({
  raiderId,
  setRaiderId,
  // raiderName,
  // setRaiderName,
  verificationStatus,
  setVerificationStatus,
  search,
  setSearch,
  handleResetFilter,
  showApproved = true,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-md px-1 py-1">
      <div className="flex flex-wrap items-center gap-3">

        {/* Search Input */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name or Email"
            className="w-full px-2 py-1 border-none rounded-md focus:outline-none"
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

        {/* Raider ID Input */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <input
            type="number"
            value={raiderId || ""}
            onChange={(e) => setRaiderId(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Enter Raider ID"
            className="w-full px-2 py-1 border-none rounded-md focus:outline-none"
          />
        </div>

        {/* Raider Name Input */}
        {/* <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <input
            type="text"
            value={raiderName}
            onChange={(e) => setRaiderName(e.target.value)}
            placeholder="Enter Raider Name"
            className="w-full px-2 py-1 border-none rounded-md focus:outline-none"
          />
        </div> */}

        {/* Verification Status Dropdown */}
        <div
          className="px-4 py-1 border border-yellow-400 rounded-md 
          w-full sm:w-[48%] md:w-auto"
        >
          <Select
            value={verificationStatus || "all"}
            onValueChange={(value) => {
              setVerificationStatus(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full md:w-[130px] border-none shadow-none px-0">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {showApproved && <SelectItem value="APPROVED">Approved</SelectItem>}
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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