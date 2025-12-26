import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import TransactionHistory from "./TransactionHistory";

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
      <TransactionHistory />

    </div>
  );
}
