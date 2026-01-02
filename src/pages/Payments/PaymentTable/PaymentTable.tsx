import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Eye } from "lucide-react";
import { TPayment } from "../data/PaymentsData";

interface UsePaymentColumnsProps {
  initialData: TPayment[];
  onViewClick?: (transactionId: string | number) => void;
}

export const usePaymentColumns = ({ 
  initialData, 
  onViewClick 
}: UsePaymentColumnsProps) => {
  const [payments] = useState<TPayment[]>(initialData);

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
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
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
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* VIEW BUTTON with onClick */}
          <button
            className="bg-green-100 p-1.5 rounded border border-green-300 cursor-pointer hover:bg-green-200 transition-colors"
            title="View Details"
            onClick={() => onViewClick?.(row.orderId)}
          >
            <Eye size={16} className="text-green-700" />
          </button>
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