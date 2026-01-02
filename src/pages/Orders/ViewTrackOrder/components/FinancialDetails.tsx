// /* eslint-disable @typescript-eslint/no-explicit-any */
// interface FinancialDetailsProps {
//   onCancelClick: () => void;
//   totalAmount: string | number; // Passed from order.total_cost
//   orderData?: any; // Optional: Pass the whole order object for more detail
// }

// export default function FinancialDetails({ 
//   onCancelClick, 
//   totalAmount, 
//   orderData 
// }: FinancialDetailsProps) {
  
//   // Format the amount for display
//   const formattedTotal = Number(totalAmount).toFixed(2);
  
//   // Determine Payment Status logic
//   const isPaid = orderData?.pay_type !== "COD"; // If not Cash on Delivery, assume Paid or Pending
//   const paymentMethod = orderData?.pay_type || "N/A";

//   return (
//     <div className="w-full bg-white rounded-lg p-6 md:p-8">
//       <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Financial Details</h2>

//       <div className="space-y-6">
//         {/* Payment Status and Method */}
//         <div className="flex justify-between items-start pb-6 border-b border-gray-200">
//           <div>
//             <p className="text-gray-600 text-sm mb-4">Payment Status</p>
//             <p className="text-gray-600 text-sm">Payment Method</p>
//           </div>
//           <div className="text-right">
//             <p className={`${isPaid ? "text-green-500" : "text-yellow-600"} font-semibold mb-4 uppercase`}>
//               {isPaid ? "PAID" : "UNPAID (COD)"}
//             </p>
//             <p className="text-gray-900 font-medium">{paymentMethod}</p>
//           </div>
//         </div>

//         {/* Fees Section */}
//         <div className="space-y-4 pb-6 border-b border-gray-200">
//           <div className="flex justify-between">
//             <p className="text-gray-600">Delivery Fee</p>
//             <p className="text-gray-900 font-medium">${formattedTotal}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Additional Services</p>
//             <p className="text-gray-900 font-medium">
//               ${orderData?.has_additional_services ? "20.00" : "0.00"}
//             </p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Processing Fee</p>
//             <p className="text-gray-900 font-medium">$0.00</p>
//           </div>
//         </div>

//         {/* Totals Section */}
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <p className="text-gray-900 font-medium">Subtotal</p>
//             <p className="text-gray-900 font-medium">${formattedTotal}</p>
//           </div>
//           <div className="flex justify-between pb-6 border-b border-gray-200">
//             <p className="text-gray-600">Promotion / Coins</p>
//             <p className="text-red-500 font-medium">
//               {orderData?.is_promo_used ? "-$5.00" : "-$0.00"}
//             </p>
//           </div>
//           <div className="flex justify-between pt-2">
//             <p className="text-lg font-bold text-gray-900">Total Amount</p>
//             <p className="text-lg font-bold text-gray-900">${formattedTotal}</p>
//           </div>
//         </div>
//       </div>

//       {/* Cancel Button */}
//       <div className="mt-8">
//         <button
//           onClick={onCancelClick}
//           className="w-full px-6 cursor-pointer py-3 border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
//         >
//           Cancel Order
//           <span className="text-lg">✕</span>
//         </button>
//       </div>
//     </div>
//   )
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FinancialDetailsProps {
  onCancelClick?: () => void; // Added "?" to make it optional
  totalAmount: string | number; 
  orderData?: any; 
}

export default function FinancialDetails({ 
  onCancelClick, 
  totalAmount, 
  orderData 
}: FinancialDetailsProps) {
  
  const formattedTotal = Number(totalAmount).toFixed(2);
  const isPaid = orderData?.pay_type !== "COD"; 
  const paymentMethod = orderData?.pay_type || "N/A";

  return (
    <div className="w-full bg-white rounded-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Financial Details</h2>

      <div className="space-y-6">
        {/* Payment Status and Method */}
        <div className="flex justify-between items-start pb-6 border-b border-gray-200">
          <div>
            <p className="text-gray-600 text-sm mb-4">Payment Status</p>
            <p className="text-gray-600 text-sm">Payment Method</p>
          </div>
          <div className="text-right">
            <p className={`${isPaid ? "text-green-500" : "text-yellow-600"} font-semibold mb-4 uppercase`}>
              {isPaid ? "PAID" : "UNPAID (COD)"}
            </p>
            <p className="text-gray-900 font-medium">{paymentMethod}</p>
          </div>
        </div>

        {/* Fees Section */}
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <div className="flex justify-between">
            <p className="text-gray-600">Delivery Fee</p>
            <p className="text-gray-900 font-medium">${formattedTotal}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Additional Services</p>
            <p className="text-gray-900 font-medium">
              ${orderData?.has_additional_services ? "20.00" : "0.00"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Processing Fee</p>
            <p className="text-gray-900 font-medium">$0.00</p>
          </div>
        </div>

        {/* Totals Section */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-gray-900 font-medium">Subtotal</p>
            <p className="text-gray-900 font-medium">${formattedTotal}</p>
          </div>
          <div className="flex justify-between pb-6 border-b border-gray-200">
            <p className="text-gray-600">Promotion / Coins</p>
            <p className="text-red-500 font-medium">
              {orderData?.is_promo_used ? "-$5.00" : "-$0.00"}
            </p>
          </div>
          <div className="flex justify-between pt-2">
            <p className="text-lg font-bold text-gray-900">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">${formattedTotal}</p>
          </div>
        </div>
      </div>

      {/* Conditionally render the Cancel Button only if the prop is provided */}
      {onCancelClick && (
        <div className="mt-8">
          <button
            onClick={onCancelClick}
            className="w-full px-6 cursor-pointer py-3 border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            Cancel Order
            <span className="text-lg">✕</span>
          </button>
        </div>
      )}
    </div>
  )
}