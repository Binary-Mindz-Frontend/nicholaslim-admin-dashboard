// export default function TransactionHistory(){
//     return(
//         <div className="  px-6">
//         <h3 className="text-2xl font-bold text-gray-800 mb-5">
//           Wallet recent transactions
//         </h3>

//         {/* Recent Transactions */}
//         <div className=" rounded-2xl ">
//           <div className="space-y-4 bg-white p-2 rounded-xl">
//             {/* Transaction Item */}
//             {[
//               {
//                 type: "Parcel",
//                 orderId: "Order ID - AL69696",
//                 amount: -40.0,
//                 color: "text-red-600",
//               },
//               {
//                 type: "Top Up",
//                 method: "Using MASTER *456",
//                 amount: +20.0,
//                 color: "text-green-600",
//               },
//               {
//                 type: "Parcel",
//                 orderId: "Order ID - AL69696",
//                 amount: -40.0,
//                 color: "text-red-600",
//               },
//               {
//                 type: "Top Up",
//                 method: "Using MASTER *456",
//                 amount: +20.0,
//                 color: "text-green-600",
//               },
//             ].map((tx, i) => (
//               <div
//                 key={i}
//                 className="flex bg-white border items-center justify-between py-3 p-4 rounded-md "
//               >
//                 <div>
//                   <p className="font-medium text-gray-900">{tx.type}</p>
//                   <p className="text-sm text-gray-500">
//                     {tx.orderId || tx.method}
//                   </p>
//                 </div>
//                 <span
//                   className={`text-lg font-semibold ${
//                     tx.amount < 0 ? "text-red-600" : "text-green-600"
//                   }`}
//                 >
//                   {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
// }


import { useGetTransactionHistoryQuery } from "@/redux/features/payment/paymentApi";

export default function TransactionHistory() {
  const { data, isLoading } = useGetTransactionHistoryQuery({
    userId: 1,
    page: 1,
    limit: 20,
  });

  const transactions = data?.data.slice(0, 5) || [];

  return (
    <div className="px-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-5">
        Wallet recent transactions
      </h3>

      {/* Recent Transactions */}
      <div className="rounded-2xl">
        <div className="space-y-4 bg-white p-2 rounded-xl">
          {isLoading && (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          )}

          {!isLoading &&
            transactions.map((tx) => {
              const isCredit = tx.type === "credit";
              const amount = Number(tx.amount);

              return (
                <div
                  key={tx.id}
                  className="flex bg-white border items-center justify-between py-3 p-4 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {tx.transactionType === "PAYMENT"
                        ? "Top Up"
                        : tx.transactionType}
                    </p>
                    <p className="text-sm text-gray-500">
                      Transaction ID - {tx.transactionId}
                    </p>
                  </div>

                  <span
                    className={`text-lg font-semibold ${
                      isCredit ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCredit ? "+" : "-"}${amount.toFixed(2)}
                  </span>
                </div>
              );
            })}

          {!isLoading && transactions.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No transactions found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
