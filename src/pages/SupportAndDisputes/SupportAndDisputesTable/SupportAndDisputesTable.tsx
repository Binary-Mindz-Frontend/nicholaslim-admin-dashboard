import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Trash2, Eye } from "lucide-react";

export interface DisputeData {
  id: number;
  orderId: number;
  issueType: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  createdByType?: string;
  createdById?: number;
}

interface UseSupportDisputeColumnsProps {
  data: DisputeData[];
  onDelete: (id: number) => void;
  onView?: (id: number) => void;
}

export const useSupportDisputeColumns = ({
  onDelete,
  onView,
}: UseSupportDisputeColumnsProps) => {
  const columns: Column<DisputeData>[] = [
    {
      header: "Case ID",
      accessor: "id",
      cell: (row) => `DISP#${row.id.toString().padStart(4, '0')}`,
    },
    {
      header: "Order ID",
      accessor: "orderId",
      cell: (row) => `ORD-${row.orderId}`,
    },
    {
      header: "Issue Type",
      accessor: "issueType",
    },
    {
      header: "Priority",
      accessor: "priority",
      cell: (row) => {
        const priorityMap: Record<string, { text: string; color: string }> = {
          HIGH: { text: "High", color: "text-red-600 bg-red-100" },
          MEDIUM: { text: "Medium", color: "text-yellow-600 bg-yellow-100" },
          LOW: { text: "Low", color: "text-green-600 bg-green-100" },
        };
        
        const priority = priorityMap[row.priority] || { text: row.priority, color: "text-gray-600 bg-gray-100" };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
            {priority.text}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          PENDING: { text: "Pending", color: "text-yellow-600 bg-yellow-100" },
          UNDER_REVIEW: { text: "Under Review", color: "text-blue-600 bg-blue-100" },
          AWAITING_INFO: { text: "Awaiting Info", color: "text-orange-600 bg-orange-100" },
          RESOLVED: { text: "Resolved", color: "text-green-600 bg-green-100" },
          REJECTED: { text: "Rejected", color: "text-red-600 bg-red-100" },
        };
        
        const status = statusMap[row.status] || { text: row.status, color: "text-gray-600 bg-gray-100" };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.text}
          </span>
        );
      },
    },
    {
      header: "Date",
      accessor: "created_at",
      cell: (row) => {
        const date = new Date(row.created_at);
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onView && onView(row.id)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return { columns };
};