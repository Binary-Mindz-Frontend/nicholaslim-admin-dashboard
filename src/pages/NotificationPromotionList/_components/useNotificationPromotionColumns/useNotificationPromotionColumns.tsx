import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  category: string;
  target_role: string;
  created_at: string;
  image_url?: string;
  orderId?: number | null;
};

interface ColumnProps {
  onEdit: (data: TNotification) => void;
  onDelete: (data: TNotification) => void;
}

export const useNotificationPromotionColumns = ({
  onEdit,
  onDelete,
}: ColumnProps) => {
  const notificationColumns: Column<TNotification>[] = [
    {
      header: "ID",
      accessor: "id",
      cell: (row) => <span className="font-medium">#N-{row.id}</span>,
    },
    {
      header: "Title & Message",
      cell: (row) => (
        <div className="max-w-[300px]">
          <p className="font-semibold text-sm truncate">{row.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.message}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) => (
        <Badge
          variant={row.category === "PROMOTION" ? "default" : "outline"}
          className="text-[10px]"
        >
          {row.category}
        </Badge>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="text-xs uppercase">
          {row.type?.replace("_", " ") || "N/A"}
        </span>
      ),
    },
    {
      header: "Target Role",
      accessor: "target_role",
      cell: (row) => (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px]">
          {row.target_role}
        </Badge>
      ),
    },
    {
      header: "Order ID",
      cell: (row) => <span>{row.orderId || "N/A"}</span>,
    },
    {
      header: "Created At",
      cell: (row) => (
        <div className="text-xs">
          {row.created_at
            ? format(new Date(row.created_at), "dd MMM yyyy")
            : "N/A"}
          <br />
          <span className="text-gray-400">
            {row.created_at ? format(new Date(row.created_at), "hh:mm a") : ""}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row)}
            className="text-blue-600 hover:bg-blue-50 h-8 w-8 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row)}
            className="text-red-600 hover:bg-red-50 h-8 w-8 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return { notificationColumns };
};
