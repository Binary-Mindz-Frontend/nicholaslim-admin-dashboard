import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Trash2, Eye } from "lucide-react";

// Update interface based on API structure
export interface DisputeData {
  id: number;
  orderId: number;
  priority: string; // "LOW", "MEDIUM", "HIGH"
  status: string; // "PENDING", etc.
  created_at: string;
  updated_at: string;

  // Nested data from API
  user?: {
    username: string;
    image: string | null;
  } | null;
  rider?: {
    username: string;
    image: string | null;
  } | null;
  disputeType: {
    name: string; // The specific type, e.g., "Payment Dispute"
    role: string; // The participant type, e.g., "DRIVER" or "USER"
  };
}

interface UseSupportDisputeColumnsProps {
  data: DisputeData[];
  onDelete: (id: number) => void;
  onView?: (id: number) => void;
}

// Function to format standard ISO dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const useSupportDisputeColumns = ({
  onDelete,
  onView,
}: UseSupportDisputeColumnsProps) => {
  const columns: Column<DisputeData>[] = [
    {
      header: "Dispute ID",
      accessor: "id",
      cell: (row) => {
        // Apply different styling based on the nested disputeType.role (DRIVER/USER)
        const baseStyle = "font-semibold px-2 py-1 rounded";
        const roleStyle =
          row.disputeType.role === "DRIVER"
            ? "bg-slate-100 text-slate-800" // Rider style
            : "bg-amber-100 text-amber-800"; // User style

        return (
          <span className={`${baseStyle} ${roleStyle}`}>
            DISP#${row.id.toString().padStart(4, "0")}
          </span>
        );
      },
    },
    {
      header: "Raised By (User/Driver)",
      cell: (row) => {
        // Determine the username from the nested rider or user object
        let username = "System";
        if (row.rider?.username) {
          username = row.rider.username;
        } else if (row.user?.username) {
          username = row.user.username;
        }

        return <span className="font-medium text-gray-900">{username}</span>;
      },
    },
    {
      header: "Participant Type",
      cell: (row) => {
        // Maps to the nested disputeType.role
        const typeMap: Record<string, string> = {
          DRIVER: "Driver",
          USER: "User",
        };
        return (
          <span className="capitalize text-gray-700">
            {typeMap[row.disputeType.role] || row.disputeType.role}
          </span>
        );
      },
    },
    {
      header: "Dispute Type",
      cell: (row) => (
        <span className="text-gray-800">{row.disputeType.name}</span>
      ),
    },
    {
      header: "Created Date",
      accessor: "created_at",
      cell: (row) => formatDate(row.created_at),
    },
    {
      header: "Last Updated",
      accessor: "updated_at",
      cell: (row) => formatDate(row.updated_at),
    },
    {
      header: "Priority",
      accessor: "priority",
      cell: (row) => {
        const priorityMap: Record<string, { text: string; color: string }> = {
          HIGH: {
            text: "High",
            color: "text-red-700 bg-red-50 border border-red-200",
          },
          MEDIUM: {
            text: "Medium",
            color: "text-amber-700 bg-amber-50 border border-amber-200",
          },
          LOW: {
            text: "Low",
            color: "text-green-700 bg-green-50 border border-green-200",
          },
        };

        const priority = priorityMap[row.priority] || {
          text: row.priority,
          color: "text-gray-700 bg-gray-50 border border-gray-200",
        };

        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priority.color}`}
          >
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
          PENDING: { text: "Pending", color: "text-amber-700 bg-amber-100" },
          UNDER_REVIEW: {
            text: "Under Review",
            color: "text-sky-700 bg-sky-100",
          },
          RESOLVED: { text: "Resolved", color: "text-green-700 bg-green-100" },
          REJECTED: { text: "Rejected", color: "text-rose-700 bg-rose-100" },
        };

        const status = statusMap[row.status] || {
          text: row.status,
          color: "text-gray-600 bg-gray-100",
        };

        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.color}`}
          >
            {status.text}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={() => onView && onView(row.id)}
            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      ),
    },
  ];

  return { columns };
};
