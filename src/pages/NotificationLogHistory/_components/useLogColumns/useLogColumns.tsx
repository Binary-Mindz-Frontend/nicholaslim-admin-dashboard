import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type TNotificationLog = {
  id: number;
  action: string;
  category: string;
  title: string;
  new_message: string;
  created_at: string;
  admin: {
    email: string;
  } | null; // Allow null
  notification: {
    id: number;
  } | null; // Allow null
};

export const useLogColumns = () => {
  const logColumns: Column<TNotificationLog>[] = [
    {
      header: "Log ID",
      cell: (row) => <span className="text-xs font-mono">#LOG-{row.id}</span>,
    },
    {
      header: "Admin / Executor",
      cell: (row) => (
        <div>
          {/* Added optional chaining here just in case admin is null */}
          <p className="text-sm font-medium">
            {row.admin?.email || "System / Unknown"}
          </p>
          <p className="text-[10px] text-gray-400">Admin ID: {row.id}</p>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      cell: (row) => (
        <Badge
          className={`${row.action === "CREATED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} border-none text-[10px]`}
        >
          {row.action}
        </Badge>
      ),
    },
    {
      header: "Notification Info",
      cell: (row) => (
        <div className="max-w-[250px]">
          <p className="text-xs font-bold line-clamp-1">{row.title}</p>
          <p className="text-[10px] text-gray-500 italic">
            {/* FIX: Safe navigation using optional chaining and fallback text */}
            Ref ID: {row.notification?.id ? `#N-${row.notification.id}` : "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) => (
        <Badge variant="secondary" className="text-[10px]">
          {row.category}
        </Badge>
      ),
    },
    {
      header: "Timestamp",
      cell: (row) => (
        <div className="text-xs">
          {row.created_at ? (
            <>
              {format(new Date(row.created_at), "dd MMM, yy")}
              <br />
              <span className="text-gray-400">
                {format(new Date(row.created_at), "hh:mm a")}
              </span>
            </>
          ) : (
            "No Date"
          )}
        </div>
      ),
    },
  ];

  return { logColumns };
};
