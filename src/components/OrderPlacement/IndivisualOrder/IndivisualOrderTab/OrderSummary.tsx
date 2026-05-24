import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  orderTotalFee: number | null;
  orderTotalCost: number | null;
  isSubmitting: boolean;
  payType: string;
  payTypeDisplay: string;
  payTypeLabel: string;
  orderCreated: boolean;
  onPaymentMethodChange: (value: string) => void;
  onCreateOrder: () => void;
  onConfirmOrder: () => void;
  // --- New Props for Cash Collection ---
  cashCollectedFrom?: string;
  onCashCollectionChange?: (value: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderTotalFee,
  orderTotalCost,
  isSubmitting,
  payType,
  payTypeDisplay,
  payTypeLabel,
  orderCreated,
  onPaymentMethodChange,
  onCreateOrder,
  onConfirmOrder,
  // --- Destructure New Props ---
  cashCollectedFrom = "SENDER",
  onCashCollectionChange,
}) => {
  return (
    <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>
      <div className="space-y-4">
        <div className="border-t pt-2 pb-2.5 flex justify-between text-lg font-semibold text-gray-900">
          <span>Fee</span>
          <span>${orderTotalFee}</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>${orderTotalCost?.toFixed(2)}</span>
        </div>
      </div>

      {/* Main Payment Method Dropdown */}
      <div className="mb-4 flex items-center justify-between mt-8">
        <Label className="mb-0">Payment method</Label>
        <Select
          value={payTypeDisplay}
          onValueChange={onPaymentMethodChange}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-[35%] lg:w-[25%]">
            <SelectValue placeholder="Select payment method">
              {payTypeLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">CASH</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="wallet">Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- Conditional Cash Collection Dropdown --- */}
      {payTypeDisplay === "cash" && (
        <div className="mb-6 flex items-center justify-between pt-2 border-t border-dashed border-gray-100 animate-in fade-in duration-200">
          <Label className="mb-0">Collect cash from</Label>
          <Select
            value={cashCollectedFrom}
            onValueChange={onCashCollectionChange}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-[35%] lg:w-[25%]">
              <SelectValue placeholder="Select who pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SENDER">Sender</SelectItem>
              <SelectItem value="RECEIVER">Receiver</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-4">
        <Button
          className="w-full bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-gray-900 font-bold py-3"
          onClick={onCreateOrder}
          disabled={isSubmitting || orderCreated}
        >
          {isSubmitting
            ? "Creating Order..."
            : orderCreated
              ? "Order Created"
              : "Create Order"}
        </Button>

        {orderCreated && orderTotalCost !== null && (
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3"
            onClick={onConfirmOrder}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Confirming..."
              : payType === "ONLINE_PAY"
                ? "Proceed to Payment"
                : "Confirm Order"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;

// import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// interface OrderSummaryProps {
//   orderTotalFee: number | null;
//   orderTotalCost: number | null;
//   isSubmitting: boolean;
//   payType: string;
//   payTypeDisplay: string;
//   payTypeLabel: string;
//   orderCreated: boolean;
//   onPaymentMethodChange: (value: string) => void;
//   onCreateOrder: () => void;
//   onConfirmOrder: () => void;
// }

// const OrderSummary: React.FC<OrderSummaryProps> = ({
//   orderTotalFee,
//   orderTotalCost,
//   isSubmitting,
//   payType,
//   payTypeDisplay,
//   payTypeLabel,
//   orderCreated,
//   onPaymentMethodChange,
//   onCreateOrder,
//   onConfirmOrder,
// }) => {
//   return (
//     <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
//       <h2 className="text-lg font-semibold text-gray-900 mb-6">
//         Order Summary
//       </h2>
//       <div className="space-y-4">
//         <div className="border-t pt-2 pb-2.5 flex justify-between text-lg font-semibold text-gray-900">
//           <span>Fee</span>
//           <span>${orderTotalFee}</span>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
//           <span>Total</span>
//           <span>${orderTotalCost?.toFixed(2)}</span>
//         </div>
//       </div>

//       <div className="mb-6 flex items-center justify-between mt-8">
//         <Label className="mb-0">Payment method</Label>
//         <Select
//           value={payTypeDisplay}
//           onValueChange={onPaymentMethodChange}
//           disabled={isSubmitting}
//         >
//           <SelectTrigger className="w-[20%]">
//             <SelectValue placeholder="Select payment method">
//               {payTypeLabel}
//             </SelectValue>
//           </SelectTrigger>
//           <SelectContent>
//             {/* <SelectItem value="cash">COD</SelectItem> */}
//             <SelectItem value="cash">CASH</SelectItem>
//             <SelectItem value="stripe">Stripe</SelectItem>
//             <SelectItem value="wallet">Wallet</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-4">
//         <Button
//           className="w-full bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-gray-900 font-bold py-3"
//           onClick={onCreateOrder}
//           disabled={isSubmitting || orderCreated}
//         >
//           {isSubmitting
//             ? "Creating Order..."
//             : orderCreated
//               ? "Order Created"
//               : "Create Order"}
//         </Button>

//         {orderCreated && orderTotalCost !== null && (
//           <Button
//             className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3"
//             onClick={onConfirmOrder}
//             disabled={isSubmitting}
//           >
//             {isSubmitting
//               ? "Confirming..."
//               : payType === "ONLINE_PAY"
//                 ? "Proceed to Payment"
//                 : "Confirm Order"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;
