"use client";

import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Eye, Trash2 } from "lucide-react";
import { TPayment } from "../data/PaymentsData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const usePaymentColumns = (initialData: TPayment[]) => {
  const [payments, setPayments] = useState<TPayment[]>(initialData);

  const handleDelete = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  const paymentColumns: Column<TPayment>[] = [
    {
      header: "Order Id",
      accessor: "orderId",
      cell: (row) => (
        <span className="text-gray-700 font-medium">{row.orderId}</span>
      ),
    },

    {
      header: "NAME",
      accessor: "name",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          {row.name}
        </a>
      ),
    },

    {
      header: "Payment Method",
      accessor: "paymentMethod",
      cell: (row) => <span className="text-sm">{row.paymentMethod}</span>,
    },

    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => <span className="font-medium">{row.amount}</span>,
    },

    {
      header: "Payment type",
      accessor: "paymentType",
      cell: (row) => <span className="text-sm">{row.paymentType}</span>,
    },

    {
      header: "ACTION",
      cell: (_row, rowIndex?: number, rowData?: TPayment) => (
        <div className="flex items-center gap-2">

          {/* VIEW BUTTON — No action */}
          <button
            className="bg-green-100 p-1.5 rounded border border-green-300"
            title="View"
          >
            <Eye size={16} className="text-green-700" />
          </button>

          {/* DELETE BUTTON WITH SHADCN ALERT */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="bg-red-100 p-1.5 rounded border border-red-300"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-700" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete payment record{" "}
                  <b>{rowData?.orderId}</b>.
                  <br />
                  You cannot undo this.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(rowIndex ?? 0)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },

    {
      header: "STATUS",
      accessor: "status",
      cell: (row) => {
        const base =
          "px-4 py-1 rounded-full text-xs font-semibold inline-block whitespace-nowrap";

        const style =
          row.status === "Completed"
            ? `${base} bg-green-100 text-green-800`
            : row.status === "Pending"
            ? `${base} bg-yellow-100 text-yellow-800`
            : `${base} bg-red-100 text-red-800`;

        return <span className={style}>{row.status}</span>;
      },
    },
  ];

  return { paymentColumns, payments };
};
