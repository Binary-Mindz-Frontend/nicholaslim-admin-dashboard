import { Edit2, Trash2, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetBulkOrdersQuery } from "@/redux/features/orderPlacement/orderPlacementApi";
import { Link } from "react-router-dom";
import { useDeleteOrderMutation } from "@/redux/features/orders/ordersApi";
import toast from "react-hot-toast";

interface BulkOrder {
  id: number;
  order_status: string;
  delivery_type: string;
  total_cost: string;
  collect_time: string;
  scheduled_time: string | null;
  is_placed: boolean;
  is_pickup: boolean;
  is_out_for_delivery: boolean;
  created_at: string;
  user: {
    id: number;
    username: string;
    phone: string;
  };
  destinations: Array<{
    id: number;
    address: string;
    floor_unit: string | null;
    contact_name: string;
    contact_number: string;
    type: "SENDER" | "RECEIVER";
  }>;
}

interface BulkOrdersResponse {
  success: boolean;
  message: string;
  data: {
    data: BulkOrder[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

const BulkOrdersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const limit = 10;

  // Fetch bulk orders from API
  const {
    data: bulkOrdersData,
    isLoading,
    isError,
    refetch,
  } = useGetBulkOrdersQuery({ page: currentPage, limit });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const ordersResponse = bulkOrdersData as BulkOrdersResponse | undefined;
  const orders = ordersResponse?.data?.data || [];

  console.log(orders, "orders");

  // Get pagination data from response
  const paginationData =
    ordersResponse?.data?.pagination || ordersResponse?.data;

  // Calculate total items and pages for pagination
  const totalItems = paginationData?.total || orders.length;
  const totalPages =
    paginationData?.totalPages ||
    (paginationData?.limit ? Math.ceil(totalItems / paginationData.limit) : 1);

  const getSenderInfo = (destinations: BulkOrder["destinations"]) => {
    const sender = destinations.find((dest) => dest.type === "SENDER");
    return sender || null;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };


  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle delete confirmation
  const handleDeleteClick = (orderId: number) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete).unwrap();
        toast.success(`Order #${orderToDelete} deleted successfully`);
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
        refetch();
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  // Refresh data when page changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bulk orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load bulk orders. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50">
      <div className="">
        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    ORDER ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    SENDER ADDRESS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    DATE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    DELIVERY TYPE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    ACTION
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    ORDER STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const sender = getSenderInfo(order.destinations);

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-slate-200 transition-colors hover:bg-yellow-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          <div>
                            {sender && (
                              <div className="text-xs text-gray-400 mt-1">
                                {sender.contact_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 max-w-xs">
                          <div
                            className="truncate"
                            title={sender?.address || "N/A"}
                          >
                            {sender?.address || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {order.delivery_type || "Standard"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-4 items-center justify-start">
                            {/* View Details Button */}
                            <Link to={`/order/${order?.id}`}>
                              <button
                                className="p-1 cursor-pointer text-green-600 bg-green-100 rounded "
                                title="View Details"
                              >
                                <Eye size={20} />
                              </button>
                            </Link>

                            {/* Edit Order Button */}
                            <Link to={`/order/${order?.id}?edit=true`}>
                              <button
                                className="p-1 cursor-pointer text-blue-600 bg-blue-100  rounded  "
                                title="Edit Order"
                              >
                                <Edit2 size={20} />
                              </button>
                            </Link>

                            {/* Delete Order Button */}
                            <button
                              onClick={() => handleDeleteClick(order.id)}
                              className="p-1 cursor-pointer text-red-600 bg-red-100 hover:bg-red-200 rounded "
                              title="Delete Order"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium">
                             { order.order_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No bulk orders found. Create your first bulk order by
                      uploading a CSV file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Updated Style */}
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="text-sm text-slate-600">
            Showing {(currentPage - 1) * limit + 1}-
            {Math.min(currentPage * limit, totalItems)} of {totalItems}
          </div>

          <div className="flex gap-2 items-center bg-yellow-100 rounded-md border border-yellow-300 px-2 ">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-600 cursor-pointer hover:bg-yellow-50 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-600 cursor-pointer hover:bg-yellow-50 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Status Summary */}
        {/* {orders.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <p className="text-center text-blue-600 font-medium text-sm flex-1">
                Page {currentPage} of {totalPages} • Showing {orders.length}{" "}
                orders
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">
                  ✓{" "}
                  {
                    orders.filter((o) =>
                      o.order_status.toLowerCase().includes("complete")
                    ).length
                  }{" "}
                  Completed
                </span>
                <span className="text-yellow-600">
                  ⚡{" "}
                  {
                    orders.filter((o) =>
                      o.order_status.toLowerCase().includes("progress")
                    ).length
                  }{" "}
                  In Progress
                </span>
                <span className="text-red-600">
                  ✗{" "}
                  {
                    orders.filter((o) =>
                      o.order_status.toLowerCase().includes("cancel")
                    ).length
                  }{" "}
                  Cancelled
                </span>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Order
              </h3>
              <button
                onClick={handleCancelDelete}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete order #{orderToDelete}? This
              action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOrdersTable;
