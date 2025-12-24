import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useGetDriverOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useNavigate } from "react-router-dom";

// 1. Define the Raw API Response Interface (Matching Backend Structure)
interface TOrderRaw {
  id: number;
  user?: {
    username?: string;
    phone?: string;
  };
  deliveryAddress?: string;
  delivery_address?: string;
  created_at: string;
  category?: string;
  delivery_type?: string;
  status?: string;
  order_status?: string;
  route_type?: string;
}

// 2. Define the Cleaned Interface for Table Display
type TOrder = {
  orderId: string;
  customerName: string;
  address: string;
  date: string;
  delivery_type: string;
  order_status: string;
  route_type: string;
};

// 3. Define Parameter Interface
interface OrderFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  search?: string;
}

export const useOrderColumns = (params: OrderFilters = {}) => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  // 4. Build query params manually (Following Driver code structure)
  const queryParams: OrderFilters = {
    page: params.page || 1,
    limit: params.limit || 20,
  };

  if (params.startDate) queryParams.startDate = params.startDate;
  if (params.endDate) queryParams.endDate = params.endDate;
  if (params.status) queryParams.status = params.status;
  if (params.category) queryParams.category = params.category;
  if (params.search) queryParams.search = params.search;

  // 5. Fetch data
  const { data, isLoading, isError } = useGetDriverOrdersQuery(queryParams);

  // 6. Effect to update and map data
  useEffect(() => {
    const rawData = data?.data?.data || [];
    if (rawData) {
      const mappedOrders: TOrder[] = rawData.map((item: TOrderRaw) => ({
        orderId: item.id?.toString() || "N/A",
        customerName: item.user?.username || item.user?.phone || "N/A",
        address: item.deliveryAddress || item.delivery_address || "N/A",
        date: item.created_at 
          ? new Date(item.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) 
          : "N/A",
        delivery_type: item.category || item.delivery_type || "N/A",
        order_status: item.status || item.order_status || "N/A",
        route_type: item.route_type || "N/A",
      }));

      setOrders(mappedOrders);
      setTotalItems(data?.data?.total || 0);
    }
  }, [data]);

  // 7. Column Definitions
  const orderColumns: Column<TOrder>[] = [
    {
      header: "ORDER ID",
      accessor: "orderId",
      cell: (row) => (
        <span className="text-gray-700 font-medium">#{row.orderId}</span>
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
      header: "DELIVERY TYPE",
      accessor: "delivery_type",
      cell: (row) => {
        const style =
          row.delivery_type === "EXPRESS"
            ? "bg-green-200 text-green-800"
            : row.delivery_type === "STANDARD"
            ? "bg-blue-200 text-blue-800"
            : row.delivery_type === "STACKED"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-gray-200 text-gray-800";

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
            {row.delivery_type}
          </span>
        );
      },
    },
    {
      header: "ACTION",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
          onClick={() => navigate(`/order/${row.orderId}`)}
          className="bg-blue-200 p-1.5 rounded hover:bg-blue-300 transition-colors">
            <Eye size={16} className="text-blue-700" />
          </button>
          <button
          onClick={() => navigate(`/order/${row.orderId}?edit=true`)}
          className="bg-green-200 p-1.5 rounded hover:bg-green-300 transition-colors">
            <Pencil size={16} className="text-green-700" />
          </button>
          <button className="bg-red-200 p-1.5 rounded hover:bg-red-300 transition-colors">
            <Trash2 size={16} className="text-red-700" />
          </button>
        </div>
      ),
    },
    {
      header: "ORDER STATUS",
      accessor: "order_status",
      cell: (row) => {
        const color =
          row.order_status === "COMPLETED"
            ? "bg-green-200 text-green-800"
            : row.order_status === "PENDING"
            ? "bg-yellow-300 text-yellow-800"
            : row.order_status === "CANCELLED"
            ? "bg-red-300 text-red-800"
            : row.order_status === "ONGOING"
            ? "bg-orange-300 text-orange-800"
            : row.order_status === "PROGRESS"
            ? "bg-blue-300 text-blue-800"
            : "bg-purple-300 text-purple-800";

        return (
          <span className={`px-4 py-1 rounded-full text-xs font-semibold ${color}`}>
            {row.order_status}
          </span>
        );
      },
    },
  ];

  return { orderColumns, orders, isLoading, isError, totalItems };
};