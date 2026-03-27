/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TOrderHistory {
  id: number;
  userId: number;
  route_type: string;
  delivery_type: string;
  pay_type: string;
  collect_time: string;
  total_cost: string;
  order_status: string;
  created_at: string;
  user: {
    username: string;
    email: string;
    phone: string;
  };
}

interface UseOrderHistoryParams {
  userId: number;
  page: number;
  limit: number;
}

import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { useGetUserOrderHistoryQuery } from "@/redux/features/drivers/driversApi";

export const useOrderHistoryColumns = (params: UseOrderHistoryParams) => {
  const [orders, setOrders] = useState<TOrderHistory[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Fetching data with pagination
  const { data, isLoading, isError } = useGetUserOrderHistoryQuery({
    id: params.userId,
    page: params.page,
    limit: params.limit,
  }, {
    skip: !params.userId,
  });

  useEffect(() => {
    // Your response structure is data.data.data
    if (data?.data?.data) {
      const mapped = data.data.data.map((item: any) => ({
        ...item,
        delivery_type: typeof item.delivery_type === "object"
          ? item.delivery_type?.name || "N/A"
          : (item.delivery_type || "N/A"),
      }));
      setOrders(mapped);
      // Access pagination total from the correct nesting
      setTotalItems(data.data.pagination?.total || data.data.data.length);
    }
  }, [data]);

  const orderColumns: Column<TOrderHistory>[] = [
    {
      header: "Order ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-bold text-gray-700">O-{row.id}</span>
      ),
    },
    // {
    //   header: "User Info",
    //   accessor: "user",
    //   cell: (row) => (
    //     <div className="flex flex-col">
    //       <span className="font-semibold text-gray-900">{row.user?.username}</span>
    //       <span className="text-[10px] text-gray-500">{row.user?.email}</span>
    //     </div>
    //   ),
    // },
    {
      header: "Service Type",
      accessor: "route_type",
      cell: (row) => (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">{row.route_type.replace("_", " ")}</span>
          <span className="text-[10px] text-blue-600 font-bold uppercase">{row.delivery_type}</span>
        </div>
      ),
    },
    {
      header: "Total Cost",
      accessor: "total_cost",
      cell: (row) => (
        <span className="font-bold text-green-600">
          ${parseFloat(row.total_cost).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "order_status",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            row.order_status === "PROGRESS"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          {row.order_status}
        </span>
      ),
    },
    {
      header: "Payment",
      accessor: "pay_type",
      cell: (row) => (
        <span className="text-xs font-medium text-gray-600 uppercase">
          {row.pay_type}
        </span>
      ),
    },
    {
      header: "Order Date",
      accessor: "created_at",
      cell: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return { orderColumns, orders, isLoading, isError, totalItems };
};