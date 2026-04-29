import { Filter, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  type: string;
  setType: (v: string) => void;
  handleReset: () => void;
}

export default function NotificationFilter({
  type,
  setType,
  handleReset,
}: Props) {
  return (
    <div className="w-full bg-white rounded-md p-2 border border-gray-100">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Label */}
        <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md bg-yellow-50/30">
          <Filter className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium">Filter By</span>
        </div>

        {/* Type Dropdown */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md bg-white">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="border-none shadow-none px-0 h-8 focus:ring-0">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PUSH_NOTIFICATION">
                Push Notification
              </SelectItem>
              <SelectItem value="IN_APP">In-App</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Dropdown */}
        {/* <div className="px-4 py-1 border border-yellow-400 rounded-md">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-none shadow-none px-0 h-8">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Category</SelectItem>
              <SelectItem value="NOTIFICATION">Notification</SelectItem>
              <SelectItem value="PROMOTION">Promotion</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Reset Button */}
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 border border-red-100 px-4 h-[42px]"
          onClick={handleReset}
        >
          <Repeat className="h-4 w-4" />
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
