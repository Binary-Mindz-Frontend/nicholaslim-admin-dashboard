import React from "react";
import { Filter, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface NotificationFilterProps {
  category: string;
  setCategory: (value: string) => void;
  handleReset: () => void;
}

const NotificationFilterLog: React.FC<NotificationFilterProps> = ({
  category,
  setCategory,
  handleReset,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-1">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Label Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-md bg-white w-full sm:w-auto">
          <Filter className="h-4 w-4 text-black" />
          <span className="text-sm font-medium">Filter By</span>
        </div>

        {/* Category Dropdown */}
        <div className="px-4 py-1 border border-yellow-400 rounded-md w-full sm:w-[48%] md:w-auto">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full border-none shadow-none px-0 h-9 focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="NOTIFICATION">Notification</SelectItem>
              <SelectItem value="PROMOTION">Promotion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="">
          <Button
            variant="ghost"
            className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-red-50 flex items-center gap-2 w-full justify-start md:justify-center border border-yellow-400 h-[46px]"
            onClick={handleReset}
          >
            <Repeat className="h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilterLog;
