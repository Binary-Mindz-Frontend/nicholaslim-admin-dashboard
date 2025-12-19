import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData: any;
  isLoading?: boolean;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transactionData,
  isLoading = false,
}: TransactionDetailsModalProps) {
  if (!transactionData && !isLoading) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl">
                Transaction Details
              </DialogTitle>
              <DialogDescription>
                ID: {transactionData?.id || transactionData?.transaction_code}
              </DialogDescription>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading transaction details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Transaction Info */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  Transaction Information
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium">
                      {transactionData?.transaction_code}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transactionData?.tx_status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : transactionData?.tx_status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transactionData?.tx_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium">
                    {transactionData?.payment_status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Payment Type</p>
                  <p className="font-medium">{transactionData?.pay_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{transactionData?.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="font-medium">
                  {formatDate(transactionData?.created_at)}
                </p>
              </div>

              {/* Financial Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Financial Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {formatCurrency(transactionData?.delivery_fee || "0")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Fee</span>
                    <span className="font-medium">
                      {transactionData?.additional_fee
                        ? formatCurrency(transactionData.additional_fee)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-semibold">
                      Total Amount
                    </span>
                    <span className="font-bold text-lg">
                      {formatCurrency(transactionData?.total_fee || "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">User Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">
                      {transactionData?.user?.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {transactionData?.user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {transactionData?.user?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transactionData?.user?.is_verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transactionData?.user?.is_verified
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Order Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{transactionData?.order?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transactionData?.order?.order_status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : transactionData?.order?.order_status === "ONGOING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transactionData?.order?.order_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Type</p>
                    <p className="font-medium">
                      {transactionData?.order?.delivery_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Route Type</p>
                    <p className="font-medium">
                      {transactionData?.order?.route_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Collect Time</p>
                    <p className="font-medium">
                      {transactionData?.order?.collect_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="font-medium">
                      {formatCurrency(
                        transactionData?.order?.total_cost || "0"
                      )}
                    </p>
                  </div>
                </div>

                {/* Pickup Items */}
                {transactionData?.order?.pick_up_items?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Pickup Items:</p>
                    <div className="space-y-1">
                      {transactionData.order.pick_up_items.map(
                        (item: string, index: number) => (
                          <p
                            key={index}
                            className="text-sm bg-white p-2 rounded border"
                          >
                            {item}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}