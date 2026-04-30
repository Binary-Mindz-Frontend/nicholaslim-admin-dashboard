import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { Edit, ListOrdered, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TDriverTier = {
  id: number;
  name: string;
  code: string;
  priorityScore: string;
  description: string;
  isActive: boolean;
  minOrders: number;
  minRating: string;
  minCompletionRate: number;
  maxCancellationRate: number;
  requiresBranding: boolean;
  isInvitationOnly: boolean;
  createdAt: string;
};

interface ColumnProps {
  onEdit: (data: TDriverTier) => void;
}

export const useTierColumns = ({ onEdit }: ColumnProps) => {
  const tierColumns: Column<TDriverTier>[] = [
    {
      header: "Tier Name",
      cell: (row) => (
        <div>
          <p className="font-bold text-sm text-gray-800">{row.name}</p>
          <p className="text-[10px] text-gray-400 font-mono">{row.code}</p>
        </div>
      ),
    },
    {
      header: "Priority Score",
      cell: (row) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-100"
        >
          {row.priorityScore}x
        </Badge>
      ),
    },
    {
      header: "Requirements",
      cell: (row) => (
        <div className="text-[11px] space-y-1">
          <p className="flex items-center gap-1">
            <ListOrdered className="w-3 h-3" />
            Orders: <b>{row.minOrders}+</b>
          </p>
          <p className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            Rating: <b>{row.minRating}</b>
          </p>
        </div>
      ),
    },
    {
      header: "Branding",
      cell: (row) => (
        <Badge
          className={
            row.requiresBranding
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-500"
          }
        >
          {row.requiresBranding ? "Required" : "Not Required"}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge
          className={
            row.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row)}
          className="text-blue-600 hover:bg-blue-50 h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return { tierColumns };
};
