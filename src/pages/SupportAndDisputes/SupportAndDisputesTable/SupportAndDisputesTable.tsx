
import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Eye,Trash2 } from "lucide-react";
import { TSupportDispute } from "../data/SupportData";
import { useNavigate } from "react-router-dom";

export const useSupportDisputeColumns = (initialData: TSupportDispute[]) => {
  const [rows] = useState<TSupportDispute[]>(initialData);
  const navigate = useNavigate();

  const columns: Column<TSupportDispute>[] = [
    {
      header: "CASE ID",
      accessor: "caseId",
      cell: (row) => (
        <span className="text-gray-700 font-medium">{row.caseId}</span>
      ),
    },

    {
      header: "NAME",
      accessor: "customerName",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          {row.customerName}
        </a>
      ),
    },

    {
      header: "ISSUE TYPE",
      accessor: "issueType",
      cell: (row) => <span>{row.issueType}</span>,
    },

    {
      header: "DATE",
      accessor: "date",
      cell: (row) => <span>{row.date}</span>,
    },

    {
      header: "CATEGORY",
      accessor: "category",
      
    },

    {
      header: "ACTION",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
          className="bg-green-100 p-1.5 rounded border border-green-300"
          onClick={() => navigate(`/support/view/${encodeURIComponent(row.caseId)}`)}

        >
          <Eye size={16} className="text-green-700" />
        </button>

          <button className="bg-red-100 p-1.5 rounded border border-red-300">
            <Trash2 size={16} className="text-red-700" />
          </button>
        </div>
      ),
    },

    {
      header: "PRIORITY",
      accessor: "priority",
      cell: (row) => {
        const style =
          row.priority === "High"
            ? "bg-red-500 text-white"
            : row.priority === "Medium"
            ? "bg-yellow-300 text-gray-900"
            : "bg-gray-600 text-white"; 

        return (
          <span
            className={`px-4 py-1 rounded-md text-xs font-semibold ${style}`}
          >
            {row.priority}
          </span>
        );
      },
    },
  ];

  return { columns, rows };
};
