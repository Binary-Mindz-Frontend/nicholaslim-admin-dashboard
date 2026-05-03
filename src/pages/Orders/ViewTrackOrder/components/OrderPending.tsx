export interface OrderData {
  orderNumber: string
  deliveryDate: string
  deliveryTime: string
  totalAmount: string
  paymentMethod: string
  cardLast4: string
  // Changed to string to support API statuses like "progress" or "placed"
  status: string 
}

interface OrderPendingProps {
  data: OrderData
}

export default function OrderPending({ data }: OrderPendingProps) {
  // Helper to format status text (e.g., progress -> Progress)
  const formatStatus = (status: string) => 
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";

  // UI logic for status colors based on your API values
  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending" || s === "placed") return "bg-yellow-200 text-gray-900";
    if (s === "processing" || s === "progress" || s === "ongoing") return "bg-blue-200 text-gray-900";
    if (s === "completed" || s === "delivered" || s === "complete") return "bg-green-200 text-gray-900";
    return "bg-gray-200 text-gray-900";
  };

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Order {formatStatus(data.status)}
          </h2>
        </div>
        <span className={`rounded-lg px-3 py-1 text-sm font-medium ${getStatusStyles(data.status)}`}>
          {formatStatus(data.status)}
        </span>
      </div>

      <div className="space-y-6">
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">Order No.</p>
          <p className="mt-1 text-right text-lg font-semibold text-gray-900">{data.orderNumber}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">Delivery Date & Time</p>
          <p className="mt-1 text-right text-lg font-semibold text-gray-900">
            {data.deliveryDate} / {data.deliveryTime}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">Total amount</p>
          <p className="mt-1 text-right text-lg font-semibold text-gray-900">{data.totalAmount}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">Payment Method ({data.paymentMethod})</p>
          <p className="mt-1 text-right text-lg font-semibold text-gray-900">
            {data.cardLast4 !== "N/A" ? `***${data.cardLast4}` : "Cash/Digital"}
          </p>
        </div>
      </div>
    </div>
  )
}