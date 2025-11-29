import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function WalletSection() {
  return (
    <div className="py-6 space-y-6">
      {/* Payment Options Card */}
      <div className="rounded-2xl  p-6">
        <h2 className="text-2xl text-gray-800 mb-6  font-bold">
          Payment Options
        </h2>

        {/* Wallet Balance */}
        <div className="bg-white rounded-xl p-4 px-6 py-8 text-center">
          <div className="flex justify-center items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-xl">
              <Wallet className=" text-gray-700" />
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-bold text-gray-600">My Wallet</p>
              <p className="text-3xl font-semibold text-gray-600">$350.00</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 font-bold mt-6 justify-center">
            <Button className="px-10 py-5 font-bold bg-[#FC0] hover:bg-[#FC0] text-yellow-900  rounded-md transition">
              Add Funds
            </Button>
            <Button className="px-10 py-5 font-bold bg-white hover:bg-gray-50 text-gray-700  rounded-md border border-gray-300 transition">
              Redeem Points
            </Button>
          </div>
        </div>
      </div>

      <div className="  px-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-5">
          Wallet recent transactions
        </h3>

        {/* Recent Transactions */}
        <div className=" rounded-2xl ">
          <div className="space-y-4 bg-white p-2 rounded-xl">
            {/* Transaction Item */}
            {[
              {
                type: "Parcel",
                orderId: "Order ID - AL69696",
                amount: -40.0,
                color: "text-red-600",
              },
              {
                type: "Top Up",
                method: "Using MASTER *456",
                amount: +20.0,
                color: "text-green-600",
              },
              {
                type: "Parcel",
                orderId: "Order ID - AL69696",
                amount: -40.0,
                color: "text-red-600",
              },
              {
                type: "Top Up",
                method: "Using MASTER *456",
                amount: +20.0,
                color: "text-green-600",
              },
            ].map((tx, i) => (
              <div
                key={i}
                className="flex bg-white border items-center justify-between py-3 p-4 rounded-md "
              >
                <div>
                  <p className="font-medium text-gray-900">{tx.type}</p>
                  <p className="text-sm text-gray-500">
                    {tx.orderId || tx.method}
                  </p>
                </div>
                <span
                  className={`text-lg font-semibold ${
                    tx.amount < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
