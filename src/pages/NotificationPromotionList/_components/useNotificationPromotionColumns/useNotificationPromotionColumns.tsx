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
  promo_code?: string;
  status?: string;
  schedule_to_send?: string;
};

interface ColumnProps {
  onEdit: (data: TNotification) => void;
  onDelete: (data: TNotification) => void;
  onResend?: (data: TNotification) => void;
  onCancelScheduled?: (data: TNotification) => void;
}

export const useNotificationPromotionColumns = ({
  onEdit,
  onDelete,
  onResend,
  onCancelScheduled,
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
        <div className="max-w-[280px]">
          <p className="font-semibold text-sm truncate">{row.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.message}</p>
          {row.promo_code && (
            <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-200">
              Code: {row.promo_code}
            </span>
          )}
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
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const status = row.status || "SENT";
        let color = "bg-green-100 text-green-700";
        if (status === "PENDING") color = "bg-yellow-100 text-yellow-800";
        if (status === "FAILED") color = "bg-red-100 text-red-700";
        if (status === "CANCELLED") color = "bg-gray-100 text-gray-700";

        return (
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Target Role",
      accessor: "target_role",
      cell: (row) => (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none text-[10px]">
          {row.target_role || "ALL"}
        </Badge>
      ),
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
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row)}
            className="text-blue-600 hover:bg-blue-50 h-8 w-8 cursor-pointer"
            title="Edit Promotion"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {onResend && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResend(row)}
              className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50 h-7 px-2 cursor-pointer"
              title="Resend Promotion"
            >
              Resend
            </Button>
          )}
          {onCancelScheduled && row.status === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelScheduled(row)}
              className="text-xs text-red-600 border-red-200 hover:bg-red-50 h-7 px-2 cursor-pointer"
              title="Cancel Scheduled Broadcast"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row)}
            className="text-red-600 hover:bg-red-50 h-8 w-8 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return { notificationColumns };
};
