"use client";

import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { TOrder } from "../data/OrderData";

export const useOrderColumns = (initialData: TOrder[]) => {
  const [orders] = useState<TOrder[]>(initialData);

  const orderColumns: Column<TOrder>[] = [
    {
      header: "ORDER ID",
      accessor: "orderId",
      cell: (row) => (
        <span className="text-gray-700 font-medium">{row.orderId}</span>
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
      header: "ADDRESS",
      accessor: "address",
    },

    {
      header: "DATE",
      accessor: "date",
    },

    {
      header: "CATEGORY",
      accessor: "category",
      cell: (row) => {
        const style =
          row.category === "Express"
            ? "bg-green-200 text-green-800"
            : row.category === "Standard"
            ? "bg-blue-200 text-blue-800"
            : "bg-yellow-200 text-yellow-800";

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
            {row.category}
          </span>
        );
      },
    },

    {
      header: "ACTION",
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="bg-blue-200 p-1.5 rounded">
            <Eye size={16} className="text-blue-700" />
          </button>

          <button className="bg-green-200 p-1.5 rounded">
            <Pencil size={16} className="text-green-700" />
          </button>

          <button className="bg-red-200 p-1.5 rounded">
            <Trash2 size={16} className="text-red-700" />
          </button>
        </div>
      ),
    },

    {
      header: "STATUS",
      accessor: "status",
      cell: (row) => {
        const color =
          row.status === "Completed"
            ? "bg-green-200 text-green-800"
            : row.status === "Pending"
            ? "bg-yellow-300 text-yellow-800"
            : row.status === "Cancelled"
            ? "bg-red-300 text-red-800"
            : row.status === "Ongoing"
            ? "bg-orange-300 text-orange-800"
            : "bg-blue-300 text-blue-800"; // Scheduled

        return (
          <span className={`px-4 py-1 rounded-full text-xs font-semibold ${color}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return { orderColumns, orders };
};
