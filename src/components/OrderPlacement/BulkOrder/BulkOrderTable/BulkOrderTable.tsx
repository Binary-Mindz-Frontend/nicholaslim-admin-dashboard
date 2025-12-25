/* eslint-disable prefer-const */
"use client"

import { Edit2, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { useGetBulkOrdersQuery } from "@/redux/features/orderPlacement/orderPlacementApi"

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
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // Fetch bulk orders from API
  const { 
    data: bulkOrdersData, 
    isLoading, 
    isError,
    refetch 
  } = useGetBulkOrdersQuery({ page: currentPage, limit })

  const ordersResponse = bulkOrdersData as BulkOrdersResponse | undefined
  const orders = ordersResponse?.data?.data || []
  
  // Get pagination data from response
  const paginationData = ordersResponse?.data?.pagination || ordersResponse?.data
  
  // Calculate total items and pages for pagination
  const totalItems = paginationData?.total || orders.length
  const totalPages = paginationData?.totalPages || 
                     (paginationData?.limit ? Math.ceil(totalItems / paginationData.limit) : 1)

  // Extract sender and receiver information from destinations
  // const getReceiverInfo = (destinations: BulkOrder['destinations']) => {
  //   const receiver = destinations.find(dest => dest.type === "RECEIVER")
  //   return receiver || null
  // }

  const getSenderInfo = (destinations: BulkOrder['destinations']) => {
    const sender = destinations.find(dest => dest.type === "SENDER")
    return sender || null
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "N/A"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('progress') || statusLower.includes('pending')) {
      return 'bg-yellow-100 text-yellow-800'
    } else if (statusLower.includes('complete') || statusLower.includes('delivered')) {
      return 'bg-green-100 text-green-800'
    } else if (statusLower.includes('cancel') || statusLower.includes('failed')) {
      return 'bg-red-100 text-red-800'
    } else if (statusLower.includes('pickup')) {
      return 'bg-blue-100 text-blue-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }

  // Format status text
  const formatStatus = (order: BulkOrder) => {
    if (order.is_out_for_delivery) return "Out for Delivery"
    if (order.is_pickup) return "Picked Up"
    if (order.is_placed) return "Placed"
    return order.order_status || "Created"
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // First page
    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) {
        pageNumbers.push('...')
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...')
      }
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  // Refresh data when page changes
  useEffect(() => {
    refetch()
  }, [currentPage, refetch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bulk orders...</p>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="">
        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ORDER ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">NAME</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">SENDER ADDRESS</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">DATE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">DELIVERY TYPE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ACTION</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ORDER STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    // const receiver = getReceiverInfo(order.destinations)
                    const sender = getSenderInfo(order.destinations)
                    
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
                          <div className="truncate" title={sender?.address || "N/A"}>
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
                          {/* <div className="text-xs text-gray-500 mt-1">
                            {order.collect_time === "ASAP" ? "ASAP" : "Scheduled"}
                          </div> */}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-3">
                            <button 
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Order"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                            {formatStatus(order)}
                          </span>
                          {/* {order.total_cost && (
                            <div className="text-xs text-gray-500 mt-1">
                              S${order.total_cost}
                            </div>
                          )} */}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No bulk orders found. Create your first bulk order by uploading a CSV file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {((currentPage - 1) * limit) + 1}-
            {Math.min(currentPage * limit, totalItems)} of {totalItems} orders
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-600 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-1">
              {getPageNumbers().map((pageNumber, index) => {
                if (pageNumber === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-3 py-1 text-slate-600">
                      ...
                    </span>
                  )
                }
                return (
                  <button
                    key={`page-${pageNumber}`}
                    onClick={() => handlePageChange(pageNumber as number)}
                    className={`px-3 cursor-pointer py-1 text-sm rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-yellow-500 text-white'
                        : 'text-slate-600 hover:bg-yellow-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-600 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Status Summary */}
        {orders.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <p className="text-center text-blue-600 font-medium text-sm flex-1">
                Page {currentPage} of {totalPages} • Showing {orders.length} orders
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">
                  ✓ {orders.filter(o => o.order_status.toLowerCase().includes('complete')).length} Completed
                </span>
                <span className="text-yellow-600">
                  ⚡ {orders.filter(o => o.order_status.toLowerCase().includes('progress')).length} In Progress
                </span>
                <span className="text-red-600">
                  ✗ {orders.filter(o => o.order_status.toLowerCase().includes('cancel')).length} Cancelled
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkOrdersTable