import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export function FilterBar() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3 flex-col sm:flex-row">
        <span className="text-sm font-medium text-slate-700">Filter By</span>

        <Select defaultValue="today">
          <SelectTrigger className="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="daily">
          <SelectTrigger className="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="border-2 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
      >
        <X className="mr-1 h-4 w-4" />
        Reset Filter
      </Button>
    </div>
  );
}
