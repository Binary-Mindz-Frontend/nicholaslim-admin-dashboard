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
  image_url?: string | null;
  orderId?: number | null;
  send_immediately?: boolean;
  is_active?: boolean;
  schedule_to_send?: string | null;
  expiry_date?: string | null;
};

interface ColumnProps {
  onEdit: (data: TNotification) => void;
  onDelete: (data: TNotification) => void;
}

export const useNotificationColumns = ({ onEdit, onDelete }: ColumnProps) => {
  const notificationColumns: Column<TNotification>[] = [
    {
      header: "ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-gray-700">#N-{row.id}</span>
      ),
    },
    {
      header: "Title & Message",
      cell: (row) => (
        <div className="max-w-[280px]">
          <p
            className="font-semibold text-sm text-gray-900 truncate"
            title={row.title}
          >
            {row.title}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1" title={row.message}>
            {row.message}
          </p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) => (
        <Badge
          variant={row.category === "PROMOTION" ? "default" : "outline"}
          className={`text-[10px] ${
            row.category === "PROMOTION"
              ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-none"
              : "bg-gray-100 text-gray-700 hover:bg-gray-100 border-none"
          }`}
        >
          {row.category}
        </Badge>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="text-[11px] font-medium text-gray-600 uppercase">
          {row.type?.replace("_", " ") || "N/A"}
        </span>
      ),
    },
    {
      header: "Target Role",
      accessor: "target_role",
      cell: (row) => (
        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[10px] font-bold">
          {row.target_role}
        </Badge>
      ),
    },
    {
      header: "Order ID",
      cell: (row) => (
        <span className="text-xs font-medium">
          {row.orderId ? `#ORD-${row.orderId}` : "—"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (row) => (
        <div className="text-[11px] leading-tight">
          <p className="font-medium text-gray-700">
            {row.created_at
              ? format(new Date(row.created_at), "dd MMM yyyy")
              : "N/A"}
          </p>
          <p className="text-gray-400">
            {row.created_at ? format(new Date(row.created_at), "hh:mm a") : ""}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge
          className={`text-[10px] border-none ${
            row.is_active
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "bg-red-100 text-red-700 hover:bg-red-100"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return { notificationColumns };
};
