import { Filter, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FilterSectionProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  disputeTypeId: string;
  setDisputeTypeId: (value: string) => void;
  participantType: string;
  setParticipantType: (value: string) => void;
  handleResetFilter: () => void;
  disputeTypes: any[];
}

export default function FilterSection({
  statusFilter,
  setStatusFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  disputeTypeId,
  setDisputeTypeId,
  participantType,
  setParticipantType,
  handleResetFilter,
  disputeTypes,
}: FilterSectionProps) {
  return (
    <div className="w-full bg-white rounded-md p-4 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-2 px-3 py-2 border border-yellow-400 rounded-md bg-yellow-50/30">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-bold">Filter By</span>
        </div>

        {/* Status Select */}
        <div className="">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-yellow-400 focus:ring-yellow-400">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="AWAITING_INFO">Awaiting Info</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Participant Type Select */}
        <div className="">
          <Select value={participantType} onValueChange={setParticipantType}>
            <SelectTrigger className="border-yellow-400 focus:ring-yellow-400">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="rider">Driver</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dispute Type Select */}
        <div className="">
          <Select value={disputeTypeId} onValueChange={setDisputeTypeId}>
            <SelectTrigger className="border-yellow-400 focus:ring-yellow-400">
              <SelectValue placeholder="Dispute Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              {disputeTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Inputs */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border-yellow-400 w-auto h-10"
          />
          <span className="text-gray-400 text-sm">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border-yellow-400 w-auto h-10"
          />
        </div>

        {/* Reset Button */}
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 ml-auto cursor-pointer"
          onClick={handleResetFilter}
        >
          <Repeat className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
