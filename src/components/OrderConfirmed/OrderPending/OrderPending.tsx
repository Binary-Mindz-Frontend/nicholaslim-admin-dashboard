export interface OrderData {
  orderNumber: string
  deliveryDate: string
  deliveryTime: string
  totalAmount: string
  paymentMethod: string
  cardLast4: string
  status: "pending" | "processing" | "completed"
}

export interface TrackingStep {
  id: number | string
  status: "completed" | "pending" | "active"
  title: string
  address?: string
  time?: string
  timeDetail?: string
}

export interface OrderTrackingData {
  headerTitle: string
  headerDate: string
  headerTime: string
  steps: TrackingStep[]
}


interface OrderPendingProps {
  data: OrderData
}

export default function OrderPending({ data }: OrderPendingProps) {
  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Order {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </h2>
        </div>
        <span
          className={`rounded-lg px-3 py-1 text-sm font-medium ${
            data.status === "pending"
              ? "bg-yellow-200 text-gray-900"
              : data.status === "processing"
                ? "bg-blue-200 text-gray-900"
                : "bg-green-200 text-gray-900"
          }`}
        >
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
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
            {data.deliveryDate}/{data.deliveryTime}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">Total amount</p>
          <p className="mt-1 text-right text-lg font-semibold text-gray-900">{data.totalAmount}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">{data.paymentMethod}</p>
          <p className="mt-1 text-right text-lg font-semibold text-gray-900">***{data.cardLast4}</p>
        </div>
      </div>
    </div>
  )
}
