
import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { TRequest } from "../data/RequestData";
import { Eye } from "lucide-react";

export const useRequestColumns = (initialData: TRequest[]) => {
  const [requests] = useState<TRequest[]>(initialData);

  const requestColumns: Column<TRequest>[] = [
    {
      header: "Driver ID",
      accessor: "id",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline text-sm">
          {row.id}
        </a>
      ),
    },

    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline text-sm">
          {row.name}
        </a>
      ),
    },

    {
      header: "Contact",
      accessor: "contact",
      cell: (row) => (
        <span className="text-sm">
          {row.contact.slice(0, 2) + "******"}
        </span>
      ),
    },

    {
      header: "Requested Date",
      accessor: "requestedDate",
      cell: (row) => {
        const date = new Date(row.requestedDate);
        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return <span className="text-sm">{formatted}</span>;
      },
    },

    {
      header: "Add Delivery Man",
      cell: () => (
        <button className=" text-black px-6 py-1.5 rounded-full text-sm bg-yellow-400 transition">
          Add
        </button>
      ),
    },
   

{
  header: "Action",
  cell: () => (
    <button className="flex items-center justify-center text-black p-2 rounded-full hover:bg-yellow-400 transition">
      <Eye size={18} />
    </button>
  ),
}
,
  ];

  return { requestColumns, requests };
};
