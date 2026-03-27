/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Eye, Loader2, Trash2 } from "lucide-react";
import {
  useDeleteOrderMutation,
  useGetOrderUserHistoryQuery,
} from "@/redux/features/orders/ordersApi";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

// 1. Interfaces
interface TOrderRaw {
  id: number;
  user?: { username?: string; phone?: string };
  deliveryAddress?: string;
  delivery_address?: string;
  created_at: string;
  category?: string;
  delivery_type?: string;
  status?: string;
  order_status?: string;
  route_type?: string;
  orderStops?: { address: string }[];
}

type TOrder = {
  orderId: string;
  customerName: string;
  address: string;
  date: string;
  delivery_type: string;
  order_status: string;
  route_type: string;
};

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

  // --- DELETE LOGIC STATE ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const queryParams: OrderFilters = {
    page: params.page || 1,
    limit: params.limit || 10,
    ...params,
  };

  const { data, isLoading, isError } = useGetOrderUserHistoryQuery(queryParams);

  useEffect(() => {
    const rawData = data?.data?.data || [];
    if (rawData) {
      const mappedOrders: TOrder[] = rawData.map((item: TOrderRaw) => ({
        orderId: item.id?.toString() || "N/A",
        customerName: item.user?.username || item.user?.phone || "N/A",

        // --- UPDATED THIS LINE ---
        address: item.orderStops?.[0]?.address || "No Address Provided",

        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        delivery_type: typeof item.delivery_type === "object"
          ? (item.delivery_type as any)?.name || "N/A"
          : (item.delivery_type || "N/A"),
        order_status: item.order_status || "N/A",
        route_type: item.route_type || "N/A",
      }));

      setOrders(mappedOrders);
      setTotalItems(data?.data?.total || 0);
    }
  }, [data]);

  // --- DELETE EXECUTION ---
  const handleDeleteConfirm = async () => {
    if (!selectedOrderId) return;
    try {
      await deleteOrder(selectedOrderId).unwrap();
      toast.success(`Order #${selectedOrderId} deleted successfully`);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete order");
    } finally {
      setSelectedOrderId(null);
    }
  };

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
      cell: (row) => <span className="text-blue-600">{row.customerName}</span>,
    },
    {
      header: "ADDRESS",
      accessor: "address",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-gray-700 truncate max-w-[200px]">
            {row.address}
          </span>
        </div>
      ),
    },
    { header: "DATE", accessor: "date" },
    {
      header: "DELIVERY TYPE",
      accessor: "delivery_type",
      cell: (row) => {
        const style =
          row.delivery_type === "EXPRESS"
            ? "bg-green-200 text-green-800"
            : "bg-gray-200 text-gray-800";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}
          >
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
            onClick={() => navigate(`/live-order-tracking/${row.orderId}`)}
            className="bg-blue-200 p-1.5 rounded hover:bg-blue-300"
          >
            <Eye size={16} className="text-blue-700" />
          </button>
          <button
            onClick={() => {
              setSelectedOrderId(row.orderId);
              setIsDeleteDialogOpen(true);
            }}
            className="bg-red-200 p-1.5 rounded hover:bg-red-300 transition-colors"
          >
            <Trash2 size={16} className="text-red-700" />
          </button>
        </div>
      ),
    },
    {
      header: "ORDER STATUS",
      accessor: "order_status",
      cell: (row) => (
        <span className="px-4 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {row.order_status}
        </span>
      ),
    },
  ];

  // --- RENDERABLE DIALOG COMPONENT ---
  const DeleteConfirmDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete order
            <span className="font-bold text-black text-lg">
              {" "}
              #{selectedOrderId}
            </span>{" "}
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    orderColumns,
    orders,
    isLoading,
    isError,
    totalItems,
    DeleteConfirmDialog,
  };
};
